import { EventEmitter } from "node:events";
import WebSocket from "ws";
import { VoiceEngineSession } from "../../../src/wrapper/voice-engine/VoiceEngineSession";
import { VoiceEngine } from "../../../src/wrapper/voice-engine";
import type { ConversationMessage, WebSocketLike } from "../../../src/wrapper/voice-engine/types";

class MockWebSocket extends EventEmitter implements WebSocketLike {
    readyState = WebSocket.OPEN;
    sent: string[] = [];

    send(data: string): void {
        this.sent.push(data);
    }

    close(): void {
        this.readyState = WebSocket.CLOSED;
        this.emit("close", 1000, Buffer.from(""));
    }

    receiveMessage(msg: Record<string, unknown>): void {
        this.emit("message", Buffer.from(JSON.stringify(msg)));
    }

    simulateError(err: Error): void {
        this.emit("error", err);
    }
}

const transcript: ConversationMessage[] = [
    { role: "agent", content: "how can I help you today?" },
    { role: "user", content: "I need a pizza" },
];

const transcript2: ConversationMessage[] = [
    { role: "agent", content: "how can I help you today?" },
    { role: "user", content: "I need a pizza" },
    { role: "agent", content: "what size?" },
    { role: "user", content: "large" },
];

describe("VoiceEngineSession", () => {
    let ws: MockWebSocket;
    let session: VoiceEngineSession;

    beforeEach(() => {
        ws = new MockWebSocket();
        session = new VoiceEngineSession(ws);
    });

    // -----------------------------------------------------------------------
    // init event
    // -----------------------------------------------------------------------

    it("emits init with conversation_id", () => {
        const handler = jest.fn();
        session.on(VoiceEngine.INIT, handler);

        ws.receiveMessage({ type: "init", conversation_id: "conv_42" });

        expect(handler).toHaveBeenCalledWith("conv_42");
        expect(session.conversationId).toBe("conv_42");
    });

    // -----------------------------------------------------------------------
    // user_transcript events
    // -----------------------------------------------------------------------

    it("emits user_transcript with conversation history and abort signal", () => {
        const handler = jest.fn();
        session.on(VoiceEngine.USER_TRANSCRIPT, handler);

        ws.receiveMessage({ type: "user_transcript", user_transcript: transcript, event_id: 1 });

        expect(handler).toHaveBeenCalledTimes(1);
        const [received, context] = handler.mock.calls[0];
        expect(received).toEqual(transcript);
        expect(context.signal).toBeInstanceOf(AbortSignal);
        expect(context.signal.aborted).toBe(false);
    });

    it("aborts previous transcript signal when a new transcript arrives", () => {
        const signals: AbortSignal[] = [];
        session.on(VoiceEngine.USER_TRANSCRIPT, (_transcript, { signal }) => {
            signals.push(signal);
        });

        ws.receiveMessage({ type: "user_transcript", user_transcript: transcript, event_id: 1 });
        ws.receiveMessage({ type: "user_transcript", user_transcript: transcript2, event_id: 2 });

        expect(signals).toHaveLength(2);
        expect(signals[0].aborted).toBe(true);
        expect(signals[1].aborted).toBe(false);
    });

    // -----------------------------------------------------------------------
    // ping / pong
    // -----------------------------------------------------------------------

    it("auto-responds to ping with pong", () => {
        ws.receiveMessage({ type: "ping" });

        expect(ws.sent).toHaveLength(1);
        expect(JSON.parse(ws.sent[0])).toEqual({ type: "pong" });
    });

    // -----------------------------------------------------------------------
    // close event (user disconnected)
    // -----------------------------------------------------------------------

    it("emits close and aborts current signal on close message", () => {
        const closeHandler = jest.fn();
        session.on(VoiceEngine.CLOSE, closeHandler);

        let capturedSignal: AbortSignal | null = null;
        session.on(VoiceEngine.USER_TRANSCRIPT, (_transcript, { signal }) => {
            capturedSignal = signal;
        });

        ws.receiveMessage({ type: "user_transcript", user_transcript: transcript, event_id: 1 });
        ws.receiveMessage({ type: "close" });

        expect(closeHandler).toHaveBeenCalledTimes(1);
        expect(capturedSignal!.aborted).toBe(true);
    });

    // -----------------------------------------------------------------------
    // error event (protocol-level)
    // -----------------------------------------------------------------------

    it("emits error on protocol error message", () => {
        const handler = jest.fn();
        session.on(VoiceEngine.ERROR, handler);

        ws.receiveMessage({ type: "error", message: "something went wrong" });

        expect(handler).toHaveBeenCalledTimes(1);
        expect(handler.mock.calls[0][0]).toBeInstanceOf(Error);
        expect(handler.mock.calls[0][0].message).toBe("something went wrong");
    });

    // -----------------------------------------------------------------------
    // WebSocket-level events
    // -----------------------------------------------------------------------

    it("emits disconnected when WebSocket closes", () => {
        const handler = jest.fn();
        session.on(VoiceEngine.DISCONNECTED, handler);

        ws.close();

        expect(handler).toHaveBeenCalledTimes(1);
        expect(session.isOpen).toBe(false);
    });

    it("aborts current signal when WebSocket closes", () => {
        let capturedSignal: AbortSignal | null = null;
        session.on(VoiceEngine.USER_TRANSCRIPT, (_transcript, { signal }) => {
            capturedSignal = signal;
        });

        ws.receiveMessage({ type: "user_transcript", user_transcript: transcript, event_id: 1 });
        ws.close();

        expect(capturedSignal!.aborted).toBe(true);
    });

    it("emits error on WebSocket error", () => {
        const handler = jest.fn();
        session.on(VoiceEngine.ERROR, handler);

        const err = new Error("connection failed");
        ws.simulateError(err);

        expect(handler).toHaveBeenCalledWith(err);
    });

    it("emits error on malformed JSON", () => {
        const handler = jest.fn();
        session.on(VoiceEngine.ERROR, handler);

        ws.emit("message", Buffer.from("not json"));

        expect(handler).toHaveBeenCalledTimes(1);
        expect(handler.mock.calls[0][0]).toBeInstanceOf(Error);
    });

    it("silently ignores unknown message types", () => {
        const errorHandler = jest.fn();
        session.on(VoiceEngine.ERROR, errorHandler);

        ws.receiveMessage({ type: "unknown_future_event", data: 123 });

        expect(errorHandler).not.toHaveBeenCalled();
    });

    // -----------------------------------------------------------------------
    // sendResponse (string)
    // -----------------------------------------------------------------------

    it("sends a complete response as agent_response with event_id and is_final", () => {
        ws.receiveMessage({ type: "user_transcript", user_transcript: transcript, event_id: 5 });
        session.sendResponse("The answer is 42");

        expect(ws.sent).toHaveLength(2);
        expect(JSON.parse(ws.sent[0])).toEqual({ type: "agent_response", content: "The answer is 42", event_id: 5, is_final: false });
        expect(JSON.parse(ws.sent[1])).toEqual({ type: "agent_response", content: "", event_id: 5, is_final: true });
    });

    it("does not send after close", () => {
        session.close();
        session.sendResponse("too late");

        expect(ws.sent).toHaveLength(0);
    });

    // -----------------------------------------------------------------------
    // sendResponse (streaming)
    // -----------------------------------------------------------------------

    it("sends each chunk with is_final:false then an empty terminator with is_final:true", async () => {
        ws.receiveMessage({ type: "user_transcript", user_transcript: transcript, event_id: 3 });

        async function* tokens() {
            yield "Hello";
            yield " world";
        }

        session.sendResponse(tokens());

        await new Promise((r) => setTimeout(r, 10));

        expect(ws.sent).toHaveLength(3);
        expect(JSON.parse(ws.sent[0])).toEqual({ type: "agent_response", content: "Hello", event_id: 3, is_final: false });
        expect(JSON.parse(ws.sent[1])).toEqual({ type: "agent_response", content: " world", event_id: 3, is_final: false });
        expect(JSON.parse(ws.sent[2])).toEqual({ type: "agent_response", content: "", event_id: 3, is_final: true });
    });

    it("stops streaming if session is closed mid-stream", async () => {
        ws.receiveMessage({ type: "user_transcript", user_transcript: transcript, event_id: 7 });

        async function* slowTokens() {
            yield "first";
            yield "second";
            await new Promise((r) => setTimeout(r, 50));
            yield "third";
        }

        session.sendResponse(slowTokens());

        // Let the first two synchronous yields resolve
        await new Promise((r) => setTimeout(r, 10));
        session.close();
        await new Promise((r) => setTimeout(r, 100));

        const sent = ws.sent.map((s) => JSON.parse(s));
        const chunks = sent.filter((m: Record<string, unknown>) => m.type === "agent_response");
        // "first" and "second" are sent immediately; session closes before the
        // 50ms delay resolves, so "third" and the empty terminator are never sent
        expect(chunks).toHaveLength(2);
        expect(chunks[0]).toEqual({ type: "agent_response", content: "first", event_id: 7, is_final: false });
        expect(chunks[1]).toEqual({ type: "agent_response", content: "second", event_id: 7, is_final: false });
    });

    // -----------------------------------------------------------------------
    // event_id tracking across interrupts
    // -----------------------------------------------------------------------

    it("stamps the correct event_id after an interrupt", () => {
        ws.receiveMessage({ type: "user_transcript", user_transcript: transcript, event_id: 1 });
        session.sendResponse("response to first");

        ws.receiveMessage({ type: "user_transcript", user_transcript: transcript2, event_id: 2 });
        session.sendResponse("response to second");

        // Each sendResponse emits a content chunk + empty terminator = 2 messages each
        expect(ws.sent).toHaveLength(4);
        expect(JSON.parse(ws.sent[0])).toEqual({ type: "agent_response", content: "response to first", event_id: 1, is_final: false });
        expect(JSON.parse(ws.sent[1])).toEqual({ type: "agent_response", content: "", event_id: 1, is_final: true });
        expect(JSON.parse(ws.sent[2])).toEqual({ type: "agent_response", content: "response to second", event_id: 2, is_final: false });
        expect(JSON.parse(ws.sent[3])).toEqual({ type: "agent_response", content: "", event_id: 2, is_final: true });
    });

    // -----------------------------------------------------------------------
    // close()
    // -----------------------------------------------------------------------

    it("close() is idempotent", () => {
        session.close();
        session.close();
        expect(session.isOpen).toBe(false);
    });

    // -----------------------------------------------------------------------
    // Typed handler methods
    // -----------------------------------------------------------------------

    it("onInit fires with conversation ID", () => {
        const handler = jest.fn();
        session.onInit(handler);
        ws.receiveMessage({ type: "init", conversation_id: "conv_99" });
        expect(handler).toHaveBeenCalledWith("conv_99");
    });

    it("onTranscript fires with transcript and signal", () => {
        const handler = jest.fn();
        session.onTranscript(handler);
        ws.receiveMessage({ type: "user_transcript", user_transcript: transcript, event_id: 1 });
        expect(handler).toHaveBeenCalledTimes(1);
        const [received, context] = handler.mock.calls[0];
        expect(received).toEqual(transcript);
        expect(context.signal).toBeInstanceOf(AbortSignal);
    });

    it("onClose fires on clean close message", () => {
        const handler = jest.fn();
        session.onClose(handler);
        ws.receiveMessage({ type: "close" });
        expect(handler).toHaveBeenCalledTimes(1);
    });

    it("onDisconnect fires when WebSocket drops", () => {
        const handler = jest.fn();
        session.onDisconnect(handler);
        ws.close();
        expect(handler).toHaveBeenCalledTimes(1);
    });

    it("onError fires on protocol error", () => {
        const handler = jest.fn();
        session.onError(handler);
        ws.receiveMessage({ type: "error", message: "oops" });
        expect(handler).toHaveBeenCalledTimes(1);
        expect(handler.mock.calls[0][0]).toBeInstanceOf(Error);
    });

    it("typed methods are chainable", () => {
        const result = session
            .onInit(() => {})
            .onTranscript(() => {})
            .onClose(() => {})
            .onDisconnect(() => {})
            .onError(() => {});
        expect(result).toBe(session);
    });

    // -----------------------------------------------------------------------
    // Namespace constants
    // -----------------------------------------------------------------------

    it("VoiceEngine namespace constants match expected event strings", () => {
        expect(VoiceEngine.INIT).toBe("init");
        expect(VoiceEngine.USER_TRANSCRIPT).toBe("user_transcript");
        expect(VoiceEngine.CLOSE).toBe("close");
        expect(VoiceEngine.ERROR).toBe("error");
        expect(VoiceEngine.DISCONNECTED).toBe("disconnected");
    });

    it("VoiceEngine.Session is the VoiceEngineSession class", () => {
        expect(VoiceEngine.Session).toBe(VoiceEngineSession);
    });
});
