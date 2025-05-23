/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../../../../../index";

export type PronunciationDictionaryRule =
    | ElevenLabs.pronunciationDictionaries.PronunciationDictionaryRule.Alias
    | ElevenLabs.pronunciationDictionaries.PronunciationDictionaryRule.Phoneme;

export namespace PronunciationDictionaryRule {
    export interface Alias extends ElevenLabs.PronunciationDictionaryAliasRuleRequestModel {
        type: "alias";
    }

    export interface Phoneme extends ElevenLabs.PronunciationDictionaryPhonemeRuleRequestModel {
        type: "phoneme";
    }
}
