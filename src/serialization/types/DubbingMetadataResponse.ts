/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";
import { DubbingMediaMetadata } from "./DubbingMediaMetadata";

export const DubbingMetadataResponse: core.serialization.ObjectSchema<
    serializers.DubbingMetadataResponse.Raw,
    ElevenLabs.DubbingMetadataResponse
> = core.serialization.object({
    dubbingId: core.serialization.property("dubbing_id", core.serialization.string()),
    name: core.serialization.string(),
    status: core.serialization.string(),
    targetLanguages: core.serialization.property(
        "target_languages",
        core.serialization.list(core.serialization.string()),
    ),
    mediaMetadata: core.serialization.property("media_metadata", DubbingMediaMetadata.optional()),
    error: core.serialization.string().optional(),
});

export declare namespace DubbingMetadataResponse {
    export interface Raw {
        dubbing_id: string;
        name: string;
        status: string;
        target_languages: string[];
        media_metadata?: DubbingMediaMetadata.Raw | null;
        error?: string | null;
    }
}
