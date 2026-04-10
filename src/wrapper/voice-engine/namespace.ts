/**
 * Voice Engine namespace — provides event constants and classes for handling
 * incoming WebSocket connections from the ElevenLabs Voice Engine API.
 *
 * @example
 * ```typescript
 * import { VoiceEngine } from "@elevenlabs/elevenlabs-js";
 *
 * const session = new VoiceEngine.Session(ws);
 * session.on(VoiceEngine.USER_TRANSCRIPT, async (transcript, signal) => { ... });
 * ```
 */

// -- Event name constants (use these with session.on) -------------------------

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

// -- Re-exported classes ------------------------------------------------------

export { VoiceEngineSession as Session } from "./VoiceEngineSession";
export { VoiceEngineServer as Server, type VoiceEngineServerOptions as ServerOptions } from "./VoiceEngineServer";
export { VoiceEngineAttachment as Attachment } from "./VoiceEngineAttachment";
export { VoiceEngineResource as Resource } from "./VoiceEngineResource";
export { VoiceEngineClientWrapper as Client } from "./VoiceEngineClientWrapper";
