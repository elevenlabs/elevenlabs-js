/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";

export const SegmentDubResponse: core.serialization.ObjectSchema<
    serializers.SegmentDubResponse.Raw,
    ElevenLabs.SegmentDubResponse
> = core.serialization.object({
    version: core.serialization.number(),
});

export declare namespace SegmentDubResponse {
    export interface Raw {
        version: number;
    }
}
