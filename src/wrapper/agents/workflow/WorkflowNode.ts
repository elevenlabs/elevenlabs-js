import { Condition, type ConditionInput, type ConditionModel, type ConditionOptions, toCondition } from "./Condition";
import type { Destination } from "./Destination";
import type {
    ConverseOptions,
    EndOptions,
    NodeUpdate,
    ToolOptions,
    TransferOptions,
    WorkflowGraph,
} from "./WorkflowGraph";

export interface WhenOptions {
    /** Condition for coming back along this edge, from the new node to this one. */
    back?: ConditionInput;
}

export interface GoToOptions {
    /** Condition for coming back along this edge, from the target to this node. */
    back?: ConditionInput;
}

/** @internal Where the next edge starts and which conditions it carries. */
export interface EdgeOrigin {
    source: string;
    forwardCondition: ConditionModel;
    backwardCondition?: ConditionModel;
}

/**
 * The verbs that add a node and connect it to the current point in the workflow. Each returns the new node, so
 * linear flows chain: `wf.converse(...).when("...").tool(...)`.
 */
export abstract class WorkflowChain {
    /** @internal */
    protected readonly _graph: WorkflowGraph;

    protected constructor(graph: WorkflowGraph) {
        this._graph = graph;
    }

    /** @internal */
    protected abstract _origin(): EdgeOrigin;

    /**
     * The agent holds a conversation with `prompt` added to its instructions, until an outgoing condition holds.
     * A subagent node in the API and the UI.
     */
    converse(id: string, prompt: string, options: ConverseOptions = {}): WorkflowNode {
        const model = this._graph.applyOptions(
            id,
            { type: "override_agent", label: id, additionalPrompt: prompt },
            options,
        );
        this._graph.addNode(id, model);
        return this._connect(id);
    }

    /** Runs the tools in parallel. Branch on the result with `onSuccess()` and `onFailure()`. */
    tool(id: string, toolIds: string[], options: ToolOptions = {}): WorkflowNode {
        this._graph.addNode(id, this._graph.applyOptions(id, { type: "tool" }, { ...options, toolIds }));
        return this._connect(id);
    }

    /** Transfers the conversation to a phone number, SIP URI or another agent. */
    transfer(id: string, destination: Destination, options: TransferOptions = {}): WorkflowNode {
        const model = this._graph.applyOptions(id, destination.toModel(), options);
        this._graph.addNode(id, model);
        return this._connect(id);
    }

    /** Ends the conversation. Every `end()` without an id shares one end node, `"end"`. */
    end(options: EndOptions = {}): WorkflowNode {
        const { id = "end", ...rest } = options;
        this._graph.addNode(id, this._graph.applyOptions(id, { type: "end" }, rest));
        return this._connect(id);
    }

    /**
     * Moves the conversation to a node that already exists (or will by the time you call `build()`), for merges
     * and loops.
     */
    goTo(target: WorkflowNode | string, options: GoToOptions = {}): WorkflowNode {
        return this._connect(typeof target === "string" ? target : target.id, options.back);
    }

    private _connect(target: string, back?: ConditionInput): WorkflowNode {
        const origin = this._origin();
        this._graph.edges.push({
            source: origin.source,
            target,
            forwardCondition: origin.forwardCondition,
            backwardCondition: back === undefined ? origin.backwardCondition : toCondition(back).toModel(),
        });
        return new WorkflowNode(this._graph, target);
    }
}

/** A pending edge out of a node, opened by `when()`, `onSuccess()` or `onFailure()`. */
export class WorkflowBranch extends WorkflowChain {
    private readonly _from: EdgeOrigin;

    /** @internal */
    constructor(graph: WorkflowGraph, origin: EdgeOrigin) {
        super(graph);
        this._from = origin;
    }

    /** @internal */
    protected _origin(): EdgeOrigin {
        return this._from;
    }
}

/** A handle to one node in a workflow. Handles are cheap: all state lives in the `Workflow`. */
export class WorkflowNode extends WorkflowChain {
    readonly id: string;

    /** @internal */
    constructor(graph: WorkflowGraph, id: string) {
        super(graph);
        this.id = id;
    }

    /** The API node type, e.g. `"override_agent"` or `"tool"`. */
    get type(): string | undefined {
        return this._graph.nodes.get(this.id)?.type;
    }

    /** Opens a branch that is followed when `condition` holds. A string is an LLM condition. */
    when(condition: ConditionInput, options: WhenOptions = {}): WorkflowBranch {
        return branch(this._graph, this.id, condition, options);
    }

    /** Opens the branch followed when every tool in this tool node succeeded. */
    onSuccess(options: ConditionOptions = {}): WorkflowBranch {
        return branch(this._graph, this.id, Condition.success(options));
    }

    /** Opens the branch followed when any tool in this tool node failed. */
    onFailure(options: ConditionOptions = {}): WorkflowBranch {
        return branch(this._graph, this.id, Condition.failure(options));
    }

    /** Changes this node's options. Only fields that apply to the node's kind may be set. */
    update(options: NodeUpdate): this {
        const model = this._graph.nodes.get(this.id);
        if (model === undefined) {
            this._graph.issues.push({
                code: "unknown_node",
                severity: "error",
                message: `Can't update unknown node "${this.id}"`,
                nodeId: this.id,
            });
        } else {
            this._graph.nodes.set(this.id, this._graph.applyOptions(this.id, model, options));
        }
        return this;
    }

    /** @internal */
    protected _origin(): EdgeOrigin {
        return { source: this.id, forwardCondition: Condition.always().toModel() };
    }
}

/** @internal */
export function branch(
    graph: WorkflowGraph,
    source: string,
    condition: ConditionInput,
    options: WhenOptions = {},
): WorkflowBranch {
    return new WorkflowBranch(graph, {
        source,
        forwardCondition: toCondition(condition).toModel(),
        backwardCondition: options.back === undefined ? undefined : toCondition(options.back).toModel(),
    });
}
