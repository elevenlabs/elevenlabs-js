import { describe, it, expect, jest, beforeEach } from "@jest/globals";

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

import { ScribeRealtime, AudioFormat } from "../../src/wrapper/realtime/scribe";

const TEST_API_KEY = "test_api_key";
const TEST_MODEL_ID = "scribe_v2_realtime";

async function connectAndGetUrl(
    overrides: Record<string, unknown> = {},
    clientOptions: { apiKey?: string } = { apiKey: TEST_API_KEY }
): Promise<URL> {
    const scribe = new ScribeRealtime(clientOptions);
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

    it("appends audio_format exactly once", async () => {
        const url = await connectAndGetUrl();

        expect(url.searchParams.getAll("audio_format")).toEqual(["pcm_16000"]);
    });

    it("includes secondary_languages as repeated query params", async () => {
        const url = await connectAndGetUrl({ secondaryLanguages: ["en", "nl"] });

        expect(url.searchParams.getAll("secondary_languages")).toEqual(["en", "nl"]);
    });

    it("includes include_language_detection", async () => {
        const url = await connectAndGetUrl({ includeLanguageDetection: true });

        expect(url.searchParams.get("include_language_detection")).toBe("true");
    });

    it("includes filter_background_audio", async () => {
        const url = await connectAndGetUrl({ filterBackgroundAudio: true });

        expect(url.searchParams.get("filter_background_audio")).toBe("true");
    });

    it("includes enable_logging=false for zero retention mode", async () => {
        const url = await connectAndGetUrl({ enableLogging: false });

        expect(url.searchParams.get("enable_logging")).toBe("false");
    });

    it("includes entity_detection when given a single value", async () => {
        const url = await connectAndGetUrl({ entityDetection: "all" });

        expect(url.searchParams.getAll("entity_detection")).toEqual(["all"]);
    });

    it("includes entity_detection as repeated query params when given a list", async () => {
        const url = await connectAndGetUrl({
            entityDetection: ["pii", "email_address"],
        });

        expect(url.searchParams.getAll("entity_detection")).toEqual([
            "pii",
            "email_address",
        ]);
    });

    it("omits the new params when not specified", async () => {
        const url = await connectAndGetUrl();

        expect(url.searchParams.has("secondary_languages")).toBe(false);
        expect(url.searchParams.has("include_language_detection")).toBe(false);
        expect(url.searchParams.has("filter_background_audio")).toBe(false);
        expect(url.searchParams.has("enable_logging")).toBe(false);
        expect(url.searchParams.has("entity_detection")).toBe(false);
        expect(url.searchParams.has("token")).toBe(false);
    });

    it("rejects filterBackgroundAudio combined with includeTimestamps", async () => {
        await expect(
            connectAndGetUrl({ filterBackgroundAudio: true, includeTimestamps: true })
        ).rejects.toThrow(/cannot be combined with includeTimestamps/);
    });

    it("accepts the inclusive bounds of the VAD parameters", async () => {
        const url = await connectAndGetUrl({
            vadSilenceThresholdSecs: 0.3,
            minSpeechDurationMs: 50,
            minSilenceDurationMs: 50,
        });

        expect(url.searchParams.get("vad_silence_threshold_secs")).toBe("0.3");
        expect(url.searchParams.get("min_speech_duration_ms")).toBe("50");
        expect(url.searchParams.get("min_silence_duration_ms")).toBe("50");
    });

    it("rejects keyterms beyond the documented limits", async () => {
        await expect(
            connectAndGetUrl({ keyterms: Array.from({ length: 51 }, (_, i) => `k${i}`) })
        ).rejects.toThrow(/cannot exceed 50/);

        await expect(
            connectAndGetUrl({ keyterms: ["a".repeat(21)] })
        ).rejects.toThrow(/at most 20 characters/);
    });
});

describe("ScribeRealtime authentication", () => {
    beforeEach(() => {
        capturedUrl = undefined;
    });

    it("passes a single use token as a query param", async () => {
        const url = await connectAndGetUrl({ token: "sutkn_1234567890" });

        expect(url.searchParams.get("token")).toBe("sutkn_1234567890");
    });

    it("connects with a token and no API key", async () => {
        const url = await connectAndGetUrl({ token: "sutkn_1234567890" }, {});

        expect(url.searchParams.get("token")).toBe("sutkn_1234567890");
    });

    it("still requires an API key when no token is given", async () => {
        await expect(connectAndGetUrl({}, {})).rejects.toThrow("API key is required");
    });
});
