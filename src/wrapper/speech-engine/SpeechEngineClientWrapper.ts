import type { Server as HttpServer } from "node:http";
import { SpeechEngineClient } from "../../api/resources/speechEngine/client/Client";
import type { CreateSpeechEngineRequest } from "../../api/resources/speechEngine/client/requests/CreateSpeechEngineRequest";
import type { SpeechEngineListRequest } from "../../api/resources/speechEngine/client/requests/SpeechEngineListRequest";
import type { UpdateSpeechEngineRequest } from "../../api/resources/speechEngine/client/requests/UpdateSpeechEngineRequest";
import type { DuplicateSpeechEngineRequest } from "../../api/types/DuplicateSpeechEngineRequest";
import type { ListSpeechEnginesResponse } from "../../api/types/ListSpeechEnginesResponse";
import type { NormalizedClientOptions } from "../../BaseClient";
import type * as core from "../../core";
import type { SpeechEngineAttachment } from "./SpeechEngineAttachment";
import { SpeechEngineResource } from "./SpeechEngineResource";
import type { SpeechEngineCallbacks } from "./types";

/**
 * Subclass used only to read protected `_options`. It does not override any
 * generated methods, so it stays assignable to `SpeechEngineClient` and does
 * not appear as an illegal override in the published declarations.
 */
class SpeechEngineClientInternal extends SpeechEngineClient {
    public options(): NormalizedClientOptions<SpeechEngineClient.Options> {
        return this._options;
    }
}

/**
 * Client for the Speech Engine resource. Accessible via `elevenlabs.speechEngine`.
 *
 * Wraps the Fern-generated `SpeechEngineClient` with WebSocket integration
 * methods. `list` and `delete` return the generated client's promises.
 * `create`, `get`, `update`, and `duplicate` return a `SpeechEngineResource`
 * with WebSocket server setup methods.
 *
 * @example
 * ```typescript
 * // Create a speech engine and immediately attach it
 * const engine = await elevenlabs.speechEngine.create({
 *     name: "My engine",
 *     speechEngine: { wsUrl: "wss://your-server.com/ws" },
 * });
 * engine.attach(httpServer, "/api/speech-engine/ws", {
 *     async onTranscript(transcript, signal, session) {
 *         session.sendResponse(await llm.generate(transcript, { signal }));
 *     },
 * });
 * ```
 */
export class SpeechEngineClientWrapper {
    private readonly inner: SpeechEngineClientInternal;

    constructor(options: SpeechEngineClient.Options = {}) {
        this.inner = new SpeechEngineClientInternal(options);
    }

    /**
     * Returns a paginated list of Speech Engine resources.
     *
     * @param {ElevenLabs.SpeechEngineListRequest} request
     * @param {SpeechEngineClient.RequestOptions} requestOptions - Request-specific configuration.
     */
    public list(
        request: SpeechEngineListRequest = {},
        requestOptions?: SpeechEngineClient.RequestOptions,
    ): core.HttpResponsePromise<ListSpeechEnginesResponse> {
        return this.inner.list(request, requestOptions);
    }

    /**
     * Create a Speech Engine and return a `SpeechEngineResource`.
     *
     * Makes an API call to create the engine, then returns a
     * `SpeechEngineResource` with `.attach()`, `.createSession()`, and
     * `.verifyRequest()` methods for setting up a WebSocket server.
     *
     * @example
     * ```typescript
     * const engine = await elevenlabs.speechEngine.create({
     *     name: "My engine",
     *     speechEngine: { wsUrl: "wss://your-server.com/ws" },
     * });
     * engine.attach(httpServer, "/api/speech-engine/ws", {
     *     async onTranscript(transcript, signal, session) {
     *         session.sendResponse(await llm.generate(transcript, { signal }));
     *     },
     * });
     * ```
     */
    public async create(
        request: CreateSpeechEngineRequest,
        requestOptions?: SpeechEngineClient.RequestOptions,
    ): Promise<SpeechEngineResource> {
        const response = await this.inner.create(request, requestOptions);
        return new SpeechEngineResource(response.speechEngineId, this.inner.options(), response);
    }

    /**
     * Fetch a Speech Engine by ID and return a `SpeechEngineResource`.
     *
     * Makes an API call to validate the engine exists, then returns a
     * `SpeechEngineResource` with `.attach()`, `.createSession()`, and
     * `.verifyRequest()` methods for setting up a WebSocket server.
     *
     * @example
     * ```typescript
     * const engine = await elevenlabs.speechEngine.get("seng_123");
     * engine.attach(httpServer, "/api/speech-engine/ws", {
     *     async onTranscript(transcript, signal, session) {
     *         session.sendResponse(await llm.generate(transcript, { signal }));
     *     },
     * });
     * ```
     */
    public async get(
        speechEngineId: string,
        requestOptions?: SpeechEngineClient.RequestOptions,
    ): Promise<SpeechEngineResource> {
        const response = await this.inner.get(speechEngineId, requestOptions);
        return new SpeechEngineResource(speechEngineId, this.inner.options(), response);
    }

    /**
     * Update a Speech Engine and return a `SpeechEngineResource`.
     *
     * Makes an API call to update the engine, then returns a
     * `SpeechEngineResource` with `.attach()`, `.createSession()`, and
     * `.verifyRequest()` methods for setting up a WebSocket server.
     *
     * @example
     * ```typescript
     * const engine = await elevenlabs.speechEngine.update("seng_123", { name: "Renamed" });
     * engine.attach(httpServer, "/api/speech-engine/ws", {
     *     async onTranscript(transcript, signal, session) {
     *         session.sendResponse(await llm.generate(transcript, { signal }));
     *     },
     * });
     * ```
     */
    public async update(
        speechEngineId: string,
        request: UpdateSpeechEngineRequest = {},
        requestOptions?: SpeechEngineClient.RequestOptions,
    ): Promise<SpeechEngineResource> {
        const response = await this.inner.update(speechEngineId, request, requestOptions);
        return new SpeechEngineResource(speechEngineId, this.inner.options(), response);
    }

    public async duplicate(
        speechEngineId: string,
        request?: DuplicateSpeechEngineRequest,
        requestOptions?: SpeechEngineClient.RequestOptions,
    ): Promise<SpeechEngineResource> {
        const response = await this.inner.duplicate(speechEngineId, request, requestOptions);
        return new SpeechEngineResource(response.speechEngineId, this.inner.options(), response);
    }

    /**
     * Delete a Speech Engine resource.
     *
     * @param {string} speechEngineId - The speech engine ID (accepts seng_ or agent_ prefix)
     * @param {SpeechEngineClient.RequestOptions} requestOptions - Request-specific configuration.
     */
    public delete(
        speechEngineId: string,
        requestOptions?: SpeechEngineClient.RequestOptions,
    ): core.HttpResponsePromise<void> {
        return this.inner.delete(speechEngineId, requestOptions);
    }

    /**
     * Shortcut: attach a Speech Engine to an HTTP server without making an
     * API call. Equivalent to constructing a `SpeechEngineResource` and calling
     * `attach()` on it directly.
     *
     * @example
     * ```typescript
     * elevenlabs.speechEngine.attach("seng_123", httpServer, "/api/se/ws", {
     *     async onTranscript(transcript, signal, session) {
     *         session.sendResponse(await llm.generate(transcript, { signal }));
     *     },
     * });
     * ```
     */
    public attach(
        engineId: string,
        httpServer: HttpServer,
        path: string,
        handler: SpeechEngineCallbacks,
    ): SpeechEngineAttachment {
        return new SpeechEngineResource(engineId, this.inner.options()).attach(httpServer, path, handler);
    }
}
