/**
 * Speech Engine namespace — provides event constants and classes for handling
 * incoming WebSocket connections from the ElevenLabs Speech Engine API.
 *
 * @example
 * ```typescript
 * import { SpeechEngine } from "@elevenlabs/elevenlabs-js";
 *
 * const session = new SpeechEngine.Session(ws);
 * session.on(SpeechEngine.USER_TRANSCRIPT, async (transcript, signal) => { ... });
 * ```
 */

// -- Event name constants (use these with session.on) -------------------------

/** Fired when the session is initialized with a conversation ID. */
export const INIT = "init" as const;

/** Fired when the Speech Engine API sends a user transcript. */
export const USER_TRANSCRIPT = "user_transcript" as const;

/** Fired when the user disconnects the call. */
export const CLOSE = "close" as const;

/** Fired when an error occurs (protocol or WebSocket level). */
export const ERROR = "error" as const;

/** Fired when the underlying WebSocket connection drops. */
export const DISCONNECTED = "disconnected" as const;

// -- Re-exported classes ------------------------------------------------------

export { SpeechEngineSession as Session } from "./SpeechEngineSession";
export { SpeechEngineServer as Server, type SpeechEngineServerOptions as ServerOptions } from "./SpeechEngineServer";
export { SpeechEngineAttachment as Attachment } from "./SpeechEngineAttachment";
export { SpeechEngineResource as Resource } from "./SpeechEngineResource";
export { SpeechEngineClientWrapper as Client } from "./SpeechEngineClientWrapper";
