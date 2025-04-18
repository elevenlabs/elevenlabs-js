/**
 * This file was auto-generated by Fern from our API Definition.
 */

export interface VoiceSamplePreviewResponseModel {
    /** The base64 encoded audio. */
    audio_base_64: string;
    /** The ID of the voice. */
    voice_id: string;
    /** The ID of the sample. */
    sample_id: string;
    /** The media type of the audio. */
    media_type: string;
    /** The duration of the audio in seconds. */
    duration_secs?: number;
}
