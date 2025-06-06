import { describe, it } from "@jest/globals";
import { ElevenLabsClient, play, stream } from "../../src";
import { Readable } from "node:stream";
import * as fs from "node:fs";
import * as path from "node:path";
import crypto from "node:crypto";

const IN_GITHUB = process.env.GITHUB_ACTIONS !== undefined;
const DEFAULT_VOICE = "21m00Tcm4TlvDq8ikWAM";
const DEFAULT_TEXT = "Hello";
const DEFAULT_MODEL = "eleven_multilingual_v2";
const DEFAULT_VOICE_FILE = path.join(__dirname, "./fixtures/voice_sample.mp3");

describe("ElevenLabs API Tests", () => {
    jest.setTimeout(120000);

    describe("textToSpeech", () => {
        it("convert", async () => {
            const client = new ElevenLabsClient();
            const audioStream = await client.textToSpeech.convert(DEFAULT_VOICE, {
                text: DEFAULT_TEXT,
                modelId: DEFAULT_MODEL,
            });
            const audio = Buffer.concat(await streamToBuffer(audioStream));
            expect(Buffer.isBuffer(audio)).toBeTruthy();
            await playIfNotGithub(audio);
        });
        it("convertAsStream", async () => {
            const client = new ElevenLabsClient();
            const audioStream = await client.textToSpeech.stream(DEFAULT_VOICE, {
                text: DEFAULT_TEXT,
                modelId: DEFAULT_MODEL,
            });
            await playIfNotGithub(audioStream);
        });
        it("convertWithTimestamps", async () => {
            const client = new ElevenLabsClient();
            const result = (await client.textToSpeech.convertWithTimestamps(DEFAULT_VOICE, {
                text: DEFAULT_TEXT,
                modelId: DEFAULT_MODEL,
            })) as unknown as { audioBase64: string; alignment: string }; // Fern type-gen issue
            expect(result.audioBase64).toBeDefined();
            expect(result.alignment).toBeDefined();
            await playIfNotGithub(Buffer.from(result.audioBase64, "base64"));
        });
        it("streamWithTimestamps", async () => {
            const client = new ElevenLabsClient();
            let audioData = Buffer.alloc(0);

            const stream = await client.textToSpeech.streamWithTimestamps(DEFAULT_VOICE, {
                text: DEFAULT_TEXT,
                modelId: DEFAULT_MODEL,
            });
            for await (const chunk of stream) {
                if ("audioBase64" in chunk) {
                    if (chunk.audioBase64) {
                        const audioChunk = Buffer.from(chunk.audioBase64, "base64");
                        audioData = Buffer.concat([audioData, audioChunk]);
                    }
                }
            }
            expect(audioData.length).toBeGreaterThan(0);
            await playIfNotGithub(audioData);
        });
    });

    describe("speechToText", () => {
        it("convert", async () => {
            const client = new ElevenLabsClient();
            const audioFile = fs.readFileSync(DEFAULT_VOICE_FILE);
            const audioBlob = new Blob([audioFile], { type: "audio/mp3" });

            const transcription = await client.speechToText.convert({
                file: audioBlob,
                modelId: "scribe_v1",
            });
            expect(typeof transcription.text).toBe("string");
            expect(transcription.text.length).toBeGreaterThan(0);
            expect(Array.isArray(transcription.words)).toBeTruthy();
            expect(transcription.words.length).toBeGreaterThan(0);
        });
    });

    describe("audioIsolation", () => {
        it("audioIsolation", async () => {
            const client = new ElevenLabsClient();

            const audioFile = fs.readFileSync(DEFAULT_VOICE_FILE);
            const audioStream = await client.audioIsolation.convert({
                audio: new Blob([audioFile], { type: "audio/mp3" }),
            });
            const audio = Buffer.concat(await streamToBuffer(audioStream));
            expect(Buffer.isBuffer(audio)).toBeTruthy();
            await playIfNotGithub(audio);
        });

        it("audioIsolationStream", async () => {
            const client = new ElevenLabsClient();
            const audioFile = fs.readFileSync(DEFAULT_VOICE_FILE);
            const audioStream = await client.audioIsolation.stream({
                audio: new Blob([audioFile], { type: "audio/mp3" }),
            });
            await playIfNotGithub(audioStream);
        });
    });

    describe("voices", () => {
        it("getAll", async () => {
            const client = new ElevenLabsClient();

            const response = await client.voices.search();
            expect(response.voices.length).toBeGreaterThan(0);
        });

        it("get", async () => {
            const client = new ElevenLabsClient();

            const voice = await client.voices.get(DEFAULT_VOICE);
            expect(voice.voiceId).toBe(DEFAULT_VOICE);
            if (voice.settings) {
                expect(voice.settings).toBeDefined();
            }
        });
    });

    describe("textToVoice", () => {
        it("createPreviews", async () => {
            const client = new ElevenLabsClient();

            const description =
                "A warm and friendly female voice with a slight British accent, speaking clearly and professionally";
            const sampleText =
                "This is a test message that needs to be at least one hundred characters long to meet the API requirements. Here it is.";

            const previews = await client.textToVoice.createPreviews({
                voiceDescription: description,
                text: sampleText,
            });

            expect(previews.previews.length).toBeGreaterThan(0);
            expect(previews.previews[0].generatedVoiceId).toBeDefined();
            expect(previews.previews[0].audioBase64).toBeDefined();

            await playIfNotGithub(Buffer.from(previews.previews[0].audioBase64, "base64"));
        });
    });

    describe("textToSoundEffects", () => {
        it("convert", async () => {
            const client = new ElevenLabsClient();

            const audioStream = await client.textToSoundEffects.convert({
                text: "Hypnotic throbbing sound effect. Increases in intensity.",
                durationSeconds: 2,
            });
            const audio = Buffer.concat(await streamToBuffer(audioStream));
            expect(Buffer.isBuffer(audio)).toBeTruthy();
            await playIfNotGithub(audio);
        });
    });

    describe("models", () => {
        it("getAll", async () => {
            const client = new ElevenLabsClient();
            const models = await client.models.list();
            expect(models.length).toBeGreaterThan(0);
        });
    });

    describe("speechToSpeech", () => {
        it("convert", async () => {
            const client = new ElevenLabsClient();
            const audioFile = fs.readFileSync(DEFAULT_VOICE_FILE);
            const audioStream = await client.speechToSpeech.convert(DEFAULT_VOICE, {
                audio: new Blob([audioFile], { type: "audio/mp3" }),
            });
            const audio = Buffer.concat(await streamToBuffer(audioStream));
            expect(Buffer.isBuffer(audio)).toBeTruthy();
            await playIfNotGithub(audio);
        });

        it("convertAsStream", async () => {
            const client = new ElevenLabsClient();
            const audioFile = fs.readFileSync(DEFAULT_VOICE_FILE);
            const audioStream = await client.speechToSpeech.stream(DEFAULT_VOICE, {
                audio: new Blob([audioFile], { type: "audio/mp3" }),
            });
            await playIfNotGithub(audioStream);
        });
    });

    describe("history", () => {
        it("getAll", async () => {
            const client = new ElevenLabsClient();
            const history = await client.history.list({ pageSize: 5 });
            expect(history.history).toBeDefined();
            expect(Array.isArray(history.history)).toBeTruthy();
        });
    });

    describe("webhooks", () => {
        it("constructEvent", () => {
            const elevenlabs = new ElevenLabsClient();

            // Create test payload
            const payload = { eventType: "test_event", data: { id: "123" } };

            // Create mock signature components
            const timestamp = Math.floor(Date.now() / 1000).toString();
            const body = JSON.stringify(payload);
            const message = `${timestamp}.${body}`;
            const secret = "webhook_secret";

            // Generate expected signature
            const signature = crypto.createHmac('sha256', secret).update(message).digest('hex');
            const sigHeader = `t=${timestamp},v0=${signature}`;

            // Test valid webhook construction
            const result = elevenlabs.webhooks.constructEvent(body, sigHeader, secret);

            // Verify result matches original payload
            expect(result).toEqual(payload);

            // Test secret not configured
            expect(() => {
                elevenlabs.webhooks.constructEvent(body, sigHeader, "");
            }).toThrow("Webhook secret not configured");

            // Test invalid signature header
            expect(() => {
                elevenlabs.webhooks.constructEvent(body, "", secret);
            }).toThrow("Missing signature header");

            // Test invalid signature format
            expect(() => {
                elevenlabs.webhooks.constructEvent(body, "invalid_format", secret);
            }).toThrow("No signature hash found with expected scheme v0");

            // Test invalid signature
            const invalidSigHeader = `t=${timestamp},v0=invalid_signature`;
            expect(() => {
                elevenlabs.webhooks.constructEvent(body, invalidSigHeader, secret);
            }).toThrow("Signature hash does not match the expected signature hash for payload");
        });
    });
});

async function streamToBuffer(stream: AsyncIterable<Buffer>): Promise<Buffer[]> {
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
        chunks.push(chunk);
    }
    return chunks;
}

const playIfNotGithub = async (audio: Buffer | AsyncIterable<Buffer>) => {
    if (!IN_GITHUB) {
        Buffer.isBuffer(audio) ? await play(Readable.from(audio)) : await stream(Readable.from(audio));
    }
};
