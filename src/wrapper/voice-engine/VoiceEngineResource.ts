import type { IncomingMessage, Server as HttpServer } from "node:http";
import WebSocket from "ws";
import type { BaseClientOptions, NormalizedClientOptions } from "../../BaseClient";
import { VoiceEngineSession } from "./VoiceEngineSession";
import { VoiceEngineAttachment } from "./VoiceEngineAttachment";

/**
 * Represents a voice engine instance. Returned by `elevenlabs.voiceEngine.get()`.
 *
 * Use `engine.attach(httpServer, path, onSession)` to integrate with an existing
 * HTTP server, or drop down to `engine.verifyRequest()` and `engine.createSession()`
 * for full control.
 *
 * @example
 * ```typescript
 * const engine = await elevenlabs.voiceEngine.get("veng_123");
 *
 * engine.attach(httpServer, "/api/voice-engine/ws", (session) => {
 *     session.on(VoiceEngine.USER_TRANSCRIPT, async (transcript, { signal }) => {
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
     * Attach to an existing HTTP server and begin accepting Voice Engine
     * connections at the given path.
     *
     * `onSession` is called once per incoming connection with an isolated
     * `VoiceEngineSession` — one per conversation, regardless of how many
     * callers connect simultaneously.
     *
     * Handles WebSocket upgrades, path routing, and request verification
     * automatically. Returns a `VoiceEngineAttachment` whose `.close()` stops
     * accepting connections without affecting the HTTP server.
     *
     * @example
     * ```typescript
     * engine.attach(httpServer, "/api/voice-engine/ws", (session) => {
     *     session.on(VoiceEngine.USER_TRANSCRIPT, async (transcript, { signal }) => {
     *         session.sendResponse(await llm.generate(transcript, { signal }));
     *     });
     * });
     * ```
     */
    attach(
        httpServer: HttpServer,
        path: string,
        onSession: (session: VoiceEngineSession) => void,
        options?: { debug?: boolean },
    ): VoiceEngineAttachment {
        const debug = options?.debug ?? false;
        const log = debug ? (...args: unknown[]) => console.log("[VoiceEngine]", ...args) : () => {};

        const wss = new WebSocket.Server({ noServer: true });
        const attachment = new VoiceEngineAttachment(wss);

        httpServer.on("upgrade", async (req, socket, head) => {
            const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
            log(`upgrade request: ${req.method} ${url.pathname}`);

            if (url.pathname !== path) {
                log(`path mismatch: expected ${path}, got ${url.pathname} — skipping`);
                return;
            }

            if (!await this.verifyRequest(req)) {
                log("verifyRequest rejected the connection — destroying socket");
                socket.destroy();
                return;
            }

            log("upgrading connection to WebSocket");
            wss.handleUpgrade(req, socket, head, (ws) => {
                log("WebSocket connection established");
                wss.emit("connection", ws);
            });
        });

        wss.on("connection", (ws: WebSocket) => {
            log("creating new session");
            onSession(this.createSession(ws));
        });

        log(`listening for WebSocket upgrades on ${path}`);
        return attachment;
    }

    /**
     * Verify that an incoming HTTP upgrade request is a legitimate connection
     * from the ElevenLabs Voice Engine API.
     *
     * Only needed when managing the WebSocket upgrade yourself. When using
     * `engine.attach()`, verification is handled automatically.
     *
     * Always returns `true` for now — signature verification will be added in
     * a future release.
     */
    async verifyRequest(_req: IncomingMessage): Promise<boolean> {
        // TODO: verify ElevenLabs request signature
        return true;
    }

    /**
     * Wrap an accepted WebSocket in a `VoiceEngineSession`.
     *
     * Only needed when managing the WebSocket upgrade yourself. When using
     * `engine.attach()`, sessions are created automatically.
     */
    createSession(ws: WebSocket): VoiceEngineSession {
        return new VoiceEngineSession(ws);
    }
}
