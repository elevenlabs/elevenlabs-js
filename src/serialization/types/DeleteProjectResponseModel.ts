/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";

export const DeleteProjectResponseModel: core.serialization.ObjectSchema<
    serializers.DeleteProjectResponseModel.Raw,
    ElevenLabs.DeleteProjectResponseModel
> = core.serialization.object({
    status: core.serialization.string(),
});

export declare namespace DeleteProjectResponseModel {
    export interface Raw {
        status: string;
    }
}
