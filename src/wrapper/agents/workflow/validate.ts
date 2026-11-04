import type { WorkflowIssue } from "./errors";
import { serializerKnowsNodeType } from "./nodeTypes";
import type { WorkflowGraph } from "./WorkflowGraph";

/** Checks that need the finished graph. Problems found while chaining are already in `graph.issues`. */
export function validate(graph: WorkflowGraph): WorkflowIssue[] {
    const issues: WorkflowIssue[] = [...graph.issues];
    const endsWithEdges = new Set<string>();

    for (const edge of graph.edges) {
        const name = `"${edge.source}" → "${edge.target}"`;
        for (const id of [edge.source, edge.target]) {
            if (!graph.nodes.has(id)) {
                issues.push({
                    code: "unknown_node",
                    severity: "error",
                    message: `Edge ${name} refers to unknown node "${id}"`,
                    nodeId: id,
                });
            }
        }
        if (edge.target === graph.startId) {
            issues.push({
                code: "edge_into_start",
                severity: "error",
                message: `Edge ${name} points into the start node; go to the first node after it instead`,
                nodeId: edge.source,
            });
        }

        const sourceType = graph.nodes.get(edge.source)?.type;
        const conditionType = edge.forwardCondition?.type;
        if (sourceType === "end" && !endsWithEdges.has(edge.source)) {
            endsWithEdges.add(edge.source);
            issues.push({
                code: "end_has_outgoing_edges",
                severity: "error",
                message: `End node "${edge.source}" can't have outgoing edges`,
                nodeId: edge.source,
            });
        }
        if (sourceType === "tool" && conditionType !== "result") {
            issues.push({
                code: "tool_edge_needs_result",
                severity: "error",
                message: `Edge ${name} leaves a tool node, so it must use onSuccess() or onFailure()`,
                nodeId: edge.source,
            });
        }
        if (sourceType !== undefined && sourceType !== "tool" && conditionType === "result") {
            issues.push({
                code: "result_edge_needs_tool",
                severity: "error",
                message: `Edge ${name} uses onSuccess()/onFailure(), which only applies to tool nodes`,
                nodeId: edge.source,
            });
        }
    }

    for (const [id, model] of graph.nodes) {
        if (!serializerKnowsNodeType(model.type)) {
            issues.push({
                code: "unknown_node_type",
                severity: "warning",
                message:
                    `Node "${id}" has type "${model.type}", which this SDK version doesn't know, so agents.create() and ` +
                    "agents.update() will reject build()'s output. Upgrade the SDK, or send toJSON() through " +
                    "requestOptions.additionalBodyParameters: { workflow: wf.toJSON() }",
                nodeId: id,
            });
        }
    }

    const reachable = reachableFrom(graph);
    for (const id of graph.nodes.keys()) {
        if (!reachable.has(id)) {
            issues.push({
                code: "unreachable_node",
                severity: "warning",
                message: `Node "${id}" can't be reached from the start node`,
                nodeId: id,
            });
        }
    }
    return issues;
}

/** Breadth-first depth of every node reachable from the start node, in visiting order. */
export function depthsFrom(graph: WorkflowGraph): Map<string, number> {
    const depths = new Map<string, number>([[graph.startId, 0]]);
    const queue = [graph.startId];
    while (queue.length > 0) {
        const id = queue.shift() as string;
        for (const edge of graph.edges) {
            // A backward condition lets the conversation travel the edge from target to source.
            const next =
                edge.source === id
                    ? edge.target
                    : edge.target === id && edge.backwardCondition !== undefined
                      ? edge.source
                      : undefined;
            if (next !== undefined && !depths.has(next) && graph.nodes.has(next)) {
                depths.set(next, (depths.get(id) as number) + 1);
                queue.push(next);
            }
        }
    }
    return depths;
}

function reachableFrom(graph: WorkflowGraph): Set<string> {
    return new Set(depthsFrom(graph).keys());
}
