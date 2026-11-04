import * as serializers from "../../../../src/serialization/index";
import {
    Condition,
    type ConditionInput,
    Destination,
    Expr,
    Workflow,
    type WorkflowChain,
    type WorkflowNode,
} from "../../../../src/wrapper/agents/workflow";

// Interprets the language-neutral fixtures in docs/agents-as-code/fixtures. See workflow-spec.md, "Fixtures".

type RawCondition = string | { llm: string; label?: string } | { expr: unknown; label?: string };
type RawDestination =
    | { phone: string }
    | { phoneVariable: string }
    | { sip: string }
    | { sipVariable: string }
    | { agent: string; nodeId?: string };

export interface FixtureOp {
    op: "converse" | "tool" | "transfer" | "end" | "goTo" | "onResult" | "update" | "remove" | "insertBetween";
    at?: string;
    when?: RawCondition;
    back?: RawCondition;
    onSuccess?: boolean;
    onFailure?: boolean;
    id?: string;
    prompt?: string;
    toolIds?: string[];
    destination?: RawDestination;
    target?: string;
    node?: string;
    source?: string;
    options?: Record<string, unknown>;
    ops?: FixtureOp[];
    success?: FixtureOp[];
    failure?: FixtureOp[];
}

export interface Fixture {
    name: string;
    description: string;
    workflow?: { preventSubagentLoops?: boolean };
    from?: unknown;
    ops: FixtureOp[];
    expected?: unknown;
    errors?: string[];
}

function condition(raw: RawCondition): ConditionInput {
    if (typeof raw === "string") {
        return raw;
    }
    if ("llm" in raw) {
        return Condition.llm(raw.llm, { label: raw.label });
    }
    const ast = serializers.AstNodeInput.parseOrThrow(raw.expr);
    return Condition.expr(Expr.fromModel(ast), { label: raw.label });
}

function destination(raw: RawDestination): Destination {
    if ("phone" in raw) return Destination.phone(raw.phone);
    if ("phoneVariable" in raw) return Destination.phoneVariable(raw.phoneVariable);
    if ("sip" in raw) return Destination.sip(raw.sip);
    if ("sipVariable" in raw) return Destination.sipVariable(raw.sipVariable);
    return Destination.agent(raw.agent, { nodeId: raw.nodeId });
}

// Option keys are canonical camelCase names; nested values are in API wire format, so parse them.
function options(op: FixtureOp): Record<string, unknown> {
    const opts = { ...(op.options ?? {}) };
    if (opts.destination !== undefined) {
        opts.destination = destination(opts.destination as RawDestination);
    }
    if (opts.schemaOverrides !== undefined) {
        opts.schemaOverrides = Object.fromEntries(
            Object.entries(opts.schemaOverrides as Record<string, Record<string, unknown>>).map(([toolId, paths]) => [
                toolId,
                Object.fromEntries(
                    Object.entries(paths).map(([path, value]) => [
                        path,
                        serializers.WorkflowToolLocatorSchemaOverridesValue.parseOrThrow(value),
                    ]),
                ),
            ]),
        );
    }
    return opts;
}

function run(wf: Workflow, ops: FixtureOp[], first: WorkflowChain): WorkflowNode | undefined {
    let previous: WorkflowChain = first;
    let result: WorkflowNode | undefined;
    for (const op of ops) {
        if (op.op === "update") {
            wf.node(op.node as string).update(options(op));
            continue;
        }
        if (op.op === "remove") {
            wf.remove(op.node as string);
            continue;
        }
        if (op.op === "onResult") {
            const { success, failure } = op;
            const node = op.at === undefined ? (previous as WorkflowNode) : wf.node(op.at);
            node.onResult({
                ...(success !== undefined && { success: (branch) => run(wf, success, branch) }),
                ...(failure !== undefined && { failure: (branch) => run(wf, failure, branch) }),
            });
            continue;
        }
        if (op.op === "insertBetween") {
            wf.insertBetween(op.source as string, op.target as string, (from) => run(wf, op.ops ?? [], from));
            continue;
        }

        let at: WorkflowChain = op.at === undefined ? previous : op.at === "$start" ? wf : wf.node(op.at);
        if (op.when !== undefined) {
            const back = op.back === undefined ? {} : { back: condition(op.back) };
            at = (at as WorkflowNode | Workflow).when(condition(op.when), back);
        } else if (op.onSuccess) {
            at = (at as WorkflowNode).onSuccess();
        } else if (op.onFailure) {
            at = (at as WorkflowNode).onFailure();
        }

        switch (op.op) {
            case "converse":
                result = at.converse(op.id as string, op.prompt as string, options(op));
                break;
            case "tool":
                result = at.tool(op.id as string, op.toolIds as string[], options(op));
                break;
            case "transfer":
                result = at.transfer(op.id as string, destination(op.destination as RawDestination), options(op));
                break;
            case "end":
                result = at.end(options(op));
                break;
            case "goTo":
                result = at.goTo(op.target as string, op.back === undefined ? {} : { back: condition(op.back) });
                break;
        }
        previous = result as WorkflowNode;
    }
    return result;
}

/** Runs a fixture and returns the canonical JSON string, or the error codes if build fails. */
export function runFixture(fixture: Fixture): { json?: string; errors?: string[] } {
    const wf =
        fixture.from === undefined ? new Workflow(fixture.workflow ?? {}) : Workflow.fromJSON(fixture.from as object);
    run(wf, fixture.ops, wf);
    try {
        return { json: wf.toJSONString() };
    } catch (err) {
        const issues = (err as { issues?: { code: string }[] }).issues;
        if (issues === undefined) throw err;
        return { errors: issues.map((issue) => issue.code) };
    }
}
