import type * as ElevenLabs from "../../../api/index";
import type { Tool } from "../tools/Tool";
import type { ConditionModel } from "./Condition";
import type { Destination } from "./Destination";
import type { WorkflowIssue } from "./errors";

export type NodeModel = ElevenLabs.AgentWorkflowRequestModelNodesValue;

export interface GraphEdge {
    /** Set for edges loaded from an existing workflow; generated at build time otherwise. */
    id?: string;
    source: string;
    target: string;
    forwardCondition?: ConditionModel;
    backwardCondition?: ConditionModel;
    /** Editor bend points, kept for loaded edges. */
    reroutes?: ElevenLabs.PositionInput[];
}

/** A tool by id, or a `Tool` object whose id is filled in when the workflow is built. */
export type ToolRef = string | Tool;

/** The placeholder a `Tool` object stands under in the graph until `build()` swaps in its id. */
export function toolPlaceholder(name: string): string {
    return `<tool:${name}>`;
}

export interface NodeOptions {
    /** Position in the workflow editor. Nodes without one are laid out automatically. */
    position?: ElevenLabs.PositionInput;
}

export interface ConverseOptions extends NodeOptions {
    /** Name shown in the workflow editor. Defaults to the node id. */
    label?: string;
    /**
     * Tools available to this subagent, on top of the agent's own: tool ids, or `Tool` objects whose ids are filled in
     * when the workflow is built with `toolIds`, as `agents.push()` does.
     */
    toolIds?: ToolRef[];
    /** Knowledge base documents available to this subagent, on top of the agent's own. */
    knowledgeBase?: ElevenLabs.KnowledgeBaseLocator[];
    /** Overrides for the agent's conversation config (LLM, voice, ...) while this subagent is active. */
    conversationConfig?: ElevenLabs.ConversationalConfigApiModelWorkflowOverrideInput;
    entryBehavior?: ElevenLabs.EntryBehavior;
}

export interface ToolOptions extends NodeOptions {
    /**
     * Parameter overrides per tool id (or tool name, for a `Tool` object), keyed by dotted parameter path (e.g.
     * `path_params.order_id`).
     */
    schemaOverrides?: Record<string, Record<string, ElevenLabs.WorkflowToolLocatorSchemaOverridesValue>>;
}

export interface TransferOptions extends NodeOptions {
    /** Phone and SIP transfers only. */
    transferType?: ElevenLabs.TransferTypeEnum;
    /** Phone and SIP transfers only. */
    customSipHeaders?: ElevenLabs.WorkflowPhoneNumberNodeModelInputCustomSipHeadersItem[];
    /** Phone and SIP transfers only. */
    sipReferPlayDialtone?: boolean;
    /** Phone and SIP transfers only. */
    uui?: ElevenLabs.UuiTransferConfig;
    /** Phone and SIP transfers only. */
    postDialDigits?: ElevenLabs.WorkflowPhoneNumberNodeModelInputPostDialDigits;
    /** Agent transfers only. */
    delayMs?: number;
    /** Agent transfers only. */
    transferMessage?: string;
    /** Agent transfers only. */
    enableTransferredAgentFirstMessage?: boolean;
    /** Agent transfers only. */
    preserveClientTtsOverrides?: boolean;
    /** Agent transfers only. */
    preserveVoiceSettings?: boolean;
}

export interface EndOptions extends NodeOptions {
    /** Defaults to `"end"`, which every `end()` without an id shares. */
    id?: string;
}

/** Fields accepted by `WorkflowNode.update()`. Only the fields that apply to the node's kind may be set. */
export interface NodeUpdate extends ConverseOptions, ToolOptions, TransferOptions {
    /** Subagent nodes: the instructions added to the agent's prompt. */
    prompt?: string;
    /** Subagent nodes: extra tools. Tool nodes: the tools to run. */
    toolIds?: ToolRef[];
    /** Transfer nodes: where to transfer to. */
    destination?: Destination;
}

const FIELDS: Record<string, Record<string, string>> = {
    start: { position: "position" },
    end: { position: "position" },
    override_agent: {
        position: "position",
        prompt: "additionalPrompt",
        label: "label",
        toolIds: "additionalToolIds",
        knowledgeBase: "additionalKnowledgeBase",
        conversationConfig: "conversationConfig",
        entryBehavior: "entryBehavior",
    },
    tool: { position: "position" },
    phone_number: {
        position: "position",
        transferType: "transferType",
        customSipHeaders: "customSipHeaders",
        sipReferPlayDialtone: "sipReferPlayDialtone",
        uui: "uui",
        postDialDigits: "postDialDigits",
    },
    standalone_agent: {
        position: "position",
        delayMs: "delayMs",
        transferMessage: "transferMessage",
        enableTransferredAgentFirstMessage: "enableTransferredAgentFirstMessage",
        preserveClientTtsOverrides: "preserveClientTtsOverrides",
        preserveVoiceSettings: "preserveVoiceSettings",
    },
};

const NODE_KIND: Record<string, string> = {
    start: "start",
    end: "end",
    override_agent: "subagent",
    tool: "tool",
    phone_number: "phone/SIP transfer",
    standalone_agent: "agent transfer",
};

/** Mutable state shared by a `Workflow` and every node handle created from it. */
export class WorkflowGraph {
    readonly nodes: Map<string, NodeModel> = new Map();
    edges: GraphEdge[] = [];
    readonly issues: WorkflowIssue[] = [];
    startId = "start_node";
    /** Each loaded node's `edgeOrder`, as edges. `build()` keeps this order and appends edges added since. */
    readonly loadedOrder: Map<string, GraphEdge[]> = new Map();
    preventSubagentLoops: boolean | undefined;
    /** `Tool` objects referenced by nodes, by placeholder. */
    readonly toolRefs: Map<string, Tool> = new Map();

    /** Swaps `Tool` objects for placeholders, remembering each one. */
    refTools(nodeId: string, refs: ToolRef[]): string[] {
        const inThisNode = new Map<string, Tool>();
        return refs.map((ref) => {
            if (typeof ref === "string") {
                return ref;
            }
            const key = toolPlaceholder(ref.name);
            const known = this.toolRefs.get(key);
            // A different tool of the same name conflicts if this node or another node still uses it; one left behind
            // by a removed or edited node doesn't.
            let clash = inThisNode.get(key);
            if (clash === undefined && known !== undefined && this._usesPlaceholder(key, nodeId)) {
                clash = known;
            }
            inThisNode.set(key, ref);
            if (clash !== undefined && clash !== ref) {
                this.issues.push({
                    code: "duplicate_tool_name",
                    severity: "error",
                    message: `Node "${nodeId}" uses a different tool also named "${ref.name}"`,
                    nodeId,
                });
            }
            this.toolRefs.set(key, ref);
            return key;
        });
    }

    private _usesPlaceholder(key: string, exceptNodeId: string): boolean {
        for (const [id, model] of this.nodes) {
            if (id === exceptNodeId) {
                continue;
            }
            const node = model as { tools?: ElevenLabs.WorkflowToolLocator[]; additionalToolIds?: string[] };
            if ((node.tools ?? []).some((t) => t.toolId === key) || (node.additionalToolIds ?? []).includes(key)) {
                return true;
            }
        }
        return false;
    }

    addNode(id: string, model: NodeModel): void {
        const existing = this.nodes.get(id);
        if (existing === undefined) {
            this.nodes.set(id, model);
        } else if (!(existing.type === "end" && model.type === "end")) {
            this.issues.push({
                code: "duplicate_node_id",
                severity: "error",
                message: `Node id "${id}" is used by more than one node`,
                nodeId: id,
            });
        }
    }

    applyOptions(id: string, model: NodeModel, options: NodeUpdate): NodeModel {
        const { destination, toolIds: refs, schemaOverrides: overridesByRef, ...rest } = options;
        const toolIds = refs === undefined ? undefined : this.refTools(id, refs);
        const schemaOverrides =
            overridesByRef === undefined
                ? undefined
                : Object.fromEntries(
                      Object.entries(overridesByRef).map(([key, value]) => {
                          const placeholder = toolPlaceholder(key);
                          return [this.toolRefs.has(placeholder) ? placeholder : key, value];
                      }),
                  );
        let next = { ...model } as Record<string, unknown>;

        if (destination !== undefined) {
            if (next.type === "phone_number" || next.type === "standalone_agent") {
                const dest = destination.toModel();
                if (dest.type !== next.type) {
                    next = { ...dest, position: next.position };
                } else {
                    // A new agent destination starts at that agent's default entry point, not the old one's node or branch.
                    const { agentId: _, nodeId: __, branchId: ___, ...settings } = next;
                    next = { ...(next.type === "standalone_agent" ? settings : next), ...dest };
                }
            } else {
                this._invalidOption(id, "destination", next.type as string);
            }
        }

        if (next.type === "tool") {
            const existing = (next.tools as ElevenLabs.WorkflowToolLocator[] | undefined) ?? [];
            const ids = toolIds ?? existing.map((tool) => tool.toolId);
            for (const toolId of Object.keys(schemaOverrides ?? {})) {
                if (!ids.includes(toolId)) {
                    this.issues.push({
                        code: "invalid_option",
                        severity: "error",
                        message: `Node "${id}" has schema overrides for tool "${displayTool(toolId)}", which it doesn't run`,
                        nodeId: id,
                    });
                }
            }
            next.tools = ids.map((toolId) => {
                const overrides =
                    schemaOverrides?.[toolId] ?? existing.find((t) => t.toolId === toolId)?.schemaOverrides;
                return overrides === undefined ? { toolId } : { toolId, schemaOverrides: overrides };
            });
        } else {
            if (schemaOverrides !== undefined) {
                this._invalidOption(id, "schemaOverrides", next.type as string);
            }
            if (toolIds !== undefined) {
                (rest as Record<string, unknown>).toolIds = toolIds;
            }
        }

        // Node kinds without a dedicated field map (e.g. generated say/update_state) still accept
        // position, which is common to every node kind.
        const fields = FIELDS[next.type as string] ?? { position: "position" };
        for (const [key, value] of Object.entries(rest)) {
            if (value === undefined) {
                continue;
            }
            const field = fields[key];
            if (field === undefined) {
                this._invalidOption(id, key, next.type as string);
            } else {
                next[field] = value;
            }
        }
        return next as unknown as NodeModel;
    }

    /** Replaces the graph's contents with an existing workflow, keeping ids, positions and edge order. */
    load(workflow: ElevenLabs.AgentWorkflowRequestModel): void {
        this.nodes.clear();
        this.edges = [];
        this.issues.length = 0;
        this.loadedOrder.clear();
        this.preventSubagentLoops = workflow.preventSubagentLoops;

        const nodes = workflow.nodes ?? {};
        const edges = workflow.edges ?? {};
        const placed = new Map<string, GraphEdge>();
        for (const [id, node] of Object.entries(nodes)) {
            // Node types the serializer doesn't know come through it untouched, in wire format.
            const { edgeOrder: _, edge_order: __, ...model } = node as NodeModel & { edge_order?: string[] };
            this.nodes.set(id, model as NodeModel);
        }
        this.startId = Object.keys(nodes).find((id) => nodes[id]?.type === "start") ?? "start_node";
        if (!this.nodes.has(this.startId)) {
            this.nodes.set(this.startId, { type: "start" });
        }

        // Rebuild the edge list in each node's edgeOrder, so that build() reproduces it.
        const addEdge = (edgeId: string): void => {
            const edge = edges[edgeId];
            if (edge === undefined || placed.has(edgeId)) {
                return;
            }
            const graphEdge: GraphEdge = { id: edgeId, ...edge };
            placed.set(edgeId, graphEdge);
            this.edges.push(graphEdge);
        };
        for (const [id, node] of Object.entries(nodes)) {
            const order = node.edgeOrder ?? (node as { edge_order?: string[] }).edge_order ?? [];
            for (const edgeId of order) {
                addEdge(edgeId);
            }
            this.loadedOrder.set(
                id,
                order.flatMap((edgeId) => placed.get(edgeId) ?? []),
            );
        }
        for (const edgeId of Object.keys(edges)) {
            addEdge(edgeId);
        }
    }

    private _invalidOption(id: string, option: string, type: string): void {
        this.issues.push({
            code: "invalid_option",
            severity: "error",
            message: `Option "${option}" doesn't apply to ${NODE_KIND[type] ?? `"${type}"`} node "${id}"`,
            nodeId: id,
        });
    }
}

/** A tool id as shown in messages: the name for a `Tool` object's placeholder. */
export function displayTool(id: string): string {
    const match = /^<tool:(.*)>$/.exec(id);
    return match === null ? id : match[1];
}
