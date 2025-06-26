import commandExists from "command-exists";
import { spawn } from "node:child_process";
import * as nodeStream from "node:stream";
import { ElevenLabsError } from "../errors/ElevenLabsError";

export async function stream(audio: nodeStream.Readable): Promise<void> {
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

    audio.pipe(mpv.stdin);

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
