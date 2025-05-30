/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";

export const LanguageAddedResponse: core.serialization.ObjectSchema<
    serializers.LanguageAddedResponse.Raw,
    ElevenLabs.LanguageAddedResponse
> = core.serialization.object({
    version: core.serialization.number(),
});

export declare namespace LanguageAddedResponse {
    export interface Raw {
        version: number;
    }
}
