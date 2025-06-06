/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";

export const EditVoiceSettingsResponseModel: core.serialization.ObjectSchema<
    serializers.EditVoiceSettingsResponseModel.Raw,
    ElevenLabs.EditVoiceSettingsResponseModel
> = core.serialization.object({
    status: core.serialization.string(),
});

export declare namespace EditVoiceSettingsResponseModel {
    export interface Raw {
        status: string;
    }
}
