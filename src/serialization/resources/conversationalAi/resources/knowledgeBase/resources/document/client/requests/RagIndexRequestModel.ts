/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../../../../../../../index";
import * as ElevenLabs from "../../../../../../../../../api/index";
import * as core from "../../../../../../../../../core";
import { EmbeddingModelEnum } from "../../../../../../../../types/EmbeddingModelEnum";

export const RagIndexRequestModel: core.serialization.Schema<
    serializers.conversationalAi.knowledgeBase.RagIndexRequestModel.Raw,
    ElevenLabs.conversationalAi.knowledgeBase.RagIndexRequestModel
> = core.serialization.object({
    model: EmbeddingModelEnum,
});

export declare namespace RagIndexRequestModel {
    export interface Raw {
        model: EmbeddingModelEnum.Raw;
    }
}
