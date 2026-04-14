import WebSocket from "ws";
import type { SpeechEngineCallbacks } from "./types";
import { SpeechEngineSession } from "./SpeechEngineSession";

export interface SpeechEngineServerOptions extends SpeechEngineCallbacks {
    /**
     * Port to listen on. Defaults to 3001.
     */
    port?: number;

    /**
     * The ID of the speech engine this server handles connections for.
     * Populated automatically when created via `engine.listen()`.
     * Will be used for connection auth in a future release.
     */
    engineId?: string;
}

/**
 * Standalone WebSocket server that produces `SpeechEngineSession` instances for
 * each incoming connection from the ElevenLabs Speech Engine API.
 *
 * For integration with an existing HTTP server (e.g. Express, Next.js), manage
 * the WebSocket upgrade yourself and use `handleConnection` to wrap individual
 * connections:
 *
 * ```typescript
 * const wss = new WebSocket.Server({ noServer: true });
 *
 * httpServer.on("upgrade", async (req, socket, head) => {
 *     if (!await engine.verifyRequest(req)) { socket.destroy(); return; }
 *     wss.handleUpgrade(req, socket, head, (ws) => wss.emit("connection", ws));
 * });
 *
 * wss.on("connection", (ws) => {
 *     const session = new SpeechEngine.Session(ws);
 *     session.on(SpeechEngine.USER_TRANSCRIPT, async (transcript, { signal }) => {
 *         session.sendResponse(await llm.generate(transcript, { signal }));
 *     });
 * });
 * ```
 */
export class SpeechEngineServer {
    private wss: WebSocket.Server | null = null;
    private options: SpeechEngineServerOptions;

    constructor(options: SpeechEngineServerOptions) {
        this.options = options;
    }

    /**
     * Create a `SpeechEngineSession` from an existing WebSocket. Use this
     * when you manage your own WebSocket server and want to wrap individual
     * connections.
     */
    handleConnection(ws: WebSocket): SpeechEngineSession {
        const session = new SpeechEngineSession(ws, { debug: this.options.debug });
        this.wireHandler(session);
        return session;
    }

    /**
     * Start the standalone WebSocket server on the configured port.
     */
    start(): void {
        if (this.wss) {
            throw new Error("Server is already started");
        }

        this.wss = new WebSocket.Server({ port: this.options.port ?? 3001 });

        this.wss.on("connection", (ws: WebSocket) => {
            this.handleConnection(ws);
        });
    }

    private wireHandler(session: SpeechEngineSession): void {
        const { onInit, onTranscript, onClose, onDisconnect, onError } = this.options;
        if (onInit) session.on("init", (id) => onInit.call(session, id, session));
        if (onTranscript) session.on("user_transcript", (t, s) => onTranscript.call(session, t, s, session));
        if (onClose) session.on("close", () => onClose.call(session, session));
        if (onDisconnect) session.on("disconnected", () => onDisconnect.call(session, session));
        if (onError) session.on("error", (err) => onError.call(session, err, session));
    }

    /**
     * Stop the WebSocket server and close all active connections.
     */
    stop(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.wss) {
                resolve();
                return;
            }

            this.wss.close((err) => {
                this.wss = null;
                if (err) reject(err);
                else resolve();
            });
        });
    }
}
