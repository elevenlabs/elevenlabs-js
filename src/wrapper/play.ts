import commandExists from "command-exists";
import * as stream from "stream";
import { ElevenLabsError } from "../errors/ElevenLabsError";
import { RUNTIME } from "../core/runtime/runtime"
import execa from "execa";

export async function play(audio: stream.Readable): Promise<void> {
    if (RUNTIME.type !== "node") {
        throw new ElevenLabsError({
            message: `This function is only supported in node environments. ${RUNTIME.type} is not supported`
        })
    }
    if (!commandExists("ffplay")) {
        throw new ElevenLabsError({
            message: `ffplay from ffmpeg not found, necessary to play audio. 
            On mac you can install it with 'brew install ffmpeg'. 
            On linux and windows you can install it from https://ffmpeg.org/`,
        });
    }
    const ffmpeg = execa("ffplay", ["-autoexit", "-", "-nodisp"]);
    for await (const data of audio) {
        ffmpeg.stdin?.write(data);
    }
    ffmpeg.stdin?.end();
    await ffmpeg;
}
