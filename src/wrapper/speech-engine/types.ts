import type WebSocket from "ws";
import type { SpeechEngineSession } from "./SpeechEngineSession";

// ---------------------------------------------------------------------------
// Incoming messages (ElevenLabs API → developer server)
// ---------------------------------------------------------------------------

export interface InitMessage {
    type: "init";
    conversation_id: string;
}

export interface TranscriptMessage {
    role: "user" | "agent";
    content: string;
}

export interface UserTranscriptMessage {
    type: "user_transcript";
    user_transcript: TranscriptMessage[];
    event_id: number;
}

export interface PingMessage {
    type: "ping";
}

export interface CloseMessage {
    type: "close";
}

export interface ErrorMessage {
    type: "error";
    message: string;
}

export type IncomingMessage = InitMessage | UserTranscriptMessage | PingMessage | CloseMessage | ErrorMessage;

// ---------------------------------------------------------------------------
// Outgoing messages (developer server → ElevenLabs API)
// ---------------------------------------------------------------------------

export interface AgentResponseMessage {
    type: "agent_response";
    content: string;
    event_id: number | undefined;
    is_final: boolean;
}

export interface PongMessage {
    type: "pong";
}

export type OutgoingMessage = AgentResponseMessage | PongMessage;

// ---------------------------------------------------------------------------
// Event map for SpeechEngineSession
// ---------------------------------------------------------------------------

export interface SpeechEngineEventMap {
    user_transcript: [transcript: TranscriptMessage[], signal: AbortSignal];
    init: [conversationId: string];
    close: [];
    error: [error: Error];
    disconnected: [];
}

export type SpeechEngineEventName = keyof SpeechEngineEventMap;

// ---------------------------------------------------------------------------
// Handler interface (options-object pattern for attach / Server)
// ---------------------------------------------------------------------------

export interface SpeechEngineCallbacks {
    /** Enable debug logging. */
    debug?: boolean;

    /** Fired once when the session is initialized with a conversation ID. */
    onInit?(conversationId: string, session: SpeechEngineSession): void;

    /** Fired each time the Speech Engine API sends a user transcript. */
    onTranscript?(transcript: TranscriptMessage[], signal: AbortSignal, session: SpeechEngineSession): void;

    /** Fired when ElevenLabs sends a clean close message ending the conversation. */
    onClose?(session: SpeechEngineSession): void;

    /** Fired when the underlying WebSocket drops unexpectedly. */
    onDisconnect?(session: SpeechEngineSession): void;

    /** Fired on protocol-level or WebSocket-level errors. */
    onError?(error: Error, session: SpeechEngineSession): void;
}

// ---------------------------------------------------------------------------
// WebSocket-like interface (for testability)
// ---------------------------------------------------------------------------

export interface WebSocketLike {
    on(event: "message", listener: (data: WebSocket.Data) => void): void;
    on(event: "close", listener: (code: number, reason: Buffer) => void): void;
    on(event: "error", listener: (err: Error) => void): void;
    send(data: string): void;
    close(): void;
    readyState: number;
}
