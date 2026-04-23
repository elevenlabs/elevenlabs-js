import { createHash, createHmac } from "node:crypto";
import type { IncomingMessage, Server as HttpServer } from "node:http";
import type { Duplex } from "node:stream";
import WebSocket from "ws";
import type { BaseClientOptions, NormalizedClientOptions } from "../../BaseClient";
import * as core from "../../core";
import type { SpeechEngineCallbacks } from "./types";
import { SpeechEngineSession } from "./SpeechEngineSession";
import { SpeechEngineAttachment } from "./SpeechEngineAttachment";

/**
 * Represents a speech engine instance. Returned by `elevenlabs.speechEngine.get()`.
 *
 * Use `engine.attach(httpServer, path, callbacks)` to integrate with an existing
 * HTTP server, or drop down to `engine.verifyRequest()` and `engine.createSession()`
 * for full control.
 *
 * @example
 * ```typescript
 * const engine = await elevenlabs.speechEngine.get("seng_123");
 *
 * engine.attach(httpServer, "/api/speech-engine/ws", {
 *     async onTranscript(transcript, signal, session) {
 *         session.sendResponse(await llm.generate(transcript, { signal }));
 *     },
 * });
 * ```
 */
export class SpeechEngineResource {
    readonly engineId: string;
    /** @internal */
    readonly _options: NormalizedClientOptions<BaseClientOptions>;

    /** @internal */
    constructor(engineId: string, options: NormalizedClientOptions<BaseClientOptions>) {
        this.engineId = engineId;
        this._options = options;
    }

    /**
     * Attach to an existing HTTP server and begin accepting Speech Engine
     * connections at the given path.
     *
     * Handles WebSocket upgrades, path routing, and request verification
     * automatically. Returns a `SpeechEngineAttachment` whose `.close()` stops
     * accepting connections without affecting the HTTP server.
     *
     * @example
     * ```typescript
     * engine.attach(httpServer, "/api/speech-engine/ws", {
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
        handler: SpeechEngineCallbacks,
    ): SpeechEngineAttachment {
        const debug = handler.debug ?? false;
        const log = debug ? (...args: unknown[]) => console.log("[SpeechEngine]", ...args) : () => {};

        const wss = new WebSocket.Server({ noServer: true });

        const upgradeListener = async (req: IncomingMessage, socket: Duplex, head: Buffer) => {
            const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
            log(`upgrade request: ${req.method} ${url.pathname}`);

            if (url.pathname !== path) {
                log(`path mismatch: expected ${path}, got ${url.pathname} — skipping`);
                return;
            }

            if (!await this.verifyRequest(req)) {
                // verifyRequest returned false — get the detailed reason for debug logging
                const reason = await this.getVerificationFailure(req, log);
                log(`rejected connection — ${reason}`);
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
        return new SpeechEngineAttachment(wss, httpServer, upgradeListener as (...args: unknown[]) => void);
    }

    /**
     * Verify that an incoming HTTP upgrade request is a legitimate connection
     * from the ElevenLabs Speech Engine API.
     *
     * Checks the `X-Elevenlabs-Speech-Engine-Authorization` header for a valid
     * JWT signed with the SHA-256 hash of the API key.
     *
     * Only needed when managing the WebSocket upgrade yourself. When using
     * `engine.attach()`, verification is handled automatically.
     */
    async verifyRequest(req: { headers: Record<string, string | string[] | undefined> }): Promise<boolean> {
        return (await this.getVerificationFailure(req)) === null;
    }

    /** @internal Returns `null` when the request is valid, or a human-readable reason when rejected. */
    private async getVerificationFailure(
        req: { headers: Record<string, string | string[] | undefined> },
        log: (...args: unknown[]) => void = () => {},
    ): Promise<string | null> {
        const apiKey = await core.Supplier.get(this._options.apiKey);
        if (!apiKey) {
            return "no API key configured on the client";
        }

        const raw = req.headers["x-elevenlabs-speech-engine-authorization"];
        const headerValue = Array.isArray(raw) ? raw[0] : raw;
        if (!headerValue) {
            return "missing X-Elevenlabs-Speech-Engine-Authorization header";
        }

        try {
            verifySpeechEngineJwt(headerValue, apiKey, log);
            return null;
        } catch (err) {
            return err instanceof Error ? err.message : String(err);
        }
    }

    /**
     * Wrap an accepted WebSocket in a `SpeechEngineSession`.
     *
     * Only needed when managing the WebSocket upgrade yourself. When using
     * `engine.attach()`, sessions are created automatically.
     */
    createSession(ws: WebSocket, options?: { debug?: boolean }): SpeechEngineSession {
        return new SpeechEngineSession(ws, options);
    }

    /** @internal */
    private wireHandler(session: SpeechEngineSession, handler: SpeechEngineCallbacks): void {
        const { onInit, onTranscript, onClose, onDisconnect, onError } = handler;
        if (onInit) session.on("init", (id) => onInit.call(session, id, session));
        if (onTranscript) session.on("user_transcript", (t, s) => onTranscript.call(session, t, s, session));
        if (onClose) session.on("close", () => onClose.call(session, session));
        if (onDisconnect) session.on("disconnected", () => onDisconnect.call(session, session));
        if (onError) session.on("error", (err) => onError.call(session, err, session));
    }
}

// ---------------------------------------------------------------------------
// JWT verification (HS256, no external dependency)
// ---------------------------------------------------------------------------

const ISSUER = "https://api.elevenlabs.io/convai/speech-engine";
const SUBJECT = "convai_speech_engine_upstream";
const LEEWAY_SECONDS = 60;

function base64UrlDecode(input: string): Buffer {
    const padded = input.replace(/-/g, "+").replace(/_/g, "/");
    return Buffer.from(padded, "base64");
}

/** @internal — exported for testing only */
export function verifySpeechEngineJwt(
    value: string,
    apiKey: string,
    log: (...args: unknown[]) => void = () => {},
): Record<string, unknown> {
    let token = value.trim();
    if (token.toLowerCase().startsWith("bearer ")) {
        token = token.slice(7).trim();
    }
    log(`raw token: ${token}`);

    const parts = token.split(".");
    if (parts.length !== 3) {
        throw new Error("Invalid JWT: expected 3 parts");
    }

    const [headerB64, payloadB64, signatureB64] = parts;

    // Decode header and payload for logging (before signature check so we
    // see them even on verification failure)
    let jwtHeader: Record<string, unknown> | null = null;
    try {
        jwtHeader = JSON.parse(base64UrlDecode(headerB64).toString("utf-8"));
        log("JWT header:", jwtHeader);
    } catch {
        log("JWT header: failed to decode");
    }

    let payload: Record<string, unknown>;
    try {
        payload = JSON.parse(base64UrlDecode(payloadB64).toString("utf-8"));
        log("JWT payload:", payload);
    } catch {
        throw new Error("Invalid JWT: failed to decode payload");
    }

    // SHA-256 hash of the API key, used as the HMAC secret
    const trimmedKey = apiKey.trim();
    if (trimmedKey.length !== apiKey.length) {
        log(`API key has whitespace — trimmed from ${apiKey.length} to ${trimmedKey.length} chars`);
    }
    const keyPrefix = trimmedKey.length > 8 ? `${trimmedKey.slice(0, 4)}...${trimmedKey.slice(-4)}` : "****";
    log(`API key: ${keyPrefix} (${trimmedKey.length} chars)`);

    const secret = createHash("sha256").update(trimmedKey, "utf-8").digest();
    log(`secret (sha256 of key): ${secret.toString("hex").slice(0, 16)}...`);

    const signingInput = `${headerB64}.${payloadB64}`;
    const expectedSignature = createHmac("sha256", secret)
        .update(signingInput)
        .digest();

    const actualSignature = base64UrlDecode(signatureB64);

    if (!expectedSignature.equals(actualSignature)) {
        log(`expected signature: ${expectedSignature.toString("hex")}`);
        log(`actual signature:   ${actualSignature.toString("hex")}`);
        log(`signing input:      ${signingInput}`);
        throw new Error("Invalid JWT: signature mismatch");
    }

    if (payload.iss !== ISSUER) {
        throw new Error(`Invalid JWT: expected issuer "${ISSUER}", got "${payload.iss}"`);
    }
    if (payload.sub !== SUBJECT) {
        throw new Error(`Invalid JWT: expected subject "${SUBJECT}", got "${payload.sub}"`);
    }

    const now = Math.floor(Date.now() / 1000);

    if (typeof payload.exp !== "number") {
        throw new Error("Invalid JWT: missing exp claim");
    }
    if (typeof payload.iat !== "number") {
        throw new Error("Invalid JWT: missing iat claim");
    }
    if (payload.exp + LEEWAY_SECONDS < now) {
        throw new Error("Invalid JWT: token has expired");
    }
    if (payload.iat - LEEWAY_SECONDS > now) {
        throw new Error("Invalid JWT: iat is in the future");
    }

    return payload;
}
