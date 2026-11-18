import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { ElevenLabsError, play, stream } from "../../src";

// Jest sandboxes `process.env`, so the real child_process wouldn't see the PATH set by these tests.
jest.mock("node:child_process", () => {
    const actual = jest.requireActual<typeof import("node:child_process")>("node:child_process");
    return {
        ...actual,
        spawn: (command: string, args: string[], options: import("node:child_process").SpawnOptions) =>
            actual.spawn(command, args, { ...options, env: process.env }),
    };
});

async function* audioChunks(): AsyncGenerator<Uint8Array> {
    yield new Uint8Array([1, 2, 3]);
    yield new Uint8Array([4, 5, 6]);
}

function audioStream(): ReadableStream<Uint8Array> {
    return new ReadableStream({
        start(controller) {
            controller.enqueue(new Uint8Array([1, 2, 3]));
            controller.close();
        },
    });
}

const players = [
    { name: "play", binary: "ffplay", run: () => play(audioChunks()), install: "brew install ffmpeg" },
    { name: "stream", binary: "mpv", run: () => stream(audioStream()), install: "brew install mpv" },
];

describe.each(players)("$name", ({ binary, run, install }) => {
    const originalPath = process.env.PATH;
    let binDir: string;

    beforeEach(() => {
        binDir = fs.mkdtempSync(path.join(os.tmpdir(), "elevenlabs-player-"));
        process.env.PATH = binDir;
    });

    afterEach(() => {
        process.env.PATH = originalPath;
        fs.rmSync(binDir, { recursive: true, force: true });
    });

    function installFakeBinary(script: string): void {
        const file = path.join(binDir, binary);
        fs.writeFileSync(file, `#!/bin/sh\n${script}\n`);
        fs.chmodSync(file, 0o755);
        process.env.PATH = `${binDir}${path.delimiter}${originalPath}`;
    }

    it(`rejects with install instructions when ${binary} is missing`, async () => {
        const error = await run().catch((err: Error) => err);
        expect(error).toBeInstanceOf(ElevenLabsError);
        expect((error as Error).message).toContain(`${binary}`);
        expect((error as Error).message).toContain(install);
    });

    const posixIt = process.platform === "win32" ? it.skip : it;

    posixIt(`resolves when ${binary} exits successfully`, async () => {
        installFakeBinary("cat > /dev/null\nexit 0");
        await expect(run()).resolves.toBeUndefined();
    });

    posixIt(`rejects with stderr when ${binary} exits with an error`, async () => {
        installFakeBinary("cat > /dev/null\necho boom >&2\nexit 3");
        await expect(run()).rejects.toThrow(`${binary} exited with code 3. Stderr: boom`);
    });
});
