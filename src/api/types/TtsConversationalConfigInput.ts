/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface TtsConversationalConfigInput {
    /** The model to use for TTS */
    modelId?: ElevenLabs.TtsConversationalModel;
    /** The voice ID to use for TTS */
    voiceId?: string;
    /** Additional supported voices for the agent */
    supportedVoices?: ElevenLabs.SupportedVoice[];
    /** The audio format to use for TTS */
    agentOutputAudioFormat?: ElevenLabs.TtsOutputFormat;
    /** The optimization for streaming latency */
    optimizeStreamingLatency?: ElevenLabs.TtsOptimizeStreamingLatency;
    /** The stability of generated speech */
    stability?: number;
    /** The speed of generated speech */
    speed?: number;
    /** The similarity boost for generated speech */
    similarityBoost?: number;
    /** The pronunciation dictionary locators */
    pronunciationDictionaryLocators?: ElevenLabs.PydanticPronunciationDictionaryVersionLocator[];
}
