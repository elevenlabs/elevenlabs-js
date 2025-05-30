/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

/**
 * Message sent from the client to the multi-context TTS WebSocket.
 */
export interface WebsocketTtsClientMessageMulti {
    /**
     * Text to be synthesized.
     * For the first message establishing a new context (identified by `context_id`, or a default context if `context_id` is absent), this should be a single space character (' ').
     * For subsequent messages to an active context, this is the text to synthesize.
     * This field can be null or an empty string if the message is primarily for control (e.g., using `flush`, `close_context`, or `close_socket`).
     */
    text?: string;
    /** Voice settings. Can only be provided in the first message for a given context_id (or first message overall if context_id is not used/default). */
    voiceSettings?: ElevenLabs.RealtimeVoiceSettings;
    /** Generation config. Can only be provided in the first message for a given context_id (or first message overall if context_id is not used/default). */
    generationConfig?: ElevenLabs.GenerationConfig;
    /** Your ElevenLabs API key. Can only be provided in the first message for a given context_id if not present in the header. */
    xiApiKey?: string;
    /** Your authorization bearer token. Can only be provided in the first message for a given context_id if not present in the header. */
    authorization?: string;
    /** If true, flushes the audio buffer and returns the remaining audio for the specified `context_id`. */
    flush?: boolean;
    /** Optional list of pronunciation dictionary locators. Can only be provided in the first message for a given context_id. */
    pronunciationDictionaryLocators?: ElevenLabs.PronunciationDictionaryLocator[];
    /** An identifier for the text-to-speech context. Allows managing multiple independent audio generation streams over a single WebSocket connection. If omitted, a default context is used. */
    contextId?: string;
    /** If true, closes the specified `contextId`. No further audio will be generated for this context. The `text` field is ignored. */
    closeContext?: boolean;
    /** If true, flushes all contexts and closes the entire WebSocket connection. The `text` and `contextId` fields are ignored. */
    closeSocket?: boolean;
}
