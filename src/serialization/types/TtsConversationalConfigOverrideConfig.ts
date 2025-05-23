/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";

export const TtsConversationalConfigOverrideConfig: core.serialization.ObjectSchema<
    serializers.TtsConversationalConfigOverrideConfig.Raw,
    ElevenLabs.TtsConversationalConfigOverrideConfig
> = core.serialization.object({
    voiceId: core.serialization.property("voice_id", core.serialization.boolean().optional()),
});

export declare namespace TtsConversationalConfigOverrideConfig {
    export interface Raw {
        voice_id?: boolean | null;
    }
}
