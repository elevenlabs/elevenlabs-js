/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as environments from "../../../../environments";
import * as core from "../../../../core";
import * as ElevenLabs from "../../../index";
import urlJoin from "url-join";
import * as errors from "../../../../errors/index";

export declare namespace PronunciationDictionary {
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
        /** Additional headers to include in the request. */
        headers?: Record<string, string>;
    }
}

export class PronunciationDictionary {
    constructor(protected readonly _options: PronunciationDictionary.Options = {}) {}

    /**
     * Creates a new pronunciation dictionary from a lexicon .PLS file
     *
     * @param {ElevenLabs.BodyAddAPronunciationDictionaryV1PronunciationDictionariesAddFromFilePost} request
     * @param {PronunciationDictionary.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link ElevenLabs.UnprocessableEntityError}
     *
     * @example
     *     await client.pronunciationDictionary.addFromFile({
     *         name: "name"
     *     })
     */
    public async addFromFile(
        request: ElevenLabs.BodyAddAPronunciationDictionaryV1PronunciationDictionariesAddFromFilePost,
        requestOptions?: PronunciationDictionary.RequestOptions
    ): Promise<ElevenLabs.AddPronunciationDictionaryResponseModel> {
        const _request = await core.newFormData();
        await _request.append("name", request.name);
        if (request.file != null) {
            await _request.appendFile("file", request.file);
        }

        if (request.description != null) {
            await _request.append("description", request.description);
        }

        if (request.workspace_access != null) {
            await _request.append("workspace_access", request.workspace_access);
        }

        const _maybeEncodedRequest = await _request.getRequest();
        const _response = await core.fetcher({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.ElevenLabsEnvironment.Production,
                "v1/pronunciation-dictionaries/add-from-file"
            ),
            method: "POST",
            headers: {
                "xi-api-key":
                    (await core.Supplier.get(this._options.apiKey)) != null
                        ? await core.Supplier.get(this._options.apiKey)
                        : undefined,
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "elevenlabs",
                "X-Fern-SDK-Version": "1.50.1",
                "User-Agent": "elevenlabs/1.50.1",
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
            return _response.body as ElevenLabs.AddPronunciationDictionaryResponseModel;
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
                throw new errors.ElevenLabsTimeoutError(
                    "Timeout exceeded when calling POST /v1/pronunciation-dictionaries/add-from-file."
                );
            case "unknown":
                throw new errors.ElevenLabsError({
                    message: _response.error.errorMessage,
                });
        }
    }

    /**
     * Add rules to the pronunciation dictionary
     *
     * @param {string} pronunciationDictionaryId - The id of the pronunciation dictionary
     * @param {ElevenLabs.PronunciationDictionary} request
     * @param {PronunciationDictionary.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link ElevenLabs.UnprocessableEntityError}
     *
     * @example
     *     await client.pronunciationDictionary.addRules("21m00Tcm4TlvDq8ikWAM", {
     *         rules: [{
     *                 type: "phoneme",
     *                 string_to_replace: "rules",
     *                 phoneme: "rules",
     *                 alphabet: "rules"
     *             }]
     *     })
     */
    public async addRules(
        pronunciationDictionaryId: string,
        request: ElevenLabs.PronunciationDictionary,
        requestOptions?: PronunciationDictionary.RequestOptions
    ): Promise<ElevenLabs.AddPronunciationDictionaryRulesResponseModel> {
        const _response = await core.fetcher({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.ElevenLabsEnvironment.Production,
                `v1/pronunciation-dictionaries/${encodeURIComponent(pronunciationDictionaryId)}/add-rules`
            ),
            method: "POST",
            headers: {
                "xi-api-key":
                    (await core.Supplier.get(this._options.apiKey)) != null
                        ? await core.Supplier.get(this._options.apiKey)
                        : undefined,
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "elevenlabs",
                "X-Fern-SDK-Version": "1.50.1",
                "User-Agent": "elevenlabs/1.50.1",
                "X-Fern-Runtime": core.RUNTIME.type,
                "X-Fern-Runtime-Version": core.RUNTIME.version,
                ...requestOptions?.headers,
            },
            contentType: "application/json",
            requestType: "json",
            body: request,
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 60000,
            maxRetries: requestOptions?.maxRetries,
            abortSignal: requestOptions?.abortSignal,
        });
        if (_response.ok) {
            return _response.body as ElevenLabs.AddPronunciationDictionaryRulesResponseModel;
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
                throw new errors.ElevenLabsTimeoutError(
                    "Timeout exceeded when calling POST /v1/pronunciation-dictionaries/{pronunciation_dictionary_id}/add-rules."
                );
            case "unknown":
                throw new errors.ElevenLabsError({
                    message: _response.error.errorMessage,
                });
        }
    }

    /**
     * Remove rules from the pronunciation dictionary
     *
     * @param {string} pronunciationDictionaryId - The id of the pronunciation dictionary
     * @param {ElevenLabs.BodyRemoveRulesFromThePronunciationDictionaryV1PronunciationDictionariesPronunciationDictionaryIdRemoveRulesPost} request
     * @param {PronunciationDictionary.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link ElevenLabs.UnprocessableEntityError}
     *
     * @example
     *     await client.pronunciationDictionary.removeRules("21m00Tcm4TlvDq8ikWAM", {
     *         rule_strings: ["rule_strings"]
     *     })
     */
    public async removeRules(
        pronunciationDictionaryId: string,
        request: ElevenLabs.BodyRemoveRulesFromThePronunciationDictionaryV1PronunciationDictionariesPronunciationDictionaryIdRemoveRulesPost,
        requestOptions?: PronunciationDictionary.RequestOptions
    ): Promise<ElevenLabs.RemovePronunciationDictionaryRulesResponseModel> {
        const _response = await core.fetcher({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.ElevenLabsEnvironment.Production,
                `v1/pronunciation-dictionaries/${encodeURIComponent(pronunciationDictionaryId)}/remove-rules`
            ),
            method: "POST",
            headers: {
                "xi-api-key":
                    (await core.Supplier.get(this._options.apiKey)) != null
                        ? await core.Supplier.get(this._options.apiKey)
                        : undefined,
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "elevenlabs",
                "X-Fern-SDK-Version": "1.50.1",
                "User-Agent": "elevenlabs/1.50.1",
                "X-Fern-Runtime": core.RUNTIME.type,
                "X-Fern-Runtime-Version": core.RUNTIME.version,
                ...requestOptions?.headers,
            },
            contentType: "application/json",
            requestType: "json",
            body: request,
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 60000,
            maxRetries: requestOptions?.maxRetries,
            abortSignal: requestOptions?.abortSignal,
        });
        if (_response.ok) {
            return _response.body as ElevenLabs.RemovePronunciationDictionaryRulesResponseModel;
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
                throw new errors.ElevenLabsTimeoutError(
                    "Timeout exceeded when calling POST /v1/pronunciation-dictionaries/{pronunciation_dictionary_id}/remove-rules."
                );
            case "unknown":
                throw new errors.ElevenLabsError({
                    message: _response.error.errorMessage,
                });
        }
    }

    /**
     * Get PLS file with a pronunciation dictionary version rules
     *
     * @param {string} dictionaryId - The id of the pronunciation dictionary
     * @param {string} versionId - The id of the version of the pronunciation dictionary
     * @param {PronunciationDictionary.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link ElevenLabs.UnprocessableEntityError}
     *
     * @example
     *     await client.pronunciationDictionary.download("Fm6AvNgS53NXe6Kqxp3e", "KZFyRUq3R6kaqhKI146w")
     */
    public async download(
        dictionaryId: string,
        versionId: string,
        requestOptions?: PronunciationDictionary.RequestOptions
    ): Promise<string> {
        const _response = await core.fetcher({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.ElevenLabsEnvironment.Production,
                `v1/pronunciation-dictionaries/${encodeURIComponent(dictionaryId)}/${encodeURIComponent(
                    versionId
                )}/download`
            ),
            method: "GET",
            headers: {
                "xi-api-key":
                    (await core.Supplier.get(this._options.apiKey)) != null
                        ? await core.Supplier.get(this._options.apiKey)
                        : undefined,
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "elevenlabs",
                "X-Fern-SDK-Version": "1.50.1",
                "User-Agent": "elevenlabs/1.50.1",
                "X-Fern-Runtime": core.RUNTIME.type,
                "X-Fern-Runtime-Version": core.RUNTIME.version,
                ...requestOptions?.headers,
            },
            contentType: "application/json",
            requestType: "json",
            responseType: "text",
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 60000,
            maxRetries: requestOptions?.maxRetries,
            abortSignal: requestOptions?.abortSignal,
        });
        if (_response.ok) {
            return _response.body as string;
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
                throw new errors.ElevenLabsTimeoutError(
                    "Timeout exceeded when calling GET /v1/pronunciation-dictionaries/{dictionary_id}/{version_id}/download."
                );
            case "unknown":
                throw new errors.ElevenLabsError({
                    message: _response.error.errorMessage,
                });
        }
    }

    /**
     * Get metadata for a pronunciation dictionary
     *
     * @param {string} pronunciationDictionaryId - The id of the pronunciation dictionary
     * @param {PronunciationDictionary.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link ElevenLabs.UnprocessableEntityError}
     *
     * @example
     *     await client.pronunciationDictionary.get("Fm6AvNgS53NXe6Kqxp3e")
     */
    public async get(
        pronunciationDictionaryId: string,
        requestOptions?: PronunciationDictionary.RequestOptions
    ): Promise<ElevenLabs.GetPronunciationDictionaryMetadataResponse> {
        const _response = await core.fetcher({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.ElevenLabsEnvironment.Production,
                `v1/pronunciation-dictionaries/${encodeURIComponent(pronunciationDictionaryId)}/`
            ),
            method: "GET",
            headers: {
                "xi-api-key":
                    (await core.Supplier.get(this._options.apiKey)) != null
                        ? await core.Supplier.get(this._options.apiKey)
                        : undefined,
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "elevenlabs",
                "X-Fern-SDK-Version": "1.50.1",
                "User-Agent": "elevenlabs/1.50.1",
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
            return _response.body as ElevenLabs.GetPronunciationDictionaryMetadataResponse;
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
                throw new errors.ElevenLabsTimeoutError(
                    "Timeout exceeded when calling GET /v1/pronunciation-dictionaries/{pronunciation_dictionary_id}/."
                );
            case "unknown":
                throw new errors.ElevenLabsError({
                    message: _response.error.errorMessage,
                });
        }
    }

    /**
     * Get a list of the pronunciation dictionaries you have access to and their metadata
     *
     * @param {ElevenLabs.PronunciationDictionaryGetAllRequest} request
     * @param {PronunciationDictionary.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link ElevenLabs.UnprocessableEntityError}
     *
     * @example
     *     await client.pronunciationDictionary.getAll({
     *         page_size: 1
     *     })
     */
    public async getAll(
        request: ElevenLabs.PronunciationDictionaryGetAllRequest = {},
        requestOptions?: PronunciationDictionary.RequestOptions
    ): Promise<ElevenLabs.GetPronunciationDictionariesMetadataResponseModel> {
        const { cursor, page_size: pageSize } = request;
        const _queryParams: Record<string, string | string[] | object | object[]> = {};
        if (cursor != null) {
            _queryParams["cursor"] = cursor;
        }

        if (pageSize != null) {
            _queryParams["page_size"] = pageSize.toString();
        }

        const _response = await core.fetcher({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.ElevenLabsEnvironment.Production,
                "v1/pronunciation-dictionaries/"
            ),
            method: "GET",
            headers: {
                "xi-api-key":
                    (await core.Supplier.get(this._options.apiKey)) != null
                        ? await core.Supplier.get(this._options.apiKey)
                        : undefined,
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "elevenlabs",
                "X-Fern-SDK-Version": "1.50.1",
                "User-Agent": "elevenlabs/1.50.1",
                "X-Fern-Runtime": core.RUNTIME.type,
                "X-Fern-Runtime-Version": core.RUNTIME.version,
                ...requestOptions?.headers,
            },
            contentType: "application/json",
            queryParameters: _queryParams,
            requestType: "json",
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 60000,
            maxRetries: requestOptions?.maxRetries,
            abortSignal: requestOptions?.abortSignal,
        });
        if (_response.ok) {
            return _response.body as ElevenLabs.GetPronunciationDictionariesMetadataResponseModel;
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
                throw new errors.ElevenLabsTimeoutError(
                    "Timeout exceeded when calling GET /v1/pronunciation-dictionaries/."
                );
            case "unknown":
                throw new errors.ElevenLabsError({
                    message: _response.error.errorMessage,
                });
        }
    }
}
