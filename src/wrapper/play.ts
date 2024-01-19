import commandExists from "command-exists";
import * as stream from "stream";
import { ElevenLabsError } from "../errors/ElevenLabsError";
import execa from "execa";

export declare namespace Play {
    interface Args {
        /* The raw audio content */
        audio: stream.Readable;
    }
}

export async function play({ audio }: Play.Args): Promise<void> {
    if (!commandExists("ffplay")) {
        throw new ElevenLabsError({
            message: `ffplay from ffmpeg not found, necessary to play audio. 
            On mac you can install it with 'brew install ffmpeg'. 
            On linux and windows you can install it from https://ffmpeg.org/`,
        });
    }
    await execa("ffplay", ["-autoexit", "-", "-nodisp"], {
        input: await stream2Buffer(audio),
    });
}

async function stream2Buffer(stream: stream.Readable): Promise<Buffer> {
    const buffers = [];
    for await (const data of stream) {
        buffers.push(data);
    }
    return Buffer.concat(buffers);
}
