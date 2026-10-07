import type * as ElevenLabs from "../api";
import { FlowsClient as GeneratedFlowsClient } from "../api/resources/flows/client/Client";
import { ImageClient as GeneratedImageClient } from "../api/resources/flows/resources/image/client/Client";
import { TemplatesClient as GeneratedTemplatesClient } from "../api/resources/flows/resources/templates/client/Client";
import { RunsClient as GeneratedRunsClient } from "../api/resources/flows/resources/templates/resources/runs/client/Client";
import { TextToSpeechClient as GeneratedTextToSpeechClient } from "../api/resources/flows/resources/textToSpeech/client/Client";
import { VideoClient as GeneratedVideoClient } from "../api/resources/flows/resources/video/client/Client";
import type { BaseRequestOptions } from "../BaseClient";
import type * as core from "../core";
import { ElevenLabsError } from "../errors";

const DEFAULT_MIN_POLL_INTERVAL_SECONDS = 1;
const JITTER_FACTOR = 0.2; // 20% positive jitter, matching the fetcher's retry jitter

export declare namespace FlowsWait {
    /**
     * Options for `createAndWait`. Everything besides the wait options below is passed
     * through as request options to the create call and every status check.
     */
    interface Options extends BaseRequestOptions {
        /**
         * Seconds to wait in total before throwing `FlowsWaitTimeoutError`, which carries the
         * generation or run id so you can resume with `get`. Waits indefinitely when omitted.
         * Not to be confused with `timeoutInSeconds`, which limits each HTTP request.
         */
        waitTimeoutInSeconds?: number;
        /**
         * The shortest wait between status checks, in seconds. Also used when the server
         * sends no `Retry-After` header. Defaults to 1.
         */
        minPollIntervalInSeconds?: number;
    }
}

/**
 * Thrown by `createAndWait` when a generation or template run is still unfinished after
 * `waitTimeoutInSeconds`. The work keeps running on the server: resume waiting by calling
 * `get` with `id` (and `templateId` for a template run), or let a webhook deliver the result.
 */
export class FlowsWaitTimeoutError extends ElevenLabsError {
    public readonly id: string;
    public readonly templateId: string | undefined;
    public readonly waitTimeoutInSeconds: number;
    public readonly lastResponse: { status: string };

    constructor(args: {
        id: string;
        templateId?: string;
        waitTimeoutInSeconds: number;
        lastResponse: { status: string };
    }) {
        const kind = args.templateId != null ? "Template run" : "Generation";
        super({
            message: `${kind} ${args.id} is still ${args.lastResponse.status} after ${args.waitTimeoutInSeconds}s; call \`get\` with this id to keep waiting`,
        });
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = "FlowsWaitTimeoutError";
        this.id = args.id;
        this.templateId = args.templateId;
        this.waitTimeoutInSeconds = args.waitTimeoutInSeconds;
        this.lastResponse = args.lastResponse;
    }
}

/**
 * Seconds from a `Retry-After` header, either delta-seconds or an HTTP date. Mirrors the
 * Retry-After branch of the fetcher's `getRetryDelayFromHeaders`, which is not exported
 * and falls back to exponential backoff rather than returning "no header".
 */
function parseRetryAfterSeconds(headers: Headers): number | undefined {
    const retryAfter = headers.get("Retry-After");
    if (!retryAfter) {
        return undefined;
    }
    if (/^\s*\d+\s*$/.test(retryAfter)) {
        return parseInt(retryAfter, 10);
    }
    const retryAfterDate = new Date(retryAfter);
    if (!Number.isNaN(retryAfterDate.getTime())) {
        return Math.max((retryAfterDate.getTime() - Date.now()) / 1000, 0);
    }
    return undefined;
}

/** Milliseconds to wait before the next GET: the server's `Retry-After`, never below the minimum, plus jitter. */
export function pollDelayMs(headers: Headers, minIntervalSeconds: number): number {
    const seconds = Math.max(parseRetryAfterSeconds(headers) ?? minIntervalSeconds, minIntervalSeconds);
    return seconds * 1000 * (1 + Math.random() * JITTER_FACTOR);
}

/** @internal Indirection so tests can replace the wait between status checks. */
export const pollTimer = {
    sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    },
};

function isTerminal(response: { status: string }): boolean {
    return response.status === "completed" || response.status === "failed";
}

function splitOptions(options: FlowsWait.Options | undefined): {
    requestOptions: BaseRequestOptions;
    waitTimeoutInSeconds: number | undefined;
    minPollIntervalInSeconds: number;
} {
    const { waitTimeoutInSeconds, minPollIntervalInSeconds, ...requestOptions } = options ?? {};
    return {
        requestOptions,
        waitTimeoutInSeconds,
        minPollIntervalInSeconds: minPollIntervalInSeconds ?? DEFAULT_MIN_POLL_INTERVAL_SECONDS,
    };
}

async function waitUntilTerminal<T extends { id: string; status: string }>(args: {
    first: core.WithRawResponse<{ id: string; status: string }>;
    get: (id: string) => core.HttpResponsePromise<T>;
    startedAt: number;
    waitTimeoutInSeconds: number | undefined;
    minPollIntervalInSeconds: number;
    templateId?: string;
}): Promise<T> {
    const id = args.first.data.id;
    let response: { status: string } = args.first.data;
    let headers = args.first.rawResponse.headers;
    while (!isTerminal(response)) {
        let delay = pollDelayMs(headers, args.minPollIntervalInSeconds);
        if (args.waitTimeoutInSeconds != null) {
            const remaining = args.startedAt + args.waitTimeoutInSeconds * 1000 - Date.now();
            if (remaining <= 0) {
                throw new FlowsWaitTimeoutError({
                    id,
                    templateId: args.templateId,
                    waitTimeoutInSeconds: args.waitTimeoutInSeconds,
                    lastResponse: response,
                });
            }
            delay = Math.min(delay, remaining);
        }
        await pollTimer.sleep(delay);
        const next = await args.get(id).withRawResponse();
        response = next.data;
        headers = next.rawResponse.headers;
    }
    return response as T;
}

type GenerationClient<Request> = {
    create(
        request: Request,
        requestOptions?: BaseRequestOptions,
    ): core.HttpResponsePromise<ElevenLabs.MediaGenerationCreateResponse>;
    get(
        generationId: string,
        requestOptions?: BaseRequestOptions,
    ): core.HttpResponsePromise<ElevenLabs.MediaGenerationResponse>;
};

async function createGenerationAndWait<Request>(
    client: GenerationClient<Request>,
    request: Request,
    options: FlowsWait.Options | undefined,
): Promise<ElevenLabs.MediaGenerationResponse> {
    const { requestOptions, waitTimeoutInSeconds, minPollIntervalInSeconds } = splitOptions(options);
    const startedAt = Date.now();
    const first = await client.create(request, requestOptions).withRawResponse();
    return waitUntilTerminal({
        first,
        get: (id) => client.get(id, requestOptions),
        startedAt,
        waitTimeoutInSeconds,
        minPollIntervalInSeconds,
    });
}

export class FlowsImageClient extends GeneratedImageClient {
    /**
     * Start an image generation and wait until it is `completed` or `failed`, then return the final generation.
     *
     * Between status checks this waits for the number of seconds in the server's `Retry-After` header,
     * never less than `minPollIntervalInSeconds`. This is meant for scripts and quickstarts: in production,
     * set `webhook` on the request passed to `create` and handle the webhook event instead of holding a process open.
     *
     * A `failed` generation is returned, not thrown; check `status` on the result.
     *
     * @throws {FlowsWaitTimeoutError} when `waitTimeoutInSeconds` elapses first.
     *
     * @example
     *     const generation = await client.flows.image.createAndWait({
     *         modelId: "bytedance-seedream-5-lite",
     *         prompt: "A corgi in a tiny lifeguard chair on a sunlit beach at golden hour, photorealistic",
     *     });
     */
    public createAndWait(
        request: ElevenLabs.ImageGenerationRequest,
        options?: FlowsWait.Options,
    ): Promise<ElevenLabs.MediaGenerationResponse> {
        return createGenerationAndWait(this, request, options);
    }
}

export class FlowsVideoClient extends GeneratedVideoClient {
    /**
     * Start a video generation and wait until it is `completed` or `failed`, then return the final generation.
     *
     * Between status checks this waits for the number of seconds in the server's `Retry-After` header,
     * never less than `minPollIntervalInSeconds`. This is meant for scripts and quickstarts: in production,
     * set `webhook` on the request passed to `create` and handle the webhook event instead of holding a process open.
     *
     * A `failed` generation is returned, not thrown; check `status` on the result.
     *
     * @throws {FlowsWaitTimeoutError} when `waitTimeoutInSeconds` elapses first.
     */
    public createAndWait(
        request: ElevenLabs.VideoGenerationRequest,
        options?: FlowsWait.Options,
    ): Promise<ElevenLabs.MediaGenerationResponse> {
        return createGenerationAndWait(this, request, options);
    }
}

export class FlowsTextToSpeechClient extends GeneratedTextToSpeechClient {
    /**
     * Start a text-to-speech generation and wait until it is `completed` or `failed`, then return the final generation.
     *
     * Between status checks this waits for the number of seconds in the server's `Retry-After` header,
     * never less than `minPollIntervalInSeconds`. This is meant for scripts and quickstarts: in production,
     * set `webhook` on the request passed to `create` and handle the webhook event instead of holding a process open.
     *
     * A `failed` generation is returned, not thrown; check `status` on the result.
     *
     * @throws {FlowsWaitTimeoutError} when `waitTimeoutInSeconds` elapses first.
     */
    public createAndWait(
        request: ElevenLabs.TextToSpeechGenerationRequest,
        options?: FlowsWait.Options,
    ): Promise<ElevenLabs.MediaGenerationResponse> {
        return createGenerationAndWait(this, request, options);
    }
}

export class FlowsTemplateRunsClient extends GeneratedRunsClient {
    /**
     * Start a run of a flows template and wait until its `status` is `completed` or `failed`, then return the final run.
     *
     * Between status checks this waits for the number of seconds in the server's `Retry-After` header,
     * never less than `minPollIntervalInSeconds`. This is meant for scripts and quickstarts: in production,
     * pass `webhook` to `create` and handle the `flows_template_run` webhook instead of holding a process open.
     *
     * A `failed` run is returned, not thrown; check `status` on the result and on each output.
     *
     * @throws {FlowsWaitTimeoutError} when `waitTimeoutInSeconds` elapses first. It carries `id` and `templateId`.
     *
     * @example
     *     const run = await client.flows.templates.runs.createAndWait("template_id", {
     *         inputs: { prompt: "a corgi on a surfboard" },
     *     });
     */
    public async createAndWait(
        templateId: string,
        request: ElevenLabs.flows.templates.TemplateRunCreateRequest,
        options?: FlowsWait.Options,
    ): Promise<ElevenLabs.TemplateRunResponse> {
        const { requestOptions, waitTimeoutInSeconds, minPollIntervalInSeconds } = splitOptions(options);
        const startedAt = Date.now();
        const first = await this.create(templateId, request, requestOptions).withRawResponse();
        return waitUntilTerminal({
            first,
            get: (runId) => this.get(templateId, runId, requestOptions),
            startedAt,
            waitTimeoutInSeconds,
            minPollIntervalInSeconds,
            templateId,
        });
    }
}

export class FlowsTemplatesClient extends GeneratedTemplatesClient {
    public override get runs(): FlowsTemplateRunsClient {
        if (!this._runs) {
            this._runs = new FlowsTemplateRunsClient(this._options);
        }
        return this._runs as FlowsTemplateRunsClient;
    }
}

/**
 * Extends the generated flows client with `createAndWait` helpers on `image`, `video`,
 * `textToSpeech` and `templates.runs`.
 */
export class Flows extends GeneratedFlowsClient {
    public override get video(): FlowsVideoClient {
        if (!this._video) {
            this._video = new FlowsVideoClient(this._options);
        }
        return this._video as FlowsVideoClient;
    }

    public override get image(): FlowsImageClient {
        if (!this._image) {
            this._image = new FlowsImageClient(this._options);
        }
        return this._image as FlowsImageClient;
    }

    public override get textToSpeech(): FlowsTextToSpeechClient {
        if (!this._textToSpeech) {
            this._textToSpeech = new FlowsTextToSpeechClient(this._options);
        }
        return this._textToSpeech as FlowsTextToSpeechClient;
    }

    public override get templates(): FlowsTemplatesClient {
        if (!this._templates) {
            this._templates = new FlowsTemplatesClient(this._options);
        }
        return this._templates as FlowsTemplatesClient;
    }
}
