/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface ConversationConfigClientOverrideConfigOutput {
    /** Overrides for the agent configuration */
    agent?: ElevenLabs.AgentConfigOverrideConfig;
    /** Overrides for the TTS configuration */
    tts?: ElevenLabs.TtsConversationalConfigOverrideConfig;
}
