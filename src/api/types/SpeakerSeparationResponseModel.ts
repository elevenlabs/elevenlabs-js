/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface SpeakerSeparationResponseModel {
    /** The ID of the voice. */
    voice_id: string;
    /** The ID of the sample. */
    sample_id: string;
    /** The status of the speaker separation. */
    status: ElevenLabs.SpeakerSeparationResponseModelStatus;
    /** The speakers of the sample. */
    speakers?: Record<string, ElevenLabs.SpeakerResponseModel | undefined>;
    /** The IDs of the selected speakers. */
    selected_speaker_ids?: string[];
}
