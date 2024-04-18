/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as environments from "../../../../environments";
import * as core from "../../../../core";
import * as fs from "fs";
import * as ElevenLabs from "../../..";
import { default as FormData } from "form-data";
import urlJoin from "url-join";
import * as errors from "../../../../errors";

export declare namespace AudioNative {
    interface Options {
        environment?: core.Supplier<environments.ElevenLabsEnvironment | string>;
        apiKey?: core.Supplier<string | undefined>;
    }

    interface RequestOptions {
        timeoutInSeconds?: number;
        maxRetries?: number;
    }
}

export class AudioNative {
    constructor(protected readonly _options: AudioNative.Options = {}) {}

    /**
     * Creates AudioNative enabled project, optionally starts conversion and returns project id and embeddable html snippet.
     * @throws {@link ElevenLabs.UnprocessableEntityError}
     */
    public async create(
        file: File | fs.ReadStream,
        request: ElevenLabs.BodyCreatesAudioNativeEnabledProjectV1AudioNativePost,
        requestOptions?: AudioNative.RequestOptions
    ): Promise<ElevenLabs.AudioNativeCreateProjectResponseModel> {
        const _request = new FormData();
        _request.append("name", request.name);
        if (request.image != null) {
            _request.append("image", request.image);
        }

        if (request.author != null) {
            _request.append("author", request.author);
        }

        if (request.title != null) {
            _request.append("title", request.title);
        }

        if (request.small != null) {
            _request.append("small", request.small.toString());
        }

        if (request.text_color != null) {
            _request.append("text_color", request.text_color);
        }

        if (request.background_color != null) {
            _request.append("background_color", request.background_color);
        }

        if (request.sessionization != null) {
            _request.append("sessionization", request.sessionization.toString());
        }

        if (request.voice_id != null) {
            _request.append("voice_id", request.voice_id);
        }

        if (request.model_id != null) {
            _request.append("model_id", request.model_id);
        }

        _request.append("file", file);
        if (request.auto_convert != null) {
            _request.append("auto_convert", request.auto_convert.toString());
        }

        const _response = await core.fetcher({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.ElevenLabsEnvironment.Production,
                "v1/audio-native"
            ),
            method: "POST",
            headers: {
                "xi-api-key":
                    (await core.Supplier.get(this._options.apiKey)) != null
                        ? await core.Supplier.get(this._options.apiKey)
                        : undefined,
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "elevenlabs",
                "X-Fern-SDK-Version": "v0.1.7",
                "X-Fern-Runtime": core.RUNTIME.type,
                "X-Fern-Runtime-Version": core.RUNTIME.version,
            },
            contentType: "multipart/form-data; boundary=" + _request.getBoundary(),
            body: _request,
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 60000,
            maxRetries: requestOptions?.maxRetries,
        });
        if (_response.ok) {
            return _response.body as ElevenLabs.AudioNativeCreateProjectResponseModel;
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
