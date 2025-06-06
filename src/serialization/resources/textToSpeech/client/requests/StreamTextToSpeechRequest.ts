/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../../../index";
import * as ElevenLabs from "../../../../../api/index";
import * as core from "../../../../../core";
import { VoiceSettings } from "../../../../types/VoiceSettings";
import { PronunciationDictionaryVersionLocator } from "../../../../types/PronunciationDictionaryVersionLocator";
import { BodyTextToSpeechStreamingV1TextToSpeechVoiceIdStreamPostApplyTextNormalization } from "../../types/BodyTextToSpeechStreamingV1TextToSpeechVoiceIdStreamPostApplyTextNormalization";

export const StreamTextToSpeechRequest: core.serialization.Schema<
    serializers.StreamTextToSpeechRequest.Raw,
    Omit<ElevenLabs.StreamTextToSpeechRequest, "enableLogging" | "optimizeStreamingLatency" | "outputFormat">
> = core.serialization.object({
    text: core.serialization.string(),
    modelId: core.serialization.property("model_id", core.serialization.string().optional()),
    languageCode: core.serialization.property("language_code", core.serialization.string().optional()),
    voiceSettings: core.serialization.property("voice_settings", VoiceSettings.optional()),
    pronunciationDictionaryLocators: core.serialization.property(
        "pronunciation_dictionary_locators",
        core.serialization.list(PronunciationDictionaryVersionLocator).optional(),
    ),
    seed: core.serialization.number().optional(),
    previousText: core.serialization.property("previous_text", core.serialization.string().optional()),
    nextText: core.serialization.property("next_text", core.serialization.string().optional()),
    previousRequestIds: core.serialization.property(
        "previous_request_ids",
        core.serialization.list(core.serialization.string()).optional(),
    ),
    nextRequestIds: core.serialization.property(
        "next_request_ids",
        core.serialization.list(core.serialization.string()).optional(),
    ),
    usePvcAsIvc: core.serialization.property("use_pvc_as_ivc", core.serialization.boolean().optional()),
    applyTextNormalization: core.serialization.property(
        "apply_text_normalization",
        BodyTextToSpeechStreamingV1TextToSpeechVoiceIdStreamPostApplyTextNormalization.optional(),
    ),
    applyLanguageTextNormalization: core.serialization.property(
        "apply_language_text_normalization",
        core.serialization.boolean().optional(),
    ),
});

export declare namespace StreamTextToSpeechRequest {
    export interface Raw {
        text: string;
        model_id?: string | null;
        language_code?: string | null;
        voice_settings?: VoiceSettings.Raw | null;
        pronunciation_dictionary_locators?: PronunciationDictionaryVersionLocator.Raw[] | null;
        seed?: number | null;
        previous_text?: string | null;
        next_text?: string | null;
        previous_request_ids?: string[] | null;
        next_request_ids?: string[] | null;
        use_pvc_as_ivc?: boolean | null;
        apply_text_normalization?: BodyTextToSpeechStreamingV1TextToSpeechVoiceIdStreamPostApplyTextNormalization.Raw | null;
        apply_language_text_normalization?: boolean | null;
    }
}
