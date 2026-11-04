import type * as ElevenLabs from "../../../api/index";
import * as serializers from "../../../serialization/index";
import { Condition, type ConditionInput } from "./Condition";
import { type WorkflowIssue, WorkflowValidationError } from "./errors";
import { layout } from "./layout";
import { validate } from "./validate";
import { isKnownNodeType, WorkflowGraph } from "./WorkflowGraph";
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
 * const triage = wf.agent("triage", "Find out what the caller needs");
 * const lookup = triage.when("Caller gave an order number").tool("lookup_order", ["tool_123"]);
 * lookup.onSuccess().agent("resolve", "Explain the order status").end();
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

    /** The id of the start node: `"start"`, or whatever a loaded workflow uses. */
    get startId(): string {
        return this._graph.startId;
    }

    /** Opens a branch from the start node that is followed when `condition` holds. A string is an LLM condition. */
    when(condition: ConditionInput, options: WhenOptions = {}): WorkflowBranch {
        return branch(this._graph, this._graph.startId, condition, options);
    }

    /** A handle to an existing node, for editing or linking to it. */
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
     * edge's conditions and returns the last new node, which is then connected to `targetId`.
     *
     * @example
     * wf.insertBetween("identify", "lookup_order", (from) => from.agent("verify", "Verify the caller"));
     */
    insertBetween(
        sourceId: string,
        targetId: string,
        insert: (from: WorkflowBranch) => WorkflowNode | undefined,
    ): this {
        const graph = this._graph;
        const index = graph.edges.findIndex((edge) => edge.source === sourceId && edge.target === targetId);
        if (index === -1) {
            graph.issues.push({
                code: "unknown_edge",
                severity: "error",
                message: `There is no edge from "${sourceId}" to "${targetId}" to insert into`,
                nodeId: sourceId,
            });
            return this;
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
        }

        if (!(last instanceof WorkflowNode)) {
            graph.issues.push({
                code: "missing_insert_result",
                severity: "error",
                message: `insertBetween("${sourceId}", "${targetId}") must return the last inserted node`,
                nodeId: sourceId,
            });
        } else if (last.type === "tool") {
            last.onSuccess().link(targetId);
        } else {
            last.link(targetId);
        }
        return this;
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

        const edgeIds = assignEdgeIds(graph);
        const positions = layout(graph);
        const edgeOrder = new Map<string, string[]>();
        const edges: Record<string, ElevenLabs.WorkflowEdgeModelInput> = {};
        graph.edges.forEach((edge, i) => {
            const id = edgeIds[i];
            edgeOrder.set(edge.source, [...(edgeOrder.get(edge.source) ?? []), id]);
            edges[id] = {
                source: edge.source,
                target: edge.target,
                ...(edge.forwardCondition !== undefined && { forwardCondition: edge.forwardCondition }),
                ...(edge.backwardCondition !== undefined && {
                    backwardCondition: edge.backwardCondition as ElevenLabs.WorkflowEdgeModelInputBackwardCondition,
                }),
            };
        });

        const nodes: Record<string, ElevenLabs.AgentWorkflowRequestModelNodesValue> = {};
        for (const [id, model] of graph.nodes) {
            const order = edgeOrder.get(id) ?? [];
            // Unmodelled node types bypass the serializer, so they need the wire-format key.
            nodes[id] = isKnownNodeType(model.type)
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

/** Loaded edges keep their ids. New ones get `source__target`, with `__2`, `__3`... on collision. */
function assignEdgeIds(graph: WorkflowGraph): string[] {
    const taken = new Set(graph.edges.flatMap((edge) => (edge.id === undefined ? [] : [edge.id])));
    return graph.edges.map((edge) => {
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
