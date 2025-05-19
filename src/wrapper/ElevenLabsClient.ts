import { ElevenLabsClient as FernClient } from "../Client";
import * as ElevenLabs from "../api";
import * as core from "../core";
import * as errors from "../errors";
import * as stream from "node:stream";
import { WebhooksClient } from "./webhooks";

export declare namespace ElevenLabsClient {
    interface Options extends FernClient.Options {
        /**
         * Your ElevenLabs API Key. Defaults to the environment
         * variable ELEVENLABS_API_KEY.
         */
        apiKey?: core.Supplier<string>;
    }

    interface GeneratAudioBulk extends ElevenLabs.TextToSpeechRequest {}

    interface GenerateAudioStream extends ElevenLabs.StreamTextToSpeechRequest {
        /* Specify stream: true if you would like to get the audio in chunks */
        stream: true;
    }
}

export class ElevenLabsClient extends FernClient {
    public readonly webhooks: WebhooksClient;

    constructor(options: ElevenLabsClient.Options = {}) {
        const apiKey = options.apiKey ?? process.env.ELEVENLABS_API_KEY;
        if (apiKey == null) {
            throw new errors.ElevenLabsError({
                message: "Please pass in your ElevenLabs API Key or export ELEVENLABS_API_KEY in your environment.",
            });
        }
        options.apiKey = apiKey;
        super(options);
        this.webhooks = new WebhooksClient();
    }
}
