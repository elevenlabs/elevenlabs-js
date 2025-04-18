/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as fs from "fs";
import * as ElevenLabs from "../../../../index";

export interface BodyAudioIsolationV1AudioIsolationPost {
    audio: File | fs.ReadStream | Blob;
    /** The format of input audio. Options are 'pcm_s16le_16' or 'other' For `pcm_s16le_16`, the input audio must be 16-bit PCM at a 16kHz sample rate, single channel (mono), and little-endian byte order. Latency will be lower than with passing an encoded waveform. */
    file_format?: ElevenLabs.AudioIsolationAudioIsolationRequestFileFormat;
}
