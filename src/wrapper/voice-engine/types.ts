import type WebSocket from "ws";
import type { VoiceEngineSession } from "./VoiceEngineSession";

// ---------------------------------------------------------------------------
// Incoming messages (ElevenLabs API → developer server)
// ---------------------------------------------------------------------------

export interface InitMessage {
    type: "init";
    conversation_id: string;
}

export interface ConversationMessage {
    role: "user" | "agent";
    content: string;
}

export interface UserTranscriptMessage {
    type: "user_transcript";
    user_transcript: ConversationMessage[];
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
// Event map for VoiceEngineSession
// ---------------------------------------------------------------------------

export interface VoiceEngineEventMap {
    user_transcript: [transcript: ConversationMessage[], signal: AbortSignal];
    init: [conversationId: string];
    close: [];
    error: [error: Error];
    disconnected: [];
}

export type VoiceEngineEventName = keyof VoiceEngineEventMap;

// ---------------------------------------------------------------------------
// Handler interface (options-object pattern for attach / Server)
// ---------------------------------------------------------------------------

export interface VoiceEngineHandler {
    /** Enable debug logging. */
    debug?: boolean;

    /** Fired once when the session is initialized with a conversation ID. */
    onInit?(conversationId: string, session: VoiceEngineSession): void;

    /** Fired each time the Voice Engine API sends a user transcript. */
    onTranscript?(transcript: ConversationMessage[], signal: AbortSignal, session: VoiceEngineSession): void;

    /** Fired when ElevenLabs sends a clean close message ending the conversation. */
    onClose?(session: VoiceEngineSession): void;

    /** Fired when the underlying WebSocket drops unexpectedly. */
    onDisconnect?(session: VoiceEngineSession): void;

    /** Fired on protocol-level or WebSocket-level errors. */
    onError?(error: Error, session: VoiceEngineSession): void;
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
