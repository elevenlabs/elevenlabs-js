import { describe, expect, it } from "@jest/globals";
import {
    Agent,
    AgentProject,
    AgentPushError,
    AgentValidationError,
    Schema,
    SystemTool,
    Tool,
    Workflow,
} from "../../../../src";
import { FakeServer } from "./fakeServer";

const getOrder = (description = "Look up an order by its number") =>
    Tool.webhook("get_order", description)
        .get("https://api.example.com/orders/{order_id}")
        .pathParam("order_id", Schema.string().describe("The order number"));
const showOrder = () =>
    Tool.client("show_order", "Show the order card").param("order_id", Schema.string().fromVariable("order_id"));

function supportAgent(tools: Tool[] = [getOrder(), showOrder()]): Agent {
    const wf = new Workflow();
    wf.converse("triage", "Find out what the caller needs")
        .when("Caller gave an order number")
        .tool("lookup", [tools[0]])
        .onSuccess()
        .converse("resolve", "Explain the order");
    return new Agent("Support line", {
        prompt: "You help with orders.",
        tools: [SystemTool.endCall(), ...tools.slice(1)],
        workflow: wf,
    });
}

describe("agents.push", () => {
    it("creates the tools, then the agent with their ids", async () => {
        const server = new FakeServer();
        const result = await server.client().conversationalAi.agents.push(supportAgent());

        expect(server.writes()).toEqual([
            "POST /v1/convai/tools",
            "POST /v1/convai/tools",
            "POST /v1/convai/agents/create",
        ]);
        expect(result).toEqual({
            agentId: "agent_new_3",
            action: "created",
            tools: {
                show_order: { id: "tool_new_1", action: "created" },
                get_order: { id: "tool_new_2", action: "created" },
            },
        });
        const sent = server.agents.get("agent_new_3") as any;
        expect(sent.conversation_config.agent.prompt.tool_ids).toEqual(["tool_new_1"]);
        expect(sent.conversation_config.agent.prompt.built_in_tools.end_call.name).toBe("end_call");
        expect(sent.workflow.nodes.lookup.tools).toEqual([{ tool_id: "tool_new_2" }]);
    });

    it("updates only what changed, and leaves another agent's same-named tool alone", async () => {
        const server = new FakeServer();
        const client = server.client();
        const { agentId } = await client.conversationalAi.agents.push(supportAgent());
        server.addTool("tool_other", getOrder("Someone else's").buildConfig() as never, ["agent_other"]);
        server.calls.length = 0;

        const again = await client.conversationalAi.agents.push(
            supportAgent([getOrder("Find an order"), showOrder()]),
            {
                agentId,
            },
        );

        expect(server.writes()).toEqual(["PATCH /v1/convai/tools/tool_new_2", `PATCH /v1/convai/agents/${agentId}`]);
        expect(server.calls[0].query).toEqual({ used_by_agent_id: agentId, page_size: "100" });
        expect(again.tools).toEqual({
            show_order: { id: "tool_new_1", action: "unchanged" },
            get_order: { id: "tool_new_2", action: "updated" },
        });
        expect(again.action).toBe("updated");
    });

    it("reports tools the agent stopped using as detached, without deleting them", async () => {
        const server = new FakeServer();
        const client = server.client();
        const { agentId } = await client.conversationalAi.agents.push(supportAgent());
        const agent = supportAgent();
        agent.update({ tools: [] });
        const result = await client.conversationalAi.agents.push(agent, { agentId });
        expect(result.tools.show_order).toEqual({ id: "tool_new_1", action: "detached" });
        expect(server.tools.has("tool_new_1")).toBe(true);
    });

    it("copies a changed workflow tool on a branch, then reuses the copy on an unchanged push", async () => {
        const server = new FakeServer();
        const client = server.client();
        const first = await client.conversationalAi.agents.push(supportAgent());
        const { agentId } = first;
        const mainId = first.tools.get_order.id;
        const branch = JSON.parse(JSON.stringify(server.agents.get(agentId)));
        branch.conversation_config.agent.prompt.tool_ids = [];
        server.branches.set(`${agentId}/agtbrch_1`, branch);
        server.calls.length = 0;

        const changed = supportAgent([getOrder("Changed lookup")]);
        const options = { agentId, branchId: "agtbrch_1" };
        const result = await client.conversationalAi.agents.push(changed, options);
        const copyId = result.tools.get_order.id;
        expect(copyId).not.toBe(mainId);
        // Only the copy is reported: the tool it replaced on the branch is still the main branch's.
        expect(result.tools).toEqual({ get_order: { id: copyId, action: "created" } });
        expect(server.writes()).toEqual(["POST /v1/convai/tools", `PATCH /v1/convai/agents/${agentId}`]);
        expect(server.tools.get(mainId)?.config.description).toBe("Look up an order by its number");
        expect(server.tools.get(copyId)?.config.description).toBe("Changed lookup");
        expect(server.agents.get(agentId)?.workflow.nodes.lookup.tools).toEqual([{ tool_id: mainId }]);
        expect(server.branches.get(`${agentId}/agtbrch_1`)?.workflow.nodes.lookup.tools).toEqual([{ tool_id: copyId }]);
        expect(server.calls.some((call) => call.query.used_by_agent_id !== undefined)).toBe(false);

        server.calls.length = 0;
        const retry = await client.conversationalAi.agents.push(changed, options);
        expect(retry.tools.get_order).toEqual({ id: copyId, action: "unchanged" });
        expect(server.writes()).toEqual([`PATCH /v1/convai/agents/${agentId}`]);
    });

    it("creates another copy when the branch's tool changes again", async () => {
        const server = new FakeServer();
        const client = server.client();
        const { agentId } = await client.conversationalAi.agents.push(supportAgent());
        server.branches.set(`${agentId}/agtbrch_1`, JSON.parse(JSON.stringify(server.agents.get(agentId))));
        const options = { agentId, branchId: "agtbrch_1" };
        const first = await client.conversationalAi.agents.push(supportAgent([getOrder("Changed lookup")]), options);
        server.calls.length = 0;

        const second = await client.conversationalAi.agents.push(supportAgent([getOrder("Third lookup")]), options);
        expect(second.tools.get_order.action).toBe("created");
        expect(second.tools.get_order.id).not.toBe(first.tools.get_order.id);
        // Never a PATCH of the first copy: earlier versions of the branch still use it.
        expect(server.writes()).toEqual(["POST /v1/convai/tools", `PATCH /v1/convai/agents/${agentId}`]);
        expect(server.tools.get(first.tools.get_order.id)?.config.description).toBe("Changed lookup");
    });

    it("reports a tool the branch stopped using as detached, with the branch's id", async () => {
        const server = new FakeServer();
        const client = server.client();
        const { agentId } = await client.conversationalAi.agents.push(supportAgent());
        // The branch has its own show_order; the main branch's is a different tool.
        server.addTool("tool_branch_show", showOrder().toJSON());
        const branch = JSON.parse(JSON.stringify(server.agents.get(agentId)));
        branch.conversation_config.agent.prompt.tool_ids = ["tool_branch_show"];
        server.branches.set(`${agentId}/agtbrch_1`, branch);
        server.calls.length = 0;

        const result = await client.conversationalAi.agents.push(supportAgent([getOrder()]), {
            agentId,
            branchId: "agtbrch_1",
        });
        expect(result.tools.show_order).toEqual({ id: "tool_branch_show", action: "detached" });
        expect(result.tools.get_order.action).toBe("unchanged");
        expect(server.writes()).toEqual([`PATCH /v1/convai/agents/${agentId}`]);
        expect(server.tools.has("tool_branch_show")).toBe(true);
    });

    it("leaves the shared webhook alone when the branch update fails", async () => {
        const server = new FakeServer();
        const client = server.client();
        const initialAgent = new Agent("Support", { tools: [getOrder()] });
        const initial = await client.conversationalAi.agents.push(initialAgent);
        const { agentId } = initial;
        const sharedId = initial.tools.get_order.id;
        server.branches.set(`${agentId}/agtbrch_1`, initialAgent.toJSON({ toolIds: { get_order: sharedId } }));
        server.failOn = /^PATCH \/v1\/convai\/agents\//;
        server.calls.length = 0;

        const changed = getOrder().get("https://staging.example.com/orders/{order_id}");
        const err = await client.conversationalAi.agents
            .push(new Agent("Support", { tools: [changed] }), {
                agentId,
                branchId: "agtbrch_1",
                requestOptions: { maxRetries: 0 },
            })
            .catch((e: unknown) => e);
        expect(err).toBeInstanceOf(AgentPushError);
        const error = err as AgentPushError;
        expect(error.message).toContain("Couldn't update agent");
        // The copy it made is in the error, so the caller can find it.
        expect(error.result.tools.get_order.action).toBe("created");
        expect(error.result.tools.get_order.id).not.toBe(sharedId);
        expect(server.writes()).toEqual(["POST /v1/convai/tools", `PATCH /v1/convai/agents/${agentId}`]);
        expect(server.tools.get(sharedId)?.config.api_schema.url).toBe("https://api.example.com/orders/{order_id}");
    });

    it("validates before any API call", async () => {
        const server = new FakeServer();
        const agent = new Agent("A", { prompt: "p", tools: [Tool.webhook("broken", "No URL")] });
        await expect(server.client().conversationalAi.agents.push(agent)).rejects.toBeInstanceOf(AgentValidationError);
        expect(server.calls).toEqual([]);
    });

    it("reports what it wrote before a failure", async () => {
        const server = new FakeServer();
        server.failOn = /^POST \/v1\/convai\/agents\/create$/;
        const err = await server
            .client()
            .conversationalAi.agents.push(supportAgent(), { requestOptions: { maxRetries: 0 } })
            .catch((e: unknown) => e);
        expect(err).toBeInstanceOf(AgentPushError);
        expect((err as AgentPushError).message).toMatch(/^Couldn't create agent "Support line"/);
        expect((err as AgentPushError).result).toEqual({
            tools: {
                show_order: { id: "tool_new_1", action: "created" },
                get_order: { id: "tool_new_2", action: "created" },
            },
        });
    });

    it("refuses agentId together with a project", async () => {
        const server = new FakeServer();
        await expect(
            server.client().conversationalAi.agents.push(supportAgent(), {
                agentId: "agent_1",
                project: AgentProject.fromFiles({}),
            }),
        ).rejects.toThrow(/not both/);
    });

    it("requires a target agent when pushing to a branch", async () => {
        const server = new FakeServer();
        const agents = server.client().conversationalAi.agents;
        await expect(agents.push(supportAgent(), { branchId: "agtbrch_1" })).rejects.toThrow(
            /branchId needs the agent/,
        );
        expect(server.calls).toEqual([]);
    });
});

describe("agents.push with a project", () => {
    it("records ids and writes the CLI layout, then updates by recorded id", async () => {
        const server = new FakeServer();
        const client = server.client();
        const project = AgentProject.fromFiles({});

        await client.conversationalAi.agents.push(supportAgent(), { project });
        const files = project.toFiles();
        expect(Object.keys(files).sort()).toEqual([
            "agent_configs/Support-line.json",
            "agents.json",
            "tool_configs/get_order.json",
            "tool_configs/show_order.json",
            "tools.json",
        ]);
        expect(files["agents.json"]).toBe(
            '{\n    "agents": [\n        {\n            "config": "agent_configs/Support-line.json",\n            "id": "agent_new_3"\n        }\n    ]\n}',
        );
        expect(JSON.parse(files["tools.json"])).toEqual({
            tools: [
                { type: "client", config: "tool_configs/show_order.json", id: "tool_new_1" },
                { type: "webhook", config: "tool_configs/get_order.json", id: "tool_new_2" },
            ],
        });
        expect(JSON.parse(files["agent_configs/Support-line.json"]).conversation_config.agent.prompt.tool_ids).toEqual([
            "tool_new_1",
        ]);

        // A fresh script run: new objects, matched to the project's entries by name.
        server.calls.length = 0;
        const reloaded = AgentProject.fromFiles(files);
        const result = await client.conversationalAi.agents.push(supportAgent(), { project: reloaded });
        expect(server.writes()).toEqual(["PATCH /v1/convai/agents/agent_new_3"]);
        expect(result.tools.get_order.action).toBe("unchanged");
        // Only the version the update reported is new, recorded like the CLI does.
        expect(reloaded.changedFiles).toEqual(["agents.json"]);
        expect(JSON.parse(reloaded.toFiles()["agents.json"]).agents[0].version_id).toBe("ver_1");
    });

    it("pushes a loaded agent's settings the SDK doesn't model", async () => {
        const server = new FakeServer();
        const client = server.client();
        server.addTool("tool_lookup", { type: "client", name: "lookup", description: "old" });
        const project = AgentProject.fromFiles({
            "agents.json": JSON.stringify({ agents: [{ config: "agent_configs/a.json", id: "agent_1" }] }),
            "tools.json": JSON.stringify({
                tools: [{ type: "client", config: "tool_configs/t.json", id: "tool_lookup" }],
            }),
            "agent_configs/a.json": JSON.stringify({
                name: "A",
                conversation_config: {
                    agent: { prompt: { prompt: "p", tool_ids: ["tool_lookup"] } },
                    future_setting: { on: true },
                },
                platform_settings: {},
                tags: [],
            }),
            "tool_configs/t.json": JSON.stringify({
                type: "client",
                name: "lookup",
                description: "d",
                future_field: 1,
            }),
        });
        server.addAgent("agent_1", {});

        const agent = project.agent("A");
        agent.update({ firstMessage: "Hello" });
        await client.conversationalAi.agents.push(agent, { project });

        const toolPatch = server.calls.find((c) => c.method === "PATCH" && c.path.includes("/tools/"));
        expect(toolPatch?.body?.tool_config.future_field).toBe(1);
        const agentPatch = server.calls.find((c) => c.method === "PATCH" && c.path.includes("/agents/"));
        expect(agentPatch?.body?.conversation_config.future_setting).toEqual({ on: true });
        expect(agentPatch?.body?.conversation_config.agent.first_message).toBe("Hello");
        expect(project.changedFiles.sort()).toEqual([
            "agent_configs/a.json",
            "agents.json",
            "tool_configs/t.json",
            "tools.json",
        ]);
    });
});

describe("agents.pull", () => {
    it("loads an agent with its tools as Tool objects, and writes them into a project", async () => {
        const server = new FakeServer();
        const client = server.client();
        const { agentId } = await client.conversationalAi.agents.push(supportAgent());

        const project = AgentProject.fromFiles({});
        const agent = await client.conversationalAi.agents.pull(agentId, { project });
        expect(agent.name).toBe("Support line");
        expect(agent.tools().map((t) => t.name)).toEqual(["show_order", "get_order"]);
        expect(project.agentId(agent)).toBe(agentId);

        const files = project.toFiles();
        expect(Object.keys(files).sort()).toEqual([
            "agent_configs/Support-line.json",
            "agents.json",
            "tool_configs/get_order.json",
            "tool_configs/show_order.json",
            "tools.json",
        ]);
        const config = JSON.parse(files["agent_configs/Support-line.json"]);
        expect(Object.keys(config)).toEqual(["conversation_config", "name", "platform_settings", "tags", "workflow"]);

        // Pushing the pulled agent back changes no tools.
        server.calls.length = 0;
        const result = await client.conversationalAi.agents.push(agent, { project });
        expect(server.writes()).toEqual([`PATCH /v1/convai/agents/${agentId}`]);
        expect(Object.values(result.tools).map((t) => t.action)).toEqual(["unchanged", "unchanged"]);
    });
});

describe("push review fixes", () => {
    it("updates a project tool whose only change is a field the SDK doesn't model", async () => {
        const server = new FakeServer();
        server.addTool("tool_1", { type: "client", name: "ping", description: "d", future_field: 1 }, ["agent_1"]);
        server.addAgent("agent_1", {});
        const files = {
            "agents.json": JSON.stringify({ agents: [{ config: "agent_configs/a.json", id: "agent_1" }] }),
            "tools.json": JSON.stringify({ tools: [{ type: "client", config: "tool_configs/t.json", id: "tool_1" }] }),
            "agent_configs/a.json": JSON.stringify({
                name: "A",
                conversation_config: { agent: { prompt: { prompt: "p", tool_ids: ["tool_1"] } } },
            }),
            "tool_configs/t.json": JSON.stringify({ type: "client", name: "ping", description: "d", future_field: 2 }),
        };
        const project = AgentProject.fromFiles(files);
        const result = await server.client().conversationalAi.agents.push(project.agent("A"), { project });
        expect(result.tools.ping.action).toBe("updated");
        expect(server.tools.get("tool_1").config.future_field).toBe(2);
    });

    it("brings the project up to date when the server already matches a new definition", async () => {
        const server = new FakeServer();
        const client = server.client();
        const project = AgentProject.fromFiles({});
        await client.conversationalAi.agents.push(supportAgent([getOrder("v2"), showOrder()]), { project });
        const stale = AgentProject.fromFiles({
            ...project.toFiles(),
            "tool_configs/get_order.json": JSON.stringify(getOrder("v1").toJSON(), null, 4),
        });
        const result = await client.conversationalAi.agents.push(supportAgent([getOrder("v2"), showOrder()]), {
            project: stale,
        });
        expect(result.tools.get_order.action).toBe("unchanged");
        expect(JSON.parse(stale.toFiles()["tool_configs/get_order.json"]).description).toBe("v2");
    });

    it("doesn't report a tool as detached while the workflow still uses its id", async () => {
        const server = new FakeServer();
        const client = server.client();
        server.addTool("tool_raw", showOrder().buildConfig() as never);
        const wf = new Workflow();
        wf.tool("run", ["tool_raw"]);
        const agent = new Agent("A", { prompt: "p", workflow: wf });
        const { agentId } = await client.conversationalAi.agents.push(agent);
        const again = await client.conversationalAi.agents.push(agent, { agentId });
        expect(again.tools).toEqual({});
    });
});

describe("push review fixes, round 2", () => {
    it("attaches a tool added with addTool()", () => {
        const agent = new Agent("A", { prompt: "p" }).addTool(getOrder());
        const prompt = (agent.toJSON({ toolIds: { get_order: "tool_1" } }).conversation_config as any).agent.prompt;
        expect(prompt.tool_ids).toEqual(["tool_1"]);
    });

    it("keeps a project tool's unmodeled fields when the same tool is rebuilt in code", async () => {
        const server = new FakeServer();
        const client = server.client();
        const project = AgentProject.fromFiles({});
        await client.conversationalAi.agents.push(supportAgent(), { project });
        const files = project.toFiles();
        const withExtra = { ...JSON.parse(files["tool_configs/get_order.json"]), future_field: 1 };
        files["tool_configs/get_order.json"] = JSON.stringify(withExtra, null, 4);
        server.tools.get("tool_new_2").config = withExtra;

        const reloaded = AgentProject.fromFiles(files);
        const result = await client.conversationalAi.agents.push(supportAgent(), { project: reloaded });
        expect(result.tools.get_order.action).toBe("unchanged");
        expect(JSON.parse(reloaded.toFiles()["tool_configs/get_order.json"]).future_field).toBe(1);
    });
});

describe("agents.push to a branch with a project", () => {
    const branchId = "agtbrch_1";
    const branchFile = "agent_configs/support.test.json";
    const ordersAgent = (...tools: Tool[]) => new Agent("Support", { prompt: "You help with orders.", tools });
    const toolEntries = (project: AgentProject): { id?: string; config: string }[] =>
        JSON.parse(project.toFiles()["tools.json"]).tools;
    const toolWrites = (server: FakeServer) => server.writes().filter((write) => write.includes("/tools"));

    // The files of a project whose agent is pushed and has a branch, which starts as a copy of the main branch.
    async function setup(initial: Agent) {
        const server = new FakeServer();
        const agents = server.client().conversationalAi.agents;
        const project = AgentProject.fromFiles({});
        const first = await agents.push(initial, { project });
        const files = project.toFiles();
        const index = JSON.parse(files["agents.json"]);
        const mainPath: string = index.agents[0].config;
        index.agents[0].branches = { test: { config: branchFile, branch_id: branchId } };
        files["agents.json"] = JSON.stringify(index);
        files[branchFile] = files[mainPath];
        const branchKey = `${first.agentId}/${branchId}`;
        server.branches.set(branchKey, JSON.parse(files[branchFile]));
        server.calls.length = 0;
        const branchToolIds = () => server.branches.get(branchKey)?.conversation_config.agent.prompt.tool_ids;
        const mainToolIds = () => server.agents.get(first.agentId)?.conversation_config.agent.prompt.tool_ids;
        return { server, agents, files, mainPath, mainId: first.tools.get_order?.id, branchToolIds, mainToolIds };
    }

    it("records the branch's copy in its own entry, and both resolve after reopening", async () => {
        const { server, agents, files, mainPath, mainId } = await setup(ordersAgent(getOrder()));
        const opened = AgentProject.fromFiles(files);
        const changed = ordersAgent(getOrder("Branch lookup"));
        const copyId = (await agents.push(changed, { project: opened, branchId })).tools.get_order.id;
        expect(copyId).not.toBe(mainId);
        const saved = opened.toFiles();
        const entries = toolEntries(opened);
        expect(entries.map((entry) => entry.id)).toEqual([mainId, copyId]);
        expect(JSON.parse(saved[entries[1].config]).description).toBe("Branch lookup");
        expect(JSON.parse(saved[branchFile]).conversation_config.agent.prompt.tool_ids).toEqual([copyId]);
        // The main branch's files are as they were.
        expect(saved[mainPath]).toBe(files[mainPath]);
        expect(saved[entries[0].config]).toBe(files[entries[0].config]);

        server.calls.length = 0;
        const reopened = AgentProject.fromFiles(saved);
        expect((await agents.push(changed, { project: reopened, branchId })).tools.get_order).toEqual({
            id: copyId,
            action: "unchanged",
        });
        expect((await agents.push(ordersAgent(getOrder()), { project: reopened })).tools.get_order).toEqual({
            id: mainId,
            action: "unchanged",
        });
        expect(toolWrites(server)).toEqual([]);
    });

    it("reuses the copy a failed push made when the push is retried", async () => {
        const { server, agents, files, branchToolIds } = await setup(ordersAgent(getOrder()));
        const project = AgentProject.fromFiles(files);
        const options = { project, branchId, requestOptions: { maxRetries: 0 } };
        server.failOn = /^PATCH \/v1\/convai\/agents\//;
        const err = await agents.push(ordersAgent(getOrder("v2")), options).catch((e: unknown) => e);
        expect(err).toBeInstanceOf(AgentPushError);
        const error = err as AgentPushError;
        const copyId = error.result.tools.get_order.id;

        server.failOn = undefined;
        server.calls.length = 0;
        // Also after reopening: the copy was recorded although the push failed.
        for (const retryProject of [project, AgentProject.fromFiles(project.toFiles())]) {
            const retry = await agents.push(ordersAgent(getOrder("v2")), { ...options, project: retryProject });
            expect(retry.tools.get_order).toEqual({ id: copyId, action: "unchanged" });
            expect(toolEntries(retryProject)).toHaveLength(2);
        }
        expect(toolWrites(server)).toEqual([]);
        expect(branchToolIds()).toEqual([copyId]);
    });

    it("keeps the main branch on its own tool when the same Tool object is pushed to both", async () => {
        const { server, agents, files, mainId, mainToolIds } = await setup(ordersAgent(getOrder()));
        const project = AgentProject.fromFiles(files);
        const agent = ordersAgent(getOrder("v2"));
        const onBranch = await agents.push(agent, { project, branchId });
        const copyId = onBranch.tools.get_order.id;
        expect(copyId).not.toBe(mainId);

        const onMain = await agents.push(agent, { project });
        expect(onMain.tools.get_order).toEqual({ id: mainId, action: "updated" });
        expect(mainToolIds()).toEqual([mainId]);

        await agents.push(ordersAgent(getOrder("v3")), { project });
        expect(server.tools.get(copyId)?.config.description).toBe("v2");
        expect(server.tools.get(mainId)?.config.description).toBe("v3");
    });

    it("fills in an entry that was never pushed, and the main branch still gets a tool of its own", async () => {
        const { server, agents, files, mainToolIds } = await setup(ordersAgent());
        const project = AgentProject.fromFiles({
            ...files,
            "tools.json": JSON.stringify({ tools: [{ type: "webhook", config: "tool_configs/get_order.json" }] }),
            "tool_configs/get_order.json": JSON.stringify(getOrder().toJSON()),
        });

        const onBranch = await agents.push(ordersAgent(getOrder()), { project, branchId });
        expect(onBranch.tools.get_order.action).toBe("created");
        const copyId = onBranch.tools.get_order.id;
        expect(toolEntries(project)).toEqual([{ type: "webhook", config: "tool_configs/get_order.json", id: copyId }]);

        // The entry is the branch's now, so a main push doesn't match it by name (it would update it later).
        const reopened = AgentProject.fromFiles(project.toFiles());
        const onMain = await agents.push(ordersAgent(getOrder()), { project: reopened });
        expect(onMain.tools.get_order.action).toBe("created");
        expect(mainToolIds()).toEqual([onMain.tools.get_order.id]);
        expect(toolEntries(reopened).map((entry) => entry.id)).toEqual([copyId, onMain.tools.get_order.id]);
        expect(toolWrites(server)).toEqual(["POST /v1/convai/tools", "POST /v1/convai/tools"]);

        // From here each branch resolves its own.
        server.calls.length = 0;
        const again = AgentProject.fromFiles(reopened.toFiles());
        expect((await agents.push(ordersAgent(getOrder()), { project: again })).tools.get_order.action).toBe(
            "unchanged",
        );
        expect((await agents.push(ordersAgent(getOrder()), { project: again, branchId })).tools.get_order).toEqual({
            id: copyId,
            action: "unchanged",
        });
        expect(toolWrites(server)).toEqual([]);
    });

    it("attaches the project's tool to a branch that lacks it, instead of creating a duplicate", async () => {
        const { server, agents, files, mainId, branchToolIds } = await setup(ordersAgent(getOrder()));
        const project = AgentProject.fromFiles(files);
        const withShow = await agents.push(ordersAgent(getOrder(), showOrder()), { project });
        const showId = withShow.tools.show_order.id;
        server.calls.length = 0;

        const onBranch = await agents.push(ordersAgent(getOrder(), showOrder()), { project, branchId });
        expect(onBranch.tools).toEqual({
            get_order: { id: mainId, action: "unchanged" },
            show_order: { id: showId, action: "unchanged" },
        });
        expect(toolWrites(server)).toEqual([]);
        expect(branchToolIds()).toEqual([mainId, showId]);
        expect(toolEntries(project)).toHaveLength(2);
    });

    it("keeps one entry for the branch's copy however often it is changed", async () => {
        const { agents, files, mainId } = await setup(ordersAgent(getOrder()));
        const project = AgentProject.fromFiles(files);
        let copyId: string | undefined;
        for (const description of ["v2", "v3", "v4"]) {
            const result = await agents.push(ordersAgent(getOrder(description)), { project, branchId });
            expect(result.tools.get_order.action).toBe("created");
            expect(result.tools.get_order.id).not.toBe(copyId);
            copyId = result.tools.get_order.id;
        }
        const entries = toolEntries(project);
        expect(entries.map((entry) => entry.id)).toEqual([mainId, copyId]);
        const saved = project.toFiles();
        expect(JSON.parse(saved[entries[1].config]).description).toBe("v4");
        // The main branch's tool file is as it was.
        expect(saved[entries[0].config]).toBe(files[entries[0].config]);
    });

    it("still matches a tool built in code to the main branch's entry once a branch copy exists", async () => {
        const { server, agents, files, mainId } = await setup(ordersAgent(getOrder()));
        const project = AgentProject.fromFiles(files);
        await agents.push(ordersAgent(getOrder("v2")), { project, branchId });
        server.calls.length = 0;

        expect(project.toolId(getOrder())).toBe(mainId);
        const other = await agents.push(new Agent("Other", { tools: [getOrder()] }), { project });
        expect(other.tools.get_order).toEqual({ id: mainId, action: "unchanged" });
        expect(toolWrites(server)).toEqual([]);
    });

    it("says so when same-named entries can't be told apart", async () => {
        const server = new FakeServer();
        const config = JSON.stringify(getOrder().toJSON());
        const project = AgentProject.fromFiles({
            "tools.json": JSON.stringify({
                tools: [
                    { type: "webhook", config: "tool_configs/a.json", id: "tool_a" },
                    { type: "webhook", config: "tool_configs/b.json", id: "tool_b" },
                ],
            }),
            "tool_configs/a.json": config,
            "tool_configs/b.json": config,
        });
        expect(() => project.toolId(getOrder())).toThrow(/2 entries in tools.json are named "get_order"/);
        const err = await server
            .client()
            .conversationalAi.agents.push(ordersAgent(getOrder()), { project })
            .catch((e: unknown) => e);
        expect(err).toBeInstanceOf(AgentPushError);
        const error = err as AgentPushError;
        expect(error.message).toMatch(/Couldn't match tool "get_order".*2 entries in tools.json/);
        expect(server.calls).toEqual([]);
        // The loaded object says which entry it is.
        expect(project.toolId(project.tools()[1])).toBe("tool_b");
    });

    it("copies a loaded tool that was edited, and keeps resolving the loaded object to the main entry", async () => {
        const { server, agents, files, mainId } = await setup(ordersAgent(getOrder()));
        const project = AgentProject.fromFiles(files);
        const agent = project.agent("Support");
        const loaded = project.tools()[0];
        loaded.get("https://staging.example.com/orders/{order_id}");

        const onBranch = await agents.push(agent, { project, branchId });
        expect(onBranch.tools.get_order.action).toBe("created");
        const copyId = onBranch.tools.get_order.id;
        expect(project.toolId(loaded)).toBe(mainId);
        expect((await agents.push(agent, { project, branchId })).tools.get_order).toEqual({
            id: copyId,
            action: "unchanged",
        });
        expect(server.tools.get(mainId)?.config.api_schema.url).toBe("https://api.example.com/orders/{order_id}");

        expect((await agents.push(agent, { project })).tools.get_order).toEqual({ id: mainId, action: "updated" });
        expect(server.tools.get(mainId)?.config.api_schema.url).toBe("https://staging.example.com/orders/{order_id}");
    });

    it("never updates a branch's copy from a main push, even when it's the only entry with the name", async () => {
        const { server, agents, files, mainToolIds } = await setup(ordersAgent());
        const project = AgentProject.fromFiles(files);
        const onBranch = await agents.push(ordersAgent(getOrder("v2")), { project, branchId });
        const copyId = onBranch.tools.get_order.id;
        server.calls.length = 0;

        const onMain = await agents.push(ordersAgent(getOrder("v3")), { project });
        expect(onMain.tools.get_order.action).toBe("created");
        expect(onMain.tools.get_order.id).not.toBe(copyId);
        expect(toolWrites(server)).toEqual(["POST /v1/convai/tools"]);
        expect(server.tools.get(copyId)?.config.description).toBe("v2");
        expect(mainToolIds()).toEqual([onMain.tools.get_order.id]);
        expect(toolEntries(project).map((entry) => entry.id)).toEqual([copyId, onMain.tools.get_order.id]);
    });

    it("doesn't take over the tool's entry when the branch has no file of its own", async () => {
        const { agents, files, mainPath, mainId } = await setup(ordersAgent(getOrder()));
        const index = JSON.parse(files["agents.json"]);
        index.agents[0].branches.test.config = `./${mainPath}`;
        const project = AgentProject.fromFiles({ ...files, "agents.json": JSON.stringify(index) });

        const onBranch = await agents.push(ordersAgent(getOrder("v2")), { project, branchId });
        expect(toolEntries(project).map((entry) => entry.id)).toEqual([mainId, onBranch.tools.get_order.id]);
    });

    it("skips a recorded copy that was deleted on the server", async () => {
        const { server, agents, files, mainId } = await setup(ordersAgent(getOrder()));
        const project = AgentProject.fromFiles(files);
        const first = await agents.push(ordersAgent(getOrder("v2")), { project, branchId });
        await agents.push(ordersAgent(getOrder()), { project, branchId }); // back on the main branch's tool
        server.tools.delete(first.tools.get_order.id);

        const again = await agents.push(ordersAgent(getOrder("v2")), { project, branchId });
        expect(again.tools.get_order.action).toBe("created");
        expect([mainId, first.tools.get_order.id]).not.toContain(again.tools.get_order.id);
    });

    it("finds its copy again when the server doesn't keep a field the project's file has", async () => {
        const { server, agents, files } = await setup(ordersAgent(getOrder()));
        const toolPath = JSON.parse(files["tools.json"]).tools[0].config;
        const withExtra = { ...JSON.parse(files[toolPath]), write_only: "x", description: "v2" };
        const project = AgentProject.fromFiles({ ...files, [toolPath]: JSON.stringify(withExtra) });
        server.dropsToolField = "write_only";
        const agent = project.agent("Support");

        const first = await agents.push(agent, { project, branchId });
        expect(first.tools.get_order.action).toBe("created");
        server.calls.length = 0;
        for (const retryProject of [project, AgentProject.fromFiles(project.toFiles())]) {
            const retry = await agents.push(retryProject.agent("Support"), { project: retryProject, branchId });
            expect(retry.tools.get_order).toEqual({ id: first.tools.get_order.id, action: "unchanged" });
        }
        expect(toolWrites(server)).toEqual([]);
    });

    it("treats the branch id on the agent's own entry as the main branch", async () => {
        const { server, agents, files, mainId } = await setup(ordersAgent(getOrder()));
        const index = JSON.parse(files["agents.json"]);
        index.agents[0].branch_id = "agtbrch_main"; // as the CLI records it for a versioned agent
        const project = AgentProject.fromFiles({ ...files, "agents.json": JSON.stringify(index) });

        expect(project.toolId(getOrder())).toBe(mainId);
        const other = await agents.push(new Agent("Other", { tools: [getOrder()] }), { project });
        expect(other.tools.get_order).toEqual({ id: mainId, action: "unchanged" });

        server.calls.length = 0;
        const result = await agents.push(ordersAgent(getOrder("v2")), { project, branchId: "agtbrch_main" });
        expect(result.tools.get_order).toEqual({ id: mainId, action: "updated" });
        expect(toolWrites(server)).toEqual([`PATCH /v1/convai/tools/${mainId}`]);
        expect(toolEntries(project).map((entry) => entry.id)).toEqual([mainId]);
    });

    it("gives the main branch its own tool when a loaded tool's entry is a branch's copy", async () => {
        const { server, agents, files, mainToolIds } = await setup(ordersAgent());
        const first = AgentProject.fromFiles(files);
        const copyId = (await agents.push(ordersAgent(getOrder()), { project: first, branchId })).tools.get_order.id;
        const project = AgentProject.fromFiles(first.toFiles());
        const loaded = project.tools()[0];
        expect(project.toolId(loaded)).toBe(copyId);
        server.calls.length = 0;

        const onMain = await agents.push(ordersAgent(loaded.get("https://staging.example.com/orders/{order_id}")), {
            project,
        });
        expect(onMain.tools.get_order.action).toBe("created");
        expect(toolWrites(server)).toEqual(["POST /v1/convai/tools"]);
        expect(server.tools.get(copyId)?.config.api_schema.url).toBe("https://api.example.com/orders/{order_id}");
        expect(mainToolIds()).toEqual([onMain.tools.get_order.id]);
    });
});
