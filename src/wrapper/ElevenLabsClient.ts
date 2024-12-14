import { ElevenLabsClient as FernClient } from "../Client";
import * as ElevenLabs from "../api";
import * as core from "../core";
import * as errors from "../errors";
import * as stream from "stream";

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
    constructor(options: ElevenLabsClient.Options = {}) {
        const apiKey = options.apiKey ?? process.env["ELEVENLABS_API_KEY"];
        if (apiKey == null) {
            throw new errors.ElevenLabsError({
                message: "Please pass in your ElevenLabs API Key or export ELEVENLABS_API_KEY in your environment.",
            });
        }
        options.apiKey = apiKey;
        super(options);
    }

    /**
     * Generates audio for a voice.
     *
     * @example Generate the entire audio
     * import { play } from "elevenlabs";
     *
     * const audio = eleven.generate({
     *   voiceId: "Matilda" // defaults to Sarah
     * })
     * await play(audio);
     *
     * @example
     * import { stream } from "elevenlabs"
     *
     * const audioStream = eleven.generate({
     *   stream: true,
     *   voice: "Sarah"
     * })
     * await stream(audioStream);
     */
    async generate(
        request: (ElevenLabsClient.GeneratAudioBulk | ElevenLabsClient.GenerateAudioStream) & { voice?: string },
        requestOptions: FernClient.RequestOptions = {}
    ): Promise<stream.Readable> {
        const voiceIdOrName = request.voice ?? "Sarah";
        const voiceId = isVoiceId(voiceIdOrName)
            ? voiceIdOrName
            : (
                  await this.voices.getAll({
                      show_legacy: true,
                  })
              ).voices.filter((voice) => voice.name === voiceIdOrName)[0]?.voice_id;
        if (voiceId == null) {
            throw new errors.ElevenLabsError({
                message: `${voiceIdOrName} is not a valid voice name`,
            });
        }
        if (isGenerateAudioStream(request)) {
            return await this.textToSpeech.convertAsStream(voiceId, request, requestOptions);
        } else {
            return await this.textToSpeech.convert(voiceId, request, requestOptions);
        }
    }
}

function isGenerateAudioStream(
    value: ElevenLabsClient.GeneratAudioBulk | ElevenLabsClient.GenerateAudioStream
): value is ElevenLabsClient.GenerateAudioStream {
    return (value as ElevenLabsClient.GenerateAudioStream).stream != null;
}

function isVoiceId(val: string): boolean {
    return /^[a-zA-Z0-9]{20}$/.test(val);
}
