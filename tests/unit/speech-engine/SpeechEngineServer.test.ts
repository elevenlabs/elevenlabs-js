import http from "node:http";
import WebSocket from "ws";
import { SpeechEngineServer } from "../../../src/wrapper/speech-engine/SpeechEngineServer";

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

describe("SpeechEngineServer", () => {
    const cleanups: Array<() => Promise<void>> = [];

    afterEach(async () => {
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

    function trackSeServer(se: SpeechEngineServer): SpeechEngineServer {
        cleanups.push(() => se.stop().catch(() => {}));
        return se;
    }

    function trackClientWs(ws: WebSocket): WebSocket {
        cleanups.push(() => closeWs(ws));
        return ws;
    }

    // -----------------------------------------------------------------------
    // handleConnection
    // -----------------------------------------------------------------------

    it("handleConnection wraps an existing WebSocket and calls onInit", async () => {
        const httpServer = trackHttpServer();
        await new Promise<void>((r) => httpServer.listen(0, r));
        const port = getPort(httpServer);

        const rawWss = new WebSocket.Server({ server: httpServer });
        cleanups.push(() => new Promise<void>((r) => rawWss.close(() => r())));

        const onInit = jest.fn();
        const se = trackSeServer(new SpeechEngineServer({ onInit }));

        rawWss.on("connection", (ws) => {
            const session = se.handleConnection(ws);
            expect(session).toBeDefined();
        });

        const ws = trackClientWs(new WebSocket(`ws://127.0.0.1:${port}`));
        await new Promise<void>((r, e) => { ws.on("open", r); ws.on("error", e); });

        ws.send(JSON.stringify({ type: "init", conversation_id: "conv_1" }));

        await new Promise((r) => setTimeout(r, 50));
        expect(onInit).toHaveBeenCalledTimes(1);
        expect(onInit).toHaveBeenCalledWith("conv_1", expect.anything());
    });

    // -----------------------------------------------------------------------
    // Session sends responses back over WebSocket
    // -----------------------------------------------------------------------

    it("session responses are received by the client", async () => {
        const httpServer = trackHttpServer();
        await new Promise<void>((r) => httpServer.listen(0, r));
        const port = getPort(httpServer);

        const rawWss = new WebSocket.Server({ server: httpServer });
        cleanups.push(() => new Promise<void>((r) => rawWss.close(() => r())));

        const se = trackSeServer(
            new SpeechEngineServer({
                onTranscript(transcript, _signal, session) {
                    const last = transcript[transcript.length - 1];
                    session.sendResponse(`echo: ${last.content}`);
                },
            }),
        );

        rawWss.on("connection", (ws) => se.handleConnection(ws));

        const ws = trackClientWs(new WebSocket(`ws://127.0.0.1:${port}`));

        const responsePromise = new Promise<string>((resolve) => {
            ws.on("message", (data) => resolve(data.toString()));
        });

        await new Promise<void>((r, e) => { ws.on("open", r); ws.on("error", e); });

        ws.send(
            JSON.stringify({
                type: "user_transcript",
                user_transcript: [{ role: "user", content: "ping" }],
                event_id: 1,
            }),
        );

        const response = JSON.parse(await responsePromise);
        expect(response).toEqual({ type: "agent_response", content: "echo: ping", event_id: 1, is_final: false });
    });

    // -----------------------------------------------------------------------
    // Lifecycle
    // -----------------------------------------------------------------------

    it("throws if started twice", () => {
        const se = trackSeServer(new SpeechEngineServer({ port: 0 }));
        se.start();
        expect(() => se.start()).toThrow("already started");
    });

    it("stop() resolves when no server is running", async () => {
        const se = trackSeServer(new SpeechEngineServer({}));
        await expect(se.stop()).resolves.toBeUndefined();
    });
});
