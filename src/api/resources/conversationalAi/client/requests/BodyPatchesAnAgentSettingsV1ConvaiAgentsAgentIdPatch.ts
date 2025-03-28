/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * @example
 *     {}
 */
export interface BodyPatchesAnAgentSettingsV1ConvaiAgentsAgentIdPatch {
    /**
     * Use tool ids instead of tools specs from request payload.
     */
    use_tool_ids?: boolean;
    /** Conversation configuration for an agent */
    conversation_config?: Record<string, unknown>;
    /** Platform settings for the agent are all settings that aren't related to the conversation orchestration and content. */
    platform_settings?: Record<string, unknown>;
    /** A name to make the agent easier to find */
    name?: string;
}
