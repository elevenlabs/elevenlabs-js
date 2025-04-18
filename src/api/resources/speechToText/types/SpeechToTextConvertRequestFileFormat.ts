/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * The format of input audio. Options are 'pcm_s16le_16' or 'other' For `pcm_s16le_16`, the input audio must be 16-bit PCM at a 16kHz sample rate, single channel (mono), and little-endian byte order. Latency will be lower than with passing an encoded waveform.
 */
export type SpeechToTextConvertRequestFileFormat = "pcm_s16le_16" | "other";
export const SpeechToTextConvertRequestFileFormat = {
    PcmS16Le16: "pcm_s16le_16",
    Other: "other",
} as const;
