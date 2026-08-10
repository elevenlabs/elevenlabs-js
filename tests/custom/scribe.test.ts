import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// Mock `ws` before importing ScribeRealtime so it never opens a real socket.
let capturedUrl: string | undefined;
let capturedOptions: { headers?: Record<string, string> } | undefined;
jest.mock("ws", () => {
    return {
        __esModule: true,
        default: class FakeWebSocket {
            static OPEN = 1;
            readyState = 0;
            constructor(url: string, options?: { headers?: Record<string, string> }) {
                capturedUrl = url;
                capturedOptions = options;
            }
            on() {}
            send() {}
            close() {}
        },
    };
});

import { ScribeRealtime, AudioFormat, CommitStrategy } from "../../src/wrapper/realtime/scribe";

const TEST_API_KEY = "test_api_key";
const TEST_MODEL_ID = "scribe_v2_realtime";

/** The options every connect() call needs, so tests only state what they exercise. */
const REQUIRED_OPTIONS = {
    modelId: TEST_MODEL_ID,
    audioFormat: AudioFormat.PCM_16000,
    sampleRate: 16000,
};

async function connect(
    overrides: Record<string, unknown> = {},
    clientOptions: { apiKey?: string; baseUrl?: string } = { apiKey: TEST_API_KEY }
): Promise<{ url: URL; headers: Record<string, string> }> {
    capturedUrl = undefined;
    capturedOptions = undefined;

    const scribe = new ScribeRealtime(clientOptions);
    const connection = await scribe.connect({ ...REQUIRED_OPTIONS, ...overrides });
    connection.close();

    if (!capturedUrl) {
        throw new Error("WebSocket was never constructed");
    }
    return { url: new URL(capturedUrl), headers: capturedOptions?.headers ?? {} };
}

/**
 * Every query parameter on the URL, sorted so assertions don't depend on the
 * order the builder happens to append in.
 */
function queryParams(url: URL): Array<[string, string]> {
    return [...url.searchParams.entries()].sort(([keyA, valueA], [keyB, valueB]) =>
        keyA === keyB ? valueA.localeCompare(valueB) : keyA.localeCompare(keyB)
    );
}

describe("ScribeRealtime handshake URL", () => {
    beforeEach(() => {
        capturedUrl = undefined;
        capturedOptions = undefined;
    });

    it("targets the realtime endpoint, upgrading the scheme to websocket", async () => {
        const secure = await connect({}, { apiKey: TEST_API_KEY });
        expect(secure.url.protocol).toBe("wss:");
        expect(secure.url.pathname).toBe("/v1/speech-to-text/realtime");

        const insecure = await connect({}, { apiKey: TEST_API_KEY, baseUrl: "http://localhost:8080" });
        expect(insecure.url.protocol).toBe("ws:");
        expect(insecure.url.host).toBe("localhost:8080");
        expect(insecure.url.pathname).toBe("/v1/speech-to-text/realtime");
    });

    // Asserting the exhaustive parameter set is what catches a parameter being
    // appended twice, or leaking in when the caller never asked for it.
    it("sends nothing beyond the required parameters when no options are set", async () => {
        const { url } = await connect();

        expect(queryParams(url)).toEqual([
            ["audio_format", "pcm_16000"],
            ["model_id", TEST_MODEL_ID],
        ]);
    });

    // Likewise exhaustive: a renamed, miscased, dropped or duplicated parameter
    // fails here rather than silently reaching the server.
    it("serializes every supported option to its documented parameter name", async () => {
        const { url } = await connect({
            commitStrategy: CommitStrategy.VAD,
            vadSilenceThresholdSecs: 1.5,
            vadThreshold: 0.4,
            minSpeechDurationMs: 100,
            minSilenceDurationMs: 200,
            languageCode: "en",
            secondaryLanguages: ["nl", "de"],
            includeTimestamps: false,
            includeLanguageDetection: true,
            keyterms: ["ElevenLabs", "Scribe"],
            noVerbatim: true,
            entityDetection: ["pii", "email_address"],
            filterBackgroundAudio: true,
            enableLogging: false,
            token: "sutkn_1234567890",
        });

        expect(queryParams(url)).toEqual([
            ["audio_format", "pcm_16000"],
            ["commit_strategy", "vad"],
            ["enable_logging", "false"],
            ["entity_detection", "email_address"],
            ["entity_detection", "pii"],
            ["filter_background_audio", "true"],
            ["include_language_detection", "true"],
            ["include_timestamps", "false"],
            ["keyterms", "ElevenLabs"],
            ["keyterms", "Scribe"],
            ["language_code", "en"],
            ["min_silence_duration_ms", "200"],
            ["min_speech_duration_ms", "100"],
            ["model_id", TEST_MODEL_ID],
            ["no_verbatim", "true"],
            ["secondary_languages", "de"],
            ["secondary_languages", "nl"],
            ["token", "sutkn_1234567890"],
            ["vad_silence_threshold_secs", "1.5"],
            ["vad_threshold", "0.4"],
        ]);
    });

    // `false` is a meaningful value here: dropping it would silently re-enable
    // logging, or leave the server on a different default than the caller asked for.
    it("transmits booleans that are explicitly false rather than dropping them", async () => {
        const { url } = await connect({
            includeTimestamps: false,
            includeLanguageDetection: false,
            noVerbatim: false,
            filterBackgroundAudio: false,
            enableLogging: false,
        });

        expect(url.searchParams.get("include_timestamps")).toBe("false");
        expect(url.searchParams.get("include_language_detection")).toBe("false");
        expect(url.searchParams.get("no_verbatim")).toBe("false");
        expect(url.searchParams.get("filter_background_audio")).toBe("false");
        expect(url.searchParams.get("enable_logging")).toBe("false");
    });

    // The endpoint reads these as repeated parameters; joining them would make
    // each list arrive as one nonsense value.
    it("repeats list-valued parameters in order instead of joining them", async () => {
        const { url } = await connect({
            keyterms: ["beta", "alpha"],
            secondaryLanguages: ["nl", "de"],
            entityDetection: ["pii", "email_address"],
        });

        expect(url.searchParams.getAll("keyterms")).toEqual(["beta", "alpha"]);
        expect(url.searchParams.getAll("secondary_languages")).toEqual(["nl", "de"]);
        expect(url.searchParams.getAll("entity_detection")).toEqual(["pii", "email_address"]);
        for (const value of url.searchParams.values()) {
            expect(value).not.toContain(",");
        }
    });

    it("accepts a bare string for entityDetection as well as a list", async () => {
        const { url } = await connect({ entityDetection: "all" });

        expect(url.searchParams.getAll("entity_detection")).toEqual(["all"]);
    });
});

describe("ScribeRealtime option validation", () => {
    beforeEach(() => {
        capturedUrl = undefined;
    });

    it.each([
        ["vadSilenceThresholdSecs", 0.3, 3.0],
        ["vadThreshold", 0.1, 0.9],
        ["minSpeechDurationMs", 50, 2000],
        ["minSilenceDurationMs", 50, 2000],
    ])("treats the %s bounds as inclusive", async (option, min, max) => {
        await expect(connect({ [option]: min })).resolves.toBeDefined();
        await expect(connect({ [option]: max })).resolves.toBeDefined();

        await expect(connect({ [option]: min - 0.05 })).rejects.toThrow(option);
        await expect(connect({ [option]: max + 0.05 })).rejects.toThrow(option);
    });

});

describe("ScribeRealtime authentication", () => {
    beforeEach(() => {
        capturedUrl = undefined;
        capturedOptions = undefined;
    });

    it("authenticates with the api key header when no token is given", async () => {
        const { url, headers } = await connect();

        expect(headers).toStrictEqual({ "xi-api-key": TEST_API_KEY });
        expect(url.searchParams.has("token")).toBe(false);
    });

    // The point of a token is connecting without an api key at all, so the
    // credential header must not be required to build the request.
    it("omits the api key header when authenticating with a token alone", async () => {
        const { url, headers } = await connect({ token: "sutkn_1234567890" }, {});

        expect(headers).toStrictEqual({});
        expect(url.searchParams.get("token")).toBe("sutkn_1234567890");
    });

    // The server authenticates the token and never falls back to the key, so
    // sending it would transmit a long-lived credential that cannot be used.
    it("does not send the api key when a token is supplied alongside one", async () => {
        const { url, headers } = await connect({ token: "sutkn_1234567890" });

        expect(headers).toStrictEqual({});
        expect(url.searchParams.get("token")).toBe("sutkn_1234567890");
    });

    it("resolves an api key supplied as a function or promise", async () => {
        const fromFunction = await connect({}, { apiKey: (() => TEST_API_KEY) as never });
        expect(fromFunction.headers).toStrictEqual({ "xi-api-key": TEST_API_KEY });

        const fromPromise = await connect({}, { apiKey: Promise.resolve(TEST_API_KEY) as never });
        expect(fromPromise.headers).toStrictEqual({ "xi-api-key": TEST_API_KEY });
    });

    it("refuses to connect without either credential", async () => {
        await expect(connect({}, {})).rejects.toThrow("API key is required");
    });
});
