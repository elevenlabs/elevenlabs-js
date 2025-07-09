import { EventEmitter } from "events";
import WebSocket from "ws";
import { ElevenLabsClient } from "../../../../Client";
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
} from "./events";
import { WebSocketFactory, WebSocketInterface, DefaultWebSocketFactory } from "./interfaces/WebSocketInterface";
import { ConversationClient } from "./interfaces/ConversationClient";

/**
 * Conversational AI session for Node.js.
 *
 * BETA: This API is subject to change without regard to backwards compatibility.
 */
export class Conversation extends EventEmitter {
    private client: ElevenLabsClient;
    private agentId: string;
    private requiresAuth: boolean;
    private audioInterface: AudioInterface;
    private clientTools: ClientTools;
    private config: ConversationInitiationData;
    private webSocketFactory: WebSocketFactory;
    private conversationClient: ConversationClient;

    // Callback functions
    private callbackAgentResponse?: (response: string) => void;
    private callbackAgentResponseCorrection?: (original: string, corrected: string) => void;
    private callbackUserTranscript?: (transcript: string) => void;
    private callbackLatencyMeasurement?: (latencyMs: number) => void;

    // Internal state
    private ws?: WebSocketInterface;
    private shouldStop: boolean = false;
    private conversationId?: string;
    private lastInterruptId: number = 0;
    private inputCallback?: (audio: Buffer) => void;

    constructor(options: {
        client?: ElevenLabsClient;
        conversationClient?: ConversationClient;
        webSocketFactory?: WebSocketFactory;
        agentId: string;
        requiresAuth: boolean;
        audioInterface: AudioInterface;
        config?: ConversationInitiationData;
        clientTools?: ClientTools;
        callbackAgentResponse?: (response: string) => void;
        callbackAgentResponseCorrection?: (original: string, corrected: string) => void;
        callbackUserTranscript?: (transcript: string) => void;
        callbackLatencyMeasurement?: (latencyMs: number) => void;
    }) {
        super();

        this.client = options.client || new ElevenLabsClient();
        this.agentId = options.agentId;
        this.requiresAuth = options.requiresAuth;
        this.audioInterface = options.audioInterface;
        this.clientTools = options.clientTools || new ClientTools();
        this.config = options.config || { extraBody: {}, conversationConfigOverride: {}, dynamicVariables: {} };
        this.conversationClient = options.conversationClient || this.client;
        this.webSocketFactory = options.webSocketFactory || new DefaultWebSocketFactory();

        this.callbackAgentResponse = options.callbackAgentResponse;
        this.callbackAgentResponseCorrection = options.callbackAgentResponseCorrection;
        this.callbackUserTranscript = options.callbackUserTranscript;
        this.callbackLatencyMeasurement = options.callbackLatencyMeasurement;
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

        this.ws.send(JSON.stringify(event));
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

        this.ws.send(JSON.stringify(event));
    }

    /**
     * Send a contextual update to the conversation.
     *
     * Contextual updates are non-interrupting content that is sent to the server
     * to update the conversation state without directly prompting the agent.
     *
     * @param content The contextual information to send to the conversation
     */
    public sendContextualUpdate(content: string): void {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            throw new Error("Session not started or websocket not connected");
        }

        const event: ContextualUpdateClientToOrchestratorEvent = {
            type: ClientToOrchestratorEvent.CONTEXTUAL_UPDATE,
            content,
        };

        this.ws.send(JSON.stringify(event));
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
        };

        this.ws!.send(JSON.stringify(initEvent));

        // Set up audio input callback
        this.inputCallback = (audio: Buffer) => {
            if (this.shouldStop || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
                return;
            }

            try {
                const audioEvent: UserAudioChunkEvent = {
                    user_audio_chunk: audio.toString("base64"),
                };
                this.ws!.send(JSON.stringify(audioEvent));
            } catch (error) {
                console.error("Error sending user audio chunk:", error);
                this.endSession();
            }
        };

        // Start audio interface
        this.audioInterface.start(this.inputCallback);
        this.emit("session_started");
    }

    private _onWebSocketMessage(data: WebSocket.Data): void {
        if (this.shouldStop) {
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
                this.audioInterface.output(audio);
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
                        correctionEvent.corrected_agent_response.trim()
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
                        this.ws.send(JSON.stringify(response));
                    }
                });
                break;

            default:
                // Ignore unknown message types
                break;
        }
    }

    private _getWssUrl(): string {
        // Default to production environment WebSocket URL
        const baseWsUrl = "wss://api.elevenlabs.io";
        return `${baseWsUrl}/v1/convai/conversation?agent_id=${this.agentId}`;
    }

    private async _getSignedUrl(): Promise<string> {
        const response = await this.conversationClient.conversationalAi.conversations.getSignedUrl({
            agentId: this.agentId,
        });
        return response.signedUrl;
    }
}