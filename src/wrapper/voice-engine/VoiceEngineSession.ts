import { EventEmitter } from "node:events";
import WebSocket from "ws";
import type {
    IncomingMessage,
    TranscriptContext,
    VoiceEngineEventMap,
    VoiceEngineEventName,
    WebSocketLike,
} from "./types";

/**
 * Wraps a WebSocket connection from the ElevenLabs Voice Engine API into a
 * typed, event-driven session.
 *
 * The ElevenLabs API connects to the developer's server via WebSocket. Each
 * connection represents one conversation. The session emits events for
 * transcripts and lifecycle changes, and provides methods to send LLM
 * responses back. When a new transcript arrives, the previous transcript's
 * abort signal is fired automatically, cancelling any in-flight LLM call.
 *
 * @example
 * ```typescript
 * import { VoiceEngine } from "@elevenlabs/elevenlabs-js";
 *
 * wss.on("connection", (ws) => {
 *     const session = new VoiceEngine.Session(ws);
 *
 *     session.on(VoiceEngine.USER_TRANSCRIPT, async (transcript, { signal }) => {
 *         const response = await llm.generate(transcript, { signal });
 *         session.sendResponse(response);
 *     });
 * });
 * ```
 */
export class VoiceEngineSession {
    private ws: WebSocketLike;
    private emitter = new EventEmitter();
    private currentAbortController: AbortController | null = null;
    private currentEventId: number | undefined;
    private conversationId: string | undefined;
    private closed = false;

    constructor(ws: WebSocketLike) {
        this.ws = ws;
        this.setupWebSocket();
    }

    // -----------------------------------------------------------------------
    // Event emitter interface
    // -----------------------------------------------------------------------

    on<E extends VoiceEngineEventName>(
        event: E,
        listener: (...args: VoiceEngineEventMap[E]) => void,
    ): this {
        this.emitter.on(event, listener as (...args: any[]) => void);
        return this;
    }

    off<E extends VoiceEngineEventName>(
        event: E,
        listener: (...args: VoiceEngineEventMap[E]) => void,
    ): this {
        this.emitter.off(event, listener as (...args: any[]) => void);
        return this;
    }

    once<E extends VoiceEngineEventName>(
        event: E,
        listener: (...args: VoiceEngineEventMap[E]) => void,
    ): this {
        this.emitter.once(event, listener as (...args: any[]) => void);
        return this;
    }

    // -----------------------------------------------------------------------
    // Sending responses
    // -----------------------------------------------------------------------

    /**
     * Send an LLM response back to the Voice Engine API for TTS synthesis.
     *
     * Accepts either a complete string or an `AsyncIterable<string>` for
     * streaming token-by-token responses.
     */
    sendResponse(response: string | AsyncIterable<string>): void {
        if (typeof response === "string") {
            this.sendAgentResponse(response, false);
            this.sendAgentResponse("", true);
        } else {
            void this.streamResponse(response);
        }
    }

    /**
     * Close the session and the underlying WebSocket connection.
     */
    close(): void {
        if (this.closed) return;
        this.closed = true;
        this.abortCurrent();
        this.ws.close();
    }

    /**
     * The conversation ID assigned by the Voice Engine API, available after
     * the `init` event.
     */
    getConversationId(): string | undefined {
        return this.conversationId;
    }

    /**
     * Whether the session is still open.
     */
    isOpen(): boolean {
        return !this.closed && this.ws.readyState === WebSocket.OPEN;
    }

    // -----------------------------------------------------------------------
    // Internals
    // -----------------------------------------------------------------------

    private setupWebSocket(): void {
        this.ws.on("message", (data: WebSocket.Data) => {
            try {
                const msg = JSON.parse(data.toString()) as IncomingMessage;
                this.handleMessage(msg);
            } catch (err) {
                this.emitter.emit(
                    "error",
                    err instanceof Error ? err : new Error(String(err)),
                );
            }
        });

        this.ws.on("close", () => {
            this.closed = true;
            this.abortCurrent();
            this.emitter.emit("disconnected");
        });

        this.ws.on("error", (err: Error) => {
            this.emitter.emit("error", err);
        });
    }

    private handleMessage(msg: IncomingMessage): void {
        switch (msg.type) {
            case "init": {
                this.conversationId = msg.conversation_id;
                this.emitter.emit("init", msg.conversation_id);
                break;
            }

            case "user_transcript": {
                // Abort any in-flight LLM call from the previous transcript
                this.abortCurrent();
                this.currentAbortController = new AbortController();
                this.currentEventId = msg.event_id;

                const context: TranscriptContext = {
                    signal: this.currentAbortController.signal,
                };
                this.emitter.emit("user_transcript", msg.user_transcript, context);
                break;
            }

            case "ping": {
                this.send({ type: "pong" });
                break;
            }

            case "close": {
                this.abortCurrent();
                this.emitter.emit("close");
                break;
            }

            case "error": {
                this.emitter.emit("error", new Error(msg.message));
                break;
            }

            default: {
                // Unknown message types are silently ignored so the SDK
                // stays forward-compatible as the protocol evolves.
                break;
            }
        }
    }

    private async streamResponse(stream: AsyncIterable<string>): Promise<void> {
        const eventId = this.currentEventId;
        for await (const chunk of stream) {
            if (this.closed) return;
            this.sendAgentResponse(chunk, false, eventId);
        }
        if (!this.closed) {
            this.sendAgentResponse("", true, eventId);
        }
    }

    private sendAgentResponse(content: string, isFinal: boolean, eventId?: number): void {
        this.send({ type: "agent_response", content, event_id: eventId ?? this.currentEventId, is_final: isFinal });
    }

    private send(msg: Record<string, unknown>): void {
        if (this.closed) return;
        this.ws.send(JSON.stringify(msg));
    }

    private abortCurrent(): void {
        if (this.currentAbortController) {
            this.currentAbortController.abort();
            this.currentAbortController = null;
        }
    }
}
