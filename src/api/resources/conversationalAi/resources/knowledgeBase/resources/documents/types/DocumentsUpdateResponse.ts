/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../../../../../../../index";

export type DocumentsUpdateResponse =
    | ElevenLabs.conversationalAi.knowledgeBase.DocumentsUpdateResponse.Url
    | ElevenLabs.conversationalAi.knowledgeBase.DocumentsUpdateResponse.File_
    | ElevenLabs.conversationalAi.knowledgeBase.DocumentsUpdateResponse.Text;

export namespace DocumentsUpdateResponse {
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
