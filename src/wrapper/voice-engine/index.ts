import { VoiceEngineSession } from "./VoiceEngineSession";
import { VoiceEngineServer, type VoiceEngineServerOptions } from "./VoiceEngineServer";
import { VoiceEngineResource } from "./VoiceEngineResource";
import { VoiceEngineClientWrapper } from "./VoiceEngineClientWrapper";

export { VoiceEngineSession } from "./VoiceEngineSession";
export { VoiceEngineServer, type VoiceEngineServerOptions } from "./VoiceEngineServer";
export { VoiceEngineResource } from "./VoiceEngineResource";
export { VoiceEngineClientWrapper } from "./VoiceEngineClientWrapper";
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
 * Voice Engine namespace — provides event constants and classes for handling
 * incoming WebSocket connections from the ElevenLabs Voice Engine API.
 *
 * For managing voice engine resources (create, get, etc.) and starting a
 * server bound to a specific engine, use `elevenlabs.voiceEngine` instead.
 *
 * @example
 * ```typescript
 * import { ElevenLabs } from "@elevenlabs/elevenlabs-js";
 *
 * // Recommended: start a server tied to a specific voice engine
 * const engine = await elevenlabs.voiceEngine.get("veng_123");
 * const server = engine.listen({
 *     httpServer,
 *     path: "/voice-engine",
 *     onSession: (session) => {
 *         session.on(VoiceEngine.USER_TRANSCRIPT, async (transcript, { signal }) => {
 *             const response = await llm.generate(transcript, { signal });
 *             session.sendResponse(response);
 *         });
 *     },
 * });
 * server.start();
 *
 * // Low-level: wrap a WebSocket yourself
 * const session = new VoiceEngine.Session(ws);
 * session.on(VoiceEngine.USER_TRANSCRIPT, async (transcript, { signal }) => {
 *     const response = await llm.generate(transcript, { signal });
 *     session.sendResponse(response);
 * });
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

    export const Resource: typeof VoiceEngineResource = VoiceEngineResource;
    export type Resource = VoiceEngineResource;

    export const Client: typeof VoiceEngineClientWrapper = VoiceEngineClientWrapper;
    export type Client = VoiceEngineClientWrapper;
}
