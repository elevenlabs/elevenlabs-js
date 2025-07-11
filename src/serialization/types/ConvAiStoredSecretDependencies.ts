/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";
import { ConvAiStoredSecretDependenciesToolsItem } from "./ConvAiStoredSecretDependenciesToolsItem";
import { ConvAiStoredSecretDependenciesAgentsItem } from "./ConvAiStoredSecretDependenciesAgentsItem";
import { SecretDependencyType } from "./SecretDependencyType";
import { DependentPhoneNumberIdentifier } from "./DependentPhoneNumberIdentifier";

export const ConvAiStoredSecretDependencies: core.serialization.ObjectSchema<
    serializers.ConvAiStoredSecretDependencies.Raw,
    ElevenLabs.ConvAiStoredSecretDependencies
> = core.serialization.object({
    tools: core.serialization.list(ConvAiStoredSecretDependenciesToolsItem),
    agents: core.serialization.list(ConvAiStoredSecretDependenciesAgentsItem),
    others: core.serialization.list(SecretDependencyType),
    phoneNumbers: core.serialization.property(
        "phone_numbers",
        core.serialization.list(DependentPhoneNumberIdentifier).optional(),
    ),
});

export declare namespace ConvAiStoredSecretDependencies {
    export interface Raw {
        tools: ConvAiStoredSecretDependenciesToolsItem.Raw[];
        agents: ConvAiStoredSecretDependenciesAgentsItem.Raw[];
        others: SecretDependencyType.Raw[];
        phone_numbers?: DependentPhoneNumberIdentifier.Raw[] | null;
    }
}
