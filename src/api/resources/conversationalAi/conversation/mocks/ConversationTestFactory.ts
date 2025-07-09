import { Conversation } from "../Conversation";
import { MockWebSocketFactory, MockAudioInterface, MockConversationClient, MockWebSocket } from "./MockConversation";
import { ClientTools } from "../ClientTools";

export interface TestConversationSetup {
    conversation: Conversation;
    mockWebSocket: MockWebSocket;
    mockAudio: MockAudioInterface;
    mockClient: MockConversationClient;
    mockTools: ClientTools;
}

export function createTestConversation(options: {
    agentId?: string;
    requiresAuth?: boolean;
    config?: any;
} = {}): TestConversationSetup {
    const mockWebSocketFactory = new MockWebSocketFactory();
    const mockAudio = new MockAudioInterface();
    const mockClient = new MockConversationClient();
    const mockTools = new ClientTools();

    const conversation = new Conversation({
        conversationClient: mockClient,
        webSocketFactory: mockWebSocketFactory,
        agentId: options.agentId || "test-agent-id",
        requiresAuth: options.requiresAuth || false,
        audioInterface: mockAudio,
        clientTools: mockTools,
        config: options.config
    });

    return {
        conversation,
        mockWebSocket: mockWebSocketFactory.getMockWebSocket(),
        mockAudio,
        mockClient,
        mockTools
    };
}