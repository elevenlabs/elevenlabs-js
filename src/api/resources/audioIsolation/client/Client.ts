/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as environments from "../../../../environments";
import * as core from "../../../../core";
import * as ElevenLabs from "../../../index";
import * as stream from "stream";
import urlJoin from "url-join";
import * as errors from "../../../../errors/index";

export declare namespace AudioIsolation {
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

export class AudioIsolation {
    constructor(protected readonly _options: AudioIsolation.Options = {}) {}

    /**
     * Removes background noise from audio
     * @throws {@link ElevenLabs.UnprocessableEntityError}
     */
    public async audioIsolation(
        request: ElevenLabs.BodyAudioIsolationV1AudioIsolationPost,
        requestOptions?: AudioIsolation.RequestOptions
    ): Promise<stream.Readable> {
        const _request = await core.newFormData();
        await _request.appendFile("audio", request.audio);
        const _maybeEncodedRequest = await _request.getRequest();
        const _response = await core.fetcher<stream.Readable>({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.ElevenLabsEnvironment.Production,
                "v1/audio-isolation"
            ),
            method: "POST",
            headers: {
                "xi-api-key":
                    (await core.Supplier.get(this._options.apiKey)) != null
                        ? await core.Supplier.get(this._options.apiKey)
                        : undefined,
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "elevenlabs",
                "X-Fern-SDK-Version": "0.18.2",
                "User-Agent": "elevenlabs/0.18.2",
                "X-Fern-Runtime": core.RUNTIME.type,
                "X-Fern-Runtime-Version": core.RUNTIME.version,
                ..._maybeEncodedRequest.headers,
            },
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
     * Removes background noise from audio and streams the result
     * @throws {@link ElevenLabs.UnprocessableEntityError}
     */
    public async audioIsolationStream(
        request: ElevenLabs.BodyAudioIsolationStreamV1AudioIsolationStreamPost,
        requestOptions?: AudioIsolation.RequestOptions
    ): Promise<stream.Readable> {
        const _request = await core.newFormData();
        await _request.appendFile("audio", request.audio);
        const _maybeEncodedRequest = await _request.getRequest();
        const _response = await core.fetcher<stream.Readable>({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.ElevenLabsEnvironment.Production,
                "v1/audio-isolation/stream"
            ),
            method: "POST",
            headers: {
                "xi-api-key":
                    (await core.Supplier.get(this._options.apiKey)) != null
                        ? await core.Supplier.get(this._options.apiKey)
                        : undefined,
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "elevenlabs",
                "X-Fern-SDK-Version": "0.18.2",
                "User-Agent": "elevenlabs/0.18.2",
                "X-Fern-Runtime": core.RUNTIME.type,
                "X-Fern-Runtime-Version": core.RUNTIME.version,
                ..._maybeEncodedRequest.headers,
            },
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
