/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

/**
 * Settings to evaluate an agent's performance.
 * Agents are evaluated against a set of criteria, with success being defined as meeting some combination of those criteria.
 */
export interface EvaluationSettings {
    /** Individual criteria that the agent should be evaluated against */
    criteria?: ElevenLabs.PromptEvaluationCriteria[];
}
