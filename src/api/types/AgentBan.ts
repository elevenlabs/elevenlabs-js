/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface AgentBan {
    at_unix: number;
    reason?: string;
    reason_type: ElevenLabs.BanReasonType;
}
