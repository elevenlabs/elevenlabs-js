import { createTestConversation } from "../../src/api/resources/conversationalAi/conversation/mocks/";

describe("Conversation", () => {
    test("should start session and handle basic flow", async () => {
        const { conversation, mockWebSocket, mockAudio, mockClient } = createTestConversation();

        // Start session
        const sessionPromise = conversation.startSession();
        
        // Simulate WebSocket open
        mockWebSocket.simulateOpen();
        await sessionPromise;

        // Verify initialization message was sent
        const messages = mockWebSocket.getSentMessages();
        expect(messages[0].type).toBe("conversation_initiation_client_data");

        // Simulate conversation started
        mockWebSocket.simulateMessage({
            type: "conversation_initiation_metadata",
            conversation_initiation_metadata_event: {
                conversation_id: "test-conv-id"
            }
        });

        expect(conversation.getConversationId()).toBe("test-conv-id");
    });

    test("should handle user messages", async () => {
        const { conversation, mockWebSocket } = createTestConversation();

        await startMockSession(conversation, mockWebSocket);

        conversation.sendUserMessage("Hello");

        const messages = mockWebSocket.getSentMessages();
        const userMessage = messages.find(m => m.type === "user_message");
        expect(userMessage.text).toBe("Hello");
    });

    test("should handle audio input/output", async () => {
        const { conversation, mockWebSocket, mockAudio } = createTestConversation();

        await startMockSession(conversation, mockWebSocket);

        // Simulate audio input
        const audioData = Buffer.from("fake audio data");
        mockAudio.simulateAudioInput(audioData);

        // Verify audio was sent via WebSocket
        const messages = mockWebSocket.getSentMessages();
        const audioMessage = messages.find(m => m.user_audio_chunk);
        expect(audioMessage.user_audio_chunk).toBe(audioData.toString("base64"));

        // Simulate audio output from server
        mockWebSocket.simulateMessage({
            type: "audio",
            audio_event: {
                event_id: "1",
                audio_base_64: audioData.toString("base64")
            }
        });

        // Verify audio was outputted
        const outputBuffer = mockAudio.getOutputBuffer();
        expect(outputBuffer).toHaveLength(1);
        expect(outputBuffer[0]).toEqual(audioData);
    });
});

async function startMockSession(conversation, mockWebSocket) {
    const sessionPromise = conversation.startSession();
    mockWebSocket.simulateOpen();
    await sessionPromise;
    mockWebSocket.clearMessages(); // Clear init messages
} 