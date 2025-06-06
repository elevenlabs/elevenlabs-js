/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";

export const RagDocumentIndexUsage: core.serialization.ObjectSchema<
    serializers.RagDocumentIndexUsage.Raw,
    ElevenLabs.RagDocumentIndexUsage
> = core.serialization.object({
    usedBytes: core.serialization.property("used_bytes", core.serialization.number()),
});

export declare namespace RagDocumentIndexUsage {
    export interface Raw {
        used_bytes: number;
    }
}
