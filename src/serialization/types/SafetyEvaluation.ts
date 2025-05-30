/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";
import { SafetyRule } from "./SafetyRule";

export const SafetyEvaluation: core.serialization.ObjectSchema<
    serializers.SafetyEvaluation.Raw,
    ElevenLabs.SafetyEvaluation
> = core.serialization.object({
    isUnsafe: core.serialization.property("is_unsafe", core.serialization.boolean().optional()),
    llmReason: core.serialization.property("llm_reason", core.serialization.string().optional()),
    safetyPromptVersion: core.serialization.property("safety_prompt_version", core.serialization.number().optional()),
    matchedRuleId: core.serialization.property("matched_rule_id", core.serialization.list(SafetyRule).optional()),
});

export declare namespace SafetyEvaluation {
    export interface Raw {
        is_unsafe?: boolean | null;
        llm_reason?: string | null;
        safety_prompt_version?: number | null;
        matched_rule_id?: SafetyRule.Raw[] | null;
    }
}
