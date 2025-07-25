/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as environments from "../../../../environments";
import * as core from "../../../../core";
import * as ElevenLabs from "../../../index";
import * as serializers from "../../../../serialization/index";
import { mergeHeaders, mergeOnlyDefinedHeaders } from "../../../../core/headers";
import * as errors from "../../../../errors/index";
import { Resource } from "../resources/resource/client/Client";
import { Audio } from "../resources/audio/client/Client";
import { Transcript } from "../resources/transcript/client/Client";

export declare namespace Dubbing {
    export interface Options {
        environment?: core.Supplier<environments.ElevenLabsEnvironment | string>;
        /** Specify a custom URL to connect the client to. */
        baseUrl?: core.Supplier<string>;
        /** Override the xi-api-key header */
        apiKey?: core.Supplier<string | undefined>;
        /** Additional headers to include in requests. */
        headers?: Record<string, string | core.Supplier<string | undefined> | undefined>;
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
        headers?: Record<string, string | core.Supplier<string | undefined> | undefined>;
    }
}

export class Dubbing {
    protected readonly _options: Dubbing.Options;
    protected _resource: Resource | undefined;
    protected _audio: Audio | undefined;
    protected _transcript: Transcript | undefined;

    constructor(_options: Dubbing.Options = {}) {
        this._options = _options;
    }

    public get resource(): Resource {
        return (this._resource ??= new Resource(this._options));
    }

    public get audio(): Audio {
        return (this._audio ??= new Audio(this._options));
    }

    public get transcript(): Transcript {
        return (this._transcript ??= new Transcript(this._options));
    }

    /**
     * List the dubs you have access to.
     *
     * @param {ElevenLabs.DubbingListRequest} request
     * @param {Dubbing.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link ElevenLabs.UnprocessableEntityError}
     *
     * @example
     *     await client.dubbing.list()
     */
    public list(
        request: ElevenLabs.DubbingListRequest = {},
        requestOptions?: Dubbing.RequestOptions,
    ): core.HttpResponsePromise<ElevenLabs.DubbingMetadataPageResponseModel> {
        return core.HttpResponsePromise.fromPromise(this.__list(request, requestOptions));
    }

    private async __list(
        request: ElevenLabs.DubbingListRequest = {},
        requestOptions?: Dubbing.RequestOptions,
    ): Promise<core.WithRawResponse<ElevenLabs.DubbingMetadataPageResponseModel>> {
        const { cursor, pageSize, dubbingStatus, filterByCreator } = request;
        const _queryParams: Record<string, string | string[] | object | object[] | null> = {};
        if (cursor != null) {
            _queryParams["cursor"] = cursor;
        }

        if (pageSize != null) {
            _queryParams["page_size"] = pageSize.toString();
        }

        if (dubbingStatus != null) {
            _queryParams["dubbing_status"] = serializers.DubbingListRequestDubbingStatus.jsonOrThrow(dubbingStatus, {
                unrecognizedObjectKeys: "strip",
            });
        }

        if (filterByCreator != null) {
            _queryParams["filter_by_creator"] = serializers.DubbingListRequestFilterByCreator.jsonOrThrow(
                filterByCreator,
                { unrecognizedObjectKeys: "strip" },
            );
        }

        const _response = await core.fetcher({
            url: core.url.join(
                (await core.Supplier.get(this._options.baseUrl)) ??
                    (await core.Supplier.get(this._options.environment)) ??
                    environments.ElevenLabsEnvironment.Production,
                "v1/dubbing",
            ),
            method: "GET",
            headers: mergeHeaders(
                this._options?.headers,
                mergeOnlyDefinedHeaders({ "xi-api-key": requestOptions?.apiKey }),
                requestOptions?.headers,
            ),
            queryParameters: _queryParams,
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 240000,
            maxRetries: requestOptions?.maxRetries,
            abortSignal: requestOptions?.abortSignal,
        });
        if (_response.ok) {
            return {
                data: serializers.DubbingMetadataPageResponseModel.parseOrThrow(_response.body, {
                    unrecognizedObjectKeys: "passthrough",
                    allowUnrecognizedUnionMembers: true,
                    allowUnrecognizedEnumValues: true,
                    breadcrumbsPrefix: ["response"],
                }),
                rawResponse: _response.rawResponse,
            };
        }

        if (_response.error.reason === "status-code") {
            switch (_response.error.statusCode) {
                case 422:
                    throw new ElevenLabs.UnprocessableEntityError(
                        serializers.HttpValidationError.parseOrThrow(_response.error.body, {
                            unrecognizedObjectKeys: "passthrough",
                            allowUnrecognizedUnionMembers: true,
                            allowUnrecognizedEnumValues: true,
                            breadcrumbsPrefix: ["response"],
                        }),
                        _response.rawResponse,
                    );
                default:
                    throw new errors.ElevenLabsError({
                        statusCode: _response.error.statusCode,
                        body: _response.error.body,
                        rawResponse: _response.rawResponse,
                    });
            }
        }

        switch (_response.error.reason) {
            case "non-json":
                throw new errors.ElevenLabsError({
                    statusCode: _response.error.statusCode,
                    body: _response.error.rawBody,
                    rawResponse: _response.rawResponse,
                });
            case "timeout":
                throw new errors.ElevenLabsTimeoutError("Timeout exceeded when calling GET /v1/dubbing.");
            case "unknown":
                throw new errors.ElevenLabsError({
                    message: _response.error.errorMessage,
                    rawResponse: _response.rawResponse,
                });
        }
    }

    /**
     * Dubs a provided audio or video file into given language.
     *
     * @param {ElevenLabs.BodyDubAVideoOrAnAudioFileV1DubbingPost} request
     * @param {Dubbing.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link ElevenLabs.UnprocessableEntityError}
     *
     * @example
     *     await client.dubbing.create({})
     */
    public create(
        request: ElevenLabs.BodyDubAVideoOrAnAudioFileV1DubbingPost,
        requestOptions?: Dubbing.RequestOptions,
    ): core.HttpResponsePromise<ElevenLabs.DoDubbingResponse> {
        return core.HttpResponsePromise.fromPromise(this.__create(request, requestOptions));
    }

    private async __create(
        request: ElevenLabs.BodyDubAVideoOrAnAudioFileV1DubbingPost,
        requestOptions?: Dubbing.RequestOptions,
    ): Promise<core.WithRawResponse<ElevenLabs.DoDubbingResponse>> {
        const _request = await core.newFormData();
        if (request.file != null) {
            await _request.appendFile("file", request.file);
        }

        if (request.csvFile != null) {
            await _request.appendFile("csv_file", request.csvFile);
        }

        if (request.foregroundAudioFile != null) {
            await _request.appendFile("foreground_audio_file", request.foregroundAudioFile);
        }

        if (request.backgroundAudioFile != null) {
            await _request.appendFile("background_audio_file", request.backgroundAudioFile);
        }

        if (request.name != null) {
            _request.append("name", request.name);
        }

        if (request.sourceUrl != null) {
            _request.append("source_url", request.sourceUrl);
        }

        if (request.sourceLang != null) {
            _request.append("source_lang", request.sourceLang);
        }

        if (request.targetLang != null) {
            _request.append("target_lang", request.targetLang);
        }

        if (request.numSpeakers != null) {
            _request.append("num_speakers", request.numSpeakers.toString());
        }

        if (request.watermark != null) {
            _request.append("watermark", request.watermark.toString());
        }

        if (request.startTime != null) {
            _request.append("start_time", request.startTime.toString());
        }

        if (request.endTime != null) {
            _request.append("end_time", request.endTime.toString());
        }

        if (request.highestResolution != null) {
            _request.append("highest_resolution", request.highestResolution.toString());
        }

        if (request.dropBackgroundAudio != null) {
            _request.append("drop_background_audio", request.dropBackgroundAudio.toString());
        }

        if (request.useProfanityFilter != null) {
            _request.append("use_profanity_filter", request.useProfanityFilter.toString());
        }

        if (request.dubbingStudio != null) {
            _request.append("dubbing_studio", request.dubbingStudio.toString());
        }

        if (request.disableVoiceCloning != null) {
            _request.append("disable_voice_cloning", request.disableVoiceCloning.toString());
        }

        if (request.mode != null) {
            _request.append("mode", request.mode);
        }

        if (request.csvFps != null) {
            _request.append("csv_fps", request.csvFps.toString());
        }

        const _maybeEncodedRequest = await _request.getRequest();
        const _response = await core.fetcher({
            url: core.url.join(
                (await core.Supplier.get(this._options.baseUrl)) ??
                    (await core.Supplier.get(this._options.environment)) ??
                    environments.ElevenLabsEnvironment.Production,
                "v1/dubbing",
            ),
            method: "POST",
            headers: mergeHeaders(
                this._options?.headers,
                mergeOnlyDefinedHeaders({ "xi-api-key": requestOptions?.apiKey, ..._maybeEncodedRequest.headers }),
                requestOptions?.headers,
            ),
            requestType: "file",
            duplex: _maybeEncodedRequest.duplex,
            body: _maybeEncodedRequest.body,
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 240000,
            maxRetries: requestOptions?.maxRetries,
            abortSignal: requestOptions?.abortSignal,
        });
        if (_response.ok) {
            return {
                data: serializers.DoDubbingResponse.parseOrThrow(_response.body, {
                    unrecognizedObjectKeys: "passthrough",
                    allowUnrecognizedUnionMembers: true,
                    allowUnrecognizedEnumValues: true,
                    breadcrumbsPrefix: ["response"],
                }),
                rawResponse: _response.rawResponse,
            };
        }

        if (_response.error.reason === "status-code") {
            switch (_response.error.statusCode) {
                case 422:
                    throw new ElevenLabs.UnprocessableEntityError(
                        serializers.HttpValidationError.parseOrThrow(_response.error.body, {
                            unrecognizedObjectKeys: "passthrough",
                            allowUnrecognizedUnionMembers: true,
                            allowUnrecognizedEnumValues: true,
                            breadcrumbsPrefix: ["response"],
                        }),
                        _response.rawResponse,
                    );
                default:
                    throw new errors.ElevenLabsError({
                        statusCode: _response.error.statusCode,
                        body: _response.error.body,
                        rawResponse: _response.rawResponse,
                    });
            }
        }

        switch (_response.error.reason) {
            case "non-json":
                throw new errors.ElevenLabsError({
                    statusCode: _response.error.statusCode,
                    body: _response.error.rawBody,
                    rawResponse: _response.rawResponse,
                });
            case "timeout":
                throw new errors.ElevenLabsTimeoutError("Timeout exceeded when calling POST /v1/dubbing.");
            case "unknown":
                throw new errors.ElevenLabsError({
                    message: _response.error.errorMessage,
                    rawResponse: _response.rawResponse,
                });
        }
    }

    /**
     * Returns metadata about a dubbing project, including whether it's still in progress or not
     *
     * @param {string} dubbingId - ID of the dubbing project.
     * @param {Dubbing.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link ElevenLabs.UnprocessableEntityError}
     *
     * @example
     *     await client.dubbing.get("dubbing_id")
     */
    public get(
        dubbingId: string,
        requestOptions?: Dubbing.RequestOptions,
    ): core.HttpResponsePromise<ElevenLabs.DubbingMetadataResponse> {
        return core.HttpResponsePromise.fromPromise(this.__get(dubbingId, requestOptions));
    }

    private async __get(
        dubbingId: string,
        requestOptions?: Dubbing.RequestOptions,
    ): Promise<core.WithRawResponse<ElevenLabs.DubbingMetadataResponse>> {
        const _response = await core.fetcher({
            url: core.url.join(
                (await core.Supplier.get(this._options.baseUrl)) ??
                    (await core.Supplier.get(this._options.environment)) ??
                    environments.ElevenLabsEnvironment.Production,
                `v1/dubbing/${encodeURIComponent(dubbingId)}`,
            ),
            method: "GET",
            headers: mergeHeaders(
                this._options?.headers,
                mergeOnlyDefinedHeaders({ "xi-api-key": requestOptions?.apiKey }),
                requestOptions?.headers,
            ),
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 240000,
            maxRetries: requestOptions?.maxRetries,
            abortSignal: requestOptions?.abortSignal,
        });
        if (_response.ok) {
            return {
                data: serializers.DubbingMetadataResponse.parseOrThrow(_response.body, {
                    unrecognizedObjectKeys: "passthrough",
                    allowUnrecognizedUnionMembers: true,
                    allowUnrecognizedEnumValues: true,
                    breadcrumbsPrefix: ["response"],
                }),
                rawResponse: _response.rawResponse,
            };
        }

        if (_response.error.reason === "status-code") {
            switch (_response.error.statusCode) {
                case 422:
                    throw new ElevenLabs.UnprocessableEntityError(
                        serializers.HttpValidationError.parseOrThrow(_response.error.body, {
                            unrecognizedObjectKeys: "passthrough",
                            allowUnrecognizedUnionMembers: true,
                            allowUnrecognizedEnumValues: true,
                            breadcrumbsPrefix: ["response"],
                        }),
                        _response.rawResponse,
                    );
                default:
                    throw new errors.ElevenLabsError({
                        statusCode: _response.error.statusCode,
                        body: _response.error.body,
                        rawResponse: _response.rawResponse,
                    });
            }
        }

        switch (_response.error.reason) {
            case "non-json":
                throw new errors.ElevenLabsError({
                    statusCode: _response.error.statusCode,
                    body: _response.error.rawBody,
                    rawResponse: _response.rawResponse,
                });
            case "timeout":
                throw new errors.ElevenLabsTimeoutError("Timeout exceeded when calling GET /v1/dubbing/{dubbing_id}.");
            case "unknown":
                throw new errors.ElevenLabsError({
                    message: _response.error.errorMessage,
                    rawResponse: _response.rawResponse,
                });
        }
    }

    /**
     * Deletes a dubbing project.
     *
     * @param {string} dubbingId - ID of the dubbing project.
     * @param {Dubbing.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link ElevenLabs.UnprocessableEntityError}
     *
     * @example
     *     await client.dubbing.delete("dubbing_id")
     */
    public delete(
        dubbingId: string,
        requestOptions?: Dubbing.RequestOptions,
    ): core.HttpResponsePromise<ElevenLabs.DeleteDubbingResponseModel> {
        return core.HttpResponsePromise.fromPromise(this.__delete(dubbingId, requestOptions));
    }

    private async __delete(
        dubbingId: string,
        requestOptions?: Dubbing.RequestOptions,
    ): Promise<core.WithRawResponse<ElevenLabs.DeleteDubbingResponseModel>> {
        const _response = await core.fetcher({
            url: core.url.join(
                (await core.Supplier.get(this._options.baseUrl)) ??
                    (await core.Supplier.get(this._options.environment)) ??
                    environments.ElevenLabsEnvironment.Production,
                `v1/dubbing/${encodeURIComponent(dubbingId)}`,
            ),
            method: "DELETE",
            headers: mergeHeaders(
                this._options?.headers,
                mergeOnlyDefinedHeaders({ "xi-api-key": requestOptions?.apiKey }),
                requestOptions?.headers,
            ),
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 240000,
            maxRetries: requestOptions?.maxRetries,
            abortSignal: requestOptions?.abortSignal,
        });
        if (_response.ok) {
            return {
                data: serializers.DeleteDubbingResponseModel.parseOrThrow(_response.body, {
                    unrecognizedObjectKeys: "passthrough",
                    allowUnrecognizedUnionMembers: true,
                    allowUnrecognizedEnumValues: true,
                    breadcrumbsPrefix: ["response"],
                }),
                rawResponse: _response.rawResponse,
            };
        }

        if (_response.error.reason === "status-code") {
            switch (_response.error.statusCode) {
                case 422:
                    throw new ElevenLabs.UnprocessableEntityError(
                        serializers.HttpValidationError.parseOrThrow(_response.error.body, {
                            unrecognizedObjectKeys: "passthrough",
                            allowUnrecognizedUnionMembers: true,
                            allowUnrecognizedEnumValues: true,
                            breadcrumbsPrefix: ["response"],
                        }),
                        _response.rawResponse,
                    );
                default:
                    throw new errors.ElevenLabsError({
                        statusCode: _response.error.statusCode,
                        body: _response.error.body,
                        rawResponse: _response.rawResponse,
                    });
            }
        }

        switch (_response.error.reason) {
            case "non-json":
                throw new errors.ElevenLabsError({
                    statusCode: _response.error.statusCode,
                    body: _response.error.rawBody,
                    rawResponse: _response.rawResponse,
                });
            case "timeout":
                throw new errors.ElevenLabsTimeoutError(
                    "Timeout exceeded when calling DELETE /v1/dubbing/{dubbing_id}.",
                );
            case "unknown":
                throw new errors.ElevenLabsError({
                    message: _response.error.errorMessage,
                    rawResponse: _response.rawResponse,
                });
        }
    }
}
