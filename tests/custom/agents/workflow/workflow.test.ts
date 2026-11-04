import { readFileSync } from "fs";
import { join } from "path";
import type * as ElevenLabs from "../../../../src/api/index";
import * as serializers from "../../../../src/serialization/index";
import {
    Condition,
    Destination,
    Expr,
    Workflow,
    type WorkflowIssue,
    WorkflowValidationError,
} from "../../../../src/wrapper/agents/workflow";

// Behaviour the shared fixtures (fixtures.test.ts) can't cover: the JS-facing model from build(), the Expr
// builder, fromAgent() on SDK-shaped responses, and rules with no fixture yet.

function supportLine(): Workflow {
    const wf = new Workflow({ preventSubagentLoops: true });
    const triage = wf.converse("triage", "Greet the caller", { label: "Triage" });
    const identify = triage.when("Caller wants to check an order").converse("identify", "Ask for the order number");
    const lookup = identify.when("Caller gave an order number").tool("lookup_order", ["tool_get_order"]);
    const resolve = lookup.onSuccess().converse("resolve", "Explain the order status");
    lookup.onFailure().goTo(identify);
    triage.when(Expr.variable("tier").eq("gold")).transfer("vip", Destination.agent("agent_vip"));
    resolve.when("Caller is satisfied").end();
    return wf;
}

function buildErrors(wf: Workflow): string[] {
    try {
        wf.build();
    } catch (err) {
        if (err instanceof WorkflowValidationError) {
            return err.issues.map((issue) => issue.code).sort();
        }
        throw err;
    }
    return [];
}

describe("build()", () => {
    it("produces a workflow the agents.update request serializer accepts without stripping anything", () => {
        // agents.update() serializes its body with this schema; "fail" rejects any field the API doesn't know.
        const body = serializers.conversationalAi.UpdateAgentRequest.jsonOrThrow(
            { workflow: supportLine().build() },
            { unrecognizedObjectKeys: "fail" },
        );

        expect(Object.keys(body.workflow?.nodes ?? {})).toEqual([
            "start",
            "triage",
            "identify",
            "lookup_order",
            "resolve",
            "vip",
            "end",
        ]);
        expect(body.workflow?.prevent_subagent_loops).toBe(true);
    });

    it("reports every problem in one error instead of failing on the first", () => {
        const wf = new Workflow();
        const a = wf.converse("a", "A");
        // None of these throw: chaining only records problems, so all of them surface together.
        wf.converse("a", "duplicate id");
        a.goTo("missing");
        a.onSuccess().end();

        expect(buildErrors(wf)).toEqual(["duplicate_node_id", "result_edge_needs_tool", "unknown_node"]);
        expect(() => wf.build()).toThrow(/Node id "a" is used by more than one node[\s\S]*unknown node "missing"/);
    });

    it("lets goTo target a node that is only created later", () => {
        const wf = new Workflow();
        wf.converse("a", "A").when("Skip ahead").goTo("b");
        wf.node("a").when("Normal path").converse("b", "B");

        expect(buildErrors(wf)).toEqual([]);
        expect(wf.build().nodes?.a?.edgeOrder).toEqual(["a__b", "a__b__2"]);
    });

    it("builds despite unreachable nodes, reporting them as warnings", () => {
        const wf = new Workflow();
        wf.converse("a", "A").end();
        wf.node("a").when("never").converse("b", "B");
        wf.remove("a");
        const warnings: WorkflowIssue[] = [];

        const model = wf.build({ onWarning: (issue) => warnings.push(issue) });

        expect(warnings.map((w) => [w.code, w.nodeId])).toEqual([
            ["unreachable_node", "end"],
            ["unreachable_node", "b"],
        ]);
        // Unreachable nodes share the column after the deepest reachable one, in insertion order.
        expect(model.nodes?.end?.position).toEqual({ x: 300, y: 0 });
        expect(model.nodes?.b?.position).toEqual({ x: 300, y: 200 });
    });

    it("counts a node reached only through a backward condition as reachable", () => {
        const always = { type: "unconditional" };
        const wf = Workflow.fromJSON({
            nodes: {
                start: { type: "start", edge_order: ["start__a"], position: { x: 0, y: 0 } },
                a: {
                    type: "override_agent",
                    label: "a",
                    additional_prompt: "A",
                    edge_order: [],
                    position: { x: 300, y: 0 },
                },
                b: {
                    type: "override_agent",
                    label: "b",
                    additional_prompt: "B",
                    edge_order: ["b__a"],
                    position: { x: 600, y: 0 },
                },
            },
            edges: {
                start__a: { source: "start", target: "a", forward_condition: always },
                b__a: { source: "b", target: "a", forward_condition: always, backward_condition: always },
            },
        });
        const warnings: WorkflowIssue[] = [];

        wf.build({ onWarning: (issue) => warnings.push(issue) });

        expect(warnings).toEqual([]);
    });

    it("lays out a node by its forward path, not by a back edge to an ancestor", () => {
        const wf = new Workflow();
        const a = wf.converse("a", "A");
        a.when("next").converse("b", "B").when("next").converse("c", "C").goTo(a, { back: "Back to C" });

        const nodes = wf.build().nodes;

        expect(nodes?.c?.position).toEqual({ x: 900, y: 0 });
    });

    it("places a node reached only through a backward condition after its target", () => {
        const always = { type: "unconditional" };
        const wf = Workflow.fromJSON({
            nodes: {
                start: { type: "start", edge_order: ["start__a"], position: { x: 0, y: 0 } },
                a: { type: "override_agent", label: "a", additional_prompt: "A", edge_order: [] },
                b: { type: "override_agent", label: "b", additional_prompt: "B", edge_order: ["b__a"] },
            },
            edges: {
                start__a: { source: "start", target: "a", forward_condition: always },
                b__a: { source: "b", target: "a", forward_condition: always, backward_condition: always },
            },
        });

        const nodes = wf.build().nodes;

        expect([nodes?.a?.position, nodes?.b?.position]).toEqual([
            { x: 300, y: 0 },
            { x: 600, y: 0 },
        ]);
    });

    it("places a new node on a free row instead of on top of a loaded node", () => {
        const at = (x: number, y: number) => ({ position: { x, y } });
        const edge = (source: string, target: string) => ({
            source,
            target,
            forward_condition: { type: "llm", condition: target },
        });
        const wf = Workflow.fromJSON({
            nodes: {
                start: { type: "start", ...at(0, 0), edge_order: ["start__a"] },
                a: { type: "override_agent", label: "a", ...at(300, 0), edge_order: ["a__b", "a__c"] },
                b: { type: "override_agent", label: "b", ...at(600, 0) },
                c: { type: "override_agent", label: "c", ...at(600, 200) },
            },
            edges: { start__a: edge("start", "a"), a__b: edge("a", "b"), a__c: edge("a", "c") },
        });

        wf.node("a").when("d").converse("d", "D");

        expect(wf.build().nodes?.d?.position).toEqual({ x: 600, y: 400 });
    });

    it("warns that agents.update() will reject a node type this SDK version doesn't know", () => {
        const fixture = JSON.parse(
            readFileSync(join(__dirname, "../../../../docs/agents-as-code/fixtures/06-round-trip.json"), "utf8"),
        );
        const warnings: WorkflowIssue[] = [];

        Workflow.fromJSON(fixture.from).build({ onWarning: (issue) => warnings.push(issue) });

        // "say" is in the generated types, so only the made-up type is flagged.
        expect(warnings.map((w) => [w.code, w.nodeId])).toEqual([["unknown_node_type", "survey"]]);
    });
});

describe("Expr", () => {
    // The fixtures load these ASTs as data, so this is the only check that the Expr builder produces them.
    const fixture = JSON.parse(
        readFileSync(join(__dirname, "../../../../docs/agents-as-code/fixtures/04-expressions-and-loops.json"), "utf8"),
    );
    const wireCondition = (condition: Condition): unknown =>
        serializers.WorkflowEdgeModelInputForwardCondition.jsonOrThrow(condition.toModel());

    it("builds the VIP rule from the fixture: allOf/anyOf, comparisons and plain-value literals", () => {
        const vip = Expr.anyOf(
            Expr.variable("tier").eq("gold"),
            Expr.allOf(Expr.variable("orders").gte(10), Expr.variable("churn_risk").neq(false)),
        );

        expect(wireCondition(Condition.expr(vip))).toEqual(fixture.expected.edges.triage__vip.forward_condition);
    });

    it("builds the refund rule from the fixture: arithmetic, ifElse and null", () => {
        const threshold = Expr.ifElse(
            Expr.variable("region").eq(null),
            500,
            Expr.literal(1000).sub(Expr.variable("discount").div(Expr.literal(1).add(1))),
        );
        const refund = Expr.variable("unit_price").mul(Expr.variable("quantity")).gt(threshold);

        expect(wireCondition(Condition.expr(refund, { label: "Large refund" }))).toEqual(
            fixture.expected.edges.triage__refund.forward_condition,
        );
    });

    it("builds the satisfaction rule from the fixture: an LLM-extracted number", () => {
        const satisfied = Expr.llm("How satisfied is the caller, from 1 to 10?", { type: "number" }).lt(5);

        expect(wireCondition(Condition.expr(satisfied))).toEqual(fixture.expected.edges.faq__end.forward_condition);
    });

    it("extracts a boolean by default", () => {
        expect(Expr.llm("Did the caller agree?").toModel()).toEqual({
            type: "llm",
            valueSchema: { type: "boolean", description: "Did the caller agree?" },
        });
    });

    it("maps lt and lte to distinct operators", () => {
        expect(Expr.variable("x").lt(3).toModel().type).toBe("lt_operator");
        expect(Expr.variable("x").lte(3).toModel().type).toBe("lte_operator");
    });

    it("is accepted directly by when() as an expression condition", () => {
        const wf = new Workflow();
        wf.converse("a", "A").when(Expr.variable("n").gt(1)).end();

        expect(wf.build().edges?.a__end?.forwardCondition?.type).toBe("expression");
    });
});

describe("update()", () => {
    it("keeps schema overrides for tools that stay when a tool node's tools change", () => {
        const override: ElevenLabs.WorkflowToolLocatorSchemaOverridesValue = {
            source: "dynamic_variable",
            dynamicVariable: "order_id",
        };
        const wf = new Workflow();
        wf.tool("lookup", ["tool_order", "tool_customer"], {
            schemaOverrides: { tool_order: { "path_params.order_id": override } },
        });

        wf.node("lookup").update({ toolIds: ["tool_order", "tool_loyalty"] });

        expect(wf.build().nodes?.lookup).toMatchObject({
            tools: [
                { toolId: "tool_order", schemaOverrides: { "path_params.order_id": override } },
                { toolId: "tool_loyalty" },
            ],
        });
    });

    it("rejects schema overrides for a tool the node doesn't run", () => {
        const wf = new Workflow();
        wf.tool("lookup", ["tool_order"], { schemaOverrides: { tool_typo: {} } });

        expect(buildErrors(wf)).toEqual(["invalid_option"]);
    });

    it("turns a phone transfer into an agent transfer, dropping phone-only settings", () => {
        const wf = new Workflow();
        wf.transfer("t", Destination.phone("+15551234567"), { transferType: "blind" });

        wf.node("t").update({ destination: Destination.agent("agent_x"), transferMessage: "Hold on" });

        expect(wf.build().nodes?.t).toEqual({
            type: "standalone_agent",
            agentId: "agent_x",
            transferMessage: "Hold on",
            position: { x: 300, y: 0 },
            edgeOrder: [],
        });
    });

    it("points an agent transfer at the new agent's default entry, not the old agent's node or branch", () => {
        const wf = Workflow.fromJSON({
            nodes: {
                start: { type: "start", edge_order: ["start__t"] },
                t: {
                    type: "standalone_agent",
                    agent_id: "agent_a",
                    node_id: "qualify",
                    branch_id: "branch_beta",
                    transfer_message: "One moment",
                },
            },
            edges: { start__t: { source: "start", target: "t", forward_condition: { type: "unconditional" } } },
        });

        wf.node("t").update({ destination: Destination.agent("agent_b") });

        const {
            position: _,
            edgeOrder: __,
            ...t
        } = wf.build().nodes?.t as ElevenLabs.WorkflowStandaloneAgentNodeModelInput;
        expect(t).toEqual({ type: "standalone_agent", agentId: "agent_b", transferMessage: "One moment" });
    });

    it("rejects options that belong to another node kind", () => {
        const wf = new Workflow();
        wf.converse("a", "A");
        wf.node("a").update({ transferMessage: "agent transfers only", destination: Destination.phone("+1") });

        expect(buildErrors(wf)).toEqual(["invalid_option", "invalid_option"]);
    });
});

describe("onResult()", () => {
    it("routes only the outcomes it is given", () => {
        const wf = new Workflow();
        const triage = wf.converse("triage", "Triage");
        triage
            .when("Has an order")
            .tool("lookup", ["tool_get_order"])
            .onResult({ failure: (failed) => failed.goTo(triage) });

        const lookup = wf.build().nodes?.lookup as ElevenLabs.WorkflowToolNodeModelInput;

        expect(lookup.edgeOrder).toEqual(["lookup__triage"]);
    });

    it("puts the success edge first even when failure is listed first", () => {
        const wf = new Workflow();
        wf.tool("lookup", ["tool_get_order"]).onResult({
            failure: (failed) => failed.end({ id: "failed" }),
            success: (ok) => ok.end(),
        });

        const lookup = wf.build().nodes?.lookup as ElevenLabs.WorkflowToolNodeModelInput;

        expect(lookup.edgeOrder).toEqual(["lookup__end", "lookup__failed"]);
    });

    it("fails the build when used on a node that isn't a tool", () => {
        const wf = new Workflow();
        wf.converse("a", "A").onResult({ success: (ok) => ok.end() });

        expect(buildErrors(wf)).toEqual(["result_edge_needs_tool"]);
    });
});

describe("insertBetween()", () => {
    it("fails the build when the callback doesn't return the last inserted node", () => {
        const wf = new Workflow();
        wf.converse("a", "A").when("next").converse("b", "B");

        wf.insertBetween("a", "b", () => undefined);

        expect(() => wf.build()).toThrow(/must return the last inserted node/);
    });

    it("keeps the replaced edge's condition and slot, and returns the inserted node for further routing", () => {
        const wf = new Workflow();
        const a = wf.converse("a", "A");
        a.when("first").converse("b", "B");
        a.when("second").end();

        const verify = wf.insertBetween("a", "b", (from) => from.converse("verify", "Verify"));
        verify?.when("Can't verify").end({ id: "unverified" });
        const model = wf.build();

        expect(model.nodes?.a?.edgeOrder).toEqual(["a__verify", "a__end"]);
        expect(model.edges?.a__verify?.forwardCondition).toEqual({ type: "llm", condition: "first" });
        expect(model.edges?.verify__b?.forwardCondition).toEqual({ type: "unconditional" });
        // The returned node is the inserted one, so branches added to it leave "verify".
        expect(model.nodes?.verify?.edgeOrder).toEqual(["verify__b", "verify__unverified"]);
    });
});

describe("loading existing workflows", () => {
    const agent = {
        agentId: "agent_1",
        workflow: {
            preventSubagentLoops: false,
            nodes: {
                s: { type: "start", position: { x: 5, y: 5 }, edgeOrder: ["n__end"] },
                n: {
                    type: "override_agent",
                    label: "N",
                    additionalPrompt: "Hi",
                    position: { x: 5, y: 205 },
                    edgeOrder: [],
                },
            },
            // An editor-assigned id that happens to match the builder's naming scheme for a different edge.
            edges: { n__end: { source: "s", target: "n", forwardCondition: { type: "unconditional" } } },
        },
    } as unknown as ElevenLabs.GetAgentResponseModel;

    it("fromAgent() keeps ids and positions, and never reuses a loaded edge id for a new edge", () => {
        const wf = Workflow.fromAgent(agent);
        wf.node("n").when("Done").end();
        const model = wf.build();

        expect(wf.startId).toBe("s");
        expect(model.nodes?.s).toEqual({ type: "start", position: { x: 5, y: 5 }, edgeOrder: ["n__end"] });
        expect(model.edges?.n__end?.target).toBe("n");
        expect(model.nodes?.n?.edgeOrder).toEqual(["n__end__2"]);
        expect(model.edges?.n__end__2?.target).toBe("end");
    });

    it("fromAgent() gives an empty workflow for an agent that has none", () => {
        const wf = Workflow.fromAgent({ agentId: "a" } as ElevenLabs.GetAgentResponseModel);

        expect(wf.nodeIds).toEqual(["start"]);
        expect(buildErrors(wf)).toEqual([]);
    });

    it("toJSONString() writes snake_case JSON that fromJSON() reads back unchanged", () => {
        const json = supportLine().toJSONString();

        expect(json).toContain('"additional_prompt": "Greet the caller"');
        expect(json).not.toContain("additionalPrompt");
        expect(Workflow.fromJSON(json).toJSONString()).toBe(json);
    });

    it("fromJSON() reads the workflow out of a CLI agent config file", () => {
        const workflow = supportLine().toJSON();
        const cliConfig = {
            name: "Support",
            conversation_config: { agent: { prompt: { prompt: "You are a support agent." } } },
            platform_settings: {},
            tags: ["support"],
            workflow,
        };

        expect(Workflow.fromJSON(JSON.stringify(cliConfig)).toJSON()).toEqual(workflow);
    });
});
