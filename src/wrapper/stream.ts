import { isNode, toAsyncIterable } from "./utils";
import { ElevenLabsError } from "../errors/ElevenLabsError";

export async function stream(audio: ReadableStream<Uint8Array>): Promise<void> {
    if (!isNode()) {
        throw new ElevenLabsError({
            message: "The stream function is only available in a Node.js environment.",
        });
    }

    const { spawn } = await import("node:child_process");
    const { Readable } = await import("node:stream");
    const commandExists = (await import("command-exists")).default;

    if (!commandExists.sync("mpv")) {
        throw new ElevenLabsError({
            message: `mpv not found, necessary to stream audio."
            On mac you can install it with 'brew install mpv'.
            On linux and windows you can install it from https://mpv.io/`,
        });
    }

    const mpv = spawn("mpv", ["--no-cache", "--no-terminal", "--", "fd://0"], {
        stdio: ["pipe", "ignore", "pipe"],
    });

    Readable.from(toAsyncIterable(audio)).pipe(mpv.stdin);

    const errorChunks: Buffer[] = [];
    mpv.stderr.on("data", (chunk) => {
        errorChunks.push(chunk);
    });

    return new Promise<void>((resolve, reject) => {
        mpv.on("close", (code) => {
            if (code === 0) {
                resolve();
            } else {
                const error = Buffer.concat(errorChunks).toString();
                reject(
                    new ElevenLabsError({
                        message: `mpv exited with code ${code}. Stderr: ${error}`,
                    }),
                );
            }
        });
        mpv.on("error", (err) => {
            reject(new ElevenLabsError({ message: `Failed to start mpv: ${err.message}` }));
        });
    });
}
