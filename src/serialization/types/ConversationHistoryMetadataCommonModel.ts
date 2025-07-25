/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";
import { ConversationDeletionSettings } from "./ConversationDeletionSettings";
import { ConversationHistoryFeedbackCommonModel } from "./ConversationHistoryFeedbackCommonModel";
import { AuthorizationMethod } from "./AuthorizationMethod";
import { ConversationChargingCommonModel } from "./ConversationChargingCommonModel";
import { ConversationHistoryMetadataCommonModelPhoneCall } from "./ConversationHistoryMetadataCommonModelPhoneCall";
import { ConversationHistoryBatchCallModel } from "./ConversationHistoryBatchCallModel";
import { ConversationHistoryErrorCommonModel } from "./ConversationHistoryErrorCommonModel";
import { ConversationHistoryRagUsageCommonModel } from "./ConversationHistoryRagUsageCommonModel";
import { FeaturesUsageCommonModel } from "./FeaturesUsageCommonModel";
import { ConversationHistoryElevenAssistantCommonModel } from "./ConversationHistoryElevenAssistantCommonModel";
import { ConversationInitiationSource } from "./ConversationInitiationSource";

export const ConversationHistoryMetadataCommonModel: core.serialization.ObjectSchema<
    serializers.ConversationHistoryMetadataCommonModel.Raw,
    ElevenLabs.ConversationHistoryMetadataCommonModel
> = core.serialization.object({
    startTimeUnixSecs: core.serialization.property("start_time_unix_secs", core.serialization.number()),
    acceptedTimeUnixSecs: core.serialization.property(
        "accepted_time_unix_secs",
        core.serialization.number().optional(),
    ),
    callDurationSecs: core.serialization.property("call_duration_secs", core.serialization.number()),
    cost: core.serialization.number().optional(),
    deletionSettings: core.serialization.property("deletion_settings", ConversationDeletionSettings.optional()),
    feedback: ConversationHistoryFeedbackCommonModel.optional(),
    authorizationMethod: core.serialization.property("authorization_method", AuthorizationMethod.optional()),
    charging: ConversationChargingCommonModel.optional(),
    phoneCall: core.serialization.property("phone_call", ConversationHistoryMetadataCommonModelPhoneCall.optional()),
    batchCall: core.serialization.property("batch_call", ConversationHistoryBatchCallModel.optional()),
    terminationReason: core.serialization.property("termination_reason", core.serialization.string().optional()),
    error: ConversationHistoryErrorCommonModel.optional(),
    mainLanguage: core.serialization.property("main_language", core.serialization.string().optional()),
    ragUsage: core.serialization.property("rag_usage", ConversationHistoryRagUsageCommonModel.optional()),
    textOnly: core.serialization.property("text_only", core.serialization.boolean().optional()),
    featuresUsage: core.serialization.property("features_usage", FeaturesUsageCommonModel.optional()),
    elevenAssistant: core.serialization.property(
        "eleven_assistant",
        ConversationHistoryElevenAssistantCommonModel.optional(),
    ),
    initiatorId: core.serialization.property("initiator_id", core.serialization.string().optional()),
    conversationInitiationSource: core.serialization.property(
        "conversation_initiation_source",
        ConversationInitiationSource.optional(),
    ),
    conversationInitiationSourceVersion: core.serialization.property(
        "conversation_initiation_source_version",
        core.serialization.string().optional(),
    ),
    timezone: core.serialization.string().optional(),
});

export declare namespace ConversationHistoryMetadataCommonModel {
    export interface Raw {
        start_time_unix_secs: number;
        accepted_time_unix_secs?: number | null;
        call_duration_secs: number;
        cost?: number | null;
        deletion_settings?: ConversationDeletionSettings.Raw | null;
        feedback?: ConversationHistoryFeedbackCommonModel.Raw | null;
        authorization_method?: AuthorizationMethod.Raw | null;
        charging?: ConversationChargingCommonModel.Raw | null;
        phone_call?: ConversationHistoryMetadataCommonModelPhoneCall.Raw | null;
        batch_call?: ConversationHistoryBatchCallModel.Raw | null;
        termination_reason?: string | null;
        error?: ConversationHistoryErrorCommonModel.Raw | null;
        main_language?: string | null;
        rag_usage?: ConversationHistoryRagUsageCommonModel.Raw | null;
        text_only?: boolean | null;
        features_usage?: FeaturesUsageCommonModel.Raw | null;
        eleven_assistant?: ConversationHistoryElevenAssistantCommonModel.Raw | null;
        initiator_id?: string | null;
        conversation_initiation_source?: ConversationInitiationSource.Raw | null;
        conversation_initiation_source_version?: string | null;
        timezone?: string | null;
    }
}
