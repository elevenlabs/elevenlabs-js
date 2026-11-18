import { ElevenLabsError } from "../errors/ElevenLabsError";
import { isNode } from "./utils";

export async function play(audio: AsyncIterable<Uint8Array>): Promise<void> {
    if (!isNode()) {
        throw new ElevenLabsError({
            message: "The play function is only available in a Node.js environment.",
        });
    }

    const { spawn } = await import("node:child_process");
    const { Readable } = await import("node:stream");
    const { pipeline } = await import("node:stream/promises");

    const ffplay = spawn("ffplay", ["-autoexit", "-", "-nodisp"], {
        stdio: ["pipe", "ignore", "pipe"],
    });

    const errorChunks: Buffer[] = [];
    ffplay.stderr.on("data", (chunk) => {
        errorChunks.push(chunk);
    });

    return new Promise<void>((resolve, reject) => {
        ffplay.on("close", (code) => {
            if (code === 0) {
                resolve();
            } else {
                const error = Buffer.concat(errorChunks).toString();
                reject(
                    new ElevenLabsError({
                        message: `ffplay exited with code ${code}. Stderr: ${error}`,
                    }),
                );
            }
        });
        ffplay.on("error", (err: NodeJS.ErrnoException) => {
            if (err.code === "ENOENT") {
                reject(
                    new ElevenLabsError({
                        message:
                            "ffplay from ffmpeg not found, necessary to play audio.\n" +
                            "On mac you can install it with 'brew install ffmpeg'.\n" +
                            "On linux and windows you can install it from https://ffmpeg.org/",
                    }),
                );
                return;
            }
            reject(new ElevenLabsError({ message: `Failed to start ffplay: ${err.message}` }));
        });
        pipeline(Readable.from(audio), ffplay.stdin).catch((error) => {
            ffplay.kill();
            reject(error);
        });
    });
}
