/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";
import { ChapterResponse } from "./ChapterResponse";

export const GetChaptersResponse: core.serialization.ObjectSchema<
    serializers.GetChaptersResponse.Raw,
    ElevenLabs.GetChaptersResponse
> = core.serialization.object({
    chapters: core.serialization.list(ChapterResponse),
});

export declare namespace GetChaptersResponse {
    export interface Raw {
        chapters: ChapterResponse.Raw[];
    }
}
