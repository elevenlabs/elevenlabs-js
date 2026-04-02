import WebSocket from "ws";
import { VoiceEngineSession } from "./VoiceEngineSession";

export interface VoiceEngineServerOptions {
    /**
     * Port to listen on. Defaults to 3001.
     */
    port?: number;

    /**
     * The ID of the voice engine this server handles connections for.
     * Populated automatically when created via `engine.listen()`.
     * Will be used for connection auth in a future release.
     */
    engineId?: string;

    /**
     * Called for each new session (one per conversation). Register event
     * listeners on the session inside this callback.
     */
    onSession: (session: VoiceEngineSession) => void;
}

/**
 * Standalone WebSocket server that produces `VoiceEngineSession` instances for
 * each incoming connection from the ElevenLabs Voice Engine API.
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
 *     const session = new VoiceEngine.Session(ws);
 *     session.on(VoiceEngine.USER_TRANSCRIPT, async (transcript, { signal }) => {
 *         session.sendResponse(await llm.generate(transcript, { signal }));
 *     });
 * });
 * ```
 */
export class VoiceEngineServer {
    private wss: WebSocket.Server | null = null;
    private options: VoiceEngineServerOptions;

    constructor(options: VoiceEngineServerOptions) {
        this.options = options;
    }

    /**
     * Create a `VoiceEngineSession` from an existing WebSocket. Use this
     * when you manage your own WebSocket server and want to wrap individual
     * connections.
     */
    handleConnection(ws: WebSocket): VoiceEngineSession {
        const session = new VoiceEngineSession(ws);
        this.options.onSession(session);
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
