import type * as core from "../core";
import { ElevenLabsError } from "../errors/ElevenLabsError";

/**
 * Resolves the API key from the provided option or the ELEVENLABS_API_KEY environment variable.
 * Throws if neither is available.
 */
export function resolveApiKey(apiKey: core.Supplier<string> | undefined): core.Supplier<string> {
    const resolved = apiKey ?? process.env.ELEVENLABS_API_KEY;
    if (resolved == null) {
        throw new ElevenLabsError({
            message: "Please pass in your ElevenLabs API Key or export ELEVENLABS_API_KEY in your environment.",
        });
    }
    return resolved;
}

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
