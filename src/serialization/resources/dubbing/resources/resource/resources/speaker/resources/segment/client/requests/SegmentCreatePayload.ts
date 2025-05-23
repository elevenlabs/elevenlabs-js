/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../../../../../../../../../index";
import * as ElevenLabs from "../../../../../../../../../../../api/index";
import * as core from "../../../../../../../../../../../core";

export const SegmentCreatePayload: core.serialization.Schema<
    serializers.dubbing.resource.speaker.SegmentCreatePayload.Raw,
    ElevenLabs.dubbing.resource.speaker.SegmentCreatePayload
> = core.serialization.object({
    startTime: core.serialization.property("start_time", core.serialization.number()),
    endTime: core.serialization.property("end_time", core.serialization.number()),
    text: core.serialization.string().optional(),
    translations: core.serialization
        .record(core.serialization.string(), core.serialization.string().optional())
        .optional(),
});

export declare namespace SegmentCreatePayload {
    export interface Raw {
        start_time: number;
        end_time: number;
        text?: string | null;
        translations?: Record<string, string | null | undefined> | null;
    }
}
