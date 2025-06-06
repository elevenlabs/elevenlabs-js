/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";
import { DynamicVariablesConfig } from "./DynamicVariablesConfig";
import { PromptAgentDbModel } from "./PromptAgentDbModel";

export const AgentConfig: core.serialization.ObjectSchema<serializers.AgentConfig.Raw, ElevenLabs.AgentConfig> =
    core.serialization.object({
        firstMessage: core.serialization.property("first_message", core.serialization.string().optional()),
        language: core.serialization.string().optional(),
        dynamicVariables: core.serialization.property("dynamic_variables", DynamicVariablesConfig.optional()),
        prompt: PromptAgentDbModel.optional(),
    });

export declare namespace AgentConfig {
    export interface Raw {
        first_message?: string | null;
        language?: string | null;
        dynamic_variables?: DynamicVariablesConfig.Raw | null;
        prompt?: PromptAgentDbModel.Raw | null;
    }
}
