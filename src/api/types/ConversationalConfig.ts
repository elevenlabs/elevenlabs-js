/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface ConversationalConfig {
    agent?: ElevenLabs.AgentConfig;
    asr?: ElevenLabs.AsrConversationalConfig;
    turn?: ElevenLabs.TurnConfig;
    tts?: ElevenLabs.TtsConversationalConfig;
    conversation?: ElevenLabs.ConversationConfig;
}