/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";

export const ConversationHistoryTwilioPhoneCallModelDirection: core.serialization.Schema<
    serializers.ConversationHistoryTwilioPhoneCallModelDirection.Raw,
    ElevenLabs.ConversationHistoryTwilioPhoneCallModelDirection
> = core.serialization.enum_(["inbound", "outbound"]);

export declare namespace ConversationHistoryTwilioPhoneCallModelDirection {
    export type Raw = "inbound" | "outbound";
}
