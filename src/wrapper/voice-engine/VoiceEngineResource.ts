import type { IncomingMessage } from "node:http";
import type WebSocket from "ws";
import type { BaseClientOptions, NormalizedClientOptions } from "../../BaseClient";
import { VoiceEngineSession } from "./VoiceEngineSession";
import { VoiceEngineServer, type VoiceEngineServerOptions } from "./VoiceEngineServer";

/**
 * Represents a voice engine instance. Returned by `elevenlabs.voiceEngine.get()`.
 *
 * Manage the WebSocket upgrade in your own server, use
 * `engine.verifyRequest(req)` to authenticate incoming connections, then wrap
 * each socket with `engine.createSession(ws)`.
 *
 * For a zero-config standalone server, use `engine.listen({ port, onSession })`.
 *
 * @example
 * ```typescript
 * const engine = await elevenlabs.voiceEngine.get("veng_123");
 *
 * const wss = new WebSocket.Server({ noServer: true });
 *
 * httpServer.on("upgrade", async (req, socket, head) => {
 *     if (!await engine.verifyRequest(req)) { socket.destroy(); return; }
 *     wss.handleUpgrade(req, socket, head, (ws) => wss.emit("connection", ws));
 * });
 *
 * wss.on("connection", (ws) => {
 *     const session = engine.createSession(ws);
 *     session.on("user_transcript", async (transcript, { signal }) => {
 *         session.sendResponse(await llm.generate(transcript, { signal }));
 *     });
 * });
 * ```
 */
export class VoiceEngineResource {
    readonly engineId: string;
    /** @internal */
    readonly _options: NormalizedClientOptions<BaseClientOptions>;

    /** @internal */
    constructor(engineId: string, options: NormalizedClientOptions<BaseClientOptions>) {
        this.engineId = engineId;
        this._options = options;
    }

    /**
     * Verify that an incoming HTTP upgrade request is a legitimate connection
     * from the ElevenLabs Voice Engine API.
     *
     * Call this inside your WebSocket upgrade handler before accepting the
     * connection. Always returns `true` for now — signature verification will
     * be added in a future release.
     *
     * @example
     * ```typescript
     * httpServer.on("upgrade", async (req, socket, head) => {
     *     if (!await engine.verifyRequest(req)) { socket.destroy(); return; }
     *     wss.handleUpgrade(req, socket, head, (ws) => wss.emit("connection", ws));
     * });
     * ```
     */
    async verifyRequest(_req: IncomingMessage): Promise<boolean> {
        // TODO: verify ElevenLabs request signature
        return true;
    }

    /**
     * Wrap an accepted WebSocket connection in a `VoiceEngineSession`.
     *
     * Call this inside your WebSocket server's `connection` handler after
     * the upgrade has been verified with `engine.verifyRequest(req)`.
     */
    createSession(ws: WebSocket): VoiceEngineSession {
        return new VoiceEngineSession(ws);
    }

    /**
     * Start a standalone WebSocket server bound to this voice engine and begin
     * accepting connections immediately. Returns the running server so you can
     * call `.stop()` later.
     *
     * For integration with an existing HTTP server, manage the WebSocket
     * upgrade yourself and use `engine.createSession(ws)` per connection.
     */
    listen(options: Omit<VoiceEngineServerOptions, "engineId">): VoiceEngineServer {
        const server = new VoiceEngineServer({ ...options, engineId: this.engineId });
        server.start();
        return server;
    }
}
