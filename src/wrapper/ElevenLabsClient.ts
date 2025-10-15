import { ElevenLabsClient as FernClient } from "../Client";
import type * as ElevenLabs from "../api";
import type * as core from "../core";
import * as errors from "../errors";
import { WebhooksClient } from "./webhooks";
import { Music } from "./music";
import { Music as GeneratedMusic } from "../api/resources/music/client/Client";

export declare namespace ElevenLabsClient {
    interface Options extends FernClient.Options {
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

    constructor(options: ElevenLabsClient.Options = {}) {
        const apiKey = options.apiKey ?? process.env.ELEVENLABS_API_KEY;
        if (apiKey == null) {
            throw new errors.ElevenLabsError({
                message: "Please pass in your ElevenLabs API Key or export ELEVENLABS_API_KEY in your environment.",
            });
        }
        options.apiKey = apiKey;
        super(options);
    }

    public get webhooks(): WebhooksClient {
        if (!this._customWebhooks) {
            this._customWebhooks = new WebhooksClient(this._options);
        }
        return this._customWebhooks;
    }

    // @ts-expect-error - Intentionally overriding with wrapper Music that has enhanced composeDetailed
    public override get music(): Music {
        if (!this._customMusic) {
            this._customMusic = new Music(this._options);
        }
        return this._customMusic;
    }
}
