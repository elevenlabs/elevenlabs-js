import type { Server as HttpServer } from "node:http";
import { SpeechEngineClient } from "../../api/resources/speechEngine/client/Client";
import type { SpeechEngineAttachment } from "./SpeechEngineAttachment";
import { SpeechEngineResource } from "./SpeechEngineResource";
import type { SpeechEngineCallbacks } from "./types";

/**
 * Client for the Speech Engine resource. Accessible via `elevenlabs.speechEngine`.
 *
 * Extends the Fern-generated `SpeechEngineClient` with WebSocket integration
 * methods. CRUD operations (`create`, `list`, `update`, `delete`) are
 * inherited from the generated client. `get()` is overridden to return a
 * `SpeechEngineResource` with WebSocket server setup methods.
 *
 * @example
 * ```typescript
 * // Create a speech engine
 * const { speechEngineId } = await elevenlabs.speechEngine.create({
 *     name: "My engine",
 *     speechEngine: { wsUrl: "wss://your-server.com/ws" },
 * });
 *
 * // Attach to an existing HTTP server
 * const engine = await elevenlabs.speechEngine.get(speechEngineId);
 * engine.attach(httpServer, "/api/speech-engine/ws", {
 *     async onTranscript(transcript, signal, session) {
 *         session.sendResponse(await llm.generate(transcript, { signal }));
 *     },
 * });
 * ```
 */
export class SpeechEngineClientWrapper extends SpeechEngineClient {
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
        await super.get(speechEngineId, requestOptions);
        return new SpeechEngineResource(speechEngineId, this._options);
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
