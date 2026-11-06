import type * as ElevenLabs from "../../../api/index";
import * as serializers from "../../../serialization/index";
import { Condition, type ConditionInput } from "./Condition";
import { type WorkflowIssue, WorkflowValidationError } from "./errors";
import { layout } from "./layout";
import { serializerKnowsNodeType } from "./nodeTypes";
import { reverseEdgeMerges, validate } from "./validate";
import { type GraphEdge, WorkflowGraph } from "./WorkflowGraph";
import { branch, type EdgeOrigin, type WhenOptions, WorkflowBranch, WorkflowChain, WorkflowNode } from "./WorkflowNode";

export interface WorkflowOptions {
    /** Stop the conversation from re-entering a subagent it already visited. */
    preventSubagentLoops?: boolean;
}

export interface BuildOptions {
    /** Called for each non-fatal problem, such as a node that can't be reached from the start. */
    onWarning?: (issue: WorkflowIssue) => void;
}

const SERIALIZER_OPTIONS = {
    unrecognizedObjectKeys: "strip",
    allowUnrecognizedUnionMembers: true,
    allowUnrecognizedEnumValues: true,
} as const;

/**
 * An agent workflow, written as code. The workflow itself is the start node: calling a verb on it branches
 * from the start.
 *
 * @example
 * const wf = new Workflow();
 * const triage = wf.converse("triage", "Find out what the caller needs");
 * const lookup = triage.when("Caller gave an order number").tool("lookup_order", ["tool_123"]);
 * lookup.onSuccess().converse("resolve", "Explain the order status").end();
 * lookup.onFailure().transfer("human", Destination.phone("+15551234567"));
 *
 * await client.conversationalAi.agents.update(agentId, { workflow: wf.build() });
 */
export class Workflow extends WorkflowChain {
    constructor(options: WorkflowOptions = {}) {
        super(new WorkflowGraph());
        this._graph.addNode(this._graph.startId, { type: "start" });
        this._graph.preventSubagentLoops = options.preventSubagentLoops;
    }

    /**
     * Loads the workflow of an existing agent so it can be edited. Accepts the result of `agents.get()` or its
     * `workflow` field. Node ids, editor positions and edge order are kept.
     */
    static fromAgent(agent: ElevenLabs.GetAgentResponseModel | ElevenLabs.AgentWorkflowResponseModel): Workflow {
        const workflow = "nodes" in agent ? agent : agent.workflow;
        const wf = new Workflow();
        if (workflow !== undefined) {
            wf._graph.load(workflow as unknown as ElevenLabs.AgentWorkflowRequestModel);
        }
        return wf;
    }

    /**
     * Loads a workflow stored as API-format JSON (snake_case), for example from `toJSONString()` or a CLI
     * `agent_configs/*.json` file. Accepts a JSON string or a parsed object, holding either the workflow itself or
     * a whole agent config with a `workflow` key.
     */
    static fromJSON(json: string | object): Workflow {
        const parsed: unknown = typeof json === "string" ? JSON.parse(json) : json;
        const raw =
            typeof parsed === "object" && parsed !== null && "workflow" in parsed
                ? (parsed as { workflow: unknown }).workflow
                : parsed;
        const wf = new Workflow();
        wf._graph.load(serializers.AgentWorkflowRequestModel.parseOrThrow(raw, SERIALIZER_OPTIONS));
        return wf;
    }

    /** The id of the start node: `"start_node"`, the id the API requires, or whatever a loaded workflow uses. */
    get startId(): string {
        return this._graph.startId;
    }

    /** Opens a branch from the start node that is followed when `condition` holds. A string is an LLM condition. */
    when(condition: ConditionInput, options: WhenOptions = {}): WorkflowBranch {
        return branch(this._graph, this._graph.startId, condition, options);
    }

    /** A handle to an existing node, for editing it or going to it. */
    node(id: string): WorkflowNode {
        if (!this._graph.nodes.has(id)) {
            this._graph.issues.push({
                code: "unknown_node",
                severity: "error",
                message: `There is no node "${id}"`,
                nodeId: id,
            });
        }
        return new WorkflowNode(this._graph, id);
    }

    /** Ids of every node, in the order they were added. */
    get nodeIds(): string[] {
        return [...this._graph.nodes.keys()];
    }

    /** Removes a node and every edge to or from it. */
    remove(id: string): this {
        if (id === this._graph.startId) {
            this._graph.issues.push({
                code: "cannot_remove_start",
                severity: "error",
                message: "The start node can't be removed",
                nodeId: id,
            });
            return this;
        }
        this._graph.nodes.delete(id);
        this._graph.edges = this._graph.edges.filter((edge) => edge.source !== id && edge.target !== id);
        return this;
    }

    /**
     * Splices new nodes into the edge from `sourceId` to `targetId`. `insert` receives a branch carrying that
     * edge's conditions and returns the last new node, which is then connected to `targetId`. Returns that node, or
     * `undefined` if there is no such edge (the callback isn't called) or the callback returned nothing; `build()`
     * reports both.
     *
     * @example
     * const verify = wf.insertBetween("identify", "lookup_order", (from) => from.converse("verify", "Verify the caller"));
     * verify?.when("Caller can't verify").end({ id: "unverified" });
     */
    insertBetween(
        sourceId: string,
        targetId: string,
        insert: (from: WorkflowBranch) => WorkflowNode | undefined,
    ): WorkflowNode | undefined {
        const graph = this._graph;
        const index = graph.edges.findIndex((edge) => edge.source === sourceId && edge.target === targetId);
        if (index === -1) {
            graph.issues.push({
                code: "unknown_edge",
                severity: "error",
                message: `There is no edge from "${sourceId}" to "${targetId}" to insert into`,
                nodeId: sourceId,
            });
            return undefined;
        }
        const [original] = graph.edges.splice(index, 1);
        const before = graph.edges.length;
        const last = insert(
            new WorkflowBranch(graph, {
                source: sourceId,
                forwardCondition: original.forwardCondition ?? Condition.always().toModel(),
                backwardCondition: original.backwardCondition,
            } satisfies EdgeOrigin),
        );

        // Put the first new edge back where the original was, so the source's edge order is unchanged.
        const firstHop = graph.edges.findIndex((edge, i) => i >= before && edge.source === sourceId);
        if (firstHop !== -1) {
            const [edge] = graph.edges.splice(firstHop, 1);
            graph.edges.splice(index, 0, edge);
            const loaded = graph.loadedOrder.get(sourceId);
            const slot = loaded?.indexOf(original) ?? -1;
            if (loaded !== undefined && slot !== -1) {
                loaded[slot] = edge;
            }
        }

        if (!(last instanceof WorkflowNode)) {
            graph.issues.push({
                code: "missing_insert_result",
                severity: "error",
                message: `insertBetween("${sourceId}", "${targetId}") must return the last inserted node`,
                nodeId: sourceId,
            });
            return undefined;
        }
        if (last.type === "tool") {
            last.onSuccess().goTo(targetId);
        } else {
            last.goTo(targetId);
        }
        return last;
    }

    /**
     * Validates the workflow and returns it in the shape `agents.create()` and `agents.update()` accept.
     *
     * @throws {WorkflowValidationError} listing every problem, if the workflow is invalid
     */
    build(options: BuildOptions = {}): ElevenLabs.AgentWorkflowRequestModel {
        const graph = this._graph;
        const issues = validate(graph);
        const errors = issues.filter((issue) => issue.severity === "error");
        if (errors.length > 0) {
            throw new WorkflowValidationError(errors);
        }
        for (const warning of issues.filter((issue) => issue.severity === "warning")) {
            options.onWarning?.(warning);
        }

        // An edge that goes back the way another one came is sent as that edge's backward condition.
        const merges = reverseEdgeMerges(graph);
        const kept = graph.edges.filter((_, i) => !merges.has(i));
        const keptIds = assignEdgeIds(kept);
        const idOf = new Map(kept.map((edge, k) => [edge, keptIds[k]]));
        const positions = layout(graph);
        const outgoing = new Map<string, GraphEdge[]>();
        const addToOrder = (nodeId: string, edge: GraphEdge): void => {
            outgoing.set(nodeId, [...(outgoing.get(nodeId) ?? []), edge]);
        };
        const edges: Record<string, ElevenLabs.WorkflowEdgeModelInput> = {};
        graph.edges.forEach((edge, i) => {
            const into = merges.get(i);
            if (into !== undefined) {
                const reverse = graph.edges[into];
                const id = idOf.get(reverse) as string;
                addToOrder(edge.source, reverse);
                edges[id] = {
                    ...edges[id],
                    backwardCondition: edge.forwardCondition as ElevenLabs.WorkflowEdgeModelInputBackwardCondition,
                };
                return;
            }
            const id = idOf.get(edge) as string;
            addToOrder(edge.source, edge);
            // The API lists an edge with a backward condition among its target's outgoing edges as well.
            if (edge.backwardCondition !== undefined) {
                addToOrder(edge.target, edge);
            }
            edges[id] = {
                source: edge.source,
                target: edge.target,
                ...(edge.forwardCondition !== undefined && { forwardCondition: edge.forwardCondition }),
                ...(edge.backwardCondition !== undefined && {
                    backwardCondition: edge.backwardCondition as ElevenLabs.WorkflowEdgeModelInputBackwardCondition,
                }),
                ...(edge.reroutes !== undefined && { reroutes: edge.reroutes }),
            };
        });

        const nodes: Record<string, ElevenLabs.AgentWorkflowRequestModelNodesValue> = {};
        for (const [id, model] of graph.nodes) {
            const order = edgeOrderOf(graph.loadedOrder.get(id) ?? [], outgoing.get(id) ?? []).map(
                (edge) => idOf.get(edge) as string,
            );
            // Node types the serializer doesn't know pass through it untouched, so they need the wire-format key.
            nodes[id] = serializerKnowsNodeType(model.type)
                ? { ...model, position: positions.get(id), edgeOrder: order }
                : ({ ...model, position: positions.get(id), edge_order: order } as unknown as typeof model);
        }
        return {
            nodes,
            edges,
            ...(graph.preventSubagentLoops !== undefined && { preventSubagentLoops: graph.preventSubagentLoops }),
        };
    }

    /**
     * The workflow in API format (snake_case keys, sorted at every level), for storing as config. Validates like
     * `build()`. Also what `JSON.stringify(workflow)` uses.
     */
    toJSON(): Record<string, unknown> {
        const raw = serializers.AgentWorkflowRequestModel.jsonOrThrow(this.build(), SERIALIZER_OPTIONS);
        return sortKeys(raw) as Record<string, unknown>;
    }

    /** `toJSON()` as a string with 2-space indentation and a trailing newline: the canonical file format. */
    toJSONString(): string {
        return `${JSON.stringify(this.toJSON(), null, 2)}\n`;
    }

    /** @internal */
    protected _origin(): EdgeOrigin {
        return { source: this._graph.startId, forwardCondition: Condition.always().toModel() };
    }
}

/** A loaded node's order for the edges it still has, then any others in edge-list order. */
function edgeOrderOf(loaded: GraphEdge[], current: GraphEdge[]): GraphEdge[] {
    const kept = loaded.filter((edge) => current.includes(edge));
    return [...kept, ...current.filter((edge) => !kept.includes(edge))];
}

/** Loaded edges keep their ids. New ones get `source__target`, with `__2`, `__3`... on collision. */
function assignEdgeIds(edges: GraphEdge[]): string[] {
    const taken = new Set(edges.flatMap((edge) => (edge.id === undefined ? [] : [edge.id])));
    return edges.map((edge) => {
        if (edge.id !== undefined) {
            return edge.id;
        }
        const base = `${edge.source}__${edge.target}`;
        let id = base;
        for (let n = 2; taken.has(id); n++) {
            id = `${base}__${n}`;
        }
        taken.add(id);
        return id;
    });
}

function sortKeys(value: unknown): unknown {
    if (Array.isArray(value)) {
        return value.map(sortKeys);
    }
    if (typeof value === "object" && value !== null) {
        return Object.fromEntries(
            Object.keys(value)
                .sort()
                .map((key) => [key, sortKeys((value as Record<string, unknown>)[key])]),
        );
    }
    return value;
}
