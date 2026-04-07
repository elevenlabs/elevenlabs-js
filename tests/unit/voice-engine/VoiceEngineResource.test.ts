import http from "node:http";
import WebSocket from "ws";
import { normalizeClientOptions } from "../../../src/BaseClient";
import { VoiceEngineResource } from "../../../src/wrapper/voice-engine/VoiceEngineResource";
import { VoiceEngineAttachment } from "../../../src/wrapper/voice-engine/VoiceEngineAttachment";

const testOptions = normalizeClientOptions({ apiKey: "test-key" });

function makeResource(): VoiceEngineResource {
    return new VoiceEngineResource("veng_test", testOptions);
}

function getPort(server: http.Server): number {
    const addr = server.address();
    if (addr && typeof addr === "object") return addr.port;
    throw new Error("Server not listening");
}

async function closeWs(ws: WebSocket): Promise<void> {
    if (ws.readyState === WebSocket.CLOSED || ws.readyState === WebSocket.CLOSING) return;
    return new Promise<void>((r) => {
        ws.on("close", () => r());
        ws.on("error", () => r());
        try { ws.close(); } catch { r(); }
    });
}

describe("VoiceEngineResource", () => {
    const cleanups: Array<() => Promise<void>> = [];

    afterEach(async () => {
        while (cleanups.length > 0) {
            await cleanups.pop()!().catch(() => {});
        }
    });

    function trackHttpServer(): http.Server {
        const server = http.createServer();
        cleanups.push(() => {
            server.closeAllConnections();
            return new Promise<void>((r) => server.close(() => r()));
        });
        return server;
    }

    function trackAttachment(a: VoiceEngineAttachment): VoiceEngineAttachment {
        cleanups.push(() => a.close().catch(() => {}));
        return a;
    }

    function trackClientWs(ws: WebSocket): WebSocket {
        cleanups.push(() => closeWs(ws));
        return ws;
    }

    // -----------------------------------------------------------------------
    // attach — routing
    // -----------------------------------------------------------------------

    it("calls onTranscript for connections on the correct path", async () => {
        const httpServer = trackHttpServer();
        await new Promise<void>((r) => httpServer.listen(0, r));
        const port = getPort(httpServer);

        const onTranscript = jest.fn();
        const resource = makeResource();
        trackAttachment(resource.attach(httpServer, "/ve", { onTranscript }));

        const ws = trackClientWs(new WebSocket(`ws://127.0.0.1:${port}/ve`));
        await new Promise<void>((r, e) => { ws.on("open", r); ws.on("error", e); });

        ws.send(JSON.stringify({
            type: "user_transcript",
            user_transcript: [{ role: "user", content: "hello" }],
            event_id: 1,
        }));

        await new Promise((r) => setTimeout(r, 50));
        expect(onTranscript).toHaveBeenCalledTimes(1);
    });

    it("ignores connections on the wrong path without calling onSession", async () => {
        const httpServer = trackHttpServer();
        await new Promise<void>((r) => httpServer.listen(0, r));
        const port = getPort(httpServer);

        // Track raw sockets from upgrade requests so we can clean up
        // connections that are intentionally left open (not destroyed) by
        // the path-mismatch branch.
        const upgradeSockets: import("node:stream").Duplex[] = [];
        httpServer.on("upgrade", (_req, socket) => { upgradeSockets.push(socket); });

        const onTranscript = jest.fn();
        const resource = makeResource();
        trackAttachment(resource.attach(httpServer, "/ve", { onTranscript }));

        const ws = new WebSocket(`ws://127.0.0.1:${port}/wrong`);
        ws.on("error", () => {});

        // The upgrade is silently ignored (not destroyed) so other handlers
        // like Next.js HMR can still process it. Give it a moment to confirm
        // onSession is never called.
        await new Promise((r) => setTimeout(r, 100));
        expect(onTranscript).not.toHaveBeenCalled();

        ws.terminate();
        for (const s of upgradeSockets) s.destroy();
    });

    // -----------------------------------------------------------------------
    // attach — verifyRequest
    // -----------------------------------------------------------------------

    it("rejects connections when verifyRequest returns false", async () => {
        const httpServer = trackHttpServer();
        await new Promise<void>((r) => httpServer.listen(0, r));
        const port = getPort(httpServer);

        const resource = makeResource();
        jest.spyOn(resource, "verifyRequest").mockResolvedValue(false);
        trackAttachment(resource.attach(httpServer, "/ve", {}));

        const ws = trackClientWs(new WebSocket(`ws://127.0.0.1:${port}/ve`));

        await new Promise<void>((resolve) => {
            ws.on("error", () => resolve());
            ws.on("close", () => resolve());
        });
    });

    // -----------------------------------------------------------------------
    // attach — session protocol
    // -----------------------------------------------------------------------

    it("sessions receive and respond to messages", async () => {
        const httpServer = trackHttpServer();
        await new Promise<void>((r) => httpServer.listen(0, r));
        const port = getPort(httpServer);

        const resource = makeResource();
        trackAttachment(resource.attach(httpServer, "/ve", {
            onTranscript(transcript, _signal, session) {
                const last = transcript[transcript.length - 1];
                session.sendResponse(`echo: ${last.content}`);
            },
        }));

        const ws = trackClientWs(new WebSocket(`ws://127.0.0.1:${port}/ve`));
        const responsePromise = new Promise<string>((resolve) => {
            ws.on("message", (data) => resolve(data.toString()));
        });

        await new Promise<void>((r, e) => { ws.on("open", r); ws.on("error", e); });

        ws.send(JSON.stringify({
            type: "user_transcript",
            user_transcript: [{ role: "user", content: "hello" }],
            event_id: 1,
        }));

        const response = JSON.parse(await responsePromise);
        expect(response).toEqual({ type: "agent_response", content: "echo: hello", event_id: 1, is_final: false });
    });


    // -----------------------------------------------------------------------
    // attach — close
    // -----------------------------------------------------------------------

    it("close() stops the attachment without closing the HTTP server", async () => {
        const httpServer = trackHttpServer();
        await new Promise<void>((r) => httpServer.listen(0, r));

        const resource = makeResource();
        const attachment = resource.attach(httpServer, "/ve", {});
        await attachment.close();

        expect(httpServer.listening).toBe(true);
    });

});
