/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../../../../../index";
import * as ElevenLabs from "../../../../../../../api/index";
import * as core from "../../../../../../../core";

export const BodyDuplicateAgentV1ConvaiAgentsAgentIdDuplicatePost: core.serialization.Schema<
    serializers.conversationalAi.BodyDuplicateAgentV1ConvaiAgentsAgentIdDuplicatePost.Raw,
    ElevenLabs.conversationalAi.BodyDuplicateAgentV1ConvaiAgentsAgentIdDuplicatePost
> = core.serialization.object({
    name: core.serialization.string().optional(),
});

export declare namespace BodyDuplicateAgentV1ConvaiAgentsAgentIdDuplicatePost {
    export interface Raw {
        name?: string | null;
    }
}
