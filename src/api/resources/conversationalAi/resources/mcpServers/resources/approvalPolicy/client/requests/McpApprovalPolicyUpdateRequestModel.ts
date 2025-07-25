/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../../../../../../../../index";

/**
 * @example
 *     {
 *         approvalPolicy: "auto_approve_all"
 *     }
 */
export interface McpApprovalPolicyUpdateRequestModel {
    /** The approval mode to set for the MCP server */
    approvalPolicy: ElevenLabs.McpApprovalPolicy;
}
