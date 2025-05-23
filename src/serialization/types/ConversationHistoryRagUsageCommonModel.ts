/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";

export const ConversationHistoryRagUsageCommonModel: core.serialization.ObjectSchema<
    serializers.ConversationHistoryRagUsageCommonModel.Raw,
    ElevenLabs.ConversationHistoryRagUsageCommonModel
> = core.serialization.object({
    usageCount: core.serialization.property("usage_count", core.serialization.number()),
    embeddingModel: core.serialization.property("embedding_model", core.serialization.string()),
});

export declare namespace ConversationHistoryRagUsageCommonModel {
    export interface Raw {
        usage_count: number;
        embedding_model: string;
    }
}
