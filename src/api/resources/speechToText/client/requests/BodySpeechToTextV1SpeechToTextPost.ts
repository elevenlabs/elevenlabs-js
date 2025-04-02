/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as fs from "fs";
import * as ElevenLabs from "../../../../index";

/**
 * @example
 *     {
 *         file: fs.createReadStream("/path/to/your/file"),
 *         model_id: "model_id"
 *     }
 */
export interface BodySpeechToTextV1SpeechToTextPost {
    /**
     * When enable_logging is set to false zero retention mode will be used for the request. This will mean history features are unavailable for this request, including request stitching. Zero retention mode may only be used by enterprise customers.
     */
    enable_logging?: boolean;
    /** The ID of the model to use for transcription, currently only 'scribe_v1' is available. */
    model_id: string;
    file: File | fs.ReadStream | Blob;
    /** An ISO-639-1 or ISO-639-3 language_code corresponding to the language of the audio file. Can sometimes improve transcription performance if known beforehand. Defaults to null, in this case the language is predicted automatically. */
    language_code?: string;
    /** Whether to tag audio events like (laughter), (footsteps), etc. in the transcription. */
    tag_audio_events?: boolean;
    /** The maximum amount of speakers talking in the uploaded file. Can help with predicting who speaks when. The maximum amount of speakers that can be predicted is 32. Defaults to null, in this case the amount of speakers is set to the maximum value the model supports. */
    num_speakers?: number;
    /** The granularity of the timestamps in the transcription. 'word' provides word-level timestamps and 'character' provides character-level timestamps per word. */
    timestamps_granularity?: ElevenLabs.SpeechToTextConvertRequestTimestampsGranularity;
    /** Whether to annotate which speaker is currently talking in the uploaded file. */
    diarize?: boolean;
    /** A list of additional formats to export the transcript to. */
    additional_formats?: ElevenLabs.AdditionalFormats;
}
