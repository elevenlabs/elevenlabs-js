/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";

export const GetConversationResponseModelStatus: core.serialization.Schema<
    serializers.GetConversationResponseModelStatus.Raw,
    ElevenLabs.GetConversationResponseModelStatus
> = core.serialization.enum_(["initiated", "in-progress", "processing", "done", "failed"]);

export declare namespace GetConversationResponseModelStatus {
    export type Raw = "initiated" | "in-progress" | "processing" | "done" | "failed";
}
