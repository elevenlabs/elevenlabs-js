import { SpeechToTextClient as GeneratedSpeechToText } from "../api/resources/speechToText/client/Client";
import type { SpeechToTextClient } from "../api/resources/speechToText/client/Client";
import type * as ElevenLabs from "../api";
import type * as core from "../core";
import { ScribeRealtime } from "./realtime";

export class SpeechToText extends GeneratedSpeechToText {
    private _realtime: ScribeRealtime | undefined;

    public get realtime(): ScribeRealtime {
        if (!this._realtime) {
            this._realtime = new ScribeRealtime(this._options);
        }
        return this._realtime;
    }

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
    ): core.HttpResponsePromise<ElevenLabs.SpeechToTextConvertResponse> {
        return super.convert(request, requestOptions);
    }
}
