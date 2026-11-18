import type { MusicClient as GeneratedMusic } from "../api/resources/music/client/Client";
import { ElevenLabsClient as FernClient } from "../Client";
import type * as core from "../core";
import * as errors from "../errors";
import { Flows } from "./flows";
import { Music } from "./music";
import { SpeechEngineClientWrapper } from "./speech-engine";
import { SpeechToText } from "./speechToText";
import { WebhooksClient } from "./webhooks";

export declare namespace ElevenLabsClient {
    interface Options extends FernClient.Options {
        /**
         * Your ElevenLabs API Key. Defaults to the environment
         * variable ELEVENLABS_API_KEY.
         */
        apiKey?: core.Supplier<string>;
    }
}

class ElevenLabsClientImpl extends FernClient {
    private _customWebhooks: WebhooksClient | undefined;
    private _customMusic: Music | undefined;
    private _customSpeechToText: SpeechToText | undefined;
    private _customFlows: Flows | undefined;

    constructor(options: ElevenLabsClient.Options = {}) {
        const apiKey = options.apiKey ?? process.env.ELEVENLABS_API_KEY;
        if (apiKey == null) {
            throw new errors.ElevenLabsError({
                message: "Please pass in your ElevenLabs API Key or export ELEVENLABS_API_KEY in your environment.",
            });
        }
        options.apiKey = apiKey;
        super(options);

        // Own-property getter shadows FernClient.speechEngine. An `override`
        // would be an illegal declaration: the wrapper is not a SpeechEngineClient.
        const clientOptions = this._options;
        let custom: SpeechEngineClientWrapper | undefined;
        Object.defineProperty(this, "speechEngine", {
            configurable: true,
            enumerable: false,
            get(): SpeechEngineClientWrapper {
                if (custom === undefined) {
                    custom = new SpeechEngineClientWrapper(clientOptions);
                }
                return custom;
            },
        });
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

    public override get flows(): Flows {
        if (!this._customFlows) {
            this._customFlows = new Flows(this._options);
        }
        return this._customFlows;
    }
}

type ElevenLabsClientInstance = Omit<ElevenLabsClientImpl, "speechEngine"> & {
    readonly speechEngine: SpeechEngineClientWrapper;
};

export type ElevenLabsClient = ElevenLabsClientInstance;

export const ElevenLabsClient: new (options?: ElevenLabsClient.Options) => ElevenLabsClient =
    ElevenLabsClientImpl as unknown as new (
        options?: ElevenLabsClient.Options,
    ) => ElevenLabsClient;
