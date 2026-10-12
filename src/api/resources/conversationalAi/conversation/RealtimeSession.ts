/**
 * Session configuration and handshake for `websocket-realtime` connections, which speak the
 * OpenAI-compatible protocol of the `/v1/convai/realtime` endpoint instead of loading a saved agent.
 *
 * @experimental
 */

/** @experimental */
export type RealtimeAudioFormat = "pcm_24000" | "ulaw_8000";

/**
 * A client tool the model may call. Register a handler with the same name in `ClientTools`.
 * @experimental
 */
export interface RealtimeFunctionTool {
    name: string;
    description?: string;
    /** JSON Schema for the tool's arguments. */
    parameters?: Record<string, unknown>;
}

/** @experimental */
export interface RealtimeTurnDetection {
    type: "semantic_vad";
    eagerness?: "low" | "medium" | "high" | "auto";
    createResponse?: boolean;
    /**
     * Whether user speech interrupts the agent.
     * @default true
     */
    interruptResponse?: boolean;
}

/**
 * Configuration sent to the Realtime endpoint in `session.update`.
 *
 * The audio formats only select what is sent over the wire. Audio interfaces always exchange
 * 16-bit PCM mono at 16kHz, whichever format is chosen.
 * @experimental
 */
export interface RealtimeSessionOptions {
    instructions?: string;
    voice?: string;
    /** @default "pcm_24000" */
    inputAudioFormat?: RealtimeAudioFormat;
    /** @default "pcm_24000" */
    outputAudioFormat?: RealtimeAudioFormat;
    /** `null` disables turn detection for manual turn-taking. */
    turnDetection?: RealtimeTurnDetection | null;
    tools?: RealtimeFunctionTool[];
    temperature?: number;
    maxOutputTokens?: number | "inf";
}

export interface RealtimeWireFormat {
    encoding: "pcm" | "ulaw";
    sampleRate: number;
}

/** The session configuration in effect, as reported by `session.updated`. */
export interface RealtimeEffectiveSession {
    id: string;
    inputFormat: RealtimeWireFormat;
    outputFormat: RealtimeWireFormat;
    interruptOnSpeech: boolean;
}

export type RealtimeServerEvent = {
    type: string;
    event_id?: string;
    [key: string]: any;
};

export type RealtimeClientEvent = {
    type: string;
    event_id?: string;
    [key: string]: unknown;
};

/** Raised when the Realtime session cannot be established. */
export class RealtimeConnectionError extends Error {
    public readonly closeCode?: number;
    public readonly closeReason?: string;

    constructor(message: string, details: { closeCode?: number; closeReason?: string } = {}) {
        super(message);
        this.name = "RealtimeConnectionError";
        this.closeCode = details.closeCode;
        this.closeReason = details.closeReason;
    }
}

export const REALTIME_DISABLED_CLOSE_CODE = 4003;

const MAIN_PROTOCOL = "realtime";
const CLIENT_SECRET_PROTOCOL_PREFIX = "openai-insecure-api-key.";
const SUPPORTED_AUDIO_FORMATS: readonly RealtimeAudioFormat[] = ["pcm_24000", "ulaw_8000"];

export function realtimeSubprotocols(clientSecret: string): string[] {
    return [MAIN_PROTOCOL, `${CLIENT_SECRET_PROTOCOL_PREFIX}${clientSecret}`];
}

/** Throws for options the Realtime endpoint would otherwise reject or silently ignore. */
export function validateRealtimeOptions(options: RealtimeSessionOptions): void {
    const turnDetectionType = options.turnDetection?.type;
    if (options.turnDetection && turnDetectionType !== "semantic_vad") {
        throw new Error(
            `Unsupported realtime turnDetection type "${turnDetectionType}". Use "semantic_vad", or null for manual turn-taking.`,
        );
    }

    for (const format of [options.inputAudioFormat, options.outputAudioFormat]) {
        if (format !== undefined && SUPPORTED_AUDIO_FORMATS.indexOf(format) === -1) {
            throw new Error(
                `Unsupported realtime audio format "${format}". Use one of: ${SUPPORTED_AUDIO_FORMATS.join(", ")}.`,
            );
        }
    }

    const toolNames = new Set<string>();
    for (const tool of options.tools ?? []) {
        if (!tool.name) {
            throw new Error("Every realtime tool requires a name.");
        }
        if (toolNames.has(tool.name)) {
            throw new Error(`Duplicate realtime tool name "${tool.name}".`);
        }
        toolNames.add(tool.name);
    }
}

export function buildSessionUpdate(options: RealtimeSessionOptions, textOnly: boolean): RealtimeClientEvent {
    const input: Record<string, unknown> = {
        format: toWireAudioFormat(options.inputAudioFormat ?? "pcm_24000"),
    };
    if (options.turnDetection === null) {
        input.turn_detection = null;
    } else if (options.turnDetection) {
        input.turn_detection = omitUndefined({
            type: options.turnDetection.type,
            eagerness: options.turnDetection.eagerness,
            create_response: options.turnDetection.createResponse,
            interrupt_response: options.turnDetection.interruptResponse,
        });
    }

    const output = omitUndefined({
        format: toWireAudioFormat(options.outputAudioFormat ?? "pcm_24000"),
        voice: options.voice,
    });

    return {
        type: "session.update",
        session: omitUndefined({
            type: "realtime",
            output_modalities: [textOnly ? "text" : "audio"],
            instructions: options.instructions,
            audio: { input, output },
            tools: options.tools?.map((tool) =>
                omitUndefined({
                    type: "function",
                    name: tool.name,
                    description: tool.description,
                    parameters: tool.parameters,
                }),
            ),
            temperature: options.temperature,
            max_output_tokens: options.maxOutputTokens,
        }),
    };
}

/**
 * Configures the session: waits for `session.created`, replies with `session.update` and
 * resolves with the effective session once `session.updated` arrives. Performs no I/O.
 */
export class RealtimeHandshake {
    public session?: RealtimeEffectiveSession;
    private readonly sessionUpdate: RealtimeClientEvent;
    private sessionId?: string;

    constructor(
        private readonly options: RealtimeSessionOptions,
        textOnly: boolean,
    ) {
        this.sessionUpdate = buildSessionUpdate(options, textOnly);
    }

    /**
     * Returns an event to send, if any, and sets `session` once the handshake completes.
     * @throws {RealtimeConnectionError} If the server rejects the session.
     */
    public handleMessage(data: string): RealtimeClientEvent | undefined {
        const message = parseServerEvent(data);
        if (!message) {
            return undefined;
        }

        switch (message.type) {
            case "session.created":
                this.sessionId = message.session?.id;
                return this.sessionUpdate;
            case "session.updated": {
                const session = message.session ?? {};
                const id = this.sessionId ?? session.id;
                if (!id) {
                    throw new RealtimeConnectionError("The Realtime endpoint did not report a session id.");
                }
                const turnDetection = session.audio?.input?.turn_detection;
                this.session = {
                    id,
                    inputFormat: fromWireAudioFormat(
                        session.audio?.input?.format,
                        this.options.inputAudioFormat ?? "pcm_24000",
                    ),
                    outputFormat: fromWireAudioFormat(
                        session.audio?.output?.format,
                        this.options.outputAudioFormat ?? "pcm_24000",
                    ),
                    interruptOnSpeech:
                        turnDetection?.interrupt_response ?? this.options.turnDetection?.interruptResponse ?? true,
                };
                return undefined;
            }
            case "error":
                throw new RealtimeConnectionError(
                    message.error?.message ?? "The Realtime endpoint rejected the session.",
                );
            default:
                return undefined;
        }
    }
}

export function handshakeCloseError(code: number, reason: string | undefined): RealtimeConnectionError {
    const message =
        reason || code === REALTIME_DISABLED_CLOSE_CODE
            ? describeClose(code, reason)
            : code === 1000
              ? "Connection closed normally before session could be established."
              : "Connection closed unexpectedly before session could be established.";
    return new RealtimeConnectionError(message, { closeCode: code, closeReason: reason || undefined });
}

export function describeClose(code: number, reason: string | undefined): string {
    if (reason) {
        return reason;
    }
    if (code === REALTIME_DISABLED_CLOSE_CODE) {
        return "The Realtime API is not enabled for this workspace.";
    }
    return "The connection was closed by the server.";
}

export function parseServerEvent(data: string): RealtimeServerEvent | null {
    try {
        const parsed = JSON.parse(data);
        return parsed && typeof parsed.type === "string" ? parsed : null;
    } catch {
        return null;
    }
}

/** Synthesized, since the Realtime endpoint never sends initiation metadata. */
export function initiationMetadataEvent(session: RealtimeEffectiveSession): Record<string, unknown> {
    return {
        type: "conversation_initiation_metadata",
        conversation_initiation_metadata_event: {
            conversation_id: session.id,
            agent_output_audio_format: `${session.outputFormat.encoding}_${session.outputFormat.sampleRate}`,
            user_input_audio_format: `${session.inputFormat.encoding}_${session.inputFormat.sampleRate}`,
        },
    };
}

function toWireAudioFormat(format: RealtimeAudioFormat): Record<string, unknown> {
    return format === "ulaw_8000" ? { type: "audio/pcmu" } : { type: "audio/pcm", rate: 24000 };
}

function fromWireAudioFormat(
    format: { type?: string; rate?: number } | undefined,
    fallback: RealtimeAudioFormat,
): RealtimeWireFormat {
    if (!format) {
        return fallback === "ulaw_8000"
            ? { encoding: "ulaw", sampleRate: 8000 }
            : { encoding: "pcm", sampleRate: 24000 };
    }
    switch (format.type) {
        case "audio/pcm":
            return { encoding: "pcm", sampleRate: format.rate ?? 24000 };
        case "audio/pcmu":
            return { encoding: "ulaw", sampleRate: 8000 };
        default:
            throw new RealtimeConnectionError(
                `The Realtime endpoint selected an unsupported audio format: ${format.type}`,
            );
    }
}

function omitUndefined<T extends Record<string, unknown>>(value: T): T {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(value)) {
        if (value[key] !== undefined) {
            result[key] = value[key];
        }
    }
    return result as T;
}
