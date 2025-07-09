import { Conversation } from "../Conversation";
import { AudioInterface } from "../AudioInterface";
import { ClientTools } from "../ClientTools";
import { ElevenLabsClient } from "../../../../../Client";
import { ConversationInitiationData } from "../ConversationConfig";

// Mock WebSocket
jest.mock("ws", () => {
    return jest.fn().mockImplementation(() => ({
        on: jest.fn(),
        send: jest.fn(),
        close: jest.fn(),
        readyState: 1, // OPEN
        OPEN: 1,
    }));
});

// Mock ElevenLabsClient
const mockClient = {
    conversationalAi: {
        conversations: {
            getSignedUrl: jest.fn().mockResolvedValue({ signedUrl: "wss://test.com/signed" }),
        },
    },
} as unknown as ElevenLabsClient;

// Mock AudioInterface
class MockAudioInterface extends AudioInterface {
    private inputCallback?: (audio: Buffer) => void;

    start(inputCallback: (audio: Buffer) => void): void {
        this.inputCallback = inputCallback;
    }

    stop(): void {
        this.inputCallback = undefined;
    }

    output(audio: Buffer): void {
        // Mock output
    }

    interrupt(): void {
        // Mock interrupt
    }

    simulateInput(audio: Buffer): void {
        if (this.inputCallback) {
            this.inputCallback(audio);
        }
    }
}

describe("Conversation", () => {
    let conversation: Conversation;
    let mockAudioInterface: MockAudioInterface;
    let mockClientTools: ClientTools;
    let mockWebSocket: any;

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();

        // Create mock instances
        mockAudioInterface = new MockAudioInterface();
        mockClientTools = new ClientTools();

        // Mock WebSocket constructor
        const WebSocket = require("ws");
        mockWebSocket = {
            on: jest.fn(),
            send: jest.fn(),
            close: jest.fn(),
            readyState: 1, // OPEN
        };
        WebSocket.mockImplementation(() => mockWebSocket);
        WebSocket.OPEN = 1;

        // Create conversation instance
        conversation = new Conversation({
            client: mockClient,
            agentId: "test-agent-id",
            requiresAuth: false,
            audioInterface: mockAudioInterface,
            clientTools: mockClientTools,
        });
    });

    afterEach(() => {
        conversation.endSession();
    });

    describe("constructor", () => {
        it("should initialize with correct properties", () => {
            expect(conversation.getConversationId()).toBeUndefined();
            expect(conversation.isSessionActive()).toBe(false);
        });

        it("should accept callback functions", () => {
            const agentResponseCallback = jest.fn();
            const userTranscriptCallback = jest.fn();

            const conversationWithCallbacks = new Conversation({
                client: mockClient,
                agentId: "test-agent-id",
                requiresAuth: false,
                audioInterface: mockAudioInterface,
                callbackAgentResponse: agentResponseCallback,
                callbackUserTranscript: userTranscriptCallback,
            });

            expect(conversationWithCallbacks).toBeDefined();
        });
    });

    describe("startSession", () => {
        it("should start a session without auth", async () => {
            // Mock WebSocket events
            mockWebSocket.on.mockImplementation((event: string, callback: Function) => {
                if (event === "open") {
                    setTimeout(() => callback(), 0);
                }
            });

            await conversation.startSession();

            expect(mockWebSocket.on).toHaveBeenCalledWith("open", expect.any(Function));
            expect(mockWebSocket.on).toHaveBeenCalledWith("message", expect.any(Function));
            expect(mockWebSocket.on).toHaveBeenCalledWith("error", expect.any(Function));
            expect(mockWebSocket.on).toHaveBeenCalledWith("close", expect.any(Function));
        });

        it("should start a session with auth", async () => {
            const authConversation = new Conversation({
                client: mockClient,
                agentId: "test-agent-id",
                requiresAuth: true,
                audioInterface: mockAudioInterface,
            });

            mockWebSocket.on.mockImplementation((event: string, callback: Function) => {
                if (event === "open") {
                    setTimeout(() => callback(), 0);
                }
            });

            await authConversation.startSession();

            expect(mockClient.conversationalAi.conversations.getSignedUrl).toHaveBeenCalledWith({
                agentId: "test-agent-id",
            });
        });

        it("should throw error if session already started", async () => {
            mockWebSocket.on.mockImplementation((event: string, callback: Function) => {
                if (event === "open") {
                    setTimeout(() => callback(), 0);
                }
            });

            await conversation.startSession();

            await expect(conversation.startSession()).rejects.toThrow("Session already started");
        });
    });

    describe("message handling", () => {
        beforeEach(async () => {
            mockWebSocket.on.mockImplementation((event: string, callback: Function) => {
                if (event === "open") {
                    setTimeout(() => callback(), 0);
                }
            });
            await conversation.startSession();
        });

        it("should send user messages", () => {
            conversation.sendUserMessage("Hello, how are you?");

            expect(mockWebSocket.send).toHaveBeenCalledWith(
                JSON.stringify({
                    type: "user_message",
                    text: "Hello, how are you?",
                })
            );
        });

        it("should register user activity", () => {
            conversation.registerUserActivity();

            expect(mockWebSocket.send).toHaveBeenCalledWith(
                JSON.stringify({
                    type: "user_activity",
                })
            );
        });

        it("should send contextual updates", () => {
            conversation.sendContextualUpdate("User is looking at product page");

            expect(mockWebSocket.send).toHaveBeenCalledWith(
                JSON.stringify({
                    type: "contextual_update",
                    text: "User is looking at product page",
                })
            );
        });

        it("should throw error when sending message without active session", () => {
            conversation.endSession();

            expect(() => conversation.sendUserMessage("test")).toThrow(
                "Session not started or websocket not connected"
            );
        });
    });

    describe("message receiving", () => {
        let messageHandler: (data: any) => void;
        let agentResponseCallback: jest.Mock;
        let userTranscriptCallback: jest.Mock;

        beforeEach(async () => {
            agentResponseCallback = jest.fn();
            userTranscriptCallback = jest.fn();

            conversation = new Conversation({
                client: mockClient,
                agentId: "test-agent-id",
                requiresAuth: false,
                audioInterface: mockAudioInterface,
                callbackAgentResponse: agentResponseCallback,
                callbackUserTranscript: userTranscriptCallback,
            });

            mockWebSocket.on.mockImplementation((event: string, callback: Function) => {
                if (event === "open") {
                    setTimeout(() => callback(), 0);
                } else if (event === "message") {
                    messageHandler = callback as (data: any) => void;
                }
            });

            await conversation.startSession();
        });

        it("should handle conversation initiation metadata", () => {
            const message = {
                type: "conversation_initiation_metadata",
                conversation_initiation_metadata_event: {
                    conversation_id: "test-conversation-123",
                },
            };

            messageHandler(Buffer.from(JSON.stringify(message)));

            expect(conversation.getConversationId()).toBe("test-conversation-123");
        });

        it("should handle agent responses", () => {
            const message = {
                type: "agent_response",
                agent_response_event: {
                    agent_response: "  Hello! How can I help you today?  ",
                },
            };

            messageHandler(Buffer.from(JSON.stringify(message)));

            expect(agentResponseCallback).toHaveBeenCalledWith("Hello! How can I help you today?");
        });

        it("should handle user transcripts", () => {
            const message = {
                type: "user_transcript",
                user_transcription_event: {
                    user_transcript: "  Hello, I need help  ",
                },
            };

            messageHandler(Buffer.from(JSON.stringify(message)));

            expect(userTranscriptCallback).toHaveBeenCalledWith("Hello, I need help");
        });

        it("should handle audio messages", () => {
            const audioData = Buffer.from("test audio data").toString("base64");
            const message = {
                type: "audio",
                audio_event: {
                    event_id: "1",
                    audio_base_64: audioData,
                },
            };

            const outputSpy = jest.spyOn(mockAudioInterface, "output");
            messageHandler(Buffer.from(JSON.stringify(message)));

            expect(outputSpy).toHaveBeenCalledWith(Buffer.from("test audio data"));
        });

        it("should handle ping messages", () => {
            const message = {
                type: "ping",
                ping_event: {
                    event_id: "ping-123",
                    ping_ms: "50",
                },
            };

            messageHandler(Buffer.from(JSON.stringify(message)));

            expect(mockWebSocket.send).toHaveBeenCalledWith(
                JSON.stringify({
                    type: "pong",
                    event_id: "ping-123",
                })
            );
        });
    });

    describe("client tools integration", () => {
        let messageHandler: (data: any) => void;

        beforeEach(async () => {
            mockWebSocket.on.mockImplementation((event: string, callback: Function) => {
                if (event === "open") {
                    setTimeout(() => callback(), 0);
                } else if (event === "message") {
                    messageHandler = callback as (data: any) => void;
                }
            });

            await conversation.startSession();
        });

        it("should handle client tool calls", async () => {
            // Register a test tool
            mockClientTools.register("test_tool", (params: any) => {
                return `Tool called with: ${params.input}`;
            });

            const message = {
                type: "client_tool_call",
                client_tool_call: {
                    tool_name: "test_tool",
                    tool_call_id: "call-123",
                    parameters: {
                        input: "test input",
                    },
                },
            };

            messageHandler(Buffer.from(JSON.stringify(message)));

            // Wait for async tool execution
            await new Promise(resolve => setTimeout(resolve, 10));

            expect(mockWebSocket.send).toHaveBeenLastCalledWith(
                JSON.stringify({
                    type: "client_tool_result",
                    tool_call_id: "call-123",
                    result: "Tool called with: test input",
                    is_error: false,
                })
            );
        });
    });

    describe("session management", () => {
        it("should properly end session", async () => {
            mockWebSocket.on.mockImplementation((event: string, callback: Function) => {
                if (event === "open") {
                    setTimeout(() => callback(), 0);
                }
            });

            await conversation.startSession();

            // Wait for session to be fully started
            await new Promise(resolve => setTimeout(resolve, 10));
            expect(conversation.isSessionActive()).toBe(true);

            conversation.endSession();

            expect(conversation.isSessionActive()).toBe(false);
            expect(mockWebSocket.close).toHaveBeenCalled();
        });

        it("should emit session events", async () => {
            const sessionStartedSpy = jest.fn();
            const sessionEndedSpy = jest.fn();

            conversation.on("session_started", sessionStartedSpy);
            conversation.on("session_ended", sessionEndedSpy);

            mockWebSocket.on.mockImplementation((event: string, callback: Function) => {
                if (event === "open") {
                    setTimeout(() => callback(), 0);
                }
            });

            await conversation.startSession();
            conversation.endSession();

            // Wait for events to be emitted
            await new Promise(resolve => setTimeout(resolve, 10));

            expect(sessionStartedSpy).toHaveBeenCalled();
            expect(sessionEndedSpy).toHaveBeenCalled();
        });
    });

    describe("audio integration", () => {
        it("should start audio interface on session start", async () => {
            const startSpy = jest.spyOn(mockAudioInterface, "start");

            mockWebSocket.on.mockImplementation((event: string, callback: Function) => {
                if (event === "open") {
                    setTimeout(() => callback(), 0);
                }
            });

            await conversation.startSession();

            expect(startSpy).toHaveBeenCalled();
        });

        it("should stop audio interface on session end", async () => {
            const stopSpy = jest.spyOn(mockAudioInterface, "stop");

            mockWebSocket.on.mockImplementation((event: string, callback: Function) => {
                if (event === "open") {
                    setTimeout(() => callback(), 0);
                }
            });

            await conversation.startSession();
            conversation.endSession();

            expect(stopSpy).toHaveBeenCalled();
        });
    });
});