/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface ConversationInitiationClientDataConfigOutput {
    /** Overrides for the conversation configuration */
    conversationConfigOverride?: ElevenLabs.ConversationConfigClientOverrideConfigOutput;
    /** Whether to include custom LLM extra body */
    customLlmExtraBody?: boolean;
    /** Whether to enable conversation initiation client data from webhooks */
    enableConversationInitiationClientDataFromWebhook?: boolean;
}
