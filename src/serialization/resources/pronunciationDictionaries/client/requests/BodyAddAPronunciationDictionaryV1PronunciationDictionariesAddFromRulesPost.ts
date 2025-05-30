/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../../../index";
import * as ElevenLabs from "../../../../../api/index";
import * as core from "../../../../../core";
import { BodyAddAPronunciationDictionaryV1PronunciationDictionariesAddFromRulesPostRulesItem } from "../../types/BodyAddAPronunciationDictionaryV1PronunciationDictionariesAddFromRulesPostRulesItem";
import { BodyAddAPronunciationDictionaryV1PronunciationDictionariesAddFromRulesPostWorkspaceAccess } from "../../types/BodyAddAPronunciationDictionaryV1PronunciationDictionariesAddFromRulesPostWorkspaceAccess";

export const BodyAddAPronunciationDictionaryV1PronunciationDictionariesAddFromRulesPost: core.serialization.Schema<
    serializers.BodyAddAPronunciationDictionaryV1PronunciationDictionariesAddFromRulesPost.Raw,
    ElevenLabs.BodyAddAPronunciationDictionaryV1PronunciationDictionariesAddFromRulesPost
> = core.serialization.object({
    rules: core.serialization.list(BodyAddAPronunciationDictionaryV1PronunciationDictionariesAddFromRulesPostRulesItem),
    name: core.serialization.string(),
    description: core.serialization.string().optional(),
    workspaceAccess: core.serialization.property(
        "workspace_access",
        BodyAddAPronunciationDictionaryV1PronunciationDictionariesAddFromRulesPostWorkspaceAccess.optional(),
    ),
});

export declare namespace BodyAddAPronunciationDictionaryV1PronunciationDictionariesAddFromRulesPost {
    export interface Raw {
        rules: BodyAddAPronunciationDictionaryV1PronunciationDictionariesAddFromRulesPostRulesItem.Raw[];
        name: string;
        description?: string | null;
        workspace_access?: BodyAddAPronunciationDictionaryV1PronunciationDictionariesAddFromRulesPostWorkspaceAccess.Raw | null;
    }
}
