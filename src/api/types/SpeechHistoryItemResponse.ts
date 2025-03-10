/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface SpeechHistoryItemResponse {
    /** The ID of the history item. */
    history_item_id: string;
    /** The ID of the request. */
    request_id?: string;
    /** The ID of the voice used. */
    voice_id?: string;
    /** The ID of the model. */
    model_id?: string;
    /** The name of the voice. */
    voice_name?: string;
    /** The category of the voice. Either 'premade', 'cloned', 'generated' or 'professional'. */
    voice_category?: ElevenLabs.SpeechHistoryItemResponseModelVoiceCategory;
    /** The text used to generate the audio item. */
    text?: string;
    /** Unix timestamp of when the item was created. */
    date_unix?: number;
    /** The character count change from. */
    character_count_change_from?: number;
    /** The character count change to. */
    character_count_change_to?: number;
    /** The content type of the generated item. */
    content_type?: string;
    state?: unknown;
    /** The settings of the history item. */
    settings?: Record<string, unknown>;
    /** Feedback associated with the generated item. Returns null if no feedback has been provided. */
    feedback?: ElevenLabs.FeedbackItem;
    /** The ID of the share link. */
    share_link_id?: string;
    /** The source of the history item. Either TTS (text to speech), STS (speech to text) or STT (speech to text). */
    source?: ElevenLabs.SpeechHistoryItemResponseModelSource;
    /** The alignments of the history item. */
    alignments?: ElevenLabs.HistoryAlignmentsResponseModel;
}
