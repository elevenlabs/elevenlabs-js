/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as environments from "../../../../environments";
import * as core from "../../../../core";
import * as ElevenLabs from "../../../index";
import urlJoin from "url-join";
import * as errors from "../../../../errors/index";

export declare namespace Chapters {
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

export class Chapters {
    constructor(protected readonly _options: Chapters.Options = {}) {}

    /**
     * Returns a list of your chapters for a project together and its metadata.
     *
     * @param {string} projectId - The project_id of the project, you can query GET https://api.elevenlabs.io/v1/projects to list all available projects.
     * @param {Chapters.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link ElevenLabs.UnprocessableEntityError}
     *
     * @example
     *     await client.chapters.getAll("21m00Tcm4TlvDq8ikWAM")
     */
    public async getAll(
        projectId: string,
        requestOptions?: Chapters.RequestOptions
    ): Promise<ElevenLabs.GetChaptersResponse> {
        const _response = await core.fetcher({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.ElevenLabsEnvironment.Production,
                `v1/projects/${encodeURIComponent(projectId)}/chapters`
            ),
            method: "GET",
            headers: {
                "xi-api-key":
                    (await core.Supplier.get(this._options.apiKey)) != null
                        ? await core.Supplier.get(this._options.apiKey)
                        : undefined,
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "elevenlabs",
                "X-Fern-SDK-Version": "0.19.0",
                "User-Agent": "elevenlabs/0.19.0",
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
            return _response.body as ElevenLabs.GetChaptersResponse;
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
                    "Timeout exceeded when calling GET /v1/projects/{project_id}/chapters."
                );
            case "unknown":
                throw new errors.ElevenLabsError({
                    message: _response.error.errorMessage,
                });
        }
    }

    /**
     * Returns information about a specific chapter.
     *
     * @param {string} projectId - The project_id of the project, you can query GET https://api.elevenlabs.io/v1/projects to list all available projects.
     * @param {string} chapterId - The chapter_id of the chapter. You can query GET https://api.elevenlabs.io/v1/projects/{project_id}/chapters to list all available chapters for a project.
     * @param {Chapters.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link ElevenLabs.UnprocessableEntityError}
     *
     * @example
     *     await client.chapters.get("21m00Tcm4TlvDq8ikWAM", "21m00Tcm4TlvDq8ikWAM")
     */
    public async get(
        projectId: string,
        chapterId: string,
        requestOptions?: Chapters.RequestOptions
    ): Promise<ElevenLabs.ChapterResponse> {
        const _response = await core.fetcher({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.ElevenLabsEnvironment.Production,
                `v1/projects/${encodeURIComponent(projectId)}/chapters/${encodeURIComponent(chapterId)}`
            ),
            method: "GET",
            headers: {
                "xi-api-key":
                    (await core.Supplier.get(this._options.apiKey)) != null
                        ? await core.Supplier.get(this._options.apiKey)
                        : undefined,
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "elevenlabs",
                "X-Fern-SDK-Version": "0.19.0",
                "User-Agent": "elevenlabs/0.19.0",
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
            return _response.body as ElevenLabs.ChapterResponse;
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
                    "Timeout exceeded when calling GET /v1/projects/{project_id}/chapters/{chapter_id}."
                );
            case "unknown":
                throw new errors.ElevenLabsError({
                    message: _response.error.errorMessage,
                });
        }
    }

    /**
     * Delete a chapter by its chapter_id.
     *
     * @param {string} projectId - The project_id of the project, you can query GET https://api.elevenlabs.io/v1/projects to list all available projects.
     * @param {string} chapterId - The chapter_id of the chapter. You can query GET https://api.elevenlabs.io/v1/projects/{project_id}/chapters to list all available chapters for a project.
     * @param {Chapters.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link ElevenLabs.UnprocessableEntityError}
     *
     * @example
     *     await client.chapters.delete("21m00Tcm4TlvDq8ikWAM", "21m00Tcm4TlvDq8ikWAM")
     */
    public async delete(
        projectId: string,
        chapterId: string,
        requestOptions?: Chapters.RequestOptions
    ): Promise<unknown> {
        const _response = await core.fetcher({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.ElevenLabsEnvironment.Production,
                `v1/projects/${encodeURIComponent(projectId)}/chapters/${encodeURIComponent(chapterId)}`
            ),
            method: "DELETE",
            headers: {
                "xi-api-key":
                    (await core.Supplier.get(this._options.apiKey)) != null
                        ? await core.Supplier.get(this._options.apiKey)
                        : undefined,
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "elevenlabs",
                "X-Fern-SDK-Version": "0.19.0",
                "User-Agent": "elevenlabs/0.19.0",
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
                throw new errors.ElevenLabsTimeoutError(
                    "Timeout exceeded when calling DELETE /v1/projects/{project_id}/chapters/{chapter_id}."
                );
            case "unknown":
                throw new errors.ElevenLabsError({
                    message: _response.error.errorMessage,
                });
        }
    }

    /**
     * Creates a new chapter either as blank or from a URL.
     *
     * @param {string} projectId - The project_id of the project, you can query GET https://api.elevenlabs.io/v1/projects to list all available projects.
     * @param {ElevenLabs.BodyAddChapterToAProjectV1ProjectsProjectIdChaptersAddPost} request
     * @param {Chapters.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link ElevenLabs.UnprocessableEntityError}
     *
     * @example
     *     await client.chapters.create("21m00Tcm4TlvDq8ikWAM", {
     *         name: "name"
     *     })
     */
    public async create(
        projectId: string,
        request: ElevenLabs.BodyAddChapterToAProjectV1ProjectsProjectIdChaptersAddPost,
        requestOptions?: Chapters.RequestOptions
    ): Promise<ElevenLabs.AddChapterResponseModel> {
        const _response = await core.fetcher({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.ElevenLabsEnvironment.Production,
                `v1/projects/${encodeURIComponent(projectId)}/chapters/add`
            ),
            method: "POST",
            headers: {
                "xi-api-key":
                    (await core.Supplier.get(this._options.apiKey)) != null
                        ? await core.Supplier.get(this._options.apiKey)
                        : undefined,
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "elevenlabs",
                "X-Fern-SDK-Version": "0.19.0",
                "User-Agent": "elevenlabs/0.19.0",
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
            return _response.body as ElevenLabs.AddChapterResponseModel;
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
                    "Timeout exceeded when calling POST /v1/projects/{project_id}/chapters/add."
                );
            case "unknown":
                throw new errors.ElevenLabsError({
                    message: _response.error.errorMessage,
                });
        }
    }

    /**
     * Starts conversion of a specific chapter.
     *
     * @param {string} projectId - The project_id of the project, you can query GET https://api.elevenlabs.io/v1/projects to list all available projects.
     * @param {string} chapterId - The chapter_id of the chapter. You can query GET https://api.elevenlabs.io/v1/projects/{project_id}/chapters to list all available chapters for a project.
     * @param {Chapters.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link ElevenLabs.UnprocessableEntityError}
     *
     * @example
     *     await client.chapters.convert("21m00Tcm4TlvDq8ikWAM", "21m00Tcm4TlvDq8ikWAM")
     */
    public async convert(
        projectId: string,
        chapterId: string,
        requestOptions?: Chapters.RequestOptions
    ): Promise<unknown> {
        const _response = await core.fetcher({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.ElevenLabsEnvironment.Production,
                `v1/projects/${encodeURIComponent(projectId)}/chapters/${encodeURIComponent(chapterId)}/convert`
            ),
            method: "POST",
            headers: {
                "xi-api-key":
                    (await core.Supplier.get(this._options.apiKey)) != null
                        ? await core.Supplier.get(this._options.apiKey)
                        : undefined,
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "elevenlabs",
                "X-Fern-SDK-Version": "0.19.0",
                "User-Agent": "elevenlabs/0.19.0",
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
                throw new errors.ElevenLabsTimeoutError(
                    "Timeout exceeded when calling POST /v1/projects/{project_id}/chapters/{chapter_id}/convert."
                );
            case "unknown":
                throw new errors.ElevenLabsError({
                    message: _response.error.errorMessage,
                });
        }
    }

    /**
     * Gets information about all the snapshots of a chapter, each snapshot corresponds can be downloaded as audio. Whenever a chapter is converted a snapshot will be automatically created.
     *
     * @param {string} projectId - The project_id of the project, you can query GET https://api.elevenlabs.io/v1/projects to list all available projects.
     * @param {string} chapterId - The chapter_id of the chapter. You can query GET https://api.elevenlabs.io/v1/projects/{project_id}/chapters to list all available chapters for a project.
     * @param {Chapters.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link ElevenLabs.UnprocessableEntityError}
     *
     * @example
     *     await client.chapters.getAllSnapshots("21m00Tcm4TlvDq8ikWAM", "21m00Tcm4TlvDq8ikWAM")
     */
    public async getAllSnapshots(
        projectId: string,
        chapterId: string,
        requestOptions?: Chapters.RequestOptions
    ): Promise<ElevenLabs.ChapterSnapshotsResponse> {
        const _response = await core.fetcher({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.ElevenLabsEnvironment.Production,
                `v1/projects/${encodeURIComponent(projectId)}/chapters/${encodeURIComponent(chapterId)}/snapshots`
            ),
            method: "GET",
            headers: {
                "xi-api-key":
                    (await core.Supplier.get(this._options.apiKey)) != null
                        ? await core.Supplier.get(this._options.apiKey)
                        : undefined,
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "elevenlabs",
                "X-Fern-SDK-Version": "0.19.0",
                "User-Agent": "elevenlabs/0.19.0",
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
            return _response.body as ElevenLabs.ChapterSnapshotsResponse;
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
                    "Timeout exceeded when calling GET /v1/projects/{project_id}/chapters/{chapter_id}/snapshots."
                );
            case "unknown":
                throw new errors.ElevenLabsError({
                    message: _response.error.errorMessage,
                });
        }
    }

    /**
     * Stream the audio from a chapter snapshot. Use `GET /v1/projects/{project_id}/chapters/{chapter_id}/snapshots` to return the chapter snapshots of a chapter.
     *
     * @param {string} projectId - The project_id of the project, you can query GET https://api.elevenlabs.io/v1/projects to list all available projects.
     * @param {string} chapterId - The chapter_id of the chapter. You can query GET https://api.elevenlabs.io/v1/projects/{project_id}/chapters to list all available chapters for a project.
     * @param {string} chapterSnapshotId - The chapter_snapshot_id of the chapter snapshot. You can query GET /v1/projects/{project_id}/chapters/{chapter_id}/snapshots to the all available snapshots for a chapter.
     * @param {ElevenLabs.BodyStreamChapterAudioV1ProjectsProjectIdChaptersChapterIdSnapshotsChapterSnapshotIdStreamPost} request
     * @param {Chapters.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link ElevenLabs.UnprocessableEntityError}
     *
     * @example
     *     await client.chapters.streamSnapshot("21m00Tcm4TlvDq8ikWAM", "21m00Tcm4TlvDq8ikWAM", "21m00Tcm4TlvDq8ikWAM")
     */
    public async streamSnapshot(
        projectId: string,
        chapterId: string,
        chapterSnapshotId: string,
        request: ElevenLabs.BodyStreamChapterAudioV1ProjectsProjectIdChaptersChapterIdSnapshotsChapterSnapshotIdStreamPost = {},
        requestOptions?: Chapters.RequestOptions
    ): Promise<void> {
        const _response = await core.fetcher({
            url: urlJoin(
                (await core.Supplier.get(this._options.environment)) ?? environments.ElevenLabsEnvironment.Production,
                `v1/projects/${encodeURIComponent(projectId)}/chapters/${encodeURIComponent(
                    chapterId
                )}/snapshots/${encodeURIComponent(chapterSnapshotId)}/stream`
            ),
            method: "POST",
            headers: {
                "xi-api-key":
                    (await core.Supplier.get(this._options.apiKey)) != null
                        ? await core.Supplier.get(this._options.apiKey)
                        : undefined,
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "elevenlabs",
                "X-Fern-SDK-Version": "0.19.0",
                "User-Agent": "elevenlabs/0.19.0",
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
            return;
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
                    "Timeout exceeded when calling POST /v1/projects/{project_id}/chapters/{chapter_id}/snapshots/{chapter_snapshot_id}/stream."
                );
            case "unknown":
                throw new errors.ElevenLabsError({
                    message: _response.error.errorMessage,
                });
        }
    }
}
