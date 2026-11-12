import type * as ElevenLabs from "../../../api/index";
import * as serializers from "../../../serialization/index";
import type { Destination } from "../workflow/Destination";
import { defined, sortKeys } from "../workflow/util";
import { type ToolIssue, ToolValidationError } from "./errors";
import type { AuthConnection, Header, HeaderModel } from "./Header";
import { type ObjectSchema, Schema, type SchemaModel } from "./Schema";
import { checkSchema, error, isLiteral } from "./validate";

export type ToolKind = "webhook" | "client" | "system" | "other";

/** Options every kind of tool accepts. */
export interface CommonToolOptions {
    /** What the LLM calls the tool by. */
    name?: string;
    /** When the tool should be used and what it does. */
    description?: string;
    /** Seconds to wait for the tool to finish. */
    responseTimeoutSecs?: number;
    interruptionMode?: ElevenLabs.ToolInterruptionMode;
    preToolSpeech?: ElevenLabs.PreToolSpeechMode;
    toolCallSound?: ElevenLabs.ToolCallSoundType;
    toolCallSoundBehavior?: ElevenLabs.ToolCallSoundBehavior;
    toolErrorHandlingMode?: ElevenLabs.ToolErrorHandlingMode;
}

export interface WebhookToolOptions extends CommonToolOptions {
    /** Placeholder values for the dynamic variables the tool uses. */
    dynamicVariablePlaceholders?: Record<string, unknown>;
    executionMode?: ElevenLabs.ToolExecutionMode;
    contentType?: ElevenLabs.WebhookToolApiSchemaConfigInputContentType;
    responseFilter?: ElevenLabs.ResponseFilter;
    followRedirects?: boolean;
    followRedirectsAllowedDomains?: string[];
}

export interface ClientToolOptions extends CommonToolOptions {
    /** Placeholder values for the dynamic variables the tool uses. */
    dynamicVariablePlaceholders?: Record<string, unknown>;
    executionMode?: ElevenLabs.ToolExecutionMode;
    /** Wait for the client to respond, and pass its response to the LLM. */
    expectsResponse?: boolean;
}

export type SystemToolOptions = CommonToolOptions;

export interface AssignOptions {
    /** Remove the value from the tool response before the LLM and the transcript see it. */
    sanitize?: boolean;
    /** Store lists and objects as they are instead of as JSON strings. */
    preserveNativeType?: boolean;
}

/** Options for one entry of a transfer system tool. The first group applies to phone/SIP, the second to agents. */
export interface SystemTransferOptions {
    transferType?: ElevenLabs.TransferTypeEnum;
    customSipHeaders?: ElevenLabs.PhoneNumberTransferCustomSipHeadersItem[];
    sipReferPlayDialtone?: boolean;
    uui?: ElevenLabs.UuiTransferConfig;
    postDialDigits?: ElevenLabs.PhoneNumberTransferPostDialDigits;
    delayMs?: number;
    transferMessage?: string;
    enableTransferredAgentFirstMessage?: boolean;
    preserveClientTtsOverrides?: boolean;
    preserveVoiceSettings?: boolean;
}

export interface ToolBuildOptions {
    /** Called for each non-fatal problem, such as a param with no description. */
    onWarning?: (issue: ToolIssue) => void;
}

type ToolConfig = ElevenLabs.ToolRequestModelToolConfig;
type Model = Record<string, unknown>;

const SERIALIZER_OPTIONS = {
    unrecognizedObjectKeys: "strip",
    allowUnrecognizedUnionMembers: true,
    allowUnrecognizedEnumValues: true,
} as const;

const COMMON_OPTIONS = [
    "name",
    "description",
    "responseTimeoutSecs",
    "interruptionMode",
    "preToolSpeech",
    "toolCallSound",
    "toolCallSoundBehavior",
    "toolErrorHandlingMode",
];
const WEBHOOK_OPTIONS = [
    ...COMMON_OPTIONS,
    "dynamicVariablePlaceholders",
    "executionMode",
    "contentType",
    "responseFilter",
    "followRedirects",
    "followRedirectsAllowedDomains",
];
const CLIENT_OPTIONS = [...COMMON_OPTIONS, "dynamicVariablePlaceholders", "executionMode", "expectsResponse"];
const ENV_VAR_TEMPLATE = /\{\{system__env_[a-z][a-z0-9_]*\}\}/g;
const PHONE_TRANSFER_OPTIONS = ["transferType", "customSipHeaders", "sipReferPlayDialtone", "uui", "postDialDigits"];
const AGENT_TRANSFER_OPTIONS = [
    "delayMs",
    "transferMessage",
    "enableTransferredAgentFirstMessage",
    "preserveClientTtsOverrides",
    "preserveVoiceSettings",
];

/**
 * An agent tool, written as code. Create one with `Tool.webhook()`, `Tool.client()` or a `SystemTool` constructor,
 * or load one with `Tool.fromJSON()` / `Tool.fromResponse()`.
 */
export abstract class Tool {
    /** `"webhook"`, `"client"`, `"system"`, or `"other"` for a loaded tool of a type this SDK can't edit. */
    abstract readonly kind: ToolKind;

    /** @internal The tool config, except the parts subclasses keep in their own fields. */
    protected _config: Model;
    /** @internal Problems found while building, reported by `build()`. */
    protected readonly _issues: ToolIssue[] = [];

    /** @internal */
    protected constructor(config: Model) {
        this._config = config;
    }

    /** A tool the server runs by calling an HTTP endpoint. Set the method and URL with `get()`, `post()`... */
    static webhook(name: string, description: string): WebhookTool {
        return new WebhookTool({ name, description }, {});
    }

    /** A tool that sends an event to the user's client. */
    static client(name: string, description: string): ClientTool {
        return new ClientTool({ name, description }, undefined);
    }

    /**
     * Loads a tool stored in API format (snake_case), for example from `toJSONString()` or a CLI
     * `tool_configs/*.json` file. Accepts a JSON string or a parsed object: a tool config, or a request or response
     * with a `tool_config` key.
     */
    static fromJSON(json: string | object): Tool {
        const parsed = (typeof json === "string" ? JSON.parse(json) : json) as Model;
        const raw = (
            typeof parsed.tool_config === "object" && parsed.tool_config !== null ? parsed.tool_config : parsed
        ) as Model;
        if (raw.type !== "webhook" && raw.type !== "client" && raw.type !== "system") {
            return new OtherTool(raw);
        }
        const model = serializers.ToolRequestModelToolConfig.parseOrThrow(raw, SERIALIZER_OPTIONS) as unknown as Model;
        const { type, ...config } = model;
        if (type === "webhook") {
            const { apiSchema, ...rest } = config;
            return WebhookTool.load(rest, apiSchema as Model);
        }
        if (type === "client") {
            const { parameters, ...rest } = config;
            return new ClientTool(
                rest,
                parameters === undefined
                    ? undefined
                    : (Schema.fromModel(parameters as SchemaModel, false, "object") as ObjectSchema),
            );
        }
        const { params, ...rest } = config;
        const { systemToolType, ...systemParams } = params as Model;
        return new SystemTool(systemToolType as string, rest, systemParams);
    }

    /** Loads the result of `tools.get()`. */
    static fromResponse(response: ElevenLabs.ToolResponseModel): Tool {
        const raw = serializers.ToolResponseModelToolConfig.jsonOrThrow(response.toolConfig, {
            ...SERIALIZER_OPTIONS,
            unrecognizedObjectKeys: "passthrough",
        });
        return Tool.fromJSON(raw as object);
    }

    /** The tool's name, as the LLM sees it. */
    get name(): string {
        return this._config.name as string;
    }

    /** Merges options for this kind of tool. A key that doesn't apply is reported by `build()`. */
    options(options: CommonToolOptions): this {
        for (const [key, value] of Object.entries(options)) {
            if (!this._allowedOptions().includes(key)) {
                this._issues.push(error("invalid_option", key, `Option "${key}" doesn't apply to ${this.kind} tools`));
            } else {
                this._setOption(key, value);
            }
        }
        return this;
    }

    /** This tool as a `WebhookTool`, or `undefined` if it's another kind. */
    asWebhook(): WebhookTool | undefined {
        return this instanceof WebhookTool ? this : undefined;
    }

    /** This tool as a `ClientTool`, or `undefined` if it's another kind. */
    asClient(): ClientTool | undefined {
        return this instanceof ClientTool ? this : undefined;
    }

    /** This tool as a `SystemTool`, or `undefined` if it's another kind. */
    asSystem(): SystemTool | undefined {
        return this instanceof SystemTool ? this : undefined;
    }

    /**
     * Validates the tool and returns it in the shape `tools.create()` and `tools.update()` accept.
     *
     * @throws {ToolValidationError} listing every problem, if the tool is invalid
     */
    build(options: ToolBuildOptions = {}): ElevenLabs.ToolRequestModel {
        return { toolConfig: this.buildConfig(options) };
    }

    /**
     * Validates the tool and returns only its config: for a system tool, its entry in `prompt.builtInTools`.
     * Create webhook and client tools with `tools.create(tool.build())` and attach them by id in `prompt.toolIds`;
     * the inline `prompt.tools` field is deprecated, and replaces `builtInTools` with the system tools it contains.
     *
     * @throws {ToolValidationError} listing every problem, if the tool is invalid
     */
    buildConfig(options: ToolBuildOptions = {}): ToolConfig {
        const issues = [...this._issues, ...this._validate()];
        const errors = issues.filter((issue) => issue.severity === "error");
        if (errors.length > 0) {
            throw new ToolValidationError(this.name, errors);
        }
        for (const warning of issues.filter((issue) => issue.severity === "warning")) {
            options.onWarning?.(warning);
        }
        return this._toModel();
    }

    /**
     * The tool config in API format (snake_case keys, sorted at every level), the shape of a CLI
     * `tool_configs/*.json` file. Validates like `build()`. Also what `JSON.stringify(tool)` uses.
     */
    toJSON(): Record<string, unknown> {
        const raw = serializers.ToolRequestModelToolConfig.jsonOrThrow(this.buildConfig(), SERIALIZER_OPTIONS);
        return sortKeys(raw) as Record<string, unknown>;
    }

    /** `toJSON()` as a string with 2-space indentation and a trailing newline: the canonical file format. */
    toJSONString(): string {
        return `${JSON.stringify(this.toJSON(), null, 2)}\n`;
    }

    /** @internal */
    protected abstract _allowedOptions(): string[];

    /** @internal */
    protected _setOption(key: string, value: unknown): void {
        if (key === "dynamicVariablePlaceholders") {
            this._config.dynamicVariables = {
                ...(this._config.dynamicVariables as Model | undefined),
                dynamicVariablePlaceholders: value,
            };
        } else {
            this._config[key] = value;
        }
    }

    /** @internal Problems that need the finished tool. */
    protected abstract _validate(): ToolIssue[];

    /** @internal */
    protected abstract _toModel(): ToolConfig;
}

/** A tool the server runs by calling an HTTP endpoint. */
export class WebhookTool extends Tool {
    readonly kind = "webhook" as const;

    /** The `api_schema` fields not kept below: url, method, auth, content type and so on. */
    private _api: Model;
    private readonly _pathParams = new Map<string, Schema>();
    private _query: ObjectSchema | undefined;
    private _body: Schema | undefined;
    private _response: Schema | undefined;
    private readonly _headers = new Map<string, HeaderModel>();

    /** @internal */
    constructor(config: Model, api: Model) {
        super(config);
        this._api = api;
    }

    /** @internal */
    static load(config: Model, apiSchema: Model = {}): WebhookTool {
        const { pathParamsSchema, queryParamsSchema, requestBodySchema, responseBodySchema, requestHeaders, ...api } =
            apiSchema;
        const tool = new WebhookTool(config, api);
        for (const [name, model] of Object.entries((pathParamsSchema ?? {}) as Record<string, SchemaModel>)) {
            tool._pathParams.set(name, Schema.fromModel(model));
        }
        if (queryParamsSchema !== undefined) {
            tool._query = Schema.fromModel(queryParamsSchema as SchemaModel, false, "object") as ObjectSchema;
        }
        if (requestBodySchema !== undefined) {
            tool._body = Schema.fromModel(requestBodySchema as SchemaModel, false, "object");
        }
        if (responseBodySchema !== undefined) {
            tool._response = Schema.fromModel(responseBodySchema as SchemaModel, false, "object");
        }
        for (const [name, value] of Object.entries((requestHeaders ?? {}) as Record<string, HeaderModel>)) {
            tool._headers.set(name, value);
        }
        return tool;
    }

    /** Sends a `GET` to `url`. `{name}` placeholders in the URL are filled from path params. */
    get(url: string): this {
        return this._request("GET", url);
    }

    /** Sends a `POST` to `url`. */
    post(url: string): this {
        return this._request("POST", url);
    }

    /** Sends a `PUT` to `url`. */
    put(url: string): this {
        return this._request("PUT", url);
    }

    /** Sends a `PATCH` to `url`. */
    patch(url: string): this {
        return this._request("PATCH", url);
    }

    /** Sends a `DELETE` to `url`. */
    delete(url: string): this {
        return this._request("DELETE", url);
    }

    /** Sets the path param `name`, filling the `{name}` placeholder in the URL. Literal schemas only. */
    pathParam(name: string, schema: Schema): this {
        this._pathParams.set(name, schema);
        return this;
    }

    /** Sets the query param `name`. Required unless the schema is `optional()`. Literal schemas only. */
    queryParam(name: string, schema: Schema): this {
        this._query = (this._query ?? Schema.object()).property(name, schema);
        return this;
    }

    /** Sets the request body schema. Must be an object. */
    body(schema: Schema): this {
        this._body = schema;
        return this;
    }

    /** Sets the response body schema. Must be an object. */
    response(schema: Schema): this {
        this._response = schema;
        return this;
    }

    /** Sets the request header `name`. */
    header(name: string, value: Header): this {
        this._headers.set(name, value.toModel());
        return this;
    }

    /** Authenticates requests with an auth connection. */
    auth(connection: AuthConnection): this {
        this._api.authConnection = connection.toModel();
        return this;
    }

    /** Stores the value at `valuePath` in the response (dot notation, e.g. `"order.status"`) in `variable`. */
    assign(variable: string, valuePath: string, options: AssignOptions = {}): this {
        const assignments = (this._config.assignments ?? []) as ElevenLabs.DynamicVariableAssignment[];
        this._config.assignments = [
            ...assignments,
            defined({ source: "response" as const, dynamicVariable: variable, valuePath, ...options }),
        ];
        return this;
    }

    /** Removes the path param `name`. */
    removePathParam(name: string): this {
        this._pathParams.delete(name);
        return this;
    }

    /** Removes the query param `name`. */
    removeQueryParam(name: string): this {
        this._query = this._query?.without(name);
        return this;
    }

    /** Removes the request header `name`. */
    removeHeader(name: string): this {
        this._headers.delete(name);
        return this;
    }

    /** Removes every assignment to `variable`. */
    removeAssignment(variable: string): this {
        const assignments = (this._config.assignments ?? []) as ElevenLabs.DynamicVariableAssignment[];
        this._config.assignments = assignments.filter((assignment) => assignment.dynamicVariable !== variable);
        return this;
    }

    /** The request body schema, for editing with `body()`. */
    get bodySchema(): Schema | undefined {
        return this._body;
    }

    /** The response body schema, for editing with `response()`. */
    get responseSchema(): Schema | undefined {
        return this._response;
    }

    /** Merges options for webhook tools. A key that doesn't apply is reported by `build()`. */
    options(options: WebhookToolOptions): this {
        return super.options(options);
    }

    /** @internal */
    protected _allowedOptions(): string[] {
        return WEBHOOK_OPTIONS;
    }

    /** @internal */
    protected _setOption(key: string, value: unknown): void {
        if (key === "contentType" || key === "responseFilter") {
            this._api[key] = value;
        } else {
            super._setOption(key, value);
        }
    }

    /** @internal */
    protected _validate(): ToolIssue[] {
        const issues: ToolIssue[] = [];
        const url = this._api.url as string | undefined;
        if (url === undefined) {
            issues.push(
                error(
                    "missing_url",
                    undefined,
                    "Set the method and URL with get(), post(), put(), patch() or delete()",
                ),
            );
        }
        // As the API does: env var templates aren't placeholders, and the auth connection fills `authResolvedParams`.
        const placeholders = [...(url ?? "").replace(ENV_VAR_TEMPLATE, "env").matchAll(/\{([^{}]+)\}/g)].map(
            (match) => match[1],
        );
        const authResolved = (this._api.authResolvedParams as string[] | undefined) ?? [];
        for (const name of placeholders.filter((p) => !this._pathParams.has(p) && !authResolved.includes(p))) {
            issues.push(
                error("missing_path_param", `pathParams.${name}`, `The URL has {${name}} but no pathParam("${name}")`),
            );
        }
        for (const [name, schema] of this._pathParams) {
            const path = `pathParams.${name}`;
            if (url !== undefined && !placeholders.includes(name)) {
                issues.push(error("unknown_path_param", path, `pathParam("${name}") has no {${name}} in the URL`));
            } else if (authResolved.includes(name)) {
                issues.push(
                    error("unknown_path_param", path, `{${name}} is filled by the auth connection, not a pathParam`),
                );
            }
            if (!isLiteral(schema.kind)) {
                issues.push(
                    error("param_not_literal", path, `Path param "${name}" must be a string, integer, number or bool`),
                );
            }
            checkSchema(schema, path, { isProperty: true }, issues);
        }
        if (this._query !== undefined) {
            for (const name of this._query.propertyNames) {
                const schema = this._query.propertySchema(name) as Schema;
                const path = `query.${name}`;
                if (!isLiteral(schema.kind)) {
                    issues.push(
                        error(
                            "param_not_literal",
                            path,
                            `Query param "${name}" must be a string, integer, number or bool`,
                        ),
                    );
                }
                checkSchema(schema, path, { isProperty: true }, issues);
            }
        }
        for (const [label, schema] of [
            ["body", this._body],
            ["response", this._response],
        ] as const) {
            if (schema === undefined) {
                continue;
            }
            if (schema.kind !== "object") {
                issues.push(error("body_not_object", label, `The ${label} schema must be an object`));
            }
            checkSchema(schema, label, { isProperty: false }, issues);
        }
        const method = this._api.method;
        if (method === "GET" && this._body !== undefined) {
            issues.push(error("body_not_allowed", "body", "A GET request can't have a body"));
        }
        if ((method === "POST" || method === "PUT" || method === "PATCH") && this._body === undefined) {
            issues.push(error("missing_body", "body", `A ${method} request needs a body`));
        }
        const where = new Map<string, string>();
        for (const [location, names] of [
            ["pathParams", [...this._pathParams.keys()]],
            ["query", this._query?.propertyNames ?? []],
            ["body", this._body?.kind === "object" ? (this._body as ObjectSchema).propertyNames : []],
        ] as const) {
            for (const name of names) {
                const first = where.get(name);
                if (first !== undefined) {
                    issues.push(
                        error(
                            "duplicate_param",
                            `${location}.${name}`,
                            `"${name}" is in both ${first} and ${location}; param names must be unique across path, query and body`,
                        ),
                    );
                } else {
                    where.set(name, location);
                }
            }
        }
        const seen = new Map<string, string>();
        for (const name of this._headers.keys()) {
            const other = seen.get(name.toLowerCase());
            if (other !== undefined) {
                issues.push(
                    error(
                        "duplicate_header",
                        `headers.${name}`,
                        `Headers "${other}" and "${name}" differ only in case`,
                    ),
                );
            }
            seen.set(name.toLowerCase(), name);
        }
        const timeout = this._config.responseTimeoutSecs as number | undefined;
        if (timeout !== undefined && (timeout < 5 || timeout > 300)) {
            issues.push(
                error("invalid_option", "responseTimeoutSecs", "A webhook tool's responseTimeoutSecs must be 5–300"),
            );
        }
        const domains = this._config.followRedirectsAllowedDomains as string[] | undefined;
        if (this._config.followRedirects === true && (domains === undefined || domains.length === 0)) {
            issues.push(
                error("invalid_option", "followRedirects", "followRedirects needs followRedirectsAllowedDomains"),
            );
        }
        return issues;
    }

    /** @internal */
    protected _toModel(): ToolConfig {
        const query = this._query?.toModel() as ElevenLabs.ObjectJsonSchemaPropertyInput | undefined;
        const apiSchema = defined({
            ...this._api,
            pathParamsSchema:
                this._pathParams.size > 0
                    ? Object.fromEntries([...this._pathParams].map(([name, schema]) => [name, schema.toModel()]))
                    : undefined,
            queryParamsSchema:
                query?.properties === undefined
                    ? undefined
                    : defined({ properties: query.properties, required: query.required }),
            requestBodySchema: this._body?.toModel(),
            responseBodySchema: this._response?.toModel(),
            requestHeaders: this._headers.size > 0 ? Object.fromEntries(this._headers) : undefined,
        });
        return defined({ ...this._config, type: "webhook", apiSchema }) as unknown as ToolConfig;
    }

    private _request(method: ElevenLabs.WebhookToolApiSchemaConfigInputMethod, url: string): this {
        this._api.method = method;
        this._api.url = url;
        return this;
    }
}

/** A tool that sends an event to the user's client. */
export class ClientTool extends Tool {
    readonly kind = "client" as const;

    private _parameters: ObjectSchema | undefined;

    /** @internal */
    constructor(config: Model, parameters: ObjectSchema | undefined) {
        super(config);
        this._parameters = parameters;
    }

    /** Sets the param `name`. Required unless the schema is `optional()`. */
    param(name: string, schema: Schema): this {
        this._parameters = (this._parameters ?? Schema.object()).property(name, schema);
        return this;
    }

    /** Removes the param `name`. */
    removeParam(name: string): this {
        this._parameters = this._parameters?.without(name);
        return this;
    }

    /** The params schema. */
    get parametersSchema(): ObjectSchema | undefined {
        return this._parameters;
    }

    /** Merges options for client tools. A key that doesn't apply is reported by `build()`. */
    options(options: ClientToolOptions): this {
        return super.options(options);
    }

    /** @internal */
    protected _allowedOptions(): string[] {
        return CLIENT_OPTIONS;
    }

    /** @internal */
    protected _validate(): ToolIssue[] {
        const issues: ToolIssue[] = [];
        if (this._parameters !== undefined) {
            // Checks the params object's own requireAnyOf()/requireAllOf() and every param under it.
            checkSchema(this._parameters, "params", { isProperty: false }, issues);
        }
        const timeout = this._config.responseTimeoutSecs as number | undefined;
        if (timeout !== undefined && timeout !== -1 && (timeout < 1 || timeout > 120)) {
            issues.push(
                error(
                    "invalid_option",
                    "responseTimeoutSecs",
                    "A client tool's responseTimeoutSecs must be 1–120, or -1",
                ),
            );
        }
        if (timeout === -1 && this._config.expectsResponse !== true) {
            issues.push(
                error("invalid_option", "responseTimeoutSecs", "responseTimeoutSecs: -1 needs expectsResponse: true"),
            );
        }
        return issues;
    }

    /** @internal */
    protected _toModel(): ToolConfig {
        return defined({
            ...this._config,
            type: "client",
            parameters: this._parameters?.toModel(),
        }) as unknown as ToolConfig;
    }
}

export interface SkipTurnOptions {
    /** Seconds to wait before the agent checks in. -1 waits for the user. */
    waitTimeoutSecs?: number;
}

export interface LanguageDetectionOptions {
    /** Only switch language during the first two user turns. */
    onlyAtConversationStart?: boolean;
}

export interface PlayKeypadTouchToneOptions {
    /** Send tones as RTP events instead of in-band audio. SIP trunk numbers only. */
    useOutOfBandDtmf?: boolean;
    /** Don't speak after playing tones, so speech doesn't confuse an IVR. */
    suppressTurnAfterDtmf?: boolean;
}

export interface VoicemailDetectionOptions {
    /** Message to leave on voicemail. Without one, the call ends. */
    voicemailMessage?: string;
}

export interface KnowledgeBaseToolOptions {
    enabledStrategies?: ElevenLabs.SearchStrategy[];
}

export interface TransferToNumberOptions {
    /** Play a message to the caller while they wait for the transfer. */
    enableClientMessage?: boolean;
}

/** A built-in tool the agent runs itself, such as ending the call or transferring it. */
export class SystemTool extends Tool {
    readonly kind = "system" as const;

    /** The API's `system_tool_type`, e.g. `"end_call"`. */
    readonly systemToolType: string;
    private readonly _params: Model;

    /** @internal */
    constructor(systemToolType: string, config: Model, params: Model) {
        super(config);
        this.systemToolType = systemToolType;
        this._params = params;
    }

    /** Lets the agent end the call. */
    static endCall(): SystemTool {
        return SystemTool._create("end_call", {});
    }

    /** Lets the agent stay quiet when the user asks for a moment. */
    static skipTurn(options: SkipTurnOptions = {}): SystemTool {
        return SystemTool._create("skip_turn", options);
    }

    /** Lets the agent switch language. */
    static languageDetection(options: LanguageDetectionOptions = {}): SystemTool {
        return SystemTool._create("language_detection", options);
    }

    /** Lets the agent play keypad tones, for phone menus. */
    static playKeypadTouchTone(options: PlayKeypadTouchToneOptions = {}): SystemTool {
        return SystemTool._create("play_keypad_touch_tone", options);
    }

    /** Lets the agent detect voicemail and leave a message or hang up. */
    static voicemailDetection(options: VoicemailDetectionOptions = {}): SystemTool {
        return SystemTool._create("voicemail_detection", options);
    }

    /** Lets the agent search its knowledge base. */
    static knowledgeBase(options: KnowledgeBaseToolOptions = {}): SystemTool {
        return SystemTool._create("knowledge_base", options);
    }

    /** Lets the agent transfer the call to a phone number or SIP URI. Add destinations with `transfer()`. */
    static transferToNumber(options: TransferToNumberOptions = {}): SystemTool {
        return SystemTool._create("transfer_to_number", { ...options, transfers: [] });
    }

    /** Lets the agent hand the conversation to another agent. Add destinations with `transfer()`. */
    static transferToAgent(): SystemTool {
        return SystemTool._create("transfer_to_agent", { transfers: [] });
    }

    private static _create(systemToolType: string, params: object): SystemTool {
        return new SystemTool(systemToolType, { name: systemToolType }, defined({ ...params }) as Model);
    }

    /**
     * Adds a destination to a transfer tool. `condition` is plain text telling the LLM when to transfer there.
     * `transferToNumber` takes phone and SIP destinations, `transferToAgent` agent destinations.
     */
    transfer(condition: string, destination: Destination, options: SystemTransferOptions = {}): this {
        const model = destination.toModel();
        const toNumber = this.systemToolType === "transfer_to_number";
        if (!toNumber && this.systemToolType !== "transfer_to_agent") {
            this._issues.push(
                error(
                    "invalid_option",
                    "transfer",
                    `transfer() only applies to transfer tools, not ${this.systemToolType}`,
                ),
            );
            return this;
        }
        if ((model.type === "phone_number") !== toNumber) {
            this._issues.push(
                error(
                    "invalid_destination",
                    "transfer",
                    toNumber
                        ? `transferToNumber() needs a phone or SIP destination, not an agent ("${condition}")`
                        : `transferToAgent() needs an agent destination ("${condition}")`,
                ),
            );
            return this;
        }
        const allowed = toNumber ? PHONE_TRANSFER_OPTIONS : AGENT_TRANSFER_OPTIONS;
        for (const key of Object.keys(options).filter((k) => !allowed.includes(k))) {
            this._issues.push(error("invalid_option", key, `Option "${key}" doesn't apply to ${this.systemToolType}`));
        }
        const settings = Object.fromEntries(Object.entries(options).filter(([key]) => allowed.includes(key)));
        const { type: _type, ...target } = model;
        // A SIP URI held in a dynamic variable resolves to a SIP URI too, so it also needs SIP REFER.
        const destinationType = ((target as Model).transferDestination as Model | undefined)?.type;
        const sipUri = destinationType === "sip_uri" || destinationType === "sip_uri_dynamic_variable";
        if (sipUri && settings.transferType !== "sip_refer") {
            this._issues.push(
                error(
                    "invalid_destination",
                    "transfer",
                    `A SIP URI destination needs { transferType: "sip_refer" } ("${condition}")`,
                ),
            );
            return this;
        }
        const entry = defined({ ...target, ...settings, condition });
        this._params.transfers = [...((this._params.transfers ?? []) as Model[]), entry];
        return this;
    }

    /**
     * Validates the tool and returns its entry for the agent's `prompt.builtInTools`.
     *
     * @throws {ToolValidationError} listing every problem, if the tool is invalid
     */
    buildConfig(options: ToolBuildOptions = {}): ElevenLabs.ToolRequestModelToolConfig.System {
        return super.buildConfig(options) as ElevenLabs.ToolRequestModelToolConfig.System;
    }

    /** @internal */
    protected _allowedOptions(): string[] {
        return COMMON_OPTIONS;
    }

    /** @internal */
    protected _validate(): ToolIssue[] {
        const transfers = this._params.transfers as unknown[] | undefined;
        const isTransfer = this.systemToolType === "transfer_to_number" || this.systemToolType === "transfer_to_agent";
        if (isTransfer && (transfers === undefined || transfers.length === 0)) {
            return [error("no_transfers", "transfer", `${this.systemToolType} needs at least one transfer()`)];
        }
        return [];
    }

    /** @internal */
    protected _toModel(): ToolConfig {
        return defined({
            ...this._config,
            type: "system",
            params: { systemToolType: this.systemToolType, ...this._params },
        }) as unknown as ToolConfig;
    }
}

/** A loaded tool of a type the builder has no constructor for, such as `mcp`. Kept exactly as loaded. */
class OtherTool extends Tool {
    readonly kind = "other" as const;

    /** @internal */
    constructor(raw: Model) {
        super(raw);
    }

    toJSON(): Record<string, unknown> {
        this.buildConfig();
        return sortKeys(this._config) as Record<string, unknown>;
    }

    /** @internal */
    protected _allowedOptions(): string[] {
        return [];
    }

    /** @internal */
    protected _validate(): ToolIssue[] {
        return [
            {
                code: "unknown_tool_type",
                severity: "warning",
                message:
                    `Tool "${this.name}" has type "${String(this._config.type)}", which this SDK can't edit. It round-trips ` +
                    "through toJSON(), but build()'s output may be rejected by tools.create() and tools.update()",
            },
        ];
    }

    /** @internal The loaded config, in API format. */
    protected _toModel(): ToolConfig {
        return this._config as unknown as ToolConfig;
    }
}
