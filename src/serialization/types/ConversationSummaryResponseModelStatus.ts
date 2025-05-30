/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";

export const ConversationSummaryResponseModelStatus: core.serialization.Schema<
    serializers.ConversationSummaryResponseModelStatus.Raw,
    ElevenLabs.ConversationSummaryResponseModelStatus
> = core.serialization.enum_(["initiated", "in-progress", "processing", "done", "failed"]);

export declare namespace ConversationSummaryResponseModelStatus {
    export type Raw = "initiated" | "in-progress" | "processing" | "done" | "failed";
}
