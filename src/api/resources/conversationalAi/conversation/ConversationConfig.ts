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
    /** The environment to use for the conversation */
    environment?: string;
    /** ID of the end user participating in the conversation */
    userId?: string;
    /** ID of the agent branch to use for the conversation */
    branchId?: string;
    /** Workflow node to start the conversation at instead of the default entry */
    startingWorkflowNodeId?: string;
    /** Procedures available to the starting agent. An empty list disables all of the agent's procedures. */
    procedureIds?: string[];
    /** Free-form procedures that start when the conversation starts */
    startProcedureIds?: string[];
}

/**
 * Creates a default conversation initiation data object.
 *
 * @param options Optional partial configuration to override defaults
 * @returns Complete conversation initiation data object
 */
export function createConversationInitiationData(
    options: Partial<ConversationInitiationData> = {},
): ConversationInitiationData {
    return {
        extraBody: options.extraBody || {},
        conversationConfigOverride: options.conversationConfigOverride || {},
        dynamicVariables: options.dynamicVariables || {},
        userId: options.userId,
        branchId: options.branchId,
        startingWorkflowNodeId: options.startingWorkflowNodeId,
        procedureIds: options.procedureIds,
        startProcedureIds: options.startProcedureIds,
    };
}
