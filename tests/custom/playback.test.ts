import { spawn } from "node:child_process";
import { EventEmitter } from "node:events";
import { PassThrough } from "node:stream";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { play } from "../../src/wrapper/play";
import { stream } from "../../src/wrapper/stream";

jest.mock("node:child_process", () => ({ spawn: jest.fn() }));
jest.mock("command-exists", () => ({ __esModule: true, default: { sync: () => true } }));

describe("audio playback input failures", () => {
    let player: EventEmitter & { stdin: PassThrough; stderr: PassThrough; kill: jest.Mock };

    beforeEach(() => {
        player = Object.assign(new EventEmitter(), {
            stdin: new PassThrough(),
            stderr: new PassThrough(),
            kill: jest.fn(),
        });
        jest.mocked(spawn).mockReturnValue(player as never);
    });

    it.each(["play", "stream"])("%s rejects an input failure and stops the player", async (method) => {
        const error = new Error("Audio download failed");
        const audio = new ReadableStream<Uint8Array>({
            start(controller) {
                controller.error(error);
            },
        });
        const result =
            method === "play"
                ? play(
                      (async function* () {
                          yield new Uint8Array([1]);
                          throw error;
                      })(),
                  )
                : stream(audio);

        await expect(result).rejects.toBe(error);
        expect(player.kill).toHaveBeenCalledTimes(1);
    });
});
