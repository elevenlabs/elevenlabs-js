/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";
import { DependentAvailableAgentIdentifier } from "./DependentAvailableAgentIdentifier";
import { DependentUnknownAgentIdentifier } from "./DependentUnknownAgentIdentifier";

export const GetKnowledgeBaseSummaryUrlResponseModelDependentAgentsItem: core.serialization.Schema<
    serializers.GetKnowledgeBaseSummaryUrlResponseModelDependentAgentsItem.Raw,
    ElevenLabs.GetKnowledgeBaseSummaryUrlResponseModelDependentAgentsItem
> = core.serialization
    .union("type", {
        available: DependentAvailableAgentIdentifier,
        unknown: DependentUnknownAgentIdentifier,
    })
    .transform<ElevenLabs.GetKnowledgeBaseSummaryUrlResponseModelDependentAgentsItem>({
        transform: (value) => value,
        untransform: (value) => value,
    });

export declare namespace GetKnowledgeBaseSummaryUrlResponseModelDependentAgentsItem {
    export type Raw =
        | GetKnowledgeBaseSummaryUrlResponseModelDependentAgentsItem.Available
        | GetKnowledgeBaseSummaryUrlResponseModelDependentAgentsItem.Unknown;

    export interface Available extends DependentAvailableAgentIdentifier.Raw {
        type: "available";
    }

    export interface Unknown extends DependentUnknownAgentIdentifier.Raw {
        type: "unknown";
    }
}
