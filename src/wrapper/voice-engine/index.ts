import { VoiceEngineSession } from "./VoiceEngineSession";
import { VoiceEngineServer, type VoiceEngineServerOptions } from "./VoiceEngineServer";

export { VoiceEngineSession } from "./VoiceEngineSession";
export { VoiceEngineServer, type VoiceEngineServerOptions } from "./VoiceEngineServer";
export type {
    ConversationMessage,
    InitMessage,
    UserTranscriptMessage,
    PingMessage,
    CloseMessage,
    ErrorMessage,
    IncomingMessage,
    AgentResponseMessage,
    PongMessage,
    OutgoingMessage,
    TranscriptContext,
    VoiceEngineEventMap,
    VoiceEngineEventName,
    WebSocketLike,
} from "./types";

/**
 * Voice Engine namespace — provides event constants, the `Session` class for
 * wrapping individual WebSocket connections, and the `Server` class for
 * managing a `ws.WebSocketServer`.
 *
 * @example
 * ```typescript
 * import { VoiceEngine } from "@elevenlabs/elevenlabs-js";
 *
 * // Low-level: wrap a WebSocket yourself
 * const session = new VoiceEngine.Session(ws);
 * session.on(VoiceEngine.USER_TRANSCRIPT, async (text, { signal }) => {
 *     const response = await llm.generate(text, { signal });
 *     session.sendResponse(response);
 * });
 *
 * // High-level: let VoiceEngine.Server manage the WS server
 * const server = new VoiceEngine.Server({
 *     httpServer,
 *     path: "/voice-engine",
 *     onSession: (session) => {
 *         session.on(VoiceEngine.USER_TRANSCRIPT, async (text, { signal }) => {
 *             const response = await llm.generate(text, { signal });
 *             session.sendResponse(response);
 *         });
 *     },
 * });
 * server.start();
 * ```
 */
export namespace VoiceEngine {
    // -- Event name constants (use these with session.on) -------------------

    /** Fired when the session is initialized with a conversation ID. */
    export const INIT = "init" as const;

    /** Fired when the Voice Engine API sends a user transcript. */
    export const USER_TRANSCRIPT = "user_transcript" as const;

    /** Fired when the user disconnects the call. */
    export const CLOSE = "close" as const;

    /** Fired when an error occurs (protocol or WebSocket level). */
    export const ERROR = "error" as const;

    /** Fired when the underlying WebSocket connection drops. */
    export const DISCONNECTED = "disconnected" as const;

    // -- Re-exported classes ------------------------------------------------

    export const Session: typeof VoiceEngineSession = VoiceEngineSession;
    export type Session = VoiceEngineSession;

    export const Server: typeof VoiceEngineServer = VoiceEngineServer;
    export type Server = VoiceEngineServer;
    export type ServerOptions = VoiceEngineServerOptions;
}
