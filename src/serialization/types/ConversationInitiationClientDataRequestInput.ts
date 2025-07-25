/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";
import { ConversationConfigClientOverrideInput } from "./ConversationConfigClientOverrideInput";
import { ConversationInitiationClientDataRequestInputDynamicVariablesValue } from "./ConversationInitiationClientDataRequestInputDynamicVariablesValue";

export const ConversationInitiationClientDataRequestInput: core.serialization.ObjectSchema<
    serializers.ConversationInitiationClientDataRequestInput.Raw,
    ElevenLabs.ConversationInitiationClientDataRequestInput
> = core.serialization.object({
    conversationConfigOverride: core.serialization.property(
        "conversation_config_override",
        ConversationConfigClientOverrideInput.optional(),
    ),
    customLlmExtraBody: core.serialization.property(
        "custom_llm_extra_body",
        core.serialization.record(core.serialization.string(), core.serialization.unknown()).optional(),
    ),
    userId: core.serialization.property("user_id", core.serialization.string().optional()),
    dynamicVariables: core.serialization.property(
        "dynamic_variables",
        core.serialization
            .record(
                core.serialization.string(),
                ConversationInitiationClientDataRequestInputDynamicVariablesValue.optional(),
            )
            .optional(),
    ),
});

export declare namespace ConversationInitiationClientDataRequestInput {
    export interface Raw {
        conversation_config_override?: ConversationConfigClientOverrideInput.Raw | null;
        custom_llm_extra_body?: Record<string, unknown> | null;
        user_id?: string | null;
        dynamic_variables?: Record<
            string,
            ConversationInitiationClientDataRequestInputDynamicVariablesValue.Raw | null | undefined
        > | null;
    }
}
