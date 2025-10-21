import { ElevenLabsError } from "../errors/ElevenLabsError";
import { isNode } from "./utils";

export async function play(audio: AsyncIterable<Uint8Array>): Promise<void> {
    if (!isNode()) {
        throw new ElevenLabsError({
            message: "The play function is only available in a Node.js environment.",
        });
    }

    const { spawn } = await import("../stubs/child_process");
    const { Readable } = await import("stream");
    const commandExists = (await import("command-exists")).default;

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
