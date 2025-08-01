/**
 * This file was auto-generated by Fern from our API Definition.
 */

export interface ConversationHistoryTranscriptToolCallMcpDetails {
    mcpServerId: string;
    mcpServerName: string;
    integrationType: string;
    parameters?: Record<string, string>;
    approvalPolicy: string;
    requiresApproval?: boolean;
    mcpToolName?: string;
    mcpToolDescription?: string;
}
