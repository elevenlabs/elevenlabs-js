/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as environments from "../../../../environments";
import * as core from "../../../../core";
import * as ElevenLabs from "../../../index";
import urlJoin from "url-join";
import * as errors from "../../../../errors/index";

export declare namespace AudioNative {
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

export class AudioNative {
    constructor(protected readonly _options: AudioNative.Options = {}) {}

    /**
     * Creates Audio Native enabled project, optionally starts conversion and returns project ID and embeddable HTML snippet.
     *
     * @param {ElevenLabs.BodyCreatesAudioNativeEnabledProjectV1AudioNativePost} request
     * @param {AudioNative.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link ElevenLabs.UnprocessableEntityError}
     *
     * @example
     *     await client.audioNative.create({
     *         name: "name"
     *     })
     */
    public async create(
        request: ElevenLabs.BodyCreatesAudioNativeEnabledProjectV1AudioNativePost,
        requestOptions?: AudioNative.RequestOptions,
    ): Promise<ElevenLabs.AudioNativeCreateProjectResponseModel> {
        const _request = await core.newFormData();
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

        if (request.file != null) {
            await _request.appendFile("file", request.file);
        }

        if (request.auto_convert != null) {
            _request.append("auto_convert", request.auto_convert.toString());
        }

        const _maybeEncodedRequest = await _request.getRequest();
        const _response = await core.fetcher({
            url: urlJoin(
                (await core.Supplier.get(this._options.baseUrl)) ??
                    (await core.Supplier.get(this._options.environment)) ??
                    environments.ElevenLabsEnvironment.Production,
                "v1/audio-native",
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
            requestType: "file",
            duplex: _maybeEncodedRequest.duplex,
            body: _maybeEncodedRequest.body,
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 60000,
            maxRetries: requestOptions?.maxRetries,
            abortSignal: requestOptions?.abortSignal,
        });
        if (_response.ok) {
            return _response.body as ElevenLabs.AudioNativeCreateProjectResponseModel;
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
                throw new errors.ElevenLabsTimeoutError("Timeout exceeded when calling POST /v1/audio-native.");
            case "unknown":
                throw new errors.ElevenLabsError({
                    message: _response.error.errorMessage,
                });
        }
    }

    /**
     * Get player settings for the specific project.
     *
     * @param {string} projectId - The ID of the Studio project.
     * @param {AudioNative.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link ElevenLabs.UnprocessableEntityError}
     *
     * @example
     *     await client.audioNative.getSettings("21m00Tcm4TlvDq8ikWAM")
     */
    public async getSettings(
        projectId: string,
        requestOptions?: AudioNative.RequestOptions,
    ): Promise<ElevenLabs.GetAudioNativeProjectSettingsResponseModel> {
        const _response = await core.fetcher({
            url: urlJoin(
                (await core.Supplier.get(this._options.baseUrl)) ??
                    (await core.Supplier.get(this._options.environment)) ??
                    environments.ElevenLabsEnvironment.Production,
                `v1/audio-native/${encodeURIComponent(projectId)}/settings`,
            ),
            method: "GET",
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
                ...requestOptions?.headers,
            },
            contentType: "application/json",
            requestType: "json",
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 60000,
            maxRetries: requestOptions?.maxRetries,
            abortSignal: requestOptions?.abortSignal,
        });
        if (_response.ok) {
            return _response.body as ElevenLabs.GetAudioNativeProjectSettingsResponseModel;
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
                throw new errors.ElevenLabsTimeoutError(
                    "Timeout exceeded when calling GET /v1/audio-native/{project_id}/settings.",
                );
            case "unknown":
                throw new errors.ElevenLabsError({
                    message: _response.error.errorMessage,
                });
        }
    }

    /**
     * Updates content for the specific AudioNative Project.
     *
     * @param {string} projectId
     * @param {ElevenLabs.BodyUpdateAudioNativeProjectContentV1AudioNativeProjectIdContentPost} request
     * @param {AudioNative.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link ElevenLabs.UnprocessableEntityError}
     *
     * @example
     *     await client.audioNative.updateContent("21m00Tcm4TlvDq8ikWAM", {})
     */
    public async updateContent(
        projectId: string,
        request: ElevenLabs.BodyUpdateAudioNativeProjectContentV1AudioNativeProjectIdContentPost,
        requestOptions?: AudioNative.RequestOptions,
    ): Promise<ElevenLabs.AudioNativeEditContentResponseModel> {
        const _request = await core.newFormData();
        if (request.file != null) {
            await _request.appendFile("file", request.file);
        }

        if (request.auto_convert != null) {
            _request.append("auto_convert", request.auto_convert.toString());
        }

        if (request.auto_publish != null) {
            _request.append("auto_publish", request.auto_publish.toString());
        }

        const _maybeEncodedRequest = await _request.getRequest();
        const _response = await core.fetcher({
            url: urlJoin(
                (await core.Supplier.get(this._options.baseUrl)) ??
                    (await core.Supplier.get(this._options.environment)) ??
                    environments.ElevenLabsEnvironment.Production,
                `v1/audio-native/${encodeURIComponent(projectId)}/content`,
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
            requestType: "file",
            duplex: _maybeEncodedRequest.duplex,
            body: _maybeEncodedRequest.body,
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 60000,
            maxRetries: requestOptions?.maxRetries,
            abortSignal: requestOptions?.abortSignal,
        });
        if (_response.ok) {
            return _response.body as ElevenLabs.AudioNativeEditContentResponseModel;
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
                throw new errors.ElevenLabsTimeoutError(
                    "Timeout exceeded when calling POST /v1/audio-native/{project_id}/content.",
                );
            case "unknown":
                throw new errors.ElevenLabsError({
                    message: _response.error.errorMessage,
                });
        }
    }
}
