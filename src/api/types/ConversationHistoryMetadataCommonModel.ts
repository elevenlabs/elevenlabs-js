/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface ConversationHistoryMetadataCommonModel {
    start_time_unix_secs: number;
    call_duration_secs: number;
    cost?: number;
    authorization_method?: ElevenLabs.AuthorizationMethod;
    charging?: ElevenLabs.ConversationChargingCommonModel;
}