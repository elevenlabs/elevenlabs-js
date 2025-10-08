export function isNode(): boolean {
    return (
        typeof process !== "undefined" &&
        process.versions != null &&
        process.versions.node != null &&
        process.release?.name === "node"
    );
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
