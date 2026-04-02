import type WebSocket from "ws";

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

export interface TranscriptContext {
    /** Aborted when a new transcript arrives or the session closes. */
    signal: AbortSignal;
}

export interface VoiceEngineEventMap {
    user_transcript: [transcript: ConversationMessage[], context: TranscriptContext];
    init: [conversationId: string];
    close: [];
    error: [error: Error];
    disconnected: [];
}

export type VoiceEngineEventName = keyof VoiceEngineEventMap;

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
