/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface BatchCallResponse {
    id: string;
    phoneNumberId: string;
    phoneProvider?: ElevenLabs.TelephonyProvider;
    name: string;
    agentId: string;
    createdAtUnix: number;
    scheduledTimeUnix: number;
    totalCallsDispatched: number;
    totalCallsScheduled: number;
    lastUpdatedAtUnix: number;
    status: ElevenLabs.BatchCallStatus;
    agentName: string;
}
