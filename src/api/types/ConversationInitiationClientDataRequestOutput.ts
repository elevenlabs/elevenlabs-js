/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface ConversationInitiationClientDataRequestOutput {
    conversationConfigOverride?: ElevenLabs.ConversationConfigClientOverrideOutput;
    customLlmExtraBody?: Record<string, unknown>;
    dynamicVariables?: Record<
        string,
        ElevenLabs.ConversationInitiationClientDataRequestOutputDynamicVariablesValue | undefined
    >;
}
