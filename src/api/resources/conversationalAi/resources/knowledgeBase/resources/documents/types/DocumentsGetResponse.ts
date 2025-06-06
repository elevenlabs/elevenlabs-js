/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../../../../../../../index";

export type DocumentsGetResponse =
    | ElevenLabs.conversationalAi.knowledgeBase.DocumentsGetResponse.Url
    | ElevenLabs.conversationalAi.knowledgeBase.DocumentsGetResponse.File_
    | ElevenLabs.conversationalAi.knowledgeBase.DocumentsGetResponse.Text;

export namespace DocumentsGetResponse {
    export interface Url extends ElevenLabs.GetKnowledgeBaseUrlResponseModel {
        type: "url";
    }

    export interface File_ extends ElevenLabs.GetKnowledgeBaseFileResponseModel {
        type: "file";
    }

    export interface Text extends ElevenLabs.GetKnowledgeBaseTextResponseModel {
        type: "text";
    }
}
