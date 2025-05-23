/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";

export const BatchCallRecipientStatus: core.serialization.Schema<
    serializers.BatchCallRecipientStatus.Raw,
    ElevenLabs.BatchCallRecipientStatus
> = core.serialization.enum_(["pending", "initiated", "in_progress", "completed", "failed", "cancelled"]);

export declare namespace BatchCallRecipientStatus {
    export type Raw = "pending" | "initiated" | "in_progress" | "completed" | "failed" | "cancelled";
}
