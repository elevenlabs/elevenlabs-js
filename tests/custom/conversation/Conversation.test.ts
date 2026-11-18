import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Conversation } from "../../../src/api/resources/conversationalAi/conversation/Conversation";
import type {
    WebSocketFactory,
    WebSocketInterface,
} from "../../../src/api/resources/conversationalAi/conversation/interfaces/WebSocketInterface";
import {
    MockAudioInterface,
    MockConversationClient,
    MockWebSocket,
} from "../../../src/api/resources/conversationalAi/conversation/mocks";

class FreshSocketFactory implements WebSocketFactory {
    sockets: MockWebSocket[] = [];

    create(): WebSocketInterface {
        const ws = new MockWebSocket();
        this.sockets.push(ws);
        return ws;
    }

    get last(): MockWebSocket {
        return this.sockets[this.sockets.length - 1];
    }
}

function createConversation(
    factory: WebSocketFactory,
    { client = new MockConversationClient(), requiresAuth = false } = {},
): Conversation {
    return new Conversation({
        conversationClient: client,
        webSocketFactory: factory,
        agentId: "test-agent-id",
        requiresAuth,
        audioInterface: new MockAudioInterface(),
    });
}

function connectionRefused(): Error {
    return Object.assign(new Error("connect ECONNREFUSED 127.0.0.1:1"), { code: "ECONNREFUSED" });
}

// The ws library emits error and then close when a connection fails
function failConnect(ws: MockWebSocket): void {
    ws.simulateError(connectionRefused());
    ws.emit("close", 1006, Buffer.from(""));
}

function flush(): Promise<void> {
    return new Promise((resolve) => setImmediate(resolve));
}

const agentClosed = { reason: "agent", closeCode: 1000, closeReason: "" };

async function openSession(conversation: Conversation, factory: FreshSocketFactory): Promise<MockWebSocket> {
    const started = conversation.startSession();
    const socket = factory.last;
    socket.simulateOpen();
    await started;
    return socket;
}

describe("Conversation.startSession", () => {
    let factory: FreshSocketFactory;
    let conversation: Conversation;

    beforeEach(() => {
        factory = new FreshSocketFactory();
        conversation = createConversation(factory);
    });

    it("rejects when the connection fails and there is no error listener", async () => {
        const started = conversation.startSession();
        const error = connectionRefused();

        expect(() => factory.last.simulateError(error)).not.toThrow();
        await expect(started).rejects.toBe(error);
    });

    it("emits error to listeners and rejects when the connection fails", async () => {
        const onError = jest.fn();
        conversation.on("error", onError);

        const started = conversation.startSession();
        const error = connectionRefused();
        factory.last.simulateError(error);

        await expect(started).rejects.toBe(error);
        expect(onError).toHaveBeenCalledWith(error);
    });

    it("can be started again after a failed connect", async () => {
        const first = conversation.startSession();
        failConnect(factory.last);
        await expect(first).rejects.toThrow("ECONNREFUSED");

        await expect(openSession(conversation, factory)).resolves.toBe(factory.last);
        conversation.endSession();
    });

    it("does not emit session_ended for a connection that never opened", async () => {
        conversation.on("error", () => {});
        const onSessionEnded = jest.fn();
        conversation.on("session_ended", onSessionEnded);

        const started = conversation.startSession();
        failConnect(factory.last);

        await expect(started).rejects.toThrow("ECONNREFUSED");
        expect(onSessionEnded).not.toHaveBeenCalled();
    });

    it("runs a session started after a failed connect has closed", async () => {
        conversation.on("error", () => {});
        const onSessionEnded = jest.fn();
        const onConversationStarted = jest.fn();
        conversation.on("session_ended", onSessionEnded);
        conversation.on("conversation_started", onConversationStarted);

        const first = conversation.startSession();
        failConnect(factory.last);
        await expect(first).rejects.toThrow("ECONNREFUSED");

        const socket = await openSession(conversation, factory);
        socket.simulateMessage({
            type: "conversation_initiation_metadata",
            conversation_initiation_metadata_event: { conversation_id: "conv_1" },
        });
        expect(onConversationStarted).toHaveBeenCalledWith("conv_1");
        expect(conversation.isSessionActive()).toBe(true);

        socket.emit("close", 1000, Buffer.from(""));
        expect(onSessionEnded).toHaveBeenCalledTimes(1);
        expect(onSessionEnded).toHaveBeenCalledWith("conv_1", 1000, "", agentClosed);
    });

    it("ignores close from a failed socket after a retry from the error listener", async () => {
        let retry: Promise<void> | undefined;
        conversation.once("error", () => {
            retry = conversation.startSession();
        });
        const onSessionEnded = jest.fn();
        conversation.on("session_ended", onSessionEnded);

        const first = conversation.startSession();
        failConnect(factory.last);
        await expect(first).rejects.toThrow("ECONNREFUSED");

        const socket = factory.last;
        socket.simulateOpen();
        await retry;
        expect(conversation.isSessionActive()).toBe(true);

        socket.emit("close", 1000, Buffer.from(""));
        expect(onSessionEnded).toHaveBeenCalledTimes(1);
        expect(onSessionEnded).toHaveBeenCalledWith(undefined, 1000, "", agentClosed);
    });

    it("rejects and ends once when endSession is called while connecting", async () => {
        const onSessionEnded = jest.fn();
        conversation.on("session_ended", onSessionEnded);

        const started = conversation.startSession();
        const socket = factory.last;
        conversation.endSession();
        // The ws library reports the aborted handshake on the next tick
        socket.simulateError(new Error("WebSocket was closed before the connection was established"));
        socket.emit("close", 1006, Buffer.from(""));

        await expect(started).rejects.toThrow("closed before the connection was established");
        expect(onSessionEnded).toHaveBeenCalledTimes(1);
        expect(onSessionEnded).toHaveBeenCalledWith(undefined, undefined, undefined, { reason: "user" });
    });

    it.each([
        ["with", true],
        ["without", false],
    ])("ends the session with the error after it was open, %s an error listener", async (_, listen) => {
        if (listen) {
            conversation.on("error", () => {});
        }
        const onSessionEnded = jest.fn();
        conversation.on("session_ended", onSessionEnded);
        const socket = await openSession(conversation, factory);

        expect(() => socket.simulateError(new Error("read ECONNRESET"))).not.toThrow();
        socket.emit("close", 1006, Buffer.from(""));

        expect(onSessionEnded).toHaveBeenCalledTimes(1);
        expect(onSessionEnded).toHaveBeenCalledWith(undefined, 1006, "", {
            reason: "error",
            message: "read ECONNRESET",
            closeCode: 1006,
            closeReason: "",
        });
    });

    it("closes the socket on endSession after an error once the session is open", async () => {
        conversation.on("error", () => {});
        const socket = await openSession(conversation, factory);

        socket.simulateError(new Error("read ECONNRESET"));
        conversation.endSession();

        expect(socket.readyState).toBe(3);
    });
});

describe("Conversation.startSession with a signed url", () => {
    let factory: FreshSocketFactory;
    let client: MockConversationClient;
    let conversation: Conversation;
    let resolveUrl: () => void;

    beforeEach(() => {
        factory = new FreshSocketFactory();
        client = new MockConversationClient();
        conversation = createConversation(factory, { client, requiresAuth: true });
    });

    // The next getSignedUrl call resolves when resolveUrl() is called
    function delayNextUrl(): void {
        client.conversationalAi.conversations.getSignedUrl.mockReturnValueOnce(
            new Promise((resolve) => {
                resolveUrl = () => resolve({ signedUrl: "wss://mock.elevenlabs.io/signed" });
            }),
        );
    }

    it("ignores close from a failed socket while a retry fetches its url", async () => {
        let retry: Promise<void> | undefined;
        conversation.once("error", () => {
            delayNextUrl();
            retry = conversation.startSession();
        });
        const onSessionEnded = jest.fn();
        conversation.on("session_ended", onSessionEnded);

        const first = conversation.startSession();
        await flush();
        failConnect(factory.last);
        await expect(first).rejects.toThrow("ECONNREFUSED");

        resolveUrl();
        await flush();
        const socket = factory.last;
        socket.simulateOpen();
        await retry;
        expect(conversation.isSessionActive()).toBe(true);

        socket.emit("close", 1000, Buffer.from(""));
        expect(onSessionEnded).toHaveBeenCalledTimes(1);
        expect(onSessionEnded).toHaveBeenCalledWith(undefined, 1000, "", agentClosed);
    });

    it("keeps the newer socket when an older overlapping start fails to connect", async () => {
        conversation.on("error", () => {});
        const first = conversation.startSession();
        const second = conversation.startSession();
        await flush();
        const [older, newer] = factory.sockets;

        older.simulateError(connectionRefused());
        await expect(first).rejects.toThrow("ECONNREFUSED");
        newer.simulateOpen();
        await second;
        conversation.endSession();

        expect(newer.readyState).toBe(3);
    });
});
