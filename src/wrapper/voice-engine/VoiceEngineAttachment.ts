/**
 * Returned by `engine.attach()`. Call `.close()` to stop accepting connections
 * without affecting the HTTP server.
 */
export class VoiceEngineAttachment {
    private wss: { close(cb?: (err?: Error) => void): void };
    private httpServer: { removeListener(event: string, listener: (...args: unknown[]) => void): void } | null;
    private upgradeListener: ((...args: unknown[]) => void) | null;

    /** @internal */
    constructor(
        wss: { close(cb?: (err?: Error) => void): void },
        httpServer?: { removeListener(event: string, listener: (...args: unknown[]) => void): void },
        upgradeListener?: (...args: unknown[]) => void,
    ) {
        this.wss = wss;
        this.httpServer = httpServer ?? null;
        this.upgradeListener = upgradeListener ?? null;
    }

    /**
     * Stop accepting new connections, remove the upgrade listener from the HTTP
     * server, and close the underlying WebSocket server.
     * Does not affect the HTTP server the attachment was created from.
     */
    close(): Promise<void> {
        if (this.httpServer && this.upgradeListener) {
            this.httpServer.removeListener("upgrade", this.upgradeListener);
        }
        return new Promise((resolve, reject) => {
            this.wss.close((err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }
}
