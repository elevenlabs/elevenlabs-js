import type * as ElevenLabs from "../../../api/index";
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
}

export interface NodeOptions {
    /** Position in the workflow editor. Nodes without one are laid out automatically. */
    position?: ElevenLabs.PositionInput;
}

export interface AgentOptions extends NodeOptions {
    /** Name shown in the workflow editor. Defaults to the node id. */
    label?: string;
    /** Tools available to this subagent, on top of the agent's own. */
    toolIds?: string[];
    /** Knowledge base documents available to this subagent, on top of the agent's own. */
    knowledgeBase?: ElevenLabs.KnowledgeBaseLocator[];
    /** Overrides for the agent's conversation config (LLM, voice, ...) while this subagent is active. */
    conversationConfig?: ElevenLabs.ConversationalConfigApiModelWorkflowOverrideInput;
    entryBehavior?: ElevenLabs.EntryBehavior;
}

export interface ToolOptions extends NodeOptions {
    /** Parameter overrides per tool id, keyed by dotted parameter path (e.g. `path_params.order_id`). */
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
export interface NodeUpdate extends AgentOptions, ToolOptions, TransferOptions {
    /** Subagent nodes: the instructions added to the agent's prompt. */
    prompt?: string;
    /** Subagent nodes: extra tools. Tool nodes: the tools to run. */
    toolIds?: string[];
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
    startId = "start";
    preventSubagentLoops: boolean | undefined;

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
        const { destination, toolIds, schemaOverrides, ...rest } = options;
        let next = { ...model } as Record<string, unknown>;

        if (destination !== undefined) {
            if (next.type === "phone_number" || next.type === "standalone_agent") {
                const dest = destination.toModel();
                next = dest.type === next.type ? { ...next, ...dest } : { ...dest, position: next.position };
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
                        message: `Node "${id}" has schema overrides for tool "${toolId}", which it doesn't run`,
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

        const fields = FIELDS[next.type as string] ?? {};
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
        this.preventSubagentLoops = workflow.preventSubagentLoops;

        const nodes = workflow.nodes ?? {};
        const edges = workflow.edges ?? {};
        const placed = new Set<string>();
        for (const [id, node] of Object.entries(nodes)) {
            // Node types the serializer doesn't know come through it untouched, in wire format.
            const { edgeOrder: _, edge_order: __, ...model } = node as NodeModel & { edge_order?: string[] };
            this.nodes.set(id, model as NodeModel);
        }
        this.startId = Object.keys(nodes).find((id) => nodes[id]?.type === "start") ?? "start";
        if (!this.nodes.has(this.startId)) {
            this.nodes.set(this.startId, { type: "start" });
        }

        // Rebuild the edge list in each node's edgeOrder, so that build() reproduces it.
        const addEdge = (edgeId: string): void => {
            const edge = edges[edgeId];
            if (edge === undefined || placed.has(edgeId)) {
                return;
            }
            placed.add(edgeId);
            this.edges.push({ id: edgeId, ...edge });
        };
        for (const node of Object.values(nodes)) {
            const order = node.edgeOrder ?? (node as { edge_order?: string[] }).edge_order ?? [];
            for (const edgeId of order) {
                addEdge(edgeId);
            }
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
