/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface SpeakerResponseModel {
    speaker_id: string;
    duration_secs: number;
    utterances?: ElevenLabs.UtteranceResponseModel[];
}
