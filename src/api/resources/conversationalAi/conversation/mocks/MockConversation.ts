import { EventEmitter } from "events";
import { WebSocketInterface, WebSocketFactory } from "../interfaces/WebSocketInterface";
import { ConversationClient } from "../interfaces/ConversationClient";
import { AudioInterface } from "../AudioInterface";

export class MockWebSocket extends EventEmitter implements WebSocketInterface {
    public readyState: number = 1; // OPEN
    private mockMessages: any[] = [];

    send(data: string): void {
        // Store sent messages for verification
        this.mockMessages.push(JSON.parse(data));
    }

    close(): void {
        this.readyState = 3; // CLOSED
        this.emit('close', 1000, Buffer.from('Normal closure'));
    }

    // Helper methods for testing
    simulateMessage(message: any): void {
        this.emit('message', JSON.stringify(message));
    }

    simulateError(error: Error): void {
        this.emit('error', error);
    }

    simulateOpen(): void {
        this.emit('open');
    }

    getSentMessages(): any[] {
        return [...this.mockMessages];
    }

    getLastMessage(): any {
        return this.mockMessages[this.mockMessages.length - 1];
    }

    clearMessages(): void {
        this.mockMessages = [];
    }
}

export class MockWebSocketFactory implements WebSocketFactory {
    private mockWebSocket = new MockWebSocket();

    create(url: string, options?: any): WebSocketInterface {
        return this.mockWebSocket;
    }

    getMockWebSocket(): MockWebSocket {
        return this.mockWebSocket;
    }
}

export class MockAudioInterface extends AudioInterface {
    private inputCallback?: (audio: Buffer) => void;
    private outputBuffer: Buffer[] = [];
    private isStarted = false;

    start(inputCallback: (audio: Buffer) => void): void {
        this.inputCallback = inputCallback;
        this.isStarted = true;
    }

    stop(): void {
        this.isStarted = false;
        this.inputCallback = undefined;
    }

    output(audio: Buffer): void {
        this.outputBuffer.push(audio);
    }

    interrupt(): void {
        this.outputBuffer = [];
    }

    // Helper methods for testing
    simulateAudioInput(audio: Buffer): void {
        if (this.inputCallback && this.isStarted) {
            this.inputCallback(audio);
        }
    }

    getOutputBuffer(): Buffer[] {
        return [...this.outputBuffer];
    }

    clearOutputBuffer(): void {
        this.outputBuffer = [];
    }

    isAudioStarted(): boolean {
        return this.isStarted;
    }
}

export class MockConversationClient implements ConversationClient {
    private mockSignedUrl = "wss://mock.elevenlabs.io/signed";

    conversationalAi = {
        conversations: {
            getSignedUrl: jest.fn().mockResolvedValue({ 
                signedUrl: this.mockSignedUrl 
            })
        }
    };

    setMockSignedUrl(url: string): void {
        this.mockSignedUrl = url;
        this.conversationalAi.conversations.getSignedUrl.mockResolvedValue({ 
            signedUrl: url 
        });
    }
} 