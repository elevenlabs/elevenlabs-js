import { ElevenLabsClient as FernClient } from "../Client";
import type * as core from "../core";
import { WebhooksClient } from "./webhooks";
import { Music } from "./music";
import { MusicClient as GeneratedMusic } from "../api/resources/music/client/Client";
import { SpeechToText } from "./speechToText";
import { resolveApiKey } from "./utils";

export declare namespace ElevenLabsClient {
    interface Options extends Omit<FernClient.Options, "apiKey"> {
        /**
         * Your ElevenLabs API Key. Defaults to the environment
         * variable ELEVENLABS_API_KEY.
         */
        apiKey?: core.Supplier<string>;
    }
}

export class ElevenLabsClient extends FernClient {
    private _customWebhooks: WebhooksClient | undefined;
    private _customMusic: Music | undefined;
    private _customSpeechToText: SpeechToText | undefined;

    constructor(options: ElevenLabsClient.Options = {}) {
        const apiKey = resolveApiKey(options.apiKey);
        super({ ...options, apiKey });
    }

    public get webhooks(): WebhooksClient {
        if (!this._customWebhooks) {
            this._customWebhooks = new WebhooksClient(this._options);
        }
        return this._customWebhooks;
    }

    public override get music(): GeneratedMusic {
        if (!this._customMusic) {
            this._customMusic = new Music(this._options);
        }
        // Return wrapper Music cast as GeneratedMusic to maintain type compatibility
        // The wrapper has enhanced composeDetailed that returns MultipartResponse
        return this._customMusic as any as GeneratedMusic;
    }

    public get speechToText(): SpeechToText {
        if (!this._customSpeechToText) {
            this._customSpeechToText = new SpeechToText(this._options);
        }
        return this._customSpeechToText;
    }
}
