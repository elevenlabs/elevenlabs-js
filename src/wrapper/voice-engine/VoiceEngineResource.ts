import type { IncomingMessage, Server as HttpServer } from "node:http";
import type { Duplex } from "node:stream";
import WebSocket from "ws";
import type { BaseClientOptions, NormalizedClientOptions } from "../../BaseClient";
import type { VoiceEngineCallbacks } from "./types";
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
     * Handles WebSocket upgrades, path routing, and request verification
     * automatically. Returns a `VoiceEngineAttachment` whose `.close()` stops
     * accepting connections without affecting the HTTP server.
     *
     * @example
     * ```typescript
     * engine.attach(httpServer, "/api/voice-engine/ws", {
     *     async onTranscript(transcript, signal, session) {
     *         const stream = await openai.responses.create({ model: "gpt-4o", input: transcript, stream: true }, { signal });
     *         session.sendResponse(stream);
     *     },
     * });
     * ```
     */
    attach(
        httpServer: HttpServer,
        path: string,
        handler: VoiceEngineCallbacks,
    ): VoiceEngineAttachment {
        const debug = handler.debug ?? false;
        const log = debug ? (...args: unknown[]) => console.log("[VoiceEngine]", ...args) : () => {};

        const wss = new WebSocket.Server({ noServer: true });

        const upgradeListener = async (req: IncomingMessage, socket: Duplex, head: Buffer) => {
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
        };

        httpServer.on("upgrade", upgradeListener);

        wss.on("connection", (ws: WebSocket) => {
            log("creating new session");
            const session = this.createSession(ws, { debug });
            this.wireHandler(session, handler);
        });

        log(`listening for WebSocket upgrades on ${path}`);
        return new VoiceEngineAttachment(wss, httpServer, upgradeListener as (...args: unknown[]) => void);
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
    createSession(ws: WebSocket, options?: { debug?: boolean }): VoiceEngineSession {
        return new VoiceEngineSession(ws, options);
    }

    /** @internal */
    private wireHandler(session: VoiceEngineSession, handler: VoiceEngineCallbacks): void {
        const { onInit, onTranscript, onClose, onDisconnect, onError } = handler;
        if (onInit) session.on("init", (id) => onInit.call(session, id, session));
        if (onTranscript) session.on("user_transcript", (t, s) => onTranscript.call(session, t, s, session));
        if (onClose) session.on("close", () => onClose.call(session, session));
        if (onDisconnect) session.on("disconnected", () => onDisconnect.call(session, session));
        if (onError) session.on("error", (err) => onError.call(session, err, session));
    }
}
