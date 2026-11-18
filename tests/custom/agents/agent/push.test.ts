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
