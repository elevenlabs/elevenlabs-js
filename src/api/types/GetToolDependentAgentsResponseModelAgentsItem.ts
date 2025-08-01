/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export type GetToolDependentAgentsResponseModelAgentsItem =
    | ElevenLabs.GetToolDependentAgentsResponseModelAgentsItem.Available
    | ElevenLabs.GetToolDependentAgentsResponseModelAgentsItem.Unknown;

export namespace GetToolDependentAgentsResponseModelAgentsItem {
    export interface Available extends ElevenLabs.DependentAvailableAgentIdentifier {
        type: "available";
    }

    export interface Unknown extends ElevenLabs.DependentUnknownAgentIdentifier {
        type: "unknown";
    }
}
