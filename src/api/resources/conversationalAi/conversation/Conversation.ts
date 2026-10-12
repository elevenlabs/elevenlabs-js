import { EventEmitter } from "events";
import WebSocket from "ws";
import { ElevenLabsClient } from "../../../../Client";
import { SDK_VERSION } from "../../../../version";
import { AudioInterface } from "./AudioInterface";
import { ClientTools } from "./ClientTools";
import { ConversationInitiationData } from "./ConversationConfig";
import {
    ClientToOrchestratorEvent,
    UserMessageClientToOrchestratorEvent,
    UserActivityClientToOrchestratorEvent,
    ContextualUpdateClientToOrchestratorEvent,
    ConversationInitiationClientDataEvent,
    UserAudioChunkEvent,
    PongEvent,
    MultimodalMessageClientToOrchestratorEvent,
} from "./events";
import { WebSocketFactory, WebSocketInterface, DefaultWebSocketFactory } from "./interfaces/WebSocketInterface";
import { ConversationClient } from "./interfaces/ConversationClient";
import { RealtimeAudioConverter } from "./RealtimeAudio";
import { NativeServerEvent, RealtimeOutgoingEvent, RealtimeProtocolTranslator } from "./RealtimeProtocol";
import {
    RealtimeConnectionError,
    RealtimeEffectiveSession,
    RealtimeHandshake,
    RealtimeSessionOptions,
    handshakeCloseError,
    initiationMetadataEvent,
    parseServerEvent,
    realtimeSubprotocols,
    validateRealtimeOptions,
} from "./RealtimeSession";

/** How the conversation connects. `"websocket-realtime"` is experimental. */
export type ConversationConnectionType = "websocket" | "websocket-realtime";

interface BaseConversationOptions {
    webSocketFactory?: WebSocketFactory;
    audioInterface: AudioInterface;
    clientTools?: ClientTools;
    callbackAgentResponse?: (response: string) => void;
    callbackAgentResponseCorrection?: (original: string, corrected: string) => void;
    callbackUserTranscript?: (transcript: string) => void;
    callbackLatencyMeasurement?: (latencyMs: number) => void;
    callbackMessageReceived?: (message: any) => void;
}

/** Connects to a saved agent. */
export interface AgentConversationOptions extends BaseConversationOptions {
    connectionType?: "websocket";
    client?: ElevenLabsClient;
    conversationClient?: ConversationClient;
    agentId: string;
    requiresAuth: boolean;
    config?: ConversationInitiationData;
}

/**
 * Connects to the OpenAI-compatible `/v1/convai/realtime` endpoint, configured through `realtime`
 * instead of a saved agent. Contextual updates and multimodal messages are not supported.
 * @experimental
 */
export interface RealtimeConversationOptions extends BaseConversationOptions {
    connectionType: "websocket-realtime";
    /** Short-lived secret minted with `POST /v1/convai/realtime/client_secrets`. */
    clientSecret: string;
    realtime?: RealtimeSessionOptions;
    /** Requests text-only responses. */
    textOnly?: boolean;
    /** @default "wss://api.elevenlabs.io" */
    origin?: string;
    client?: never;
    conversationClient?: never;
    agentId?: never;
    requiresAuth?: never;
    config?: never;
}

export type ConversationOptions = AgentConversationOptions | RealtimeConversationOptions;

const DEFAULT_WSS_ORIGIN = "wss://api.elevenlabs.io";
const REALTIME_HANDSHAKE_TIMEOUT_MS = 10000;
const MAX_PAYLOAD = 16 * 1024 * 1024;
const REALTIME_UNSUPPORTED_OPTIONS = ["client", "conversationClient", "agentId", "requiresAuth", "config"] as const;

/**
 * Conversational AI session for Node.js.
 *
 * BETA: This API is subject to change without regard to backwards compatibility.
 */
export class Conversation extends EventEmitter {
    private client?: ElevenLabsClient;
    private agentId: string;
    private requiresAuth: boolean;
    private audioInterface: AudioInterface;
    private clientTools: ClientTools;
    private config: ConversationInitiationData;
    private webSocketFactory: WebSocketFactory;
    private conversationClient?: ConversationClient;
    private connectionType: ConversationConnectionType;
    private realtimeConfig?: {
        clientSecret: string;
        options: RealtimeSessionOptions;
        textOnly: boolean;
        origin: string;
    };
    private realtimeTranslator?: RealtimeProtocolTranslator;
    private realtimeAudio?: RealtimeAudioConverter;

    // Callback functions
    private callbackAgentResponse?: (response: string) => void;
    private callbackAgentResponseCorrection?: (original: string, corrected: string) => void;
    private callbackUserTranscript?: (transcript: string) => void;
    private callbackLatencyMeasurement?: (latencyMs: number) => void;
    private callbackMessageReceived?: (message: any) => void;

    // Internal state
    private ws?: WebSocketInterface;
    private shouldStop: boolean = false;
    private conversationId?: string;
    private lastInterruptId: number = 0;
    private inputCallback?: (audio: Buffer) => void;

    constructor(options: ConversationOptions) {
        super();

        this.connectionType = options.connectionType ?? "websocket";
        if (options.connectionType === "websocket-realtime") {
            assertRealtimeOptionsSupported(options);
            this.agentId = "";
            this.requiresAuth = false;
            this.realtimeConfig = {
                clientSecret: options.clientSecret,
                options: options.realtime ?? {},
                textOnly: options.textOnly ?? false,
                origin: options.origin ?? DEFAULT_WSS_ORIGIN,
            };
        } else if (this.connectionType === "websocket") {
            const agentOptions = options as AgentConversationOptions;
            this.client = agentOptions.client || new ElevenLabsClient();
            this.agentId = agentOptions.agentId;
            this.requiresAuth = agentOptions.requiresAuth;
            this.conversationClient = agentOptions.conversationClient || this.client;
        } else {
            throw new Error(
                `Unsupported connectionType "${this.connectionType}". Use "websocket" or "websocket-realtime".`,
            );
        }
        this.audioInterface = options.audioInterface;
        this.clientTools = options.clientTools || new ClientTools();
        this.config = (options.config as ConversationInitiationData | undefined) || {
            extraBody: {},
            conversationConfigOverride: {},
            dynamicVariables: {},
        };
        this.webSocketFactory = options.webSocketFactory || new DefaultWebSocketFactory();

        this.callbackAgentResponse = options.callbackAgentResponse;
        this.callbackAgentResponseCorrection = options.callbackAgentResponseCorrection;
        this.callbackUserTranscript = options.callbackUserTranscript;
        this.callbackLatencyMeasurement = options.callbackLatencyMeasurement;
        this.callbackMessageReceived = options.callbackMessageReceived;
    }

    /**
     * Starts the conversation session.
     *
     * Will run until `endSession` is called.
     */
    public async startSession(): Promise<void> {
        if (this.ws) {
            throw new Error("Session already started");
        }

        if (this.realtimeConfig) {
            return this._startRealtimeSession(this.realtimeConfig);
        }

        const wsUrl = this.requiresAuth ? await this._getSignedUrl() : this._getWssUrl();

        return new Promise((resolve, reject) => {
            this.ws = this.webSocketFactory.create(wsUrl, {
                perMessageDeflate: false,
                maxPayload: 16 * 1024 * 1024, // 16MB max message size
            });

            this.ws.on("open", () => {
                this._onWebSocketOpen();
                resolve();
            });

            this.ws.on("message", (data: WebSocket.Data) => {
                this._onWebSocketMessage(data);
            });

            this.ws.on("error", (error: Error) => {
                this.emit("error", error);
                reject(error);
            });

            this.ws.on("close", (code: number, reason: Buffer) => {
                this._onWebSocketClose(code, reason);
            });
        });
    }

    /**
     * Ends the conversation session and cleans up resources.
     */
    public endSession(): void {
        this.shouldStop = true;

        if (this.audioInterface) {
            this.audioInterface.stop();
        }

        if (this.ws) {
            this.ws.close();
            this.ws = undefined;
        }

        this.emit("session_ended", this.conversationId);
    }

    /**
     * Send a text message from the user to the agent.
     *
     * @param text The text message to send to the agent
     */
    public sendUserMessage(text: string): void {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            throw new Error("Session not started or websocket not connected");
        }

        const event: UserMessageClientToOrchestratorEvent = {
            type: ClientToOrchestratorEvent.USER_MESSAGE,
            text,
        };

        this._sendEvent(event);
    }

    /**
     * Register user activity to prevent session timeout.
     *
     * This sends a ping to the orchestrator to reset the timeout timer.
     */
    public registerUserActivity(): void {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            throw new Error("Session not started or websocket not connected");
        }

        const event: UserActivityClientToOrchestratorEvent = {
            type: ClientToOrchestratorEvent.USER_ACTIVITY,
        };

        this._sendEvent(event);
    }

    /**
     * Send a multimodal message combining text and file references to the agent.
     *
     * At least one of `text`, `fileId`, or `fileIds` must be provided.
     *
     * @param options.text Optional text message to include
     * @param options.fileId @deprecated Use `fileIds`.
     * @param options.fileIds Optional ElevenLabs file IDs to include
     * @throws {RealtimeUnsupportedFeatureError} For websocket-realtime connections.
     */
    public sendMultimodalMessage(options: {
        text?: string;
        /** @deprecated Use `fileIds`. */
        fileId?: string;
        fileIds?: string[];
    }): void {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            throw new Error("Session not started or websocket not connected");
        }

        const fileIds = options.fileIds?.length ? options.fileIds : options.fileId ? [options.fileId] : [];
        if (!options.text && fileIds.length === 0) {
            throw new Error("At least one of text, fileId, or fileIds must be provided");
        }

        const files = fileIds.map((file_id) => ({ type: "file_input" as const, file_id }));
        const event: MultimodalMessageClientToOrchestratorEvent = {
            type: ClientToOrchestratorEvent.MULTIMODAL_MESSAGE,
            ...(options.text && { text: { type: ClientToOrchestratorEvent.USER_MESSAGE, text: options.text } }),
            ...(files.length && { file: files[0], files }),
        };

        this._sendEvent(event);
    }

    /**
     * Send a contextual update to the conversation.
     *
     * Contextual updates are non-interrupting content that is sent to the server
     * to update the conversation state without directly prompting the agent.
     *
     * @param text The contextual information to send to the conversation
     * @throws {RealtimeUnsupportedFeatureError} For websocket-realtime connections.
     */
    public sendContextualUpdate(text: string): void {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            throw new Error("Session not started or websocket not connected");
        }

        const event: ContextualUpdateClientToOrchestratorEvent = {
            type: ClientToOrchestratorEvent.CONTEXTUAL_UPDATE,
            text,
        };

        this._sendEvent(event);
    }

    /**
     * Get the conversation ID if available.
     *
     * @returns The conversation ID or undefined if not yet available
     */
    public getConversationId(): string | undefined {
        return this.conversationId;
    }

    /**
     * Check if the session is currently active.
     *
     * @returns True if the session is active
     */
    public isSessionActive(): boolean {
        return !!this.ws && this.ws.readyState === WebSocket.OPEN && !this.shouldStop;
    }

    private _onWebSocketOpen(): void {
        // Send conversation initiation data
        const initEvent: ConversationInitiationClientDataEvent = {
            type: ClientToOrchestratorEvent.CONVERSATION_INITIATION_CLIENT_DATA,
            custom_llm_extra_body: this.config.extraBody,
            conversation_config_override: this.config.conversationConfigOverride,
            dynamic_variables: this.config.dynamicVariables,
            environment: this.config.environment,
        };

        this.ws!.send(JSON.stringify(initEvent));
        this._startAudio();
    }

    private _startAudio(): void {
        this.inputCallback = (audio: Buffer) => {
            if (this.shouldStop || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
                return;
            }

            try {
                const wireAudio = this.realtimeAudio ? this.realtimeAudio.encodeInput(audio) : audio;
                if (wireAudio.length === 0) {
                    return;
                }
                const audioEvent: UserAudioChunkEvent = {
                    user_audio_chunk: wireAudio.toString("base64"),
                };
                this._sendEvent(audioEvent);
            } catch (error) {
                console.error("Error sending user audio chunk:", error);
                this.endSession();
            }
        };

        this.audioInterface.start(this.inputCallback);
        this.emit("session_started");
    }

    private _startRealtimeSession(config: NonNullable<Conversation["realtimeConfig"]>): Promise<void> {
        const url = `${config.origin}/v1/convai/realtime?source=js_sdk&version=${SDK_VERSION}`;
        const ws = this.webSocketFactory.create(
            url,
            { perMessageDeflate: false, maxPayload: MAX_PAYLOAD },
            realtimeSubprotocols(config.clientSecret),
        );
        this.ws = ws;
        const handshake = new RealtimeHandshake(config.options, config.textOnly);

        return new Promise((resolve, reject) => {
            let settled = false;
            let failed = false;
            const timeout = setTimeout(
                () => fail(new RealtimeConnectionError("Timed out waiting for the Realtime session to be configured.")),
                REALTIME_HANDSHAKE_TIMEOUT_MS,
            );
            const fail = (error: unknown) => {
                if (settled) return;
                settled = true;
                failed = true;
                clearTimeout(timeout);
                if (this.ws === ws) this.ws = undefined;
                ws.close();
                reject(error);
            };

            ws.on("message", (data: WebSocket.Data) => {
                if (settled) {
                    if (!failed) this._onWebSocketMessage(data);
                    return;
                }
                try {
                    const reply = handshake.handleMessage(data.toString());
                    if (reply) ws.send(JSON.stringify(reply));
                    if (handshake.session) {
                        settled = true;
                        clearTimeout(timeout);
                        this._beginRealtimeSession(handshake.session);
                        resolve();
                    }
                } catch (error) {
                    fail(error);
                }
            });

            ws.on("error", (error: Error) => {
                if (!settled) {
                    fail(error);
                    return;
                }
                if (!failed) this.emit("error", error);
            });

            ws.on("close", (code: number, reason: Buffer) => {
                if (!settled) {
                    fail(handshakeCloseError(code, reason.toString() || undefined));
                    return;
                }
                if (!failed) this._onWebSocketClose(code, reason);
            });
        });
    }

    private _beginRealtimeSession(session: RealtimeEffectiveSession): void {
        this.realtimeTranslator = new RealtimeProtocolTranslator({
            outputFormat: session.outputFormat,
            interruptOnSpeech: session.interruptOnSpeech,
            emit: (event: NativeServerEvent) => this._handleMessage(event),
            send: (event) => this.ws?.send(JSON.stringify(event)),
        });
        this.realtimeAudio = new RealtimeAudioConverter(session.inputFormat, session.outputFormat);
        this._handleMessage(initiationMetadataEvent(session));
        this._startAudio();
    }

    /** Sends a native client event, translating it for websocket-realtime connections. */
    private _sendEvent(event: RealtimeOutgoingEvent): void {
        if (this.realtimeTranslator) {
            this.realtimeTranslator.handleOutgoingEvent(event);
            return;
        }
        this.ws!.send(JSON.stringify(event));
    }

    private _onWebSocketMessage(data: WebSocket.Data): void {
        if (this.shouldStop) {
            return;
        }

        if (this.realtimeTranslator) {
            const event = parseServerEvent(data.toString());
            if (!event) {
                console.error("Error parsing WebSocket message:", data.toString());
                return;
            }
            try {
                this.realtimeTranslator.handleServerEvent(event);
            } catch (error) {
                console.error("Error handling WebSocket message:", error);
            }
            return;
        }

        try {
            const message = JSON.parse(data.toString());
            this._handleMessage(message);
        } catch (error) {
            console.error("Error parsing WebSocket message:", error);
        }
    }

    private _onWebSocketClose(code: number, reason: Buffer): void {
        this.emit("session_ended", this.conversationId, code, reason.toString());
    }

    private _handleMessage(message: any): void {
        const messageType = message.type;

        switch (messageType) {
            case "conversation_initiation_metadata":
                const event = message.conversation_initiation_metadata_event;
                if (!this.conversationId) {
                    this.conversationId = event.conversation_id;
                    this.emit("conversation_started", this.conversationId);
                }
                break;

            case "audio":
                const audioEvent = message.audio_event;
                if (parseInt(audioEvent.event_id) <= this.lastInterruptId) {
                    return;
                }
                const audio = Buffer.from(audioEvent.audio_base_64, "base64");
                this.audioInterface.output(this.realtimeAudio ? this.realtimeAudio.decodeOutput(audio) : audio);
                break;

            case "agent_response":
                if (this.callbackAgentResponse) {
                    const responseEvent = message.agent_response_event;
                    this.callbackAgentResponse(responseEvent.agent_response.trim());
                }
                break;

            case "agent_response_correction":
                if (this.callbackAgentResponseCorrection) {
                    const correctionEvent = message.agent_response_correction_event;
                    this.callbackAgentResponseCorrection(
                        correctionEvent.original_agent_response.trim(),
                        correctionEvent.corrected_agent_response.trim(),
                    );
                }
                break;

            case "user_transcript":
                if (this.callbackUserTranscript) {
                    const transcriptEvent = message.user_transcription_event;
                    this.callbackUserTranscript(transcriptEvent.user_transcript.trim());
                }
                break;

            case "interruption":
                const interruptionEvent = message.interruption_event;
                this.lastInterruptId = parseInt(interruptionEvent.event_id);
                this.audioInterface.interrupt();
                break;

            case "ping":
                const pingEvent = message.ping_event;
                const pongEvent: PongEvent = {
                    type: ClientToOrchestratorEvent.PONG,
                    event_id: pingEvent.event_id,
                };
                this.ws!.send(JSON.stringify(pongEvent));

                if (this.callbackLatencyMeasurement && pingEvent.ping_ms) {
                    this.callbackLatencyMeasurement(parseInt(pingEvent.ping_ms));
                }
                break;

            case "client_tool_call":
                const toolCall = message.client_tool_call;
                const toolName = toolCall.tool_name;
                const parameters = {
                    tool_call_id: toolCall.tool_call_id,
                    ...toolCall.parameters,
                };

                this.clientTools.executeToolAsync(toolName, parameters, (response) => {
                    if (!this.shouldStop && this.ws && this.ws.readyState === WebSocket.OPEN) {
                        this._sendEvent(response);
                    }
                });
                break;

            default:
                // Ignore unknown message types
                break;
        }

        if (this.callbackMessageReceived) {
            this.callbackMessageReceived(message);
        }
    }

    private _getWssUrl(): string {
        // Default to production environment WebSocket URL
        const baseWsUrl = "wss://api.elevenlabs.io";
        return `${baseWsUrl}/v1/convai/conversation?agent_id=${this.agentId}&source=js_sdk&version=${SDK_VERSION}`;
    }

    private async _getSignedUrl(): Promise<string> {
        const response = await this.conversationClient!.conversationalAi.conversations.getSignedUrl({
            agentId: this.agentId,
        });
        const signedUrl = response.signedUrl;
        const separator = signedUrl.includes("?") ? "&" : "?";
        return `${signedUrl}${separator}source=js_sdk&version=${SDK_VERSION}`;
    }
}

function assertRealtimeOptionsSupported(options: RealtimeConversationOptions): void {
    if (!options.clientSecret) {
        throw new Error(
            "websocket-realtime connections require a clientSecret, minted with POST /v1/convai/realtime/client_secrets.",
        );
    }
    const record = options as unknown as Record<string, unknown>;
    const unsupported = REALTIME_UNSUPPORTED_OPTIONS.filter(
        (key) =>
            record[key] !== undefined && record[key] !== null && !(key === "requiresAuth" && record[key] === false),
    );
    if (unsupported.length > 0) {
        throw new Error(
            `websocket-realtime connections do not support: ${unsupported.join(", ")}. ` +
                "The Realtime endpoint does not load a saved agent; configure the session through the realtime option instead.",
        );
    }
    validateRealtimeOptions(options.realtime ?? {});
}
