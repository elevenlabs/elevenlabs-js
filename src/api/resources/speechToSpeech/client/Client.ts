/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as environments from "../../../../environments";
import * as core from "../../../../core";
import * as fs from "fs";
import * as ElevenLabs from "../../..";
import * as stream from "stream";
import { default as FormData } from "form-data";
import urlJoin from "url-join";
import * as errors from "../../../../errors";

export declare namespace SpeechToSpeech {
    interface Options {
        environment?: core.Supplier<environments.ElevenLabsEnvironment | string>;
        apiKey?: core.Supplier<string | undefined>;
    }

    interface RequestOptions {
        timeoutInSeconds?: number;
        maxRetries?: number;
    }
}

export class SpeechToSpeech {
    constructor(protected readonly _options: SpeechToSpeech.Options = {}) {}

    /**
     * Create speech by combining the content and emotion of the uploaded audio with a voice of your choice.
     */
    public async convert(
        audio: File | fs.ReadStream,
        voiceId: string,
        request: ElevenLabs.BodySpeechToSpeechV1SpeechToSpeechVoiceIdPost,
        requestOptions?: SpeechToSpeech.RequestOptions
    ): Promise<stream.Readable> {
        const _queryParams: Record<string, string | string[] | object | object[]> = {};
        if (request.optimize_streaming_latency != null) {
            _queryParams["optimize_streaming_latency"] = request.optimize_streaming_latency.toString();
        }

        const _request = new FormData();
        _request.append("audio", audio);
        if (request.model_id != null) {
            _request.append("model_id", request.model_id);
        }

        if (request.voice_settings != null) {
            _request.append("voice_settings", request.voice_settings);
        }

        const _response = await core.fetcher<stream.Readable>({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.ElevenLabsEnvironment.Production,
                `v1/speech-to-speech/${voiceId}`
            ),
            method: "POST",
            headers: {
                "xi-api-key":
                    (await core.Supplier.get(this._options.apiKey)) != null
                        ? await core.Supplier.get(this._options.apiKey)
                        : undefined,
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "elevenlabs",
                "X-Fern-SDK-Version": "v0.2.2",
                "X-Fern-Runtime": core.RUNTIME.type,
                "X-Fern-Runtime-Version": core.RUNTIME.version,
            },
            contentType: "multipart/form-data; boundary=" + _request.getBoundary(),
            queryParameters: _queryParams,
            body: _request,
            responseType: "streaming",
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 60000,
            maxRetries: requestOptions?.maxRetries,
        });
        if (_response.ok) {
            return _response.body;
        }

        if (_response.error.reason === "status-code") {
            throw new errors.ElevenLabsError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
            });
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
     */
    public async convertAsStream(
        audio: File | fs.ReadStream,
        voiceId: string,
        request: ElevenLabs.BodySpeechToSpeechStreamingV1SpeechToSpeechVoiceIdStreamPost,
        requestOptions?: SpeechToSpeech.RequestOptions
    ): Promise<stream.Readable> {
        const _queryParams: Record<string, string | string[] | object | object[]> = {};
        if (request.optimize_streaming_latency != null) {
            _queryParams["optimize_streaming_latency"] = request.optimize_streaming_latency.toString();
        }

        const _request = new FormData();
        _request.append("audio", audio);
        if (request.model_id != null) {
            _request.append("model_id", request.model_id);
        }

        if (request.voice_settings != null) {
            _request.append("voice_settings", request.voice_settings);
        }

        const _response = await core.fetcher<stream.Readable>({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.ElevenLabsEnvironment.Production,
                `v1/speech-to-speech/${voiceId}/stream`
            ),
            method: "POST",
            headers: {
                "xi-api-key":
                    (await core.Supplier.get(this._options.apiKey)) != null
                        ? await core.Supplier.get(this._options.apiKey)
                        : undefined,
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "elevenlabs",
                "X-Fern-SDK-Version": "v0.2.2",
                "X-Fern-Runtime": core.RUNTIME.type,
                "X-Fern-Runtime-Version": core.RUNTIME.version,
            },
            contentType: "multipart/form-data; boundary=" + _request.getBoundary(),
            queryParameters: _queryParams,
            body: _request,
            responseType: "streaming",
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 60000,
            maxRetries: requestOptions?.maxRetries,
        });
        if (_response.ok) {
            return _response.body;
        }

        if (_response.error.reason === "status-code") {
            throw new errors.ElevenLabsError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
            });
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
