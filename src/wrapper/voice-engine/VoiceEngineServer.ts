import type { Server as HttpServer } from "node:http";
import WebSocket from "ws";
import { VoiceEngineSession } from "./VoiceEngineSession";

export interface VoiceEngineServerOptions {
    /**
     * An existing HTTP server to attach to. If provided, the WebSocket server
     * will handle upgrades on this server at the given `path`.
     */
    httpServer?: HttpServer;

    /**
     * If no `httpServer` is provided, the WebSocket server will listen on
     * this port. Defaults to 3001.
     */
    port?: number;

    /**
     * URL path to accept WebSocket upgrades on. Only connections to this
     * path will be accepted. Defaults to "/".
     */
    path?: string;

    /**
     * Called for each new session (one per conversation). Register event
     * listeners on the session inside this callback.
     */
    onSession: (session: VoiceEngineSession) => void;
}

/**
 * Convenience wrapper that creates a `ws.WebSocketServer` and produces
 * `VoiceEngineSession` instances for each incoming connection from the
 * ElevenLabs Voice Engine API.
 *
 * @example
 * ```typescript
 * import { VoiceEngine } from "@elevenlabs/elevenlabs-js";
 *
 * const server = new VoiceEngine.Server({
 *     httpServer: existingHttpServer,
 *     path: "/voice-engine",
 *     onSession: (session) => {
 *         session.on(VoiceEngine.TRANSCRIPT, async (text, { signal }) => {
 *             const response = await llm.generate(text, { signal });
 *             session.sendResponse(response);
 *         });
 *     },
 * });
 *
 * server.start();
 * ```
 *
 * For maximum flexibility, skip this class and wrap connections yourself:
 * ```typescript
 * const wss = new WebSocket.Server({ server: httpServer });
 * wss.on("connection", (ws) => {
 *     const session = new VoiceEngine.Session(ws);
 *     session.on(VoiceEngine.TRANSCRIPT, ...);
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
     * Start listening for incoming WebSocket connections.
     *
     * If an `httpServer` was provided, the WebSocket server attaches to it.
     * Otherwise a standalone server is created on the configured `port`.
     */
    start(): void {
        if (this.wss) {
            throw new Error("Server is already started");
        }

        const path = this.options.path ?? "/";

        if (this.options.httpServer) {
            this.wss = new WebSocket.Server({
                noServer: true,
            });

            this.options.httpServer.on("upgrade", (req, socket, head) => {
                const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
                if (url.pathname !== path) {
                    socket.destroy();
                    return;
                }

                this.wss!.handleUpgrade(req, socket, head, (ws) => {
                    this.wss!.emit("connection", ws, req);
                });
            });
        } else {
            this.wss = new WebSocket.Server({
                port: this.options.port ?? 3001,
                path,
            });
        }

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
