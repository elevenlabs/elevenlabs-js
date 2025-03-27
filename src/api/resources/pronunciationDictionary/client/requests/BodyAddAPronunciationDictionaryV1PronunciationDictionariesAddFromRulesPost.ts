/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../../../../index";

/**
 * @example
 *     {
 *         rules: [{
 *                 type: "alias",
 *                 string_to_replace: "Thailand",
 *                 alias: "tie-land"
 *             }],
 *         name: "My Dictionary"
 *     }
 */
export interface BodyAddAPronunciationDictionaryV1PronunciationDictionariesAddFromRulesPost {
    /**
     * List of pronunciation rules. Rule can be either:
     *     an alias rule: {'string_to_replace': 'a', 'type': 'alias', 'alias': 'b', }
     *     or a phoneme rule: {'string_to_replace': 'a', 'type': 'phoneme', 'phoneme': 'b', 'alphabet': 'ipa' }
     */
    rules: ElevenLabs.BodyAddAPronunciationDictionaryV1PronunciationDictionariesAddFromRulesPostRulesItem[];
    /** The name of the pronunciation dictionary, used for identification only. */
    name: string;
    /** A description of the pronunciation dictionary, used for identification only. */
    description?: string;
    /** Should be one of 'admin', 'editor' or 'viewer'. If not provided, defaults to no access. */
    workspace_access?: ElevenLabs.BodyAddAPronunciationDictionaryV1PronunciationDictionariesAddFromRulesPostWorkspaceAccess;
}
