/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

/**
 * Safety evaluation of the agent. Prompt and first message is taken into account.
 * The unsafe reason is provided from the evaluation
 */
export interface SafetyEvaluation {
    is_unsafe?: boolean;
    llm_reason?: string;
    safety_prompt_version?: number;
    matched_rule_id?: ElevenLabs.SafetyRule[];
}