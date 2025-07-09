import { EventEmitter } from "events";
import WebSocket from "ws";

export interface WebSocketInterface extends EventEmitter {
    readyState: number;
    send(data: string): void;
    close(): void;
}

export interface WebSocketFactory {
    create(url: string, options?: any): WebSocketInterface;
}

export class DefaultWebSocketFactory implements WebSocketFactory {
    create(url: string, options?: any): WebSocketInterface {
        return new WebSocket(url, options) as WebSocketInterface;
    }
}