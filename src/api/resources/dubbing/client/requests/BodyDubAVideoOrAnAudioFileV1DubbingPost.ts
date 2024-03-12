/**
 * This file was auto-generated by Fern from our API Definition.
 */

export interface BodyDubAVideoOrAnAudioFileV1DubbingPost {
    /** automatic or manual. */
    mode: string;
    /** Name of the dubbing project. */
    name: string;
    /** URL of the source video/audio file. */
    source_url: string;
    /** Source language. */
    source_lang: string;
    /** Target language. */
    target_lang: string;
    /** Number of speakers to use for the dubbing. */
    num_speakers: number;
    /** Whether to apply watermark to the output video. */
    watermark: boolean;
    /** Start time of the source video/audio file. */
    start_time: number;
    /** End time of the source video/audio file. */
    end_time: number;
    /** Whether to use the highest resolution available. */
    highest_resolution: boolean;
    /** Whether to prepare dub for edits in dubbing studio. */
    dubbing_studio: boolean;
}
