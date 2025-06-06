/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../../../../../index";
import * as ElevenLabs from "../../../../../../../api/index";
import * as core from "../../../../../../../core";
import { ConversationSimulationSpecification } from "../../../../../../types/ConversationSimulationSpecification";
import { PromptEvaluationCriteria } from "../../../../../../types/PromptEvaluationCriteria";

export const BodySimulatesAConversationStreamV1ConvaiAgentsAgentIdSimulateConversationStreamPost: core.serialization.Schema<
    serializers.conversationalAi.BodySimulatesAConversationStreamV1ConvaiAgentsAgentIdSimulateConversationStreamPost.Raw,
    ElevenLabs.conversationalAi.BodySimulatesAConversationStreamV1ConvaiAgentsAgentIdSimulateConversationStreamPost
> = core.serialization.object({
    simulationSpecification: core.serialization.property(
        "simulation_specification",
        ConversationSimulationSpecification,
    ),
    extraEvaluationCriteria: core.serialization.property(
        "extra_evaluation_criteria",
        core.serialization.list(PromptEvaluationCriteria).optional(),
    ),
});

export declare namespace BodySimulatesAConversationStreamV1ConvaiAgentsAgentIdSimulateConversationStreamPost {
    export interface Raw {
        simulation_specification: ConversationSimulationSpecification.Raw;
        extra_evaluation_criteria?: PromptEvaluationCriteria.Raw[] | null;
    }
}
