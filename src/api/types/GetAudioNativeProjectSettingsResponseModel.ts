/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface GetAudioNativeProjectSettingsResponseModel {
    /** Whether the project is enabled. */
    enabled: boolean;
    /** The ID of the latest snapshot of the project. */
    snapshot_id?: string;
    /** The settings of the project. */
    settings?: ElevenLabs.AudioNativeProjectSettingsResponseModel;
}
