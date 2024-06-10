import * as stream from "stream";
import { ElevenLabsError } from "../errors/ElevenLabsError";
import { RUNTIME } from "../core/runtime/runtime"
import {exec} from "child_process"

export async function play(audio: stream.Readable): Promise<void> {
    if (RUNTIME.type !== "node") {
        throw new ElevenLabsError({
            message: `This function is only supported in node environments. ${RUNTIME.type} is not supported`
        })
    }
    try {
        const exe = exec('ffplay -autoexit - -nodisp');
        for await (const data of audio) {
            exe.stdin?.write(data)
        }
        exe.stdin?.end()
        // await exe
    } catch (error) {
        throw new ElevenLabsError({
            message: `Play has failed to properly execute. Please see error below`,
            body: error
        })
    }
}
