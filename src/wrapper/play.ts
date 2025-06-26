import commandExists from "command-exists";
import { spawn } from "node:child_process";
import { Readable } from "node:stream";
import { ElevenLabsError } from "../errors/ElevenLabsError";

export async function play(audio: AsyncIterable<Uint8Array>): Promise<void> {
    if (!commandExists.sync("ffplay")) {
        throw new ElevenLabsError({
            message: `ffplay from ffmpeg not found, necessary to play audio.
            On mac you can install it with 'brew install ffmpeg'.
            On linux and windows you can install it from https://ffmpeg.org/`,
        });
    }

    const ffplay = spawn("ffplay", ["-autoexit", "-", "-nodisp"], {
        stdio: ["pipe", "ignore", "pipe"],
    });

    Readable.from(audio).pipe(ffplay.stdin);

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
        ffplay.on("error", (err) => {
            reject(new ElevenLabsError({ message: `Failed to start ffplay: ${err.message}` }));
        });
    });
}
