/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../../../index";
import * as ElevenLabs from "../../../../../api/index";
import * as core from "../../../../../core";
import { DialogueInput } from "../../../../types/DialogueInput";
import { ModelSettingsResponseModel } from "../../../../types/ModelSettingsResponseModel";
import { PronunciationDictionaryVersionLocator } from "../../../../types/PronunciationDictionaryVersionLocator";

export const BodyTextToDialogueMultiVoiceV1TextToDialoguePost: core.serialization.Schema<
    serializers.BodyTextToDialogueMultiVoiceV1TextToDialoguePost.Raw,
    Omit<ElevenLabs.BodyTextToDialogueMultiVoiceV1TextToDialoguePost, "outputFormat">
> = core.serialization.object({
    inputs: core.serialization.list(DialogueInput),
    modelId: core.serialization.property("model_id", core.serialization.string().optional()),
    settings: ModelSettingsResponseModel.optional(),
    pronunciationDictionaryLocators: core.serialization.property(
        "pronunciation_dictionary_locators",
        core.serialization.list(PronunciationDictionaryVersionLocator).optional(),
    ),
    seed: core.serialization.number().optional(),
});

export declare namespace BodyTextToDialogueMultiVoiceV1TextToDialoguePost {
    export interface Raw {
        inputs: DialogueInput.Raw[];
        model_id?: string | null;
        settings?: ModelSettingsResponseModel.Raw | null;
        pronunciation_dictionary_locators?: PronunciationDictionaryVersionLocator.Raw[] | null;
        seed?: number | null;
    }
}
