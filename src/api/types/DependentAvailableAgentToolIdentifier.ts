/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface DependentAvailableAgentToolIdentifier {
    agentId: string;
    agentName: string;
    usedBy: string[];
    createdAtUnixSecs: number;
    accessLevel: ElevenLabs.DependentAvailableAgentToolIdentifierAccessLevel;
}
