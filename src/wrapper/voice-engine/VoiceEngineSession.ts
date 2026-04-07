import { EventEmitter } from "node:events";
import WebSocket from "ws";
import type {
    IncomingMessage,
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
    private _conversationId: string | undefined;
    private closed = false;
    private log: (...args: unknown[]) => void;

    constructor(ws: WebSocketLike, options?: { debug?: boolean }) {
        this.ws = ws;
        this.log = options?.debug ? (...args: unknown[]) => console.log("[VoiceEngine]", ...args) : () => {};
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
     * Accepts a complete string, an `AsyncIterable<string>` for streaming
     * token-by-token responses, or an LLM stream that yields event objects
     * (e.g. an OpenAI Responses API stream). Event objects are automatically
     * parsed to extract text deltas.
     */
    sendResponse(response: string | AsyncIterable<unknown>): void {
        if (typeof response === "string") {
            this.log(`sending string response (${response.length} chars), event_id=${this.currentEventId}`);
            this.sendAgentResponse(response, false);
            this.sendAgentResponse("", true);
        } else {
            this.log(`starting streamed response, event_id=${this.currentEventId}`);
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
    get conversationId(): string | undefined {
        return this._conversationId;
    }

    /**
     * Whether the session is still open.
     */
    get isOpen(): boolean {
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
                this._conversationId = msg.conversation_id;
                this.log(`session initialized, conversation_id=${msg.conversation_id}`);
                this.emitter.emit("init", msg.conversation_id);
                break;
            }

            case "user_transcript": {
                // Abort any in-flight LLM call from the previous transcript
                const wasActive = this.currentAbortController !== null;
                this.abortCurrent();
                if (wasActive) {
                    this.log(`interrupted: aborting previous response (event_id=${this.currentEventId}) for new transcript (event_id=${msg.event_id})`);
                }
                this.currentAbortController = new AbortController();
                this.currentEventId = msg.event_id;
                this.log(`received transcript, event_id=${msg.event_id}, messages=${msg.user_transcript.length}`);

                this.emitter.emit("user_transcript", msg.user_transcript, this.currentAbortController.signal);
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

    private async streamResponse(stream: AsyncIterable<unknown>): Promise<void> {
        const eventId = this.currentEventId;
        let chunks = 0;
        for await (const chunk of stream) {
            if (this.closed) {
                this.log(`stream stopped: session closed after ${chunks} chunks, event_id=${eventId}`);
                return;
            }
            const text = this.extractText(chunk);
            if (text) {
                chunks++;
                this.sendAgentResponse(text, false, eventId);
            }
        }
        if (!this.closed) {
            this.log(`stream complete: ${chunks} chunks sent, event_id=${eventId}`);
            this.sendAgentResponse("", true, eventId);
        }
    }

    /**
     * Extract text content from a stream chunk. Handles plain strings and
     * common LLM stream event formats:
     *
     * - OpenAI Responses API (`response.output_text.delta`)
     * - OpenAI Chat Completions API (`choices[0].delta.content`)
     * - Anthropic Messages API (`content_block_delta` with `text_delta`)
     * - Google Gemini API (`candidates[0].content.parts[0].text`)
     */
    private extractText(chunk: unknown): string | null {
        if (typeof chunk === "string") return chunk;
        if (typeof chunk !== "object" || chunk === null) return null;

        const event = chunk as Record<string, unknown>;

        // OpenAI Responses API: { type: "response.output_text.delta", delta: "text" }
        if (event.type === "response.output_text.delta" && typeof event.delta === "string") {
            return event.delta;
        }

        // OpenAI Chat Completions API: { choices: [{ delta: { content: "text" } }] }
        if (Array.isArray(event.choices)) {
            const content = (event.choices[0] as Record<string, unknown>)?.delta;
            if (typeof content === "object" && content !== null && typeof (content as Record<string, unknown>).content === "string") {
                return (content as Record<string, unknown>).content as string;
            }
        }

        // Anthropic Messages API: { type: "content_block_delta", delta: { type: "text_delta", text: "text" } }
        if (event.type === "content_block_delta" && typeof event.delta === "object" && event.delta !== null) {
            const delta = event.delta as Record<string, unknown>;
            if (delta.type === "text_delta" && typeof delta.text === "string") {
                return delta.text;
            }
        }

        // Google Gemini API: { candidates: [{ content: { parts: [{ text: "text" }] } }] }
        if (Array.isArray(event.candidates)) {
            const content = (event.candidates[0] as Record<string, unknown>)?.content;
            if (typeof content === "object" && content !== null) {
                const parts = (content as Record<string, unknown>).parts;
                if (Array.isArray(parts) && typeof (parts[0] as Record<string, unknown>)?.text === "string") {
                    return (parts[0] as Record<string, unknown>).text as string;
                }
            }
        }

        return null;
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
