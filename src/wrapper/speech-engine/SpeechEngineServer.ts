import { createServer, type Server as HttpServer } from "node:http";
import type { Duplex } from "node:stream";
import WebSocket from "ws";
import { isAbortError, type SpeechEngineCallbacks } from "./types";
import { SpeechEngineSession } from "./SpeechEngineSession";
import { verifySpeechEngineJwt } from "./SpeechEngineResource";

export interface SpeechEngineServerOptions extends SpeechEngineCallbacks {
    /**
     * Port to listen on. Defaults to 3001.
     */
    port?: number;

    /**
     * Your ElevenLabs API key. Used to verify that incoming WebSocket
     * connections originate from the ElevenLabs API.
     *
     * When omitted, the server will reject all connections and throw
     * an error on start. Pass `{ apiKey: "..." }` or set the
     * `ELEVENLABS_API_KEY` environment variable.
     */
    apiKey?: string;

    /**
     * The ID of the speech engine this server handles connections for.
     * Populated automatically when created via `engine.listen()`.
     */
    engineId?: string;
}

/**
 * Standalone WebSocket server that produces `SpeechEngineSession` instances for
 * each incoming connection from the ElevenLabs Speech Engine API.
 *
 * Every incoming connection is verified against the ElevenLabs API using the
 * configured API key before being accepted.
 *
 * For integration with an existing HTTP server (e.g. Express, Next.js), use
 * `engine.attach()` instead.
 */
export class SpeechEngineServer {
    private wss: WebSocket.Server | null = null;
    private httpServer: HttpServer | null = null;
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

        const apiKey = this.options.apiKey ?? process.env.ELEVENLABS_API_KEY;
        if (!apiKey) {
            throw new Error(
                "SpeechEngine.Server requires an API key to verify incoming connections. " +
                "Pass { apiKey: \"...\" } or set the ELEVENLABS_API_KEY environment variable.",
            );
        }

        const debug = this.options.debug ?? false;
        const log = debug ? (...args: unknown[]) => console.log("[SpeechEngine]", ...args) : () => {};

        const httpServer = createServer();
        const wss = new WebSocket.Server({ noServer: true });

        httpServer.on("upgrade", (req, socket: Duplex, head) => {
            const headerValue = req.headers["x-elevenlabs-speech-engine-authorization"];
            const token = Array.isArray(headerValue) ? headerValue[0] : headerValue;

            if (!token) {
                log("rejected connection — missing X-Elevenlabs-Speech-Engine-Authorization header");
                socket.destroy();
                return;
            }

            try {
                verifySpeechEngineJwt(token, apiKey);
            } catch (err) {
                log(`rejected connection — ${err instanceof Error ? err.message : String(err)}`);
                socket.destroy();
                return;
            }

            log("verified connection, upgrading to WebSocket");
            wss.handleUpgrade(req, socket, head, (ws) => {
                wss.emit("connection", ws);
            });
        });

        wss.on("connection", (ws: WebSocket) => {
            this.handleConnection(ws);
        });

        httpServer.listen(this.options.port ?? 3001);

        this.wss = wss;
        this.httpServer = httpServer;
    }

    private wireHandler(session: SpeechEngineSession): void {
        const { onInit, onTranscript, onClose, onDisconnect, onError } = this.options;
        if (onInit) session.on("init", (id) => onInit.call(session, id, session));
        if (onTranscript) {
            session.on("user_transcript", (t, s) => {
                Promise.resolve(onTranscript.call(session, t, s, session)).catch((err) => {
                    if (isAbortError(err)) return;
                    const error = err instanceof Error ? err : new Error(String(err));
                    if (onError) onError.call(session, error, session);
                });
            });
        }
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

            this.wss.close((wssErr) => {
                this.wss = null;
                if (this.httpServer) {
                    this.httpServer.close((httpErr) => {
                        this.httpServer = null;
                        if (wssErr || httpErr) reject(wssErr || httpErr);
                        else resolve();
                    });
                } else {
                    if (wssErr) reject(wssErr);
                    else resolve();
                }
            });
        });
    }
}
