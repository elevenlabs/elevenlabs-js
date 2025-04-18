/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface SpeakerResponseModel {
    /** The ID of the speaker. */
    speaker_id: string;
    /** The duration of the speaker segment in seconds. */
    duration_secs: number;
    /** The utterances of the speaker. */
    utterances?: ElevenLabs.UtteranceResponseModel[];
}
