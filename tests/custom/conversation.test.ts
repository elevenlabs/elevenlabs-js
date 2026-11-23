import { describe, expect, it, jest } from "@jest/globals";
import { EventEmitter } from "events";
import { readFileSync } from "fs";
import { join } from "path";
import { ElevenLabsClient } from "../../src";
import {
    AudioInterface,
    Conversation,
    type ConversationInitiationData,
} from "../../src/api/resources/conversationalAi/conversation";
import type { WebSocketInterface } from "../../src/api/resources/conversationalAi/conversation/interfaces/WebSocketInterface";
import { SDK_VERSION } from "../../src/version";

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

async function startConversation(config?: ConversationInitiationData) {
    const socket = new FakeSocket();
    const audio = new FakeAudio();
    const conversation = new Conversation({
        client: new ElevenLabsClient({ apiKey: "test" }),
        webSocketFactory: { create: () => socket },
        agentId: "agent_1",
        requiresAuth: false,
        audioInterface: audio,
        config,
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
        expect(sessionEnded).toHaveBeenCalledWith("conv_1", 1000, "bye", expect.anything());
        expect(audio.input).toBeUndefined();
    });

    it("reports the user as having ended a session ended with endSession", async () => {
        const { conversation, socket, sessionEnded } = await startConversation();

        conversation.endSession();
        socket.serverClose(1000, "");

        expect(sessionEnded).toHaveBeenCalledTimes(1);
        expect(sessionEnded).toHaveBeenCalledWith("conv_1", undefined, undefined, { reason: "user" });
    });

    it("reports the agent as having ended a session after an end_call", async () => {
        const { conversation, socket, sessionEnded } = await startConversation();

        socket.emit(
            "message",
            JSON.stringify({
                type: "agent_tool_response",
                agent_tool_response: { tool_name: "end_call", tool_call_id: "t1", tool_type: "system" },
            }),
        );
        socket.serverClose(1000, "");
        conversation.endSession();

        expect(sessionEnded).toHaveBeenCalledTimes(1);
        expect(sessionEnded).toHaveBeenCalledWith("conv_1", 1000, "", {
            reason: "agent",
            closeCode: 1000,
            closeReason: "",
        });
    });

    it("reports an error as having ended a session the server closed abnormally", async () => {
        const { socket, sessionEnded } = await startConversation();

        socket.serverClose(1011, "internal error");

        expect(sessionEnded).toHaveBeenCalledTimes(1);
        expect(sessionEnded).toHaveBeenCalledWith("conv_1", 1011, "internal error", {
            reason: "error",
            message: "WebSocket closed with code 1011",
            closeCode: 1011,
            closeReason: "internal error",
        });
    });

    it("reports an error as having ended a session after a socket error", async () => {
        const { conversation, socket, sessionEnded } = await startConversation();
        conversation.on("error", () => {});

        socket.emit("error", new Error("read ECONNRESET"));
        socket.serverClose(1006, "");

        expect(sessionEnded).toHaveBeenCalledTimes(1);
        expect(sessionEnded).toHaveBeenCalledWith("conv_1", 1006, "", {
            reason: "error",
            message: "read ECONNRESET",
            closeCode: 1006,
            closeReason: "",
        });
    });

    it("reports an error as having ended a session when sending audio fails", async () => {
        const { socket, audio, sessionEnded } = await startConversation();
        const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
        socket.send.mockImplementation(() => {
            throw new Error("socket write failed");
        });

        audio.input?.(Buffer.from([1, 2, 3]));
        socket.serverClose(1000, "");
        consoleError.mockRestore();

        expect(sessionEnded).toHaveBeenCalledTimes(1);
        expect(sessionEnded).toHaveBeenCalledWith("conv_1", undefined, undefined, {
            reason: "error",
            message: "socket write failed",
        });
    });
});

describe("Conversation initiation client data", () => {
    function sentInitiation(socket: FakeSocket): Record<string, unknown> {
        return JSON.parse(socket.send.mock.calls[0][0]);
    }

    it("sends every initiation field the application sets", async () => {
        const { socket } = await startConversation({
            extraBody: { temperature: 0.2 },
            conversationConfigOverride: { agent: { first_message: "Hi" } },
            dynamicVariables: { name: "Ada" },
            environment: "staging",
            userId: "user_1",
            branchId: "branch_1",
            startingWorkflowNodeId: "node_1",
            procedureIds: ["proc_1", "proc_2"],
            startProcedureIds: ["proc_1"],
        });

        expect(sentInitiation(socket)).toEqual({
            type: "conversation_initiation_client_data",
            custom_llm_extra_body: { temperature: 0.2 },
            conversation_config_override: { agent: { first_message: "Hi" } },
            dynamic_variables: { name: "Ada" },
            environment: "staging",
            user_id: "user_1",
            branch_id: "branch_1",
            starting_workflow_node_id: "node_1",
            procedure_ids: ["proc_1", "proc_2"],
            start_procedure_ids: ["proc_1"],
            source_info: { source: "node_js_sdk", version: SDK_VERSION },
        });
    });

    it("sends an empty procedure list, which disables the agent's procedures", async () => {
        const { socket } = await startConversation({ procedureIds: [] });

        expect(sentInitiation(socket)).toHaveProperty("procedure_ids", []);
    });

    it("leaves out the fields the application does not set", async () => {
        const { socket } = await startConversation();

        expect(sentInitiation(socket)).toEqual({
            type: "conversation_initiation_client_data",
            custom_llm_extra_body: {},
            conversation_config_override: {},
            dynamic_variables: {},
            source_info: { source: "node_js_sdk", version: SDK_VERSION },
        });
    });

    it("identifies itself as node_js_sdk at this package's version", async () => {
        const { version } = JSON.parse(readFileSync(join(__dirname, "../../package.json"), "utf8"));
        const { socket } = await startConversation();

        expect(sentInitiation(socket).source_info).toEqual({ source: "node_js_sdk", version });
    });
});

describe("Conversation URL", () => {
    function connect(options: { requiresAuth: boolean; signedUrl?: string }): jest.Mock {
        const create = jest.fn((_url: string) => new FakeSocket());
        const conversation = new Conversation({
            client: new ElevenLabsClient({ apiKey: "test" }),
            conversationClient: {
                conversationalAi: {
                    conversations: { getSignedUrl: async () => ({ signedUrl: options.signedUrl ?? "" }) },
                },
            },
            webSocketFactory: { create },
            agentId: "agent_1",
            requiresAuth: options.requiresAuth,
            audioInterface: new FakeAudio(),
        });
        void conversation.startSession();
        return create;
    }

    it("identifies itself as node_js_sdk on the public agent URL", async () => {
        const create = connect({ requiresAuth: false });
        await new Promise(setImmediate);

        expect(create.mock.calls[0][0]).toBe(
            `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=agent_1&source=node_js_sdk&version=${SDK_VERSION}`,
        );
    });

    it("identifies itself as node_js_sdk on the signed URL", async () => {
        const create = connect({ requiresAuth: true, signedUrl: "wss://example.test/convai?token=t" });
        await new Promise(setImmediate);

        expect(create.mock.calls[0][0]).toBe(
            `wss://example.test/convai?token=t&source=node_js_sdk&version=${SDK_VERSION}`,
        );
    });
});
