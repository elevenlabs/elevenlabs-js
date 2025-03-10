/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface GetSpeechHistoryResponse {
    /** A list of speech history items. */
    history: ElevenLabs.SpeechHistoryItemResponse[];
    /** The ID of the last history item. */
    last_history_item_id?: string;
    /** Whether there are more history items to fetch. */
    has_more: boolean;
}
