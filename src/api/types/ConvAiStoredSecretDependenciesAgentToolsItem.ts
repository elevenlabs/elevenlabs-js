/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export type ConvAiStoredSecretDependenciesAgentToolsItem =
    | ElevenLabs.ConvAiStoredSecretDependenciesAgentToolsItem.Available
    | ElevenLabs.ConvAiStoredSecretDependenciesAgentToolsItem.Unknown;

export namespace ConvAiStoredSecretDependenciesAgentToolsItem {
    export interface Available extends ElevenLabs.DependentAvailableAgentToolIdentifier {
        type: "available";
    }

    export interface Unknown extends ElevenLabs.DependentUnknownAgentToolIdentifier {
        type: "unknown";
    }
}
