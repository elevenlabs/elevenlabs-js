import { describe, it, expect } from "@jest/globals";
import { MusicClient } from "../../../src/api/resources/music/client/Client";
import { Music } from "../../../src/wrapper/music";

function getPublicMethods(proto: object): string[] {
    return Object.getOwnPropertyNames(proto).filter(
        (name) => name !== "constructor" && !name.startsWith("_"),
    );
}

describe("Music wrapper", () => {
    it("exposes all public methods of the generated MusicClient", () => {
        const clientMethods = getPublicMethods(MusicClient.prototype);
        const wrapperMethods = getPublicMethods(Music.prototype);

        const missing = clientMethods.filter((m) => !wrapperMethods.includes(m));
        expect(missing).toEqual([]);
    });
});
