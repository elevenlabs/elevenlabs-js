/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";

export const KnowledgeBaseDocumentChunkResponseModel: core.serialization.ObjectSchema<
    serializers.KnowledgeBaseDocumentChunkResponseModel.Raw,
    ElevenLabs.KnowledgeBaseDocumentChunkResponseModel
> = core.serialization.object({
    id: core.serialization.string(),
    name: core.serialization.string(),
    content: core.serialization.string(),
});

export declare namespace KnowledgeBaseDocumentChunkResponseModel {
    export interface Raw {
        id: string;
        name: string;
        content: string;
    }
}
