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

function createConversation(factory: WebSocketFactory): Conversation {
    return new Conversation({
        conversationClient: new MockConversationClient(),
        webSocketFactory: factory,
        agentId: "test-agent-id",
        requiresAuth: false,
        audioInterface: new MockAudioInterface(),
    });
}

function connectionRefused(): Error {
    return Object.assign(new Error("connect ECONNREFUSED 127.0.0.1:1"), { code: "ECONNREFUSED" });
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

    it("emits error to listeners and still rejects when the connection fails", async () => {
        const onError = jest.fn();
        conversation.on("error", onError);

        const started = conversation.startSession();
        const error = connectionRefused();
        factory.last.simulateError(error);

        await expect(started).rejects.toBe(error);
        expect(onError).toHaveBeenCalledWith(error);
    });

    it("can be started again after a failed attempt", async () => {
        conversation.on("error", () => {});

        const first = conversation.startSession();
        factory.last.simulateError(connectionRefused());
        await expect(first).rejects.toThrow("ECONNREFUSED");

        const second = conversation.startSession();
        factory.last.simulateOpen();

        await expect(second).resolves.toBeUndefined();
        expect(conversation.isSessionActive()).toBe(true);
        conversation.endSession();
    });

    it("does not throw on an error after the session is open with no error listener", async () => {
        const started = conversation.startSession();
        factory.last.simulateOpen();
        await started;

        expect(() => factory.last.simulateError(new Error("socket hang up"))).not.toThrow();
        conversation.endSession();
    });
});
