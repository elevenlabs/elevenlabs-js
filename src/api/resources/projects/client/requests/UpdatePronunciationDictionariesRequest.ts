/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../../../../index";

/**
 * @example
 *     {
 *         pronunciation_dictionary_locators: [{
 *                 pronunciation_dictionary_id: "pronunciation_dictionary_id",
 *                 version_id: "version_id"
 *             }]
 *     }
 */
export interface UpdatePronunciationDictionariesRequest {
    /** A list of pronunciation dictionary locators (pronunciation_dictionary_id, version_id) encoded as a list of JSON strings for pronunciation dictionaries to be applied to the text. A list of json encoded strings is required as adding projects may occur through formData as opposed to jsonBody. To specify multiple dictionaries use multiple --form lines in your curl, such as --form 'pronunciation_dictionary_locators="{\"pronunciation_dictionary_id\":\"Vmd4Zor6fplcA7WrINey\",\"version_id\":\"hRPaxjlTdR7wFMhV4w0b\"}"' --form 'pronunciation_dictionary_locators="{\"pronunciation_dictionary_id\":\"JzWtcGQMJ6bnlWwyMo7e\",\"version_id\":\"lbmwxiLu4q6txYxgdZqn\"}"'. Note that multiple dictionaries are not currently supported by our UI which will only show the first. */
    pronunciation_dictionary_locators: ElevenLabs.PronunciationDictionaryVersionLocator[];
}
