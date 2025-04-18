/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as environments from "../../../../../../../../environments";
import * as core from "../../../../../../../../core";
import * as ElevenLabs from "../../../../../../../index";
import * as fs from "fs";
import urlJoin from "url-join";
import * as errors from "../../../../../../../../errors/index";
import { Audio } from "../resources/audio/client/Client";
import { Waveform } from "../resources/waveform/client/Client";
import { Speakers } from "../resources/speakers/client/Client";

export declare namespace Samples {
    export interface Options {
        environment?: core.Supplier<environments.ElevenLabsEnvironment | environments.ElevenLabsEnvironmentUrls>;
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

export class Samples {
    protected _audio: Audio | undefined;
    protected _waveform: Waveform | undefined;
    protected _speakers: Speakers | undefined;

    constructor(protected readonly _options: Samples.Options = {}) {}

    public get audio(): Audio {
        return (this._audio ??= new Audio(this._options));
    }

    public get waveform(): Waveform {
        return (this._waveform ??= new Waveform(this._options));
    }

    public get speakers(): Speakers {
        return (this._speakers ??= new Speakers(this._options));
    }

    /**
     * Add audio samples to a PVC voice
     *
     * @param {string} voiceId
     * @param {ElevenLabs.voices.pvc.BodyAddSamplesToPvcVoiceV1VoicesPvcVoiceIdSamplesPost} request
     * @param {Samples.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link ElevenLabs.UnprocessableEntityError}
     *
     * @example
     *     await client.voices.pvc.samples.create("21m00Tcm4TlvDq8ikWAM", {
     *         files: [fs.createReadStream("/path/to/your/file")]
     *     })
     */
    public async create(
        voiceId: string,
        request: ElevenLabs.voices.pvc.BodyAddSamplesToPvcVoiceV1VoicesPvcVoiceIdSamplesPost,
        requestOptions?: Samples.RequestOptions,
    ): Promise<ElevenLabs.VoiceSample[]> {
        const _request = await core.newFormData();
        for (const _file of request.files) {
            await _request.appendFile("files", _file);
        }

        if (request.remove_background_noise != null) {
            _request.append("remove_background_noise", request.remove_background_noise.toString());
        }

        const _maybeEncodedRequest = await _request.getRequest();
        const _response = await core.fetcher({
            url: urlJoin(
                (await core.Supplier.get(this._options.baseUrl)) ??
                    (
                        (await core.Supplier.get(this._options.environment)) ??
                        environments.ElevenLabsEnvironment.Production
                    ).base,
                `v1/voices/pvc/${encodeURIComponent(voiceId)}/samples`,
            ),
            method: "POST",
            headers: {
                "xi-api-key":
                    (await core.Supplier.get(this._options.apiKey)) != null
                        ? await core.Supplier.get(this._options.apiKey)
                        : undefined,
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "elevenlabs",
                "X-Fern-SDK-Version": "1.57.0",
                "User-Agent": "elevenlabs/1.57.0",
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
            return _response.body as ElevenLabs.VoiceSample[];
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
                    "Timeout exceeded when calling POST /v1/voices/pvc/{voice_id}/samples.",
                );
            case "unknown":
                throw new errors.ElevenLabsError({
                    message: _response.error.errorMessage,
                });
        }
    }

    /**
     * Update a PVC voice sample - apply noise removal, or select speaker.
     *
     * @param {string} voiceId - Voice ID to be used, you can use https://api.elevenlabs.io/v1/voices to list all the available voices.
     * @param {string} sampleId - Sample ID to be used
     * @param {ElevenLabs.voices.pvc.BodyUpdatePvcVoiceSampleV1VoicesPvcVoiceIdSamplesSampleIdPost} request
     * @param {Samples.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link ElevenLabs.UnprocessableEntityError}
     *
     * @example
     *     await client.voices.pvc.samples.update("21m00Tcm4TlvDq8ikWAM", "VW7YKqPnjY4h39yTbx2L")
     */
    public async update(
        voiceId: string,
        sampleId: string,
        request: ElevenLabs.voices.pvc.BodyUpdatePvcVoiceSampleV1VoicesPvcVoiceIdSamplesSampleIdPost = {},
        requestOptions?: Samples.RequestOptions,
    ): Promise<ElevenLabs.AddVoiceResponseModel> {
        const _response = await core.fetcher({
            url: urlJoin(
                (await core.Supplier.get(this._options.baseUrl)) ??
                    (
                        (await core.Supplier.get(this._options.environment)) ??
                        environments.ElevenLabsEnvironment.Production
                    ).base,
                `v1/voices/pvc/${encodeURIComponent(voiceId)}/samples/${encodeURIComponent(sampleId)}`,
            ),
            method: "POST",
            headers: {
                "xi-api-key":
                    (await core.Supplier.get(this._options.apiKey)) != null
                        ? await core.Supplier.get(this._options.apiKey)
                        : undefined,
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "elevenlabs",
                "X-Fern-SDK-Version": "1.57.0",
                "User-Agent": "elevenlabs/1.57.0",
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
            return _response.body as ElevenLabs.AddVoiceResponseModel;
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
                    "Timeout exceeded when calling POST /v1/voices/pvc/{voice_id}/samples/{sample_id}.",
                );
            case "unknown":
                throw new errors.ElevenLabsError({
                    message: _response.error.errorMessage,
                });
        }
    }

    /**
     * Delete a sample from a PVC voice.
     *
     * @param {string} voiceId - Voice ID to be used, you can use https://api.elevenlabs.io/v1/voices to list all the available voices.
     * @param {string} sampleId - Sample ID to be used
     * @param {Samples.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link ElevenLabs.UnprocessableEntityError}
     *
     * @example
     *     await client.voices.pvc.samples.delete("21m00Tcm4TlvDq8ikWAM", "VW7YKqPnjY4h39yTbx2L")
     */
    public async delete(
        voiceId: string,
        sampleId: string,
        requestOptions?: Samples.RequestOptions,
    ): Promise<ElevenLabs.DeleteVoiceSampleResponseModel> {
        const _response = await core.fetcher({
            url: urlJoin(
                (await core.Supplier.get(this._options.baseUrl)) ??
                    (
                        (await core.Supplier.get(this._options.environment)) ??
                        environments.ElevenLabsEnvironment.Production
                    ).base,
                `v1/voices/pvc/${encodeURIComponent(voiceId)}/samples/${encodeURIComponent(sampleId)}`,
            ),
            method: "DELETE",
            headers: {
                "xi-api-key":
                    (await core.Supplier.get(this._options.apiKey)) != null
                        ? await core.Supplier.get(this._options.apiKey)
                        : undefined,
                "X-Fern-Language": "JavaScript",
                "X-Fern-SDK-Name": "elevenlabs",
                "X-Fern-SDK-Version": "1.57.0",
                "User-Agent": "elevenlabs/1.57.0",
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
            return _response.body as ElevenLabs.DeleteVoiceSampleResponseModel;
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
                    "Timeout exceeded when calling DELETE /v1/voices/pvc/{voice_id}/samples/{sample_id}.",
                );
            case "unknown":
                throw new errors.ElevenLabsError({
                    message: _response.error.errorMessage,
                });
        }
    }
}
