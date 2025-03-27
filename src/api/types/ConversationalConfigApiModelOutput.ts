/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface ConversationalConfigApiModelOutput {
    /** Configuration for conversational transcription */
    asr?: ElevenLabs.AsrConversationalConfig;
    /** Configuration for turn detection */
    turn?: ElevenLabs.TurnConfig;
    /** Configuration for conversational text to speech */
    tts?: ElevenLabs.TtsConversationalConfig;
    /** Configuration for conversational events */
    conversation?: ElevenLabs.ConversationConfig;
    /** Language presets for conversations */
    language_presets?: Record<string, ElevenLabs.LanguagePresetOutput>;
    /** Agent specific configuration */
    agent?: ElevenLabs.AgentConfigApiModelOutput;
}
