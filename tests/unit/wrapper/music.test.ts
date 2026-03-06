import { Music } from "../../../src/wrapper/music";

const AUDIO_BYTES = new Uint8Array([0xff, 0xfb, 0x90, 0x00, 0xde, 0xad, 0xbe, 0xef]);

function buildMultipartBody(lineEnding: "\r\n" | "\n"): Uint8Array {
    const boundary = "--boundary123";
    const jsonPayload = JSON.stringify({
        composition_plan: {
            positive_global_styles: ["pop"],
            negative_global_styles: [],
            sections: [],
        },
        song_metadata: {
            title: "Test Song",
            description: "A test",
            genres: ["pop"],
            languages: ["en"],
            is_explicit: false,
        },
    });

    

    const parts = [
        boundary,
        `Content-Type: application/json`,
        ``,
        jsonPayload,
        boundary,
        `Content-Disposition: attachment; filename="test_song.mp3"`,
        `Content-Type: audio/mpeg`,
        ``,
    ];
    const headerText = parts.join(lineEnding) + lineEnding;
    const headerBytes = new TextEncoder().encode(headerText);

    const closingText = lineEnding + boundary + "--" + lineEnding;
    const closingBytes = new TextEncoder().encode(closingText);

    const result = new Uint8Array(headerBytes.length + AUDIO_BYTES.length + closingBytes.length);
    result.set(headerBytes, 0);
    result.set(AUDIO_BYTES, headerBytes.length);
    result.set(closingBytes, headerBytes.length + AUDIO_BYTES.length);
    return result;
}

function toReadableStream(bytes: Uint8Array): ReadableStream<Uint8Array> {
    return new ReadableStream({
        start(controller) {
            controller.enqueue(bytes);
            controller.close();
        },
    });
}

describe("Music.parseMultipart", () => {
    let music: Music;

    beforeEach(() => {
        music = new Music();
    });

    it("should parse multipart response with CRLF line endings", async () => {
        const body = buildMultipartBody("\r\n");
        const stream = toReadableStream(body);

        const result = await music["parseMultipart"](stream);

        expect(result.filename).toBe("test_song.mp3");
        expect(result.json.songMetadata).toEqual({
            title: "Test Song",
            description: "A test",
            genres: ["pop"],
            languages: ["en"],
            isExplicit: false,
        });
        expect(result.json.compositionPlan).toEqual({
            positiveGlobalStyles: ["pop"],
            negativeGlobalStyles: [],
            sections: [],
        });
        expect(result.audio).toEqual(Buffer.from(AUDIO_BYTES));
    });

    it("should parse multipart response with LF line endings", async () => {
        const body = buildMultipartBody("\n");
        const stream = toReadableStream(body);

        const result = await music["parseMultipart"](stream);

        expect(result.filename).toBe("test_song.mp3");
        expect(result.json.songMetadata).toEqual({
            title: "Test Song",
            description: "A test",
            genres: ["pop"],
            languages: ["en"],
            isExplicit: false,
        });
        expect(result.json.compositionPlan).toEqual({
            positiveGlobalStyles: ["pop"],
            negativeGlobalStyles: [],
            sections: [],
        });
        expect(result.audio).toEqual(Buffer.from(AUDIO_BYTES));
    });
});
