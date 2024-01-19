import commandExists from "command-exists";
import * as stream from "stream";
import { ElevenLabsError } from "../errors/ElevenLabsError";
import execa from "execa";

export async function play(audio: stream.Readable): Promise<void> {
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
