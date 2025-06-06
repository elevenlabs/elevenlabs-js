/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";
import { GetKnowledgeBaseDependentAgentsResponseModelAgentsItem } from "./GetKnowledgeBaseDependentAgentsResponseModelAgentsItem";

export const GetKnowledgeBaseDependentAgentsResponseModel: core.serialization.ObjectSchema<
    serializers.GetKnowledgeBaseDependentAgentsResponseModel.Raw,
    ElevenLabs.GetKnowledgeBaseDependentAgentsResponseModel
> = core.serialization.object({
    agents: core.serialization.list(GetKnowledgeBaseDependentAgentsResponseModelAgentsItem),
    nextCursor: core.serialization.property("next_cursor", core.serialization.string().optional()),
    hasMore: core.serialization.property("has_more", core.serialization.boolean()),
});

export declare namespace GetKnowledgeBaseDependentAgentsResponseModel {
    export interface Raw {
        agents: GetKnowledgeBaseDependentAgentsResponseModelAgentsItem.Raw[];
        next_cursor?: string | null;
        has_more: boolean;
    }
}
