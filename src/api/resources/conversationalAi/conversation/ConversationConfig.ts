/**
 * Configuration options for the Conversation.
 */
export interface ConversationInitiationData {
    /** Extra body parameters to include in the conversation initiation request */
    extraBody?: Record<string, any>;
    /** Configuration overrides for the conversation */
    conversationConfigOverride?: Record<string, any>;
    /** Dynamic variables to use in the conversation */
    dynamicVariables?: Record<string, any>;
}

/**
 * Creates a default conversation initiation data object.
 *
 * @param options Optional partial configuration to override defaults
 * @returns Complete conversation initiation data object
 */
export function createConversationInitiationData(
    options: Partial<ConversationInitiationData> = {}
): ConversationInitiationData {
    return {
        extraBody: options.extraBody || {},
        conversationConfigOverride: options.conversationConfigOverride || {},
        dynamicVariables: options.dynamicVariables || {},
    };
}