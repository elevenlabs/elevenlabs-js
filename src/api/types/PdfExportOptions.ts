/**
 * This file was auto-generated by Fern from our API Definition.
 */

export interface PdfExportOptions {
    include_speakers?: boolean;
    include_timestamps?: boolean;
    segment_on_silence_longer_than_s?: number;
    max_segment_duration_s?: number;
    max_segment_chars?: number;
}
