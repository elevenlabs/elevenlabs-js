import type { Server as HttpServer } from "node:http";
import type { CreateSpeechEngineRequest } from "../../api/resources/speechEngine/client/requests/CreateSpeechEngineRequest";
import type { UpdateSpeechEngineRequest } from "../../api/resources/speechEngine/client/requests/UpdateSpeechEngineRequest";
import { SpeechEngineClient } from "../../api/resources/speechEngine/client/Client";
import type { SpeechEngineAttachment } from "./SpeechEngineAttachment";
import { SpeechEngineResource } from "./SpeechEngineResource";
import type { SpeechEngineCallbacks } from "./types";

/**
 * Client for the Speech Engine resource. Accessible via `elevenlabs.speechEngine`.
 *
 * Extends the Fern-generated `SpeechEngineClient` with WebSocket integration
 * methods. `list` and `delete` are inherited from the generated client.
 * `create`, `get`, and `update` are overridden to return a `SpeechEngineResource`
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
export class SpeechEngineClientWrapper extends SpeechEngineClient {
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
    // @ts-expect-error — intentionally returns SpeechEngineResource instead of HttpResponsePromise<SpeechEngineResponse>
    public async create(
        request: CreateSpeechEngineRequest,
        requestOptions?: SpeechEngineClient.RequestOptions,
    ): Promise<SpeechEngineResource> {
        const response = await super.create(request, requestOptions);
        return new SpeechEngineResource(response.speechEngineId, this._options, response);
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
    // @ts-expect-error — intentionally returns SpeechEngineResource instead of HttpResponsePromise<SpeechEngineResponse>
    public async get(
        speechEngineId: string,
        requestOptions?: SpeechEngineClient.RequestOptions,
    ): Promise<SpeechEngineResource> {
        const response = await super.get(speechEngineId, requestOptions);
        return new SpeechEngineResource(speechEngineId, this._options, response);
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
    // @ts-expect-error — intentionally returns SpeechEngineResource instead of HttpResponsePromise<SpeechEngineResponse>
    public async update(
        speechEngineId: string,
        request: UpdateSpeechEngineRequest = {},
        requestOptions?: SpeechEngineClient.RequestOptions,
    ): Promise<SpeechEngineResource> {
        const response = await super.update(speechEngineId, request, requestOptions);
        return new SpeechEngineResource(speechEngineId, this._options, response);
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
    attach(
        engineId: string,
        httpServer: HttpServer,
        path: string,
        handler: SpeechEngineCallbacks,
    ): SpeechEngineAttachment {
        return new SpeechEngineResource(engineId, this._options).attach(httpServer, path, handler);
    }
}
