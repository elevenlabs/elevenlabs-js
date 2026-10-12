import { EventEmitter } from "events";
import WebSocket from "ws";

export interface WebSocketInterface extends EventEmitter {
    readyState: number;
    send(data: string): void;
    close(): void;
}

export interface WebSocketFactory {
    /**
     * @param protocols WebSocket subprotocols to request. Websocket-realtime connections
     * authenticate through them, so custom factories must forward them.
     */
    create(url: string, options?: any, protocols?: string[]): WebSocketInterface;
}

export class DefaultWebSocketFactory implements WebSocketFactory {
    create(url: string, options?: any, protocols?: string[]): WebSocketInterface {
        if (protocols) {
            return new WebSocket(url, protocols, options) as WebSocketInterface;
        }
        return new WebSocket(url, options) as WebSocketInterface;
    }
}
