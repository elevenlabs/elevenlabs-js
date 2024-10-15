/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as environments from "../../../../environments";
import * as core from "../../../../core";
import * as ElevenLabs from "../../../index";
import * as stream from "stream";
import urlJoin from "url-join";
import * as errors from "../../../../errors/index";

export declare namespace SpeechToSpeech {
    interface Options {
        environment?: core.Supplier<environments.ElevenLabsEnvironment | string>;
        /** Override the xi-api-key header */
        apiKey?: core.Supplier<string | undefined>;
    }

    interface RequestOptions {
        /** The maximum time to wait for a response in seconds. */
        timeoutInSeconds?: number;
        /** The number of times to retry the request. Defaults to 2. */
        maxRetries?: number;
        /** A hook to abort the request. */
        abortSignal?: AbortSignal;
        /** Override the xi-api-key header */
        apiKey?: string | undefined;
    }
}

export class SpeechToSpeech {
    constructor(protected readonly _options: SpeechToSpeech.Options = {}) {}

    /**
     * Create speech by combining the content and emotion of the uploaded audio with a voice of your choice.
     * @throws {@link ElevenLabs.UnprocessableEntityError}
     */
    public async convert(
        voiceId: string,
        request: ElevenLabs.BodySpeechToSpeechV1SpeechToSpeechVoiceIdPost,
        requestOptions?: SpeechToSpeech.RequestOptions
    ): Promise<stream.Readable> {
        const _queryParams: Record<string, string | string[] | object | object[]> = {};
        if (request.enable_logging != null) {
            _queryParams["enable_logging"] = request.enable_logging.toString();
        }

        if (request.optimize_streaming_latency != null) {
            _queryParams["optimize_streaming_latency"] = request.optimize_streaming_latency;
        }

        if (request.output_format != null) {
            _queryParams["output_format"] = request.output_format;
        }

        const _request = await core.newFormData();
        await _request.appendFile("audio", request.audio);
        if (request.model_id != null) {
            await _request.append("model_id", request.model_id);
        }

        if (request.voice_settings != null) {
            await _request.append("voice_settings", request.voice_settings);
        }

        if (request.seed != null) {
            await _request.append("seed", request.seed.toString());
        }

        const _maybeEncodedRequest = await _request.getRequest();
        const _response = await core.fetcher<stream.Readable>({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.ElevenLabsEnvironment.Production,
                `v1/speech-to-speech/${encodeURIComponent(voiceId)}`
            ),
            method: "POST",
            headers: {
                "xi-api-key":
                    (await core.Supplier.get(this._options.apiKey)) != null
                        ? await core.Supplier.get(this._options.apiKey)
                        : undefined,
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "elevenlabs",
                "X-Fern-SDK-Version": "0.17.0",
                "User-Agent": "elevenlabs/0.17.0",
                "X-Fern-Runtime": core.RUNTIME.type,
                "X-Fern-Runtime-Version": core.RUNTIME.version,
                ..._maybeEncodedRequest.headers,
            },
            queryParameters: _queryParams,
            requestType: "file",
            duplex: _maybeEncodedRequest.duplex,
            body: _maybeEncodedRequest.body,
            responseType: "streaming",
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 60000,
            maxRetries: requestOptions?.maxRetries,
            abortSignal: requestOptions?.abortSignal,
        });
        if (_response.ok) {
            return _response.body;
        }

        if (_response.error.reason === "status-code") {
            switch (_response.error.statusCode) {
                case 422:
                    throw new ElevenLabs.UnprocessableEntityError(
                        _response.error.body as ElevenLabs.HttpValidationError
                    );
                default:
                    throw new errors.ElevenLabsError({
                        statusCode: _response.error.statusCode,
                        body: _response.error.body,
                    });
            }
        }

        switch (_response.error.reason) {
            case "non-json":
                throw new errors.ElevenLabsError({
                    statusCode: _response.error.statusCode,
                    body: _response.error.rawBody,
                });
            case "timeout":
                throw new errors.ElevenLabsTimeoutError();
            case "unknown":
                throw new errors.ElevenLabsError({
                    message: _response.error.errorMessage,
                });
        }
    }

    /**
     * Create speech by combining the content and emotion of the uploaded audio with a voice of your choice and returns an audio stream.
     * @throws {@link ElevenLabs.UnprocessableEntityError}
     */
    public async convertAsStream(
        voiceId: string,
        request: ElevenLabs.BodySpeechToSpeechStreamingV1SpeechToSpeechVoiceIdStreamPost,
        requestOptions?: SpeechToSpeech.RequestOptions
    ): Promise<stream.Readable> {
        const _queryParams: Record<string, string | string[] | object | object[]> = {};
        if (request.enable_logging != null) {
            _queryParams["enable_logging"] = request.enable_logging;
        }

        if (request.optimize_streaming_latency != null) {
            _queryParams["optimize_streaming_latency"] = request.optimize_streaming_latency;
        }

        if (request.output_format != null) {
            _queryParams["output_format"] = request.output_format;
        }

        const _request = await core.newFormData();
        await _request.appendFile("audio", request.audio);
        if (request.model_id != null) {
            await _request.append("model_id", request.model_id);
        }

        if (request.voice_settings != null) {
            await _request.append("voice_settings", request.voice_settings);
        }

        if (request.seed != null) {
            await _request.append("seed", request.seed.toString());
        }

        const _maybeEncodedRequest = await _request.getRequest();
        const _response = await core.fetcher<stream.Readable>({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.ElevenLabsEnvironment.Production,
                `v1/speech-to-speech/${encodeURIComponent(voiceId)}/stream`
            ),
            method: "POST",
            headers: {
                "xi-api-key":
                    (await core.Supplier.get(this._options.apiKey)) != null
                        ? await core.Supplier.get(this._options.apiKey)
                        : undefined,
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "elevenlabs",
                "X-Fern-SDK-Version": "0.17.0",
                "User-Agent": "elevenlabs/0.17.0",
                "X-Fern-Runtime": core.RUNTIME.type,
                "X-Fern-Runtime-Version": core.RUNTIME.version,
                ..._maybeEncodedRequest.headers,
            },
            queryParameters: _queryParams,
            requestType: "file",
            duplex: _maybeEncodedRequest.duplex,
            body: _maybeEncodedRequest.body,
            responseType: "streaming",
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 60000,
            maxRetries: requestOptions?.maxRetries,
            abortSignal: requestOptions?.abortSignal,
        });
        if (_response.ok) {
            return _response.body;
        }

        if (_response.error.reason === "status-code") {
            switch (_response.error.statusCode) {
                case 422:
                    throw new ElevenLabs.UnprocessableEntityError(
                        _response.error.body as ElevenLabs.HttpValidationError
                    );
                default:
                    throw new errors.ElevenLabsError({
                        statusCode: _response.error.statusCode,
                        body: _response.error.body,
                    });
            }
        }

        switch (_response.error.reason) {
            case "non-json":
                throw new errors.ElevenLabsError({
                    statusCode: _response.error.statusCode,
                    body: _response.error.rawBody,
                });
            case "timeout":
                throw new errors.ElevenLabsTimeoutError();
            case "unknown":
                throw new errors.ElevenLabsError({
                    message: _response.error.errorMessage,
                });
        }
    }
}
