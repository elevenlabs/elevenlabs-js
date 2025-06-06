/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";
import { EmbeddingModelEnum } from "./EmbeddingModelEnum";

export const RagIndexOverviewEmbeddingModelResponseModel: core.serialization.ObjectSchema<
    serializers.RagIndexOverviewEmbeddingModelResponseModel.Raw,
    ElevenLabs.RagIndexOverviewEmbeddingModelResponseModel
> = core.serialization.object({
    model: EmbeddingModelEnum,
    usedBytes: core.serialization.property("used_bytes", core.serialization.number()),
});

export declare namespace RagIndexOverviewEmbeddingModelResponseModel {
    export interface Raw {
        model: EmbeddingModelEnum.Raw;
        used_bytes: number;
    }
}
