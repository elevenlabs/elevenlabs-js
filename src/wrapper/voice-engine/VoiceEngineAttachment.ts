import WebSocket from "ws";

/**
 * Returned by `engine.attach()`. Call `.close()` to stop accepting connections
 * without affecting the HTTP server.
 */
export class VoiceEngineAttachment {
    private wss: WebSocket.Server;

    /** @internal */
    constructor(wss: WebSocket.Server) {
        this.wss = wss;
    }

    /**
     * Stop accepting new connections and close the underlying WebSocket server.
     * Does not affect the HTTP server the attachment was created from.
     */
    close(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.wss.close((err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }
}
