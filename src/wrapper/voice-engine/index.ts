import { VoiceEngineSession } from "./VoiceEngineSession";
import { VoiceEngineServer, type VoiceEngineServerOptions } from "./VoiceEngineServer";
import { VoiceEngineResource } from "./VoiceEngineResource";
import { VoiceEngineAttachment } from "./VoiceEngineAttachment";
import { VoiceEngineClientWrapper } from "./VoiceEngineClientWrapper";

export { VoiceEngineSession } from "./VoiceEngineSession";
export { VoiceEngineServer, type VoiceEngineServerOptions } from "./VoiceEngineServer";
export { VoiceEngineResource } from "./VoiceEngineResource";
export { VoiceEngineAttachment } from "./VoiceEngineAttachment";
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
    VoiceEngineEventMap,
    VoiceEngineEventName,
    VoiceEngineHandler,
    WebSocketLike,
} from "./types";

/**
 * Voice Engine namespace — provides event constants and classes for handling
 * incoming WebSocket connections from the ElevenLabs Voice Engine API.
 *
 * For managing voice engine resources and attaching to an HTTP server, use
 * `elevenlabs.voiceEngine` instead.
 *
 * @example
 * ```typescript
 * import { ElevenLabsClient, VoiceEngine } from "@elevenlabs/elevenlabs-js";
 *
 * const elevenlabs = new ElevenLabsClient();
 * const engine = await elevenlabs.voiceEngine.get("veng_123");
 *
 * // Recommended: attach to an existing HTTP server
 * engine.attach(httpServer, "/api/voice-engine/ws", {
 *     async onTranscript(transcript, signal, session) {
 *         session.sendResponse(await llm.generate(transcript, { signal }));
 *     },
 * });
 *
 * // Low-level escape hatch: manage the WebSocket server yourself
 * const wss = new WebSocket.Server({ noServer: true });
 * httpServer.on("upgrade", async (req, socket, head) => {
 *     if (!await engine.verifyRequest(req)) { socket.destroy(); return; }
 *     wss.handleUpgrade(req, socket, head, (ws) => wss.emit("connection", ws));
 * });
 * wss.on("connection", (ws) => {
 *     const session = engine.createSession(ws);
 *     session.on(VoiceEngine.USER_TRANSCRIPT, ...);
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

    /** Standalone WebSocket server. Use `engine.attach()` for HTTP server integration. */
    export const Server: typeof VoiceEngineServer = VoiceEngineServer;
    export type Server = VoiceEngineServer;
    export type ServerOptions = VoiceEngineServerOptions;

    export const Attachment: typeof VoiceEngineAttachment = VoiceEngineAttachment;
    export type Attachment = VoiceEngineAttachment;

    export const Resource: typeof VoiceEngineResource = VoiceEngineResource;
    export type Resource = VoiceEngineResource;

    export const Client: typeof VoiceEngineClientWrapper = VoiceEngineClientWrapper;
    export type Client = VoiceEngineClientWrapper;
}
