/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * An evaluation using the transcript and a prompt for a yes/no achieved answer
 */
export interface PromptEvaluationCriteria {
    /** The unique identifier for the evaluation criteria */
    id: string;
    name?: string;
    /** The type of evaluation criteria */
    type?: "prompt";
    /** The prompt that the agent should use to evaluate the conversation */
    conversation_goal_prompt: string;
    /** When evaluating the prompt, should the agent's knowledge base be used. */
    use_knowledge_base?: boolean;
}
