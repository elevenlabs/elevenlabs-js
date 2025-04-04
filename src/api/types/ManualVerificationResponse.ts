/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface ManualVerificationResponse {
    /** The extra text of the manual verification. */
    extra_text: string;
    /** The date of the manual verification in Unix time. */
    request_time_unix: number;
    /** The files of the manual verification. */
    files: ElevenLabs.ManualVerificationFileResponse[];
}
