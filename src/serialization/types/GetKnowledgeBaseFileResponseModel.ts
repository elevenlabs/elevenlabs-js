/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";
import { KnowledgeBaseDocumentMetadataResponseModel } from "./KnowledgeBaseDocumentMetadataResponseModel";
import { ResourceAccessInfo } from "./ResourceAccessInfo";

export const GetKnowledgeBaseFileResponseModel: core.serialization.ObjectSchema<
    serializers.GetKnowledgeBaseFileResponseModel.Raw,
    ElevenLabs.GetKnowledgeBaseFileResponseModel
> = core.serialization.object({
    id: core.serialization.string(),
    name: core.serialization.string(),
    metadata: KnowledgeBaseDocumentMetadataResponseModel,
    promptInjectable: core.serialization.property("prompt_injectable", core.serialization.boolean()),
    accessInfo: core.serialization.property("access_info", ResourceAccessInfo),
    extractedInnerHtml: core.serialization.property("extracted_inner_html", core.serialization.string()),
});

export declare namespace GetKnowledgeBaseFileResponseModel {
    export interface Raw {
        id: string;
        name: string;
        metadata: KnowledgeBaseDocumentMetadataResponseModel.Raw;
        prompt_injectable: boolean;
        access_info: ResourceAccessInfo.Raw;
        extracted_inner_html: string;
    }
}
