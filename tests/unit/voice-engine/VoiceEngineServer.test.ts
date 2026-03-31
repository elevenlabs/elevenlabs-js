import http from "node:http";
import WebSocket from "ws";
import { VoiceEngineServer } from "../../../src/wrapper/voice-engine/VoiceEngineServer";
import { VoiceEngine } from "../../../src/wrapper/voice-engine";

function getPort(server: http.Server): number {
    const addr = server.address();
    if (addr && typeof addr === "object") return addr.port;
    throw new Error("Server not listening");
}

async function closeWs(ws: WebSocket | null): Promise<void> {
    if (!ws) return;
    if (ws.readyState === WebSocket.CLOSED || ws.readyState === WebSocket.CLOSING) return;
    return new Promise<void>((r) => {
        ws.on("close", () => r());
        ws.on("error", () => r()); // suppress errors during teardown
        try {
            ws.close();
        } catch {
            r();
        }
    });
}

describe("VoiceEngineServer", () => {
    const cleanups: Array<() => Promise<void>> = [];

    afterEach(async () => {
        // Run cleanups in reverse order (LIFO)
        while (cleanups.length > 0) {
            const fn = cleanups.pop()!;
            await fn().catch(() => {});
        }
    });

    function trackHttpServer(): http.Server {
        const server = http.createServer();
        cleanups.push(() => new Promise<void>((r) => server.close(() => r())));
        return server;
    }

    function trackVeServer(ve: VoiceEngineServer): VoiceEngineServer {
        cleanups.push(() => ve.stop().catch(() => {}));
        return ve;
    }

    function trackClientWs(ws: WebSocket): WebSocket {
        cleanups.push(() => closeWs(ws));
        return ws;
    }

    // -----------------------------------------------------------------------
    // HTTP server mode
    // -----------------------------------------------------------------------

    it("attaches to an existing HTTP server and routes by path", async () => {
        const httpServer = trackHttpServer();
        await new Promise<void>((r) => httpServer.listen(0, r));
        const port = getPort(httpServer);

        const sessionPromise = new Promise<void>((resolve) => {
            const ve = trackVeServer(
                new VoiceEngineServer({
                    httpServer,
                    path: "/voice-engine",
                    onSession: (session) => {
                        session.on(VoiceEngine.USER_TRANSCRIPT, (transcript) => {
                            expect(transcript).toEqual([{ role: "user", content: "test transcript" }]);
                            resolve();
                        });
                    },
                }),
            );
            ve.start();
        });

        const ws = trackClientWs(new WebSocket(`ws://127.0.0.1:${port}/voice-engine`));

        await new Promise<void>((resolve, reject) => {
            ws.on("open", resolve);
            ws.on("error", reject);
        });

        ws.send(
            JSON.stringify({
                type: "user_transcript",
                user_transcript: [{ role: "user", content: "test transcript" }],
                event_id: 1,
            }),
        );

        await sessionPromise;
    });

    it("rejects connections to wrong path", async () => {
        const httpServer = trackHttpServer();
        await new Promise<void>((r) => httpServer.listen(0, r));
        const port = getPort(httpServer);

        const onSession = jest.fn();
        const ve = trackVeServer(
            new VoiceEngineServer({
                httpServer,
                path: "/voice-engine",
                onSession,
            }),
        );
        ve.start();

        const ws = trackClientWs(new WebSocket(`ws://127.0.0.1:${port}/wrong-path`));

        await new Promise<void>((resolve) => {
            ws.on("error", () => resolve());
            ws.on("close", () => resolve());
        });

        expect(onSession).not.toHaveBeenCalled();
    });

    // -----------------------------------------------------------------------
    // handleConnection
    // -----------------------------------------------------------------------

    it("handleConnection wraps an existing WebSocket and calls onSession", async () => {
        const httpServer = trackHttpServer();
        await new Promise<void>((r) => httpServer.listen(0, r));
        const port = getPort(httpServer);

        const rawWss = new WebSocket.Server({ server: httpServer });
        cleanups.push(() => new Promise<void>((r) => rawWss.close(() => r())));

        const onSession = jest.fn();
        const ve = trackVeServer(new VoiceEngineServer({ onSession }));

        const connectionPromise = new Promise<void>((resolve) => {
            rawWss.on("connection", (ws) => {
                const session = ve.handleConnection(ws);
                expect(session).toBeDefined();
                resolve();
            });
        });

        const ws = trackClientWs(new WebSocket(`ws://127.0.0.1:${port}`));
        await new Promise<void>((r, e) => { ws.on("open", r); ws.on("error", e); });
        await connectionPromise;

        expect(onSession).toHaveBeenCalledTimes(1);
    });

    // -----------------------------------------------------------------------
    // Session sends responses back over WebSocket
    // -----------------------------------------------------------------------

    it("session responses are received by the client", async () => {
        const httpServer = trackHttpServer();
        await new Promise<void>((r) => httpServer.listen(0, r));
        const port = getPort(httpServer);

        const ve = trackVeServer(
            new VoiceEngineServer({
                httpServer,
                path: "/",
                onSession: (session) => {
                    session.on(VoiceEngine.USER_TRANSCRIPT, (transcript) => {
                        const last = transcript[transcript.length - 1];
                        session.sendResponse(`echo: ${last.content}`);
                    });
                },
            }),
        );
        ve.start();

        const ws = trackClientWs(new WebSocket(`ws://127.0.0.1:${port}/`));

        const responsePromise = new Promise<string>((resolve) => {
            ws.on("message", (data) => {
                resolve(data.toString());
            });
        });

        await new Promise<void>((r, e) => {
            ws.on("open", r);
            ws.on("error", e);
        });

        ws.send(
            JSON.stringify({
                type: "user_transcript",
                user_transcript: [{ role: "user", content: "ping" }],
                event_id: 1,
            }),
        );

        const response = JSON.parse(await responsePromise);
        expect(response).toEqual({ agent_response: { content: "echo: ping", event_id: 1, is_final: true } });
    });

    // -----------------------------------------------------------------------
    // Lifecycle
    // -----------------------------------------------------------------------

    it("throws if started twice", () => {
        const httpServer = trackHttpServer();
        const ve = trackVeServer(
            new VoiceEngineServer({
                httpServer,
                onSession: () => {},
            }),
        );
        ve.start();
        expect(() => ve.start()).toThrow("already started");
    });

    it("stop() resolves when no server is running", async () => {
        const ve = trackVeServer(new VoiceEngineServer({ onSession: () => {} }));
        await expect(ve.stop()).resolves.toBeUndefined();
    });
});
