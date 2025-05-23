/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";

export const BodyEditBasicProjectInfoV1ProjectsProjectIdPost: core.serialization.ObjectSchema<
    serializers.BodyEditBasicProjectInfoV1ProjectsProjectIdPost.Raw,
    ElevenLabs.BodyEditBasicProjectInfoV1ProjectsProjectIdPost
> = core.serialization.object({
    name: core.serialization.string(),
    defaultTitleVoiceId: core.serialization.property("default_title_voice_id", core.serialization.string()),
    defaultParagraphVoiceId: core.serialization.property("default_paragraph_voice_id", core.serialization.string()),
    title: core.serialization.string().optional(),
    author: core.serialization.string().optional(),
    isbnNumber: core.serialization.property("isbn_number", core.serialization.string().optional()),
    volumeNormalization: core.serialization.property("volume_normalization", core.serialization.boolean().optional()),
});

export declare namespace BodyEditBasicProjectInfoV1ProjectsProjectIdPost {
    export interface Raw {
        name: string;
        default_title_voice_id: string;
        default_paragraph_voice_id: string;
        title?: string | null;
        author?: string | null;
        isbn_number?: string | null;
        volume_normalization?: boolean | null;
    }
}
