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

    it("matches a branch push against the branch's tools, not the main branch's", async () => {
        const server = new FakeServer();
        const client = server.client();
        const { agentId } = await client.conversationalAi.agents.push(supportAgent());
        // The branch uses its own copy of get_order, and no show_order.
        server.addTool("tool_branch_order", getOrder("Branch lookup").toJSON());
        const branch = JSON.parse(JSON.stringify(server.agents.get(agentId)));
        branch.workflow.nodes.lookup.tools = [{ tool_id: "tool_branch_order" }];
        branch.conversation_config.agent.prompt.tool_ids = [];
        server.branches.set(`${agentId}/agtbrch_1`, branch);
        server.calls.length = 0;

        const result = await client.conversationalAi.agents.push(supportAgent([getOrder("Changed lookup")]), {
            agentId,
            branchId: "agtbrch_1",
        });
        expect(result.tools.get_order).toEqual({ id: "tool_branch_order", action: "updated" });
        expect(result.tools.show_order).toBeUndefined(); // a main-branch tool the branch never used isn't "detached"
        expect(server.writes()).toEqual([
            "PATCH /v1/convai/tools/tool_branch_order",
            `PATCH /v1/convai/agents/${agentId}`,
        ]);
        expect(server.calls.some((call) => call.query.used_by_agent_id !== undefined)).toBe(false);
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

describe("tools push doesn't manage", () => {
    const mcpConfig = {
        type: "mcp",
        name: "docs_search",
        description: "Search the docs",
        mcp_server_id: "mcp_1",
    };
    const mcpTool = (): Tool => Tool.fromJSON(mcpConfig);
    const config = {
        name: "A",
        conversation_config: { agent: { prompt: { prompt: "p", tool_ids: ["tool_mcp"] } } },
        platform_settings: {},
        tags: [],
    };
    const message =
        'Tool "docs_search" has type "mcp", which push doesn\'t create or update: load it with its id or attach it with toolIds';

    function issuesOf(run: () => unknown): { code: string; path?: string; message: string }[] {
        try {
            run();
        } catch (err) {
            if (err instanceof AgentValidationError) {
                return err.issues.map(({ code, path, message }) => ({ code, path, message }));
            }
            throw err;
        }
        return [];
    }

    // A tool push doesn't manage needs the id it was loaded with: given as a new object, it's reported before any
    // request, whether the agent or a workflow node uses it.
    it("rejects an MCP tool without an id", async () => {
        const server = new FakeServer();
        const agent = new Agent("A", { prompt: "p", tools: [mcpTool()] });
        expect(issuesOf(() => agent.validate())).toEqual([
            { code: "invalid_tool", path: "tools.docs_search", message },
        ]);
        await expect(server.client().conversationalAi.agents.push(agent)).rejects.toThrow(AgentValidationError);

        const wf = new Workflow();
        wf.converse("triage", "Find out what the caller needs").tool("search", [mcpTool()]);
        const inWorkflow = new Agent("A", { prompt: "p", workflow: wf });
        expect(issuesOf(() => inWorkflow.validate())).toEqual([
            { code: "invalid_tool", path: "tools.docs_search", message },
        ]);
        expect(server.calls).toEqual([]);
    });

    // Push manages webhook and client tools only: an MCP tool, like pull leaves it, stays attached by the id it was
    // loaded with and is never created or updated.
    describe("leaves an MCP tool attached by id", () => {
        async function check(server: FakeServer, agent: Agent, options: Parameters<typeof push>[1]): Promise<void> {
            expect(agent.tools()).toEqual([]);
            const result = await push(server, agent, options);
            expect(server.writes()).toEqual(["PATCH /v1/convai/agents/agent_1"]);
            expect(result.tools.docs_search).toBeUndefined();
            const sent = server.agents.get("agent_1") as any;
            expect(sent.conversation_config.agent.prompt.tool_ids).toEqual(["tool_mcp"]);
            expect((server.tools.get("tool_mcp") as any).config).toEqual(mcpConfig);
        }
        const push = (server: FakeServer, agent: Agent, options: { agentId?: string; project?: AgentProject }) =>
            server.client().conversationalAi.agents.push(agent, options);
        const serverWithMcp = (): FakeServer => {
            const server = new FakeServer();
            server.addTool("tool_mcp", mcpConfig as never, ["agent_1"]);
            server.addAgent("agent_1", {} as never);
            return server;
        };

        it("loaded with its id", async () => {
            const agent = Agent.fromJSON(config, { toolsById: { tool_mcp: mcpTool() } });
            await check(serverWithMcp(), agent, { agentId: "agent_1" });
        });

        it("from a project's tools.json", async () => {
            const project = AgentProject.fromFiles({
                "agents.json": JSON.stringify({ agents: [{ config: "agent_configs/a.json", id: "agent_1" }] }),
                "tools.json": JSON.stringify({
                    tools: [{ type: "mcp", config: "tool_configs/docs.json", id: "tool_mcp" }],
                }),
                "agent_configs/a.json": JSON.stringify(config),
                "tool_configs/docs.json": JSON.stringify(mcpConfig),
            });
            await check(serverWithMcp(), project.agent("A"), { project });
        });

        it("in a workflow node", async () => {
            const server = serverWithMcp();
            const mcp = mcpTool();
            const agent = Agent.fromJSON(config, { toolsById: { tool_mcp: mcp } });
            const wf = new Workflow();
            wf.converse("triage", "Find out what the caller needs").tool("search", [mcp]);
            agent.update({ workflow: wf });
            await check(server, agent, { agentId: "agent_1" });
            expect((server.agents.get("agent_1") as any).workflow.nodes.search.tools).toEqual([
                { tool_id: "tool_mcp" },
            ]);
        });
    });

    // A loaded MCP tool stays in toolIds, as pull leaves it, so replacing the agent's tools keeps it attached.
    it("keeps a loaded MCP tool in toolIds", () => {
        const ping = Tool.fromJSON({ type: "client", name: "ping", description: "Ping the client" });
        const mcp = mcpTool();
        const agent = Agent.fromJSON(
            {
                ...config,
                conversation_config: { agent: { prompt: { prompt: "p", tool_ids: ["tool_mcp", "tool_ping"] } } },
            },
            { toolsById: { tool_mcp: mcp, tool_ping: ping } },
        );
        expect(agent.toolIds).toEqual(["tool_mcp"]);
        expect(agent.tools()).toEqual([ping]);

        agent.update({ tools: [getOrder("Look up an order")] });
        expect(agent.toolIds).toEqual(["tool_mcp"]);
        const toolIdsOf = () =>
            (agent.toJSON({ toolIds: { get_order: "tool_order" } }) as any).conversation_config.agent.prompt.tool_ids;
        expect(toolIdsOf()).toEqual(["tool_mcp", "tool_order"]);

        // Adding the loaded MCP object back, while its id is still in toolIds, attaches it once.
        agent.addTool(mcp);
        expect(toolIdsOf()).toEqual(["tool_mcp", "tool_order"]);
    });
});
