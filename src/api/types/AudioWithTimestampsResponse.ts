/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface AudioWithTimestampsResponse {
    /** Base64 encoded audio data */
    audioBase64: string;
    /** Timestamp information for each character in the original text */
    alignment?: ElevenLabs.CharacterAlignmentResponseModel;
    /** Timestamp information for each character in the normalized text */
    normalizedAlignment?: ElevenLabs.CharacterAlignmentResponseModel;
}
