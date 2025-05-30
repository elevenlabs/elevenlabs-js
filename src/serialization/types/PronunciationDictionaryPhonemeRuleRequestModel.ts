/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";

export const PronunciationDictionaryPhonemeRuleRequestModel: core.serialization.ObjectSchema<
    serializers.PronunciationDictionaryPhonemeRuleRequestModel.Raw,
    ElevenLabs.PronunciationDictionaryPhonemeRuleRequestModel
> = core.serialization.object({
    stringToReplace: core.serialization.property("string_to_replace", core.serialization.string()),
    phoneme: core.serialization.string(),
    alphabet: core.serialization.string(),
});

export declare namespace PronunciationDictionaryPhonemeRuleRequestModel {
    export interface Raw {
        string_to_replace: string;
        phoneme: string;
        alphabet: string;
    }
}
