/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";
import { DubbingMediaReference } from "./DubbingMediaReference";
import { SpeakerTrack } from "./SpeakerTrack";
import { SpeakerSegment } from "./SpeakerSegment";
import { Render } from "./Render";

export const DubbingResource: core.serialization.ObjectSchema<
    serializers.DubbingResource.Raw,
    ElevenLabs.DubbingResource
> = core.serialization.object({
    id: core.serialization.string(),
    version: core.serialization.number(),
    sourceLanguage: core.serialization.property("source_language", core.serialization.string()),
    targetLanguages: core.serialization.property(
        "target_languages",
        core.serialization.list(core.serialization.string()),
    ),
    input: DubbingMediaReference,
    background: DubbingMediaReference,
    foreground: DubbingMediaReference,
    speakerTracks: core.serialization.property(
        "speaker_tracks",
        core.serialization.record(core.serialization.string(), SpeakerTrack),
    ),
    speakerSegments: core.serialization.property(
        "speaker_segments",
        core.serialization.record(core.serialization.string(), SpeakerSegment),
    ),
    renders: core.serialization.record(core.serialization.string(), Render),
});

export declare namespace DubbingResource {
    export interface Raw {
        id: string;
        version: number;
        source_language: string;
        target_languages: string[];
        input: DubbingMediaReference.Raw;
        background: DubbingMediaReference.Raw;
        foreground: DubbingMediaReference.Raw;
        speaker_tracks: Record<string, SpeakerTrack.Raw>;
        speaker_segments: Record<string, SpeakerSegment.Raw>;
        renders: Record<string, Render.Raw>;
    }
}
