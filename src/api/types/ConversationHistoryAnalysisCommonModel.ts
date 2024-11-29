/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface ConversationHistoryAnalysisCommonModel {
    evaluation_criteria_results?: Record<string, ElevenLabs.ConversationHistoryEvaluationCriteriaResultCommonModel>;
    data_collection_results?: Record<string, ElevenLabs.DataCollectionResultCommonModel>;
    call_successful: ElevenLabs.EvaluationSuccessResult;
    transcript_summary: string;
}
