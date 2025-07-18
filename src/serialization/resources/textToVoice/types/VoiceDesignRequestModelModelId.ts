/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../../index";
import * as ElevenLabs from "../../../../api/index";
import * as core from "../../../../core";

export const VoiceDesignRequestModelModelId: core.serialization.Schema<
    serializers.VoiceDesignRequestModelModelId.Raw,
    ElevenLabs.VoiceDesignRequestModelModelId
> = core.serialization.enum_(["eleven_multilingual_ttv_v2", "eleven_ttv_v3"]);

export declare namespace VoiceDesignRequestModelModelId {
    export type Raw = "eleven_multilingual_ttv_v2" | "eleven_ttv_v3";
}
