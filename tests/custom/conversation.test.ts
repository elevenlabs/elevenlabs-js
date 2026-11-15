import { describe, expect, it, jest } from "@jest/globals";
import { EventEmitter } from "events";
import { ElevenLabsClient } from "../../src";
import { AudioInterface, Conversation } from "../../src/api/resources/conversationalAi/conversation";
import type { WebSocketInterface } from "../../src/api/resources/conversationalAi/conversation/interfaces/WebSocketInterface";

class FakeSocket extends EventEmitter implements WebSocketInterface {
    readyState = 1;
    send = jest.fn((_data: string) => {});
    close = jest.fn(() => {
        this.readyState = 3;
    });

    serverClose(code: number, reason: string): void {
        this.readyState = 3;
        this.emit("close", code, Buffer.from(reason));
    }
}

class FakeAudio extends AudioInterface {
    input?: (audio: Buffer) => void;
    start(inputCallback: (audio: Buffer) => void): void {
        this.input = inputCallback;
    }
    stop(): void {
        this.input = undefined;
    }
    output(): void {}
    interrupt(): void {}
}

async function startConversation() {
    const socket = new FakeSocket();
    const audio = new FakeAudio();
    const conversation = new Conversation({
        client: new ElevenLabsClient({ apiKey: "test" }),
        webSocketFactory: { create: () => socket },
        agentId: "agent_1",
        requiresAuth: false,
        audioInterface: audio,
    });
    const sessionEnded = jest.fn();
    conversation.on("session_ended", sessionEnded);
    const started = conversation.startSession();
    socket.emit("open");
    await started;
    socket.emit(
        "message",
        JSON.stringify({
            type: "conversation_initiation_metadata",
            conversation_initiation_metadata_event: { conversation_id: "conv_1" },
        }),
    );
    return { conversation, socket, audio, sessionEnded };
}

describe("Conversation session end", () => {
    it("emits session_ended once however many times endSession is called", async () => {
        const { conversation, socket, sessionEnded } = await startConversation();

        conversation.endSession();
        conversation.endSession();
        socket.serverClose(1000, "");
        conversation.endSession();

        expect(sessionEnded).toHaveBeenCalledTimes(1);
    });

    it("emits session_ended once when the socket closes synchronously inside endSession", async () => {
        const { conversation, socket, sessionEnded } = await startConversation();
        socket.close.mockImplementation(() => socket.serverClose(1000, "Normal closure"));

        conversation.endSession();
        conversation.endSession();

        expect(sessionEnded).toHaveBeenCalledTimes(1);
    });

    it("does not emit session_ended again when endSession follows a server close", async () => {
        const { conversation, socket, audio, sessionEnded } = await startConversation();

        socket.serverClose(1000, "bye");
        conversation.endSession();

        expect(sessionEnded).toHaveBeenCalledTimes(1);
        expect(sessionEnded).toHaveBeenCalledWith("conv_1", 1000, "bye");
        expect(audio.input).toBeUndefined();
    });
});
