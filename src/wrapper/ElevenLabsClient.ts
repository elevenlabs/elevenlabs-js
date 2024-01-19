import { ElevenLabsClient as FernClient } from "../Client";
import * as ElevenLabs from "../api";
import * as core from "../core";
import * as errors from "../errors";

export declare namespace ElevenLabsClient {
    interface Options {
        /**
         * Your ElevenLabs API Key. Defaults to the environment
         * variable ELEVENLABS_API_KEY.
         */
        apiKey?: core.Supplier<string>;
    }
}

export class ElevenLabsClient extends FernClient {
    constructor(options: ElevenLabsClient.Options = {}) {
        const apiKey = options.apiKey ?? process.env["ELEVENLABS_API_KEY"];
        if (apiKey == null) {
            throw new errors.ElevenLabsError({
                message: "Please pass in your ElevenLabs API Key or export ELEVENLABS_API_KEY in your environment.",
            });
        }
        super({
            xiApiKey: apiKey,
        });
    }
}
