/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface VerificationAttemptResponse {
    /** The text of the verification attempt. */
    text: string;
    /** The date of the verification attempt in Unix time. */
    date_unix: number;
    /** Whether the verification attempt was accepted. */
    accepted: boolean;
    /** The similarity of the verification attempt. */
    similarity: number;
    /** The Levenshtein distance of the verification attempt. */
    levenshtein_distance: number;
    /** The recording of the verification attempt. */
    recording?: ElevenLabs.RecordingResponse;
}
