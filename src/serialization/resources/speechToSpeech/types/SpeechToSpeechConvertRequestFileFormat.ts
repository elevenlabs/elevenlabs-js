/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../../index";
import * as ElevenLabs from "../../../../api/index";
import * as core from "../../../../core";

export const SpeechToSpeechConvertRequestFileFormat: core.serialization.Schema<
    serializers.SpeechToSpeechConvertRequestFileFormat.Raw,
    ElevenLabs.SpeechToSpeechConvertRequestFileFormat
> = core.serialization.enum_(["pcm_s16le_16", "other"]);

export declare namespace SpeechToSpeechConvertRequestFileFormat {
    export type Raw = "pcm_s16le_16" | "other";
}
