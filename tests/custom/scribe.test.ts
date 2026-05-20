import { beforeEach, describe, expect, it, jest } from "@jest/globals";

// Mock `ws` before importing ScribeRealtime so it never opens a real socket.
let capturedUrl: string | undefined;
jest.mock("ws", () => {
    return {
        __esModule: true,
        default: class FakeWebSocket {
            static OPEN = 1;
            readyState = 0;
            constructor(url: string) {
                capturedUrl = url;
            }
            on() {}
            send() {}
            close() {}
        },
    };
});

import { AudioFormat, ScribeRealtime } from "../../src/wrapper/realtime/scribe";

const TEST_API_KEY = "test_api_key";
const TEST_MODEL_ID = "scribe_v2_realtime";

async function connectAndGetUrl(overrides: Record<string, unknown> = {}): Promise<URL> {
    const scribe = new ScribeRealtime({ apiKey: TEST_API_KEY });
    capturedUrl = undefined;

    const connection = await scribe.connect({
        modelId: TEST_MODEL_ID,
        audioFormat: AudioFormat.PCM_16000,
        sampleRate: 16000,
        ...overrides,
    });
    connection.close();

    if (!capturedUrl) {
        throw new Error("WebSocket was never constructed");
    }
    return new URL(capturedUrl);
}

describe("ScribeRealtime URI building", () => {
    beforeEach(() => {
        capturedUrl = undefined;
    });

    it("includes keyterms as repeated query params", async () => {
        const url = await connectAndGetUrl({
            keyterms: ["ElevenLabs", "Scribe"],
        });

        const keyterms = url.searchParams.getAll("keyterms");
        expect(keyterms).toEqual(["ElevenLabs", "Scribe"]);
    });

    it("includes no_verbatim=true when noVerbatim is true", async () => {
        const url = await connectAndGetUrl({ noVerbatim: true });

        expect(url.searchParams.get("no_verbatim")).toBe("true");
    });

    it("includes no_verbatim=false when noVerbatim is false", async () => {
        const url = await connectAndGetUrl({ noVerbatim: false });

        expect(url.searchParams.get("no_verbatim")).toBe("false");
    });

    it("omits keyterms and no_verbatim when not specified", async () => {
        const url = await connectAndGetUrl();

        expect(url.searchParams.has("keyterms")).toBe(false);
        expect(url.searchParams.has("no_verbatim")).toBe(false);
    });
});
