/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../../../../../../../index";
import * as ElevenLabs from "../../../../../../../../../api/index";
import * as core from "../../../../../../../../../core";
import { ChapterContentInputModel } from "../../../../../../../../types/ChapterContentInputModel";

export const BodyUpdateChapterV1StudioProjectsProjectIdChaptersChapterIdPost: core.serialization.Schema<
    serializers.studio.projects.BodyUpdateChapterV1StudioProjectsProjectIdChaptersChapterIdPost.Raw,
    ElevenLabs.studio.projects.BodyUpdateChapterV1StudioProjectsProjectIdChaptersChapterIdPost
> = core.serialization.object({
    name: core.serialization.string().optional(),
    content: ChapterContentInputModel.optional(),
});

export declare namespace BodyUpdateChapterV1StudioProjectsProjectIdChaptersChapterIdPost {
    export interface Raw {
        name?: string | null;
        content?: ChapterContentInputModel.Raw | null;
    }
}
