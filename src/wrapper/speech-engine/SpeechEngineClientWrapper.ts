import type { Server as HttpServer } from "node:http";
import type { BaseClientOptions, NormalizedClientOptions } from "../../BaseClient";
import type { SpeechEngineCallbacks } from "./types";
import type { SpeechEngineAttachment } from "./SpeechEngineAttachment";
import { SpeechEngineResource } from "./SpeechEngineResource";

/**
 * Client for the Speech Engine resource. Accessible via `elevenlabs.speechEngine`.
 *
 * Currently exposes `.get()` to retrieve a `SpeechEngineResource` by ID. CRUD
 * methods (`create`, `update`, `delete`, `list`) will be added here once the
 * API spec is available and SDK regeneration is complete.
 *
 * @example
 * ```typescript
 * const engine = await elevenlabs.speechEngine.get("seng_123");
 * const server = engine.listen({ httpServer, onSession: (session) => { ... } });
 * server.start();
 * ```
 */
export class SpeechEngineClientWrapper {
    /** @internal */
    readonly _options: NormalizedClientOptions<BaseClientOptions>;

    /** @internal */
    constructor(options: NormalizedClientOptions<BaseClientOptions>) {
        this._options = options;
    }

    /**
     * Retrieve a speech engine by ID.
     *
     * Returns a `SpeechEngineResource` that holds the engine ID and client
     * credentials. Once CRUD endpoints are available in the API spec, this
     * method will also fetch and expose the engine's full configuration.
     */
    async get(engineId: string): Promise<SpeechEngineResource> {
        return new SpeechEngineResource(engineId, this._options);
    }

    /**
     * Shortcut: retrieve a speech engine by ID and immediately attach it to an
     * HTTP server. Equivalent to calling `get()` followed by `attach()`.
     *
     * @example
     * ```typescript
     * await elevenlabs.speechEngine.attach("seng_123", httpServer, "/api/se/ws", {
     *     async onTranscript(transcript, signal, session) {
     *         session.sendResponse(await llm.generate(transcript, { signal }));
     *     },
     * });
     * ```
     */
    async attach(
        engineId: string,
        httpServer: HttpServer,
        path: string,
        handler: SpeechEngineCallbacks,
    ): Promise<SpeechEngineAttachment> {
        const resource = await this.get(engineId);
        return resource.attach(httpServer, path, handler);
    }
}
