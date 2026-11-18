export function isNode(): boolean {
    return (
        typeof process !== "undefined" &&
        process.versions != null &&
        process.versions.node != null &&
        process.release?.name === "node"
    );
}

/**
 * Pipes audio into a player's stdin, rejecting only when the audio source fails.
 * Player failures (such as EPIPE once the player has exited) are left to the child process
 * "error" and "close" events, which carry a more useful message.
 */
export async function pipeAudio(audio: AsyncIterable<Uint8Array>, stdin: NodeJS.WritableStream): Promise<void> {
    const { Readable } = await import("node:stream");
    const { pipeline } = await import("node:stream/promises");

    let sourceFailure: { error: unknown } | undefined;
    const iterator = audio[Symbol.asyncIterator]();
    // No `throw` method, so Readable.from() won't inject stdin errors back into the source on teardown.
    const source: AsyncIterableIterator<Uint8Array> = {
        [Symbol.asyncIterator]() {
            return this;
        },
        async next() {
            try {
                return await iterator.next();
            } catch (error) {
                sourceFailure = { error };
                throw error;
            }
        },
        async return() {
            await iterator.return?.();
            return { done: true, value: undefined };
        },
    };

    try {
        await pipeline(Readable.from(source), stdin);
    } catch {
        if (sourceFailure) {
            throw sourceFailure.error;
        }
    }
}

export async function* toAsyncIterable(
    stream: ReadableStream<Uint8Array>,
): AsyncGenerator<Uint8Array<ArrayBufferLike>, void, unknown> {
    const reader = stream.getReader();
    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                return;
            }
            yield value;
        }
    } finally {
        reader.releaseLock();
    }
}
