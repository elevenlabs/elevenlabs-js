/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface ConversationHistoryTranscriptCommonModel {
    role: ElevenLabs.ConversationHistoryTranscriptCommonModelRole;
    message?: string;
    tool_calls?: ElevenLabs.ConversationHistoryTranscriptToolCallCommonModel[];
    tool_results?: ElevenLabs.ConversationHistoryTranscriptToolResultCommonModel[];
    feedback?: ElevenLabs.UserFeedback;
    llm_override?: string;
    time_in_call_secs: number;
    conversation_turn_metrics?: ElevenLabs.ConversationTurnMetrics;
    rag_retrieval_info?: ElevenLabs.RagRetrievalInfo;
}
