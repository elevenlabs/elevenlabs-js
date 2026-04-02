import type { BaseClientOptions, NormalizedClientOptions } from "../../BaseClient";
import { VoiceEngineResource } from "./VoiceEngineResource";

/**
 * Client for the Voice Engine resource. Accessible via `elevenlabs.voiceEngine`.
 *
 * Currently exposes `.get()` to retrieve a `VoiceEngineResource` by ID. CRUD
 * methods (`create`, `update`, `delete`, `list`) will be added here once the
 * API spec is available and SDK regeneration is complete.
 *
 * @example
 * ```typescript
 * const engine = await elevenlabs.voiceEngine.get("veng_123");
 * const server = engine.listen({ httpServer, onSession: (session) => { ... } });
 * server.start();
 * ```
 */
export class VoiceEngineClientWrapper {
    /** @internal */
    readonly _options: NormalizedClientOptions<BaseClientOptions>;

    /** @internal */
    constructor(options: NormalizedClientOptions<BaseClientOptions>) {
        this._options = options;
    }

    /**
     * Retrieve a voice engine by ID.
     *
     * Returns a `VoiceEngineResource` that holds the engine ID and client
     * credentials. Once CRUD endpoints are available in the API spec, this
     * method will also fetch and expose the engine's full configuration.
     */
    async get(engineId: string): Promise<VoiceEngineResource> {
        return new VoiceEngineResource(engineId, this._options);
    }
}
