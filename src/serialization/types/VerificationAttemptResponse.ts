/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";
import { RecordingResponse } from "./RecordingResponse";

export const VerificationAttemptResponse: core.serialization.ObjectSchema<
    serializers.VerificationAttemptResponse.Raw,
    ElevenLabs.VerificationAttemptResponse
> = core.serialization.object({
    text: core.serialization.string(),
    dateUnix: core.serialization.property("date_unix", core.serialization.number()),
    accepted: core.serialization.boolean(),
    similarity: core.serialization.number(),
    levenshteinDistance: core.serialization.property("levenshtein_distance", core.serialization.number()),
    recording: RecordingResponse.optional(),
});

export declare namespace VerificationAttemptResponse {
    export interface Raw {
        text: string;
        date_unix: number;
        accepted: boolean;
        similarity: number;
        levenshtein_distance: number;
        recording?: RecordingResponse.Raw | null;
    }
}
