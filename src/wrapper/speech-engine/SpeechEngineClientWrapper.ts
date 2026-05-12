import type { Server as HttpServer } from "node:http";
import { SpeechEngineClient } from "../../api/resources/speechEngine/client/Client";
import type { SpeechEngineCallbacks } from "./types";
import type { SpeechEngineAttachment } from "./SpeechEngineAttachment";
import { SpeechEngineResource } from "./SpeechEngineResource";

/**
 * Client for the Speech Engine resource. Accessible via `elevenlabs.speechEngine`.
 *
 * Extends the Fern-generated `SpeechEngineClient` with WebSocket integration
 * methods. CRUD operations (`create`, `get`, `list`, `update`, `delete`) are
 * inherited from the generated client.
 *
 * Use `resource()` to get a `SpeechEngineResource` for WebSocket server setup.
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
 * const engine = elevenlabs.speechEngine.resource(speechEngineId);
 * engine.attach(httpServer, "/api/speech-engine/ws", {
 *     async onTranscript(transcript, signal, session) {
 *         session.sendResponse(await llm.generate(transcript, { signal }));
 *     },
 * });
 * ```
 */
export class SpeechEngineClientWrapper extends SpeechEngineClient {
    /**
     * Return a `SpeechEngineResource` for WebSocket server integration.
     *
     * Unlike the inherited `get()` which fetches and returns the full
     * `SpeechEngineResponse` from the API, this method returns a
     * `SpeechEngineResource` with `.attach()`, `.createSession()`, and
     * `.verifyRequest()` methods for setting up a WebSocket server.
     */
    resource(engineId: string): SpeechEngineResource {
        return new SpeechEngineResource(engineId, this._options);
    }

    /**
     * Shortcut: get a `SpeechEngineResource` by ID and immediately attach it
     * to an HTTP server. Equivalent to calling `resource()` followed by
     * `attach()`.
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
        return this.resource(engineId).attach(httpServer, path, handler);
    }
}
