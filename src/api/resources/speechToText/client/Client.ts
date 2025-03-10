/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as environments from "../../../../environments";
import * as core from "../../../../core";
import * as ElevenLabs from "../../../index";
import * as fs from "fs";
import urlJoin from "url-join";
import * as errors from "../../../../errors/index";

export declare namespace SpeechToText {
    export interface Options {
        environment?: core.Supplier<environments.ElevenLabsEnvironment | string>;
        /** Specify a custom URL to connect the client to. */
        baseUrl?: core.Supplier<string>;
        /** Override the xi-api-key header */
        apiKey?: core.Supplier<string | undefined>;
    }

    export interface RequestOptions {
        /** The maximum time to wait for a response in seconds. */
        timeoutInSeconds?: number;
        /** The number of times to retry the request. Defaults to 2. */
        maxRetries?: number;
        /** A hook to abort the request. */
        abortSignal?: AbortSignal;
        /** Override the xi-api-key header */
        apiKey?: string | undefined;
        /** Additional headers to include in the request. */
        headers?: Record<string, string>;
    }
}

export class SpeechToText {
    constructor(protected readonly _options: SpeechToText.Options = {}) {}

    /**
     * Transcribe an audio or video file.
     *
     * @param {ElevenLabs.BodySpeechToTextV1SpeechToTextPost} request
     * @param {SpeechToText.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link ElevenLabs.UnprocessableEntityError}
     *
     * @example
     *     await client.speechToText.convert({
     *         file: fs.createReadStream("/path/to/your/file"),
     *         model_id: "model_id"
     *     })
     */
    public async convert(
        request: ElevenLabs.BodySpeechToTextV1SpeechToTextPost,
        requestOptions?: SpeechToText.RequestOptions,
    ): Promise<ElevenLabs.SpeechToTextChunkResponseModel> {
        const _queryParams: Record<string, string | string[] | object | object[] | null> = {};
        if (request.enable_logging != null) {
            _queryParams["enable_logging"] = request.enable_logging.toString();
        }

        const _request = await core.newFormData();
        _request.append("model_id", request.model_id);
        await _request.appendFile("file", request.file);
        if (request.language_code != null) {
            _request.append("language_code", request.language_code);
        }

        if (request.tag_audio_events != null) {
            _request.append("tag_audio_events", request.tag_audio_events.toString());
        }

        if (request.num_speakers != null) {
            _request.append("num_speakers", request.num_speakers.toString());
        }

        if (request.timestamps_granularity != null) {
            _request.append("timestamps_granularity", request.timestamps_granularity);
        }

        if (request.diarize != null) {
            _request.append("diarize", request.diarize.toString());
        }

        if (request.biased_keywords != null) {
            for (const _item of request.biased_keywords) {
                _request.append("biased_keywords", _item);
            }
        }

        const _maybeEncodedRequest = await _request.getRequest();
        const _response = await core.fetcher({
            url: urlJoin(
                (await core.Supplier.get(this._options.baseUrl)) ??
                    (await core.Supplier.get(this._options.environment)) ??
                    environments.ElevenLabsEnvironment.Production,
                "v1/speech-to-text",
            ),
            method: "POST",
            headers: {
                "xi-api-key":
                    (await core.Supplier.get(this._options.apiKey)) != null
                        ? await core.Supplier.get(this._options.apiKey)
                        : undefined,
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "elevenlabs",
                "X-Fern-SDK-Version": "1.54.0",
                "User-Agent": "elevenlabs/1.54.0",
                "X-Fern-Runtime": core.RUNTIME.type,
                "X-Fern-Runtime-Version": core.RUNTIME.version,
                ..._maybeEncodedRequest.headers,
                ...requestOptions?.headers,
            },
            queryParameters: _queryParams,
            requestType: "file",
            duplex: _maybeEncodedRequest.duplex,
            body: _maybeEncodedRequest.body,
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 60000,
            maxRetries: requestOptions?.maxRetries,
            abortSignal: requestOptions?.abortSignal,
        });
        if (_response.ok) {
            return _response.body as ElevenLabs.SpeechToTextChunkResponseModel;
        }

        if (_response.error.reason === "status-code") {
            switch (_response.error.statusCode) {
                case 422:
                    throw new ElevenLabs.UnprocessableEntityError(
                        _response.error.body as ElevenLabs.HttpValidationError,
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
                throw new errors.ElevenLabsTimeoutError("Timeout exceeded when calling POST /v1/speech-to-text.");
            case "unknown":
                throw new errors.ElevenLabsError({
                    message: _response.error.errorMessage,
                });
        }
    }
}
