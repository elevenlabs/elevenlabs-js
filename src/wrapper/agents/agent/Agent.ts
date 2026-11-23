import type * as ElevenLabs from "../../../api/index";
import * as serializers from "../../../serialization/index";
import { type SystemTool, Tool } from "../tools/Tool";
import { sortKeys } from "../workflow/util";
import { Workflow } from "../workflow/Workflow";
import { type AgentIssue, AgentValidationError } from "./errors";
import { deepMerge, getPath, isObject, setPath, type WireObject } from "./wire";

type AgentFields = NonNullable<ElevenLabs.ConversationalConfig["agent"]>;
type PromptFields = NonNullable<AgentFields["prompt"]>;
type TtsFields = NonNullable<ElevenLabs.ConversationalConfig["tts"]>;

/** The settings an agent can be given in code. Every field is optional, so `update()` takes the same shape. */
export interface AgentOptions {
    /** The agent's instructions: `conversation_config.agent.prompt.prompt`. */
    prompt?: PromptFields["prompt"];
    /** What the agent says first: `conversation_config.agent.first_message`. */
    firstMessage?: AgentFields["firstMessage"];
    /** `conversation_config.agent.language`, e.g. `"en"`. */
    language?: AgentFields["language"];
    /** `conversation_config.agent.prompt.llm`. */
    llm?: PromptFields["llm"];
    /** `conversation_config.agent.prompt.temperature`. */
    temperature?: PromptFields["temperature"];
    /** `conversation_config.tts.voice_id`. */
    voiceId?: TtsFields["voiceId"];
    /** `conversation_config.tts.model_id`. */
    ttsModel?: TtsFields["modelId"];
    tags?: string[];
    /**
     * Tools the agent can use anywhere. Webhook and client tools are created or updated by `agents.push()` and
     * attached by id; system tools go into `prompt.built_in_tools`. Replaces the agent's tools on `update()`.
     */
    tools?: Tool[];
    /** Ids of existing tools to attach as they are. `agents.push()` doesn't create or change them. */
    toolIds?: string[];
    /** The agent's workflow. Its tool nodes can take `Tool` objects, which `agents.push()` manages too. */
    workflow?: Workflow;
    /**
     * Any other conversation settings, merged under the typed options above. Setting a field here that a typed option
     * also sets is reported by `validate()`.
     */
    conversationConfig?: ElevenLabs.ConversationalConfig;
    /** Platform settings (privacy, evaluation, widget...), merged the same way. */
    platformSettings?: ElevenLabs.AgentPlatformSettingsRequestModel;
}

export interface AgentValidateOptions {
    /** Called for each non-fatal problem, such as an agent without a prompt. */
    onWarning?: (issue: AgentIssue) => void;
}

export interface AgentBuildOptions extends AgentValidateOptions {
    /**
     * The id of each webhook and client tool the agent uses, by tool name. `agents.push()` passes these after creating
     * or updating the tools. Every such tool needs one.
     */
    toolIds?: Record<string, string>;
}

export interface AgentLoadOptions {
    /**
     * Tools the config refers to, by id. Each matching webhook or client tool becomes a `Tool` the agent manages; the
     * other ids, including tools of other kinds such as `mcp`, stay as `toolIds`.
     */
    toolsById?: Record<string, Tool> | Map<string, Tool>;
}

type TypedKey = "prompt" | "firstMessage" | "language" | "llm" | "temperature" | "voiceId" | "ttsModel";

/**
 * Where each typed option goes, as the piece of the generated `ConversationalConfig` it sets. Written against the
 * generated type, so a wrong or renamed field fails to compile; the generated serializer turns it into API format.
 */
const TYPED_OPTIONS: { [K in TypedKey]-?: (value: NonNullable<AgentOptions[K]>) => ElevenLabs.ConversationalConfig } = {
    prompt: (prompt) => ({ agent: { prompt: { prompt } } }),
    firstMessage: (firstMessage) => ({ agent: { firstMessage } }),
    language: (language) => ({ agent: { language } }),
    llm: (llm) => ({ agent: { prompt: { llm } } }),
    temperature: (temperature) => ({ agent: { prompt: { temperature } } }),
    voiceId: (voiceId) => ({ tts: { voiceId } }),
    ttsModel: (modelId) => ({ tts: { modelId } }),
};

/** The API-format path a typed option sets, and its value in API format. */
function typedOption(key: TypedKey, value: unknown): { path: string[]; wire: unknown } {
    const piece = (TYPED_OPTIONS[key] as (v: unknown) => ElevenLabs.ConversationalConfig)(value);
    let wire: unknown = serializers.ConversationalConfig.jsonOrThrow(piece, SERIALIZER_OPTIONS);
    const path = ["conversation_config"];
    while (isObject(wire) && Object.keys(wire).length === 1) {
        const [field] = Object.keys(wire);
        path.push(field);
        wire = wire[field];
    }
    return { path, wire };
}

const TOOL_IDS_PATH = ["conversation_config", "agent", "prompt", "tool_ids"];
const BUILT_IN_TOOLS_PATH = ["conversation_config", "agent", "prompt", "built_in_tools"];

const SERIALIZER_OPTIONS = {
    unrecognizedObjectKeys: "passthrough",
    allowUnrecognizedUnionMembers: true,
    allowUnrecognizedEnumValues: true,
} as const;

const PROMPT_PATH: string[] = typedOption("prompt", "").path;

/**
 * An agent, written as code: its settings, its tools and its workflow in one definition. Push it with
 * `client.conversationalAi.agents.push(agent)`, which creates or updates the tools and the agent together.
 *
 * @example
 * const agent = new Agent("Support line", {
 *     prompt: "You are a support agent for Acme.",
 *     firstMessage: "Hi, how can I help?",
 *     tools: [Tool.endCall(), getOrder],
 *     workflow: wf,
 * });
 * const { agentId } = await client.conversationalAi.agents.push(agent);
 */
export class Agent {
    private _name: string;
    private readonly _typed: Partial<Record<TypedKey, unknown>> = {};
    private _tags: string[] | undefined;
    private _tools: Tool[] = [];
    private _toolIds: string[] = [];
    private _workflow: Workflow | undefined;
    /** A loaded workflow nobody has edited yet, kept in API format so it round-trips exactly. */
    private _rawWorkflow: WireObject | undefined;
    private _toolsById: Map<string, Tool> = new Map();
    /** The loaded `tool_ids`, so a loaded agent keeps its tool order. */
    private _loadedToolIds: string[] = [];
    /** Whether `tools` or `toolIds` was given (even empty), so the agent sets `tool_ids` rather than leaving it alone. */
    private _toolListGiven = false;
    /** Loaded system tools with their config as loaded, sent as-is while the tool is unchanged. */
    private readonly _loadedSystem = new Map<Tool, { raw: unknown; baseline: string | undefined }>();
    /** Settings loaded from a config, in API format. Typed options and raw options are applied on top. */
    private _base: WireObject = {};
    private _rawConversationConfig: ElevenLabs.ConversationalConfig[] = [];
    private _rawPlatformSettings: ElevenLabs.AgentPlatformSettingsRequestModel[] = [];

    constructor(name: string, options: AgentOptions = {}) {
        this._name = name;
        this.update(options);
    }

    /**
     * Loads an agent config in API format (snake_case): a CLI `agent_configs/*.json` file, or the `toJSON()` of an
     * agent. Webhook and client tools found in `toolsById` become `Tool` objects the agent manages; the other ids,
     * including tools of other kinds such as `mcp`, stay as `toolIds`. Fields this SDK doesn't model are kept, so an
     * unedited agent round-trips exactly.
     */
    static fromJSON(json: string | object, options: AgentLoadOptions = {}): Agent {
        const parsed = structuredClone(typeof json === "string" ? JSON.parse(json) : json) as WireObject;
        const toolsById =
            options.toolsById instanceof Map ? options.toolsById : new Map(Object.entries(options.toolsById ?? {}));
        const { name, tags, workflow, ...base } = parsed;
        const agent = new Agent(typeof name === "string" ? name : "");
        agent._base = base;
        agent._tags = Array.isArray(tags) ? (tags as string[]) : undefined;
        agent._toolsById = toolsById;
        const ids = getPath(base, TOOL_IDS_PATH);
        if (Array.isArray(ids)) {
            setPath(base, TOOL_IDS_PATH, undefined);
            agent._loadedToolIds = ids as string[];
            for (const id of ids as string[]) {
                // Like pull: kinds push doesn't manage (mcp...) stay attached by id. `_toolsById` keeps them, so a
                // workflow node or `addTool()` can still use the object under that id.
                const tool = toolsById.get(id);
                if (tool !== undefined && isManaged(tool)) {
                    agent._tools.push(tool);
                } else {
                    agent._toolIds.push(id);
                }
            }
        }
        if (Array.isArray(ids)) {
            agent._toolListGiven = true;
        }
        // System tools become SystemTool objects, so replacing `tools` replaces them like on an agent built in code.
        const builtIn = getPath(base, BUILT_IN_TOOLS_PATH);
        if (isObject(builtIn)) {
            for (const [key, raw] of Object.entries(builtIn)) {
                if (!isObject(raw)) {
                    continue;
                }
                try {
                    const tool = Tool.fromJSON({ type: "system", ...raw });
                    if (tool.kind !== "system" || tool.asSystem()?.systemToolType !== key) {
                        continue;
                    }
                    agent._tools.push(tool);
                    agent._loadedSystem.set(tool, { raw, baseline: safeJson(tool) });
                    delete builtIn[key];
                } catch {
                    // Kept in the config as it is.
                }
            }
            if (Object.keys(builtIn).length === 0) {
                setPath(base, BUILT_IN_TOOLS_PATH, undefined);
            }
        }
        if (isObject(workflow)) {
            agent._rawWorkflow = workflow;
        }
        return agent;
    }

    /** The agent's name. */
    get name(): string {
        return this._name;
    }

    /**
     * The agent's workflow, or `undefined` if it has none. A loaded workflow is turned into a `Workflow` the first time
     * it's read here, with its tool ids swapped for the `Tool` objects the agent knows, so it can be edited.
     */
    get workflow(): Workflow | undefined {
        if (this._workflow === undefined && this._rawWorkflow !== undefined) {
            this._workflow = Workflow.fromJSON(this._rawWorkflow, { toolsById: this._toolsById });
            this._rawWorkflow = undefined;
        }
        return this._workflow;
    }

    /** Changes the agent. Typed options replace what was there; `conversationConfig` and `platformSettings` merge. */
    update(options: AgentOptions & { name?: string }): this {
        const { name, tags, tools, toolIds, workflow, conversationConfig, platformSettings, ...typed } = options;
        if (name !== undefined) {
            this._name = name;
        }
        for (const [key, value] of Object.entries(typed)) {
            if (value !== undefined) {
                this._typed[key as TypedKey] = value;
            }
        }
        if (tags !== undefined) {
            this._tags = tags;
        }
        if (tools !== undefined) {
            this._tools = [...tools];
            this._toolListGiven = true;
        }
        if (toolIds !== undefined) {
            this._toolIds = [...toolIds];
            this._toolListGiven = true;
        }
        if (workflow !== undefined) {
            this._workflow = workflow;
            this._rawWorkflow = undefined;
        }
        if (conversationConfig !== undefined) {
            this._rawConversationConfig.push(conversationConfig);
        }
        if (platformSettings !== undefined) {
            this._rawPlatformSettings.push(platformSettings);
        }
        return this;
    }

    /** Adds a tool the agent can use anywhere. */
    addTool(tool: Tool): this {
        this._tools.push(tool);
        this._toolListGiven = true;
        return this;
    }

    /**
     * Every webhook and client tool the agent and its workflow use, each once: the tools `agents.push()` creates or
     * updates. System tools aren't included; they live inside the agent's config. Nor are tools of other kinds (such
     * as `mcp`): they stay attached by the id the agent was loaded with, as pull leaves them.
     */
    tools(): Tool[] {
        const seen = new Set<Tool>();
        return [...this._tools, ...this._workflowTools()].filter((tool) => {
            if (!isManaged(tool) || seen.has(tool)) {
                return false;
            }
            seen.add(tool);
            return true;
        });
    }

    /**
     * The id the agent was loaded with for `tool` (`toolsById`; a project passes its `tools.json` ids this way). Tools
     * of kinds push doesn't manage stay attached by it.
     */
    private _knownId(tool: Tool): string | undefined {
        const ids = [...this._toolsById].filter(([, t]) => t === tool).map(([id]) => id);
        return ids.sort()[0];
    }

    private _workflowTools(): Tool[] {
        return (
            this._workflow?.tools() ??
            rawWorkflowToolIds(this._rawWorkflow).flatMap((id) => this._toolsById.get(id) ?? [])
        );
    }

    /** The ids of existing tools attached as they are, which `agents.push()` doesn't manage. */
    get toolIds(): string[] {
        return [...this._toolIds];
    }

    /**
     * Checks everything that doesn't need tool ids: the tools, the workflow, the settings, and that no two tools share
     * a name. CI can run this without an API key.
     *
     * @throws {AgentValidationError} listing every problem, if the agent is invalid
     */
    validate(options: AgentValidateOptions = {}): void {
        this._assemble(undefined, options.onWarning);
    }

    /**
     * Validates the agent and returns it in the shape `agents.create()` accepts (`agents.update()` takes the same
     * fields). Fields this SDK doesn't model are dropped by the generated client; `agents.push()` sends them too.
     *
     * @throws {AgentValidationError} listing every problem, if the agent is invalid or a tool has no id
     */
    build(options: AgentBuildOptions = {}): ElevenLabs.conversationalAi.BodyCreateAgentV1ConvaiAgentsCreatePost {
        return serializers.conversationalAi.BodyCreateAgentV1ConvaiAgentsCreatePost.parseOrThrow(
            this.toJSON(options),
            SERIALIZER_OPTIONS,
        );
    }

    /**
     * The agent config in API format (snake_case keys, sorted at every level): the shape of a CLI
     * `agent_configs/*.json` file. Validates like `build()`, and also needs every tool's id.
     */
    toJSON(options: AgentBuildOptions = {}): Record<string, unknown> {
        return this._assemble(options.toolIds ?? {}, options.onWarning);
    }

    /**
     * Builds the API-format config. Without `toolIds` (validation only), tools stand under placeholder ids and missing
     * ids aren't reported.
     */
    private _assemble(
        toolIds: Record<string, string> | undefined,
        onWarning?: (issue: AgentIssue) => void,
    ): WireObject {
        const issues: AgentIssue[] = [];
        const config = structuredClone(this._base) as WireObject;
        // A kind push doesn't manage keeps the id it was loaded with; a missing one is reported as invalid_tool below.
        const idOf = (tool: Tool): string =>
            (isManaged(tool) ? toolIds?.[tool.name] : this._knownId(tool)) ?? `<tool:${tool.name}>`;

        if (this._name.trim() === "") {
            issues.push({ code: "missing_name", severity: "error", message: "The agent needs a name" });
        }

        // Raw options first, so the typed ones win and can be checked against them.
        const raw: WireObject = {};
        for (const settings of this._rawConversationConfig) {
            const wire = toWire(() => serializers.ConversationalConfig.jsonOrThrow(settings, SERIALIZER_OPTIONS));
            if (wire instanceof Error) {
                issues.push(invalidConfig("conversationConfig", wire));
            } else {
                deepMerge(raw, { conversation_config: wire });
            }
        }
        for (const settings of this._rawPlatformSettings) {
            const wire = toWire(() =>
                serializers.AgentPlatformSettingsRequestModel.jsonOrThrow(settings, SERIALIZER_OPTIONS),
            );
            if (wire instanceof Error) {
                issues.push(invalidConfig("platformSettings", wire));
            } else {
                deepMerge(raw, { platform_settings: wire });
            }
        }
        deepMerge(config, raw);

        for (const [key, value] of Object.entries(this._typed) as [TypedKey, unknown][]) {
            const { path, wire } = typedOption(key, value);
            if (getPath(raw, path) !== undefined) {
                issues.push(conflict(key, path));
            }
            setPath(config, path, wire);
        }

        // Tools: every one validates, and no two different tools share a name.
        const byName = new Map<string, Tool>();
        const everyTool = [...this._tools, ...this._workflowTools()];
        for (const tool of everyTool) {
            const other = byName.get(tool.name);
            if (other !== undefined && other !== tool) {
                issues.push({
                    code: "duplicate_tool_name",
                    severity: "error",
                    message: `Two different tools are named "${tool.name}"`,
                    path: `tools.${tool.name}`,
                });
            }
            if (other === undefined) {
                byName.set(tool.name, tool);
                try {
                    tool.buildConfig();
                } catch (err) {
                    issues.push({
                        code: "invalid_tool",
                        severity: "error",
                        message: err instanceof Error ? err.message : String(err),
                        path: `tools.${tool.name}`,
                    });
                }
                // Push only creates and updates webhook and client tools; any other kind needs an id.
                if (tool.kind !== "system" && !isManaged(tool) && this._knownId(tool) === undefined) {
                    issues.push({
                        code: "invalid_tool",
                        severity: "error",
                        message:
                            `Tool "${tool.name}" has type "${toolType(tool)}", which push doesn't create or update: ` +
                            "load it with its id or attach it with toolIds",
                        path: `tools.${tool.name}`,
                    });
                }
            }
        }

        // Webhook and client tools by their pushed ids, other kinds by the ids they were loaded with. An other-kind
        // tool whose id is already attached (such as a loaded mcp tool added back with addTool() while its id is still
        // in toolIds) isn't listed twice.
        const attached: string[] = [];
        for (const tool of this._tools) {
            if (tool.kind === "system") {
                continue;
            }
            const id = idOf(tool);
            if (!isManaged(tool) && (this._toolIds.includes(id) || attached.includes(id))) {
                continue;
            }
            attached.push(id);
        }
        const system = this._tools.filter((tool): tool is SystemTool => tool.kind === "system");
        if (this._toolListGiven) {
            if (getPath(raw, TOOL_IDS_PATH) !== undefined) {
                issues.push(conflict("tools", TOOL_IDS_PATH));
            }
            setPath(config, TOOL_IDS_PATH, keepOrder([...this._toolIds, ...attached], this._loadedToolIds));
        }
        for (const tool of system) {
            const path = [...BUILT_IN_TOOLS_PATH, tool.systemToolType];
            if (getPath(raw, path) !== undefined) {
                issues.push(conflict("tools", path));
            }
            const loaded = this._loadedSystem.get(tool);
            const wire =
                loaded !== undefined && loaded.baseline !== undefined && safeJson(tool) === loaded.baseline
                    ? structuredClone(loaded.raw)
                    : toWire(() =>
                          serializers.ToolRequestModelToolConfig.jsonOrThrow(tool.buildConfig(), SERIALIZER_OPTIONS),
                      );
            if (!(wire instanceof Error)) {
                setPath(config, path, wire);
            }
        }

        // Workflow: its own checks, plus tool nodes can only run webhook and client tools.
        if (this._workflow !== undefined) {
            const wf = this._workflow;
            for (const tool of wf.tools().filter((t) => t.kind === "system")) {
                issues.push({
                    code: "system_tool_in_workflow",
                    severity: "error",
                    message: `System tool "${tool.name}" can't be used in a workflow node; add it to the agent's tools`,
                    path: `workflow.tools.${tool.name}`,
                });
            }
            const ids = Object.fromEntries(wf.tools().map((tool) => [tool.name, idOf(tool)]));
            try {
                config.workflow = serializers.AgentWorkflowRequestModel.jsonOrThrow(
                    wf.build({ toolIds: ids }),
                    SERIALIZER_OPTIONS,
                );
            } catch (err) {
                issues.push({
                    code: "invalid_workflow",
                    severity: "error",
                    message: err instanceof Error ? err.message : String(err),
                    path: "workflow",
                });
            }
        } else if (this._rawWorkflow !== undefined) {
            // Check the loaded graph without replacing the raw copy, which keeps fields this SDK doesn't model.
            try {
                Workflow.fromJSON(this._rawWorkflow).build();
            } catch (err) {
                issues.push({
                    code: "invalid_workflow",
                    severity: "error",
                    message: err instanceof Error ? err.message : String(err),
                    path: "workflow",
                });
            }
            // Its managed tools may have new ids, e.g. when pushed as a new agent.
            config.workflow = mapRawWorkflowToolIds(structuredClone(this._rawWorkflow), (id) => {
                const tool = this._toolsById.get(id);
                return tool === undefined || !isManaged(tool) ? id : (toolIds?.[tool.name] ?? id);
            });
        }

        if (toolIds !== undefined) {
            for (const tool of this.tools()) {
                if (toolIds[tool.name] === undefined) {
                    issues.push({
                        code: "unresolved_tool",
                        severity: "error",
                        message: `Tool "${tool.name}" has no id yet. Push the agent with agents.push(), or pass toolIds`,
                        path: `tools.${tool.name}`,
                    });
                }
            }
        }

        if (typeof getPath(config, PROMPT_PATH) !== "string") {
            issues.push({
                code: "missing_prompt",
                severity: "warning",
                message: "The agent needs a prompt",
                path: "conversation_config.agent.prompt.prompt",
            });
        }

        const unique = dedupe(issues);
        const errors = unique.filter((issue) => issue.severity === "error");
        if (errors.length > 0) {
            throw new AgentValidationError(this._name, errors);
        }
        for (const warning of unique.filter((issue) => issue.severity === "warning")) {
            onWarning?.(warning);
        }

        config.name = this._name;
        config.conversation_config = config.conversation_config ?? {};
        config.platform_settings = config.platform_settings ?? {};
        config.tags = this._tags ?? [];
        return sortKeys(config) as WireObject;
    }
}

/** Replaces the tool ids in an API-format workflow's tool nodes and subagents, in place. */
export function mapRawWorkflowToolIds(workflow: WireObject, map: (id: string) => string): WireObject {
    for (const node of isObject(workflow.nodes) ? Object.values(workflow.nodes) : []) {
        if (!isObject(node)) {
            continue;
        }
        if (Array.isArray(node.tools)) {
            for (const locator of node.tools) {
                if (isObject(locator) && typeof locator.tool_id === "string") {
                    locator.tool_id = map(locator.tool_id);
                }
            }
        }
        if (Array.isArray(node.additional_tool_ids)) {
            node.additional_tool_ids = node.additional_tool_ids.map((id) => (typeof id === "string" ? map(id) : id));
        }
    }
    return workflow;
}

/** Whether push creates or updates `tool`: a webhook or client tool. */
function isManaged(tool: Tool): boolean {
    return tool.kind === "webhook" || tool.kind === "client";
}

/** The type a tool's config gives, such as `"mcp"`. */
function toolType(tool: Tool): string {
    if (tool.kind !== "other") {
        return tool.kind;
    }
    try {
        return String((tool.toJSON() as { type?: unknown }).type);
    } catch {
        return "other";
    }
}

function safeJson(tool: Tool): string | undefined {
    try {
        return tool.toJSONString();
    } catch {
        return undefined;
    }
}

/** The tool ids an API-format workflow's nodes use. */
export function rawWorkflowToolIds(workflow: WireObject | undefined): string[] {
    const nodes = isObject(workflow?.nodes) ? Object.values(workflow.nodes) : [];
    return nodes.flatMap((node) => {
        if (!isObject(node)) {
            return [];
        }
        const tools = Array.isArray(node.tools) ? node.tools : [];
        const extra = Array.isArray(node.additional_tool_ids) ? node.additional_tool_ids : [];
        return [
            ...tools.flatMap((t) => (isObject(t) && typeof t.tool_id === "string" ? [t.tool_id] : [])),
            ...extra.filter((id): id is string => typeof id === "string"),
        ];
    });
}

/** `ids` with the ones in `loaded` first, in that order, then the rest as they are. */
function keepOrder(ids: string[], loaded: string[]): string[] {
    const rank = (id: string): number => {
        const i = loaded.indexOf(id);
        return i === -1 ? loaded.length : i;
    };
    return ids
        .map((id, i) => ({ id, i }))
        .sort((a, b) => rank(a.id) - rank(b.id) || a.i - b.i)
        .map(({ id }) => id);
}

function toWire(serialize: () => unknown): WireObject | Error {
    try {
        return serialize() as WireObject;
    } catch (err) {
        return err instanceof Error ? err : new Error(String(err));
    }
}

function invalidConfig(option: string, err: Error): AgentIssue {
    return { code: "invalid_config", severity: "error", message: `Invalid ${option}: ${err.message}`, path: option };
}

function conflict(option: string, path: string[]): AgentIssue {
    return {
        code: "option_conflict",
        severity: "error",
        message: `"${option}" and the raw config both set ${path.join(".")}; set it in one place`,
        path: path.join("."),
    };
}

function dedupe(issues: AgentIssue[]): AgentIssue[] {
    const seen = new Set<string>();
    return issues.filter((issue) => {
        const key = `${issue.code}|${issue.path}|${issue.message}`;
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}
