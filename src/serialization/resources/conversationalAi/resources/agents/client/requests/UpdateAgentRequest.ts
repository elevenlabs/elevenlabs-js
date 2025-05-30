/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../../../../../index";
import * as ElevenLabs from "../../../../../../../api/index";
import * as core from "../../../../../../../core";

export const UpdateAgentRequest: core.serialization.Schema<
    serializers.conversationalAi.UpdateAgentRequest.Raw,
    ElevenLabs.conversationalAi.UpdateAgentRequest
> = core.serialization.object({
    conversationConfig: core.serialization.property("conversation_config", core.serialization.unknown().optional()),
    platformSettings: core.serialization.property("platform_settings", core.serialization.unknown().optional()),
    name: core.serialization.string().optional(),
    tags: core.serialization.list(core.serialization.string()).optional(),
});

export declare namespace UpdateAgentRequest {
    export interface Raw {
        conversation_config?: unknown | null;
        platform_settings?: unknown | null;
        name?: string | null;
        tags?: string[] | null;
    }
}
