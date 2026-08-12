import type * as ElevenLabs from "../api";
import type { SpeechToTextClient } from "../api/resources/speechToText/client/Client";
import { SpeechToTextClient as GeneratedSpeechToText } from "../api/resources/speechToText/client/Client";
import type * as core from "../core";

export class SpeechToText extends GeneratedSpeechToText {
    public convert(
        request: ElevenLabs.BodySpeechToTextV1SpeechToTextPost & { webhook: true },
        requestOptions?: SpeechToTextClient.RequestOptions,
    ): core.HttpResponsePromise<ElevenLabs.SpeechToTextWebhookResponseModel>;

    public convert(
        request: ElevenLabs.BodySpeechToTextV1SpeechToTextPost & { useMultiChannel: true },
        requestOptions?: SpeechToTextClient.RequestOptions,
    ): core.HttpResponsePromise<ElevenLabs.MultichannelSpeechToTextResponseModel>;

    public convert(
        request: ElevenLabs.BodySpeechToTextV1SpeechToTextPost,
        requestOptions?: SpeechToTextClient.RequestOptions,
    ): core.HttpResponsePromise<ElevenLabs.SpeechToTextChunkResponseModel>;

    public convert(
        request: ElevenLabs.BodySpeechToTextV1SpeechToTextPost,
        requestOptions?: SpeechToTextClient.RequestOptions,
    ): core.HttpResponsePromise<ElevenLabs.ConvertSpeechToTextResponse> {
        return super.convert(request, requestOptions);
    }
}
