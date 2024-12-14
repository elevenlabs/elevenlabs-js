/**
 * This file was auto-generated by Fern from our API Definition.
 */

export interface TextToSpeechStreamWithTimestampsResponseAlignment {
    /** Array of individual characters from the input text */
    characters?: string[];
    /** Array of start times (in seconds) for each character */
    character_start_times_seconds?: number[];
    /** Array of end times (in seconds) for each character */
    character_end_times_seconds?: number[];
}