/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

/**
 * The type of tool
 */
export type PromptAgentDbModelToolsItem =
    | ElevenLabs.PromptAgentDbModelToolsItem.Client
    | ElevenLabs.PromptAgentDbModelToolsItem.Mcp
    | ElevenLabs.PromptAgentDbModelToolsItem.NativeMcp
    | ElevenLabs.PromptAgentDbModelToolsItem.System
    | ElevenLabs.PromptAgentDbModelToolsItem.Webhook;

export namespace PromptAgentDbModelToolsItem {
    export interface Client extends ElevenLabs.ClientToolConfigInput {
        type: "client";
    }

    export interface Mcp extends ElevenLabs.McpToolConfigInput {
        type: "mcp";
    }

    export interface NativeMcp extends ElevenLabs.NativeMcpToolConfigInput {
        type: "native_mcp";
    }

    export interface System extends ElevenLabs.SystemToolConfigInput {
        type: "system";
    }

    export interface Webhook extends ElevenLabs.WebhookToolConfigInput {
        type: "webhook";
    }
}
