/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../../../../../../../index";
import * as ElevenLabs from "../../../../../../../../../api/index";
import * as core from "../../../../../../../../../core";

export const LlmUsageCalculatorRequestModel: core.serialization.Schema<
    serializers.conversationalAi.agents.LlmUsageCalculatorRequestModel.Raw,
    ElevenLabs.conversationalAi.agents.LlmUsageCalculatorRequestModel
> = core.serialization.object({
    promptLength: core.serialization.property("prompt_length", core.serialization.number().optional()),
    numberOfPages: core.serialization.property("number_of_pages", core.serialization.number().optional()),
    ragEnabled: core.serialization.property("rag_enabled", core.serialization.boolean().optional()),
});

export declare namespace LlmUsageCalculatorRequestModel {
    export interface Raw {
        prompt_length?: number | null;
        number_of_pages?: number | null;
        rag_enabled?: boolean | null;
    }
}
