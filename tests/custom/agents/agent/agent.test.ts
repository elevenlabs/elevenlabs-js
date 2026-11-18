import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "@jest/globals";
import { Agent, AgentValidationError, Schema, SystemTool, Tool, Workflow } from "../../../../src";
import { sortKeys } from "../../../../src/wrapper/agents/workflow/util";

const CLI_PROJECT = join(__dirname, "../../../../docs/agents-as-code/fixtures/project/cli-graph");
const readJson = (path: string): Record<string, unknown> => JSON.parse(readFileSync(join(CLI_PROJECT, path), "utf8"));

const getOrder = () =>
    Tool.webhook("get_order", "Look up an order by its number")
        .get("https://api.example.com/orders/{order_id}")
        .pathParam("order_id", Schema.string().describe("The order number"));
const showOrder = () =>
    Tool.client("show_order", "Show the order card").param("order_id", Schema.string().fromVariable("order_id"));

function issuesOf(fn: () => unknown): Array<{ code: string; path?: string }> {
    try {
        fn();
    } catch (err) {
        if (err instanceof AgentValidationError) {
            return err.issues.map(({ code, path }) => ({ code, path }));
        }
        throw err;
    }
    throw new Error("expected an AgentValidationError");
}

describe("Agent.toJSON / build", () => {
    it("maps typed options, tools and system tools into the API config", () => {
        const agent = new Agent("Support line", {
            prompt: "You are a support agent.",
            firstMessage: "Hi!",
            language: "en",
            llm: "gemini-2.0-flash",
            temperature: 0.5,
            voiceId: "voice_1",
            tags: ["support"],
            tools: [SystemTool.endCall(), getOrder()],
            toolIds: ["tool_existing"],
        });
        const config = agent.toJSON({ toolIds: { get_order: "tool_1" } });
        expect(config).toEqual({
            conversation_config: {
                agent: {
                    first_message: "Hi!",
                    language: "en",
                    prompt: {
                        built_in_tools: {
                            end_call: { name: "end_call", params: { system_tool_type: "end_call" }, type: "system" },
                        },
                        llm: "gemini-2.0-flash",
                        prompt: "You are a support agent.",
                        temperature: 0.5,
                        tool_ids: ["tool_existing", "tool_1"],
                    },
                },
                tts: { voice_id: "voice_1" },
            },
            name: "Support line",
            platform_settings: {},
            tags: ["support"],
        });
        expect(JSON.stringify(config)).toBe(JSON.stringify(sortKeys(config)));

        const body = agent.build({ toolIds: { get_order: "tool_1" } });
        expect(body.name).toBe("Support line");
        expect(body.conversationConfig.agent?.prompt?.toolIds).toEqual(["tool_existing", "tool_1"]);
        expect(body.conversationConfig.agent?.prompt?.builtInTools?.endCall?.name).toBe("end_call");
    });

    it("merges the raw config under the typed options", () => {
        const agent = new Agent("A", {
            prompt: "p",
            conversationConfig: { turn: { turnTimeout: 7 }, agent: { disableFirstMessageInterruptions: true } },
            platformSettings: { privacy: { recordVoice: false } },
        });
        agent.update({ conversationConfig: { turn: { silenceEndCallTimeout: 20 } } });
        const config = agent.toJSON();
        expect(config.conversation_config).toEqual({
            agent: { disable_first_message_interruptions: true, prompt: { prompt: "p" } },
            turn: { silence_end_call_timeout: 20, turn_timeout: 7 },
        });
        expect(config.platform_settings).toEqual({ privacy: { record_voice: false } });
    });

    it("fills in the ids of Tool objects used by workflow nodes", () => {
        const lookup = getOrder();
        const show = showOrder();
        const wf = new Workflow();
        const triage = wf.converse("triage", "Find out what the caller needs");
        triage
            .when("Caller gave an order number")
            .tool("lookup", [lookup], {
                schemaOverrides: { get_order: { "path_params.order_id": { source: "constant", constantValue: "1" } } },
            })
            .onSuccess()
            .converse("resolve", "Explain the order", { toolIds: [show, "tool_raw"] });
        const agent = new Agent("A", { prompt: "p", workflow: wf });

        expect(agent.tools()).toEqual([lookup, show]);
        const nodes = (
            agent.toJSON({ toolIds: { get_order: "tool_g", show_order: "tool_s" } }).workflow as {
                nodes: Record<string, Record<string, unknown>>;
            }
        ).nodes;
        expect(nodes.lookup.tools).toEqual([
            {
                schema_overrides: { "path_params.order_id": { constant_value: "1", source: "constant" } },
                tool_id: "tool_g",
            },
        ]);
        expect(nodes.resolve.additional_tool_ids).toEqual(["tool_s", "tool_raw"]);
        expect(issuesOf(() => agent.toJSON({ toolIds: { get_order: "tool_g" } }))).toEqual([
            { code: "unresolved_tool", path: "tools.show_order" },
        ]);
    });

    it("validates without ids, so CI needs no API key", () => {
        expect(() => new Agent("A", { prompt: "p", tools: [getOrder()] }).validate()).not.toThrow();
    });

    it("reports every problem at once", () => {
        const wf = new Workflow();
        wf.tool("hang_up", [SystemTool.endCall()]);
        const agent = new Agent("", {
            prompt: "p",
            tools: [getOrder(), getOrder(), Tool.webhook("broken", "No URL")],
            workflow: wf,
            conversationConfig: { agent: { prompt: { prompt: "raw prompt" } } },
        });
        expect(issuesOf(() => agent.validate())).toEqual([
            { code: "missing_name", path: undefined },
            { code: "option_conflict", path: "conversation_config.agent.prompt.prompt" },
            { code: "duplicate_tool_name", path: "tools.get_order" },
            { code: "invalid_tool", path: "tools.broken" },
            { code: "system_tool_in_workflow", path: "workflow.tools.end_call" },
        ]);
    });

    it("warns, without failing, when there's no prompt", () => {
        const warnings: string[] = [];
        new Agent("A").validate({ onWarning: (issue) => warnings.push(issue.code) });
        expect(warnings).toEqual(["missing_prompt"]);
    });
});

describe("Agent.fromJSON", () => {
    it("round-trips a CLI agent config, keeping fields the SDK doesn't model and the tool order", () => {
        const raw = readJson("agent_configs/support.json");
        const lookup = Tool.fromJSON(readJson("tool_configs/lookup_order.json"));
        const agent = Agent.fromJSON(raw, { toolsById: { tool_lookup: lookup } });

        expect(agent.name).toBe("Support");
        expect(agent.tools()).toEqual([lookup]);
        expect(agent.toolIds).toEqual(["tool_from_dashboard"]);
        expect(agent.toJSON({ toolIds: { lookup_order: "tool_lookup" } })).toEqual(sortKeys(raw));
    });

    it("turns a loaded workflow into a Workflow on first use, with tool ids bound to Tool objects", () => {
        const raw = readJson("agent_configs/support.beta.json");
        const refund = Tool.fromJSON(readJson("tool_configs/issue_refund.json"));
        const agent = Agent.fromJSON(raw, { toolsById: { tool_refund: refund } });

        expect(agent.tools()).toEqual([refund]); // read from the raw workflow, before it's materialized
        const unedited = agent.toJSON({ toolIds: { issue_refund: "tool_refund" } });
        expect(unedited.workflow).toEqual(sortKeys(raw.workflow));

        agent.workflow?.node("refunds").update({ prompt: "Handle refunds" });
        const nodes = (
            agent.toJSON({ toolIds: { issue_refund: "tool_new" } }).workflow as {
                nodes: Record<string, Record<string, unknown>>;
            }
        ).nodes;
        expect(nodes.refunds.additional_tool_ids).toEqual(["tool_new"]);
        expect(nodes.refunds.additional_prompt).toBe("Handle refunds");
    });
});
