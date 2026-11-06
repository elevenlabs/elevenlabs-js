import type { WorkflowIssue } from "./errors";
import { serializerKnowsNodeType } from "./nodeTypes";
import type { WorkflowGraph } from "./WorkflowGraph";

/** Checks that need the finished graph. Problems found while chaining are already in `graph.issues`. */
export function validate(graph: WorkflowGraph): WorkflowIssue[] {
    const issues: WorkflowIssue[] = [...graph.issues];
    const endsWithEdges = new Set<string>();
    const merged = reverseEdgeMerges(graph);
    const connected = new Set<string>();

    graph.edges.forEach((edge, i) => {
        if (merged.has(i)) {
            return;
        }
        // The API allows one edge per pair of nodes, in either direction.
        const pair = JSON.stringify([edge.source, edge.target].sort());
        if (connected.has(pair)) {
            issues.push({
                code: "duplicate_edge",
                severity: "error",
                message:
                    `Edge "${edge.source}" → "${edge.target}" connects two nodes that already have an edge between ` +
                    "them, and the API allows only one. Give the existing edge a different condition, or remove one",
                nodeId: edge.source,
            });
        }
        connected.add(pair);
    });

    for (const edge of graph.edges) {
        const name = `"${edge.source}" → "${edge.target}"`;
        if (edge.source === edge.target) {
            issues.push({
                code: "self_loop",
                severity: "error",
                message: `Edge ${name} connects a node to itself, which the API doesn't allow`,
                nodeId: edge.source,
            });
        }
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

/**
 * Edges the API stores as the backward condition of another edge: index of the later edge → index of the earlier one.
 * The later edge goes the opposite way between the same two nodes, and neither has a backward condition of its own.
 */
export function reverseEdgeMerges(graph: WorkflowGraph): Map<number, number> {
    const merges = new Map<number, number>();
    const taken = new Set<number>();
    graph.edges.forEach((later, j) => {
        if (
            later.source === later.target ||
            later.backwardCondition !== undefined ||
            later.forwardCondition === undefined
        ) {
            return;
        }
        const i = graph.edges.findIndex(
            (earlier, k) =>
                k < j &&
                !taken.has(k) &&
                !merges.has(k) &&
                earlier.source === later.target &&
                earlier.target === later.source &&
                earlier.backwardCondition === undefined,
        );
        if (i !== -1) {
            merges.set(j, i);
            taken.add(i);
        }
    });
    return merges;
}

/**
 * Breadth-first depth of every node reachable from the start node, in visiting order. Forward edges come first;
 * an edge's backward condition is followed only to reach a node the forward search can't.
 */
export function depthsFrom(graph: WorkflowGraph): Map<string, number> {
    const depths = new Map<string, number>();
    const visit = (id: string, depth: number): void => {
        depths.set(id, depth);
        const queue = [id];
        while (queue.length > 0) {
            const current = queue.shift() as string;
            for (const edge of graph.edges) {
                if (edge.source === current && !depths.has(edge.target) && graph.nodes.has(edge.target)) {
                    depths.set(edge.target, (depths.get(current) as number) + 1);
                    queue.push(edge.target);
                }
            }
        }
    };
    visit(graph.startId, 0);
    for (;;) {
        const back = graph.edges.find(
            (edge) =>
                edge.backwardCondition !== undefined &&
                depths.has(edge.target) &&
                !depths.has(edge.source) &&
                graph.nodes.has(edge.source),
        );
        if (back === undefined) {
            return depths;
        }
        visit(back.source, (depths.get(back.target) as number) + 1);
    }
}

function reachableFrom(graph: WorkflowGraph): Set<string> {
    return new Set(depthsFrom(graph).keys());
}
