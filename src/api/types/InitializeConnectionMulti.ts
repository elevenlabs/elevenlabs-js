/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

/**
 * Payload to initialize a new context in a multi-stream WebSocket connection.
 */
export interface InitializeConnectionMulti {
    /** Must be a single space character to initiate the context. */
    text: " ";
    voiceSettings?: ElevenLabs.RealtimeVoiceSettings;
    generationConfig?: ElevenLabs.GenerationConfig;
    /** Optional pronunciation dictionaries for this context. */
    pronunciationDictionaryLocators?: ElevenLabs.PronunciationDictionaryLocator[];
    /** Your ElevenLabs API key (if not in header). For this context's first message only. */
    xiApiKey?: string;
    /** Your authorization bearer token (if not in header). For this context's first message only. */
    authorization?: string;
    /** A unique identifier for the first context created in the websocket. If not provided, a default context will be used. */
    contextId?: string;
}
