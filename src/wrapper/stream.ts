import commandExists from "command-exists";
import * as nodeStream from "stream";
import { ElevenLabsError } from "../errors/ElevenLabsError";
import { RUNTIME } from "../core/runtime/runtime"
import execa from "execa";

export async function stream(audio: nodeStream.Readable): Promise<void> {
    if (RUNTIME.type !== "node") {
        throw new ElevenLabsError({
            message: `This function is only supported in node environments. ${RUNTIME.type} is not supported`
        })
    }
    if (!commandExists("mpv")) {
        throw new ElevenLabsError({
            message: `mpv not found, necessary to stream audio."
            On mac you can install it with 'brew install mpv'.
            On linux and windows you can install it from https://mpv.io/`,
        });
    }
    const mpv = execa("mpv", ["--no-cache", "--no-terminal", "--", "fd://0"]);
    for await (const data of audio) {
        mpv.stdin?.write(data);
    }
    mpv.stdin?.end();
    await mpv;
}
