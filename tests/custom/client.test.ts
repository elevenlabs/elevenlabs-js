import { describe, it } from "@jest/globals";
import { ElevenLabsClient, play, stream } from "../../src";
import { Readable } from "stream";
import * as fs from "fs";
import * as path from "path";

const IN_GITHUB = process.env.GITHUB_ACTIONS !== undefined;
const DEFAULT_VOICE = "21m00Tcm4TlvDq8ikWAM";
const DEFAULT_TEXT = "Hello";
const DEFAULT_MODEL = "eleven_multilingual_v2";
const DEFAULT_VOICE_FILE = path.join(__dirname, "./fixtures/voice_sample.mp3");

describe("ElevenLabs API Tests", () => {
    jest.setTimeout(120000);

    describe("generate", () => {
        it("generate", async () => {
            const client = new ElevenLabsClient();
            const audioStream = await client.generate({
                voice: "Sarah",
                text: DEFAULT_TEXT,
                model_id: DEFAULT_MODEL,
            });
            const audio = Buffer.concat(await streamToBuffer(audioStream));
            expect(Buffer.isBuffer(audio)).toBeTruthy();
            await playIfNotGithub(audio);
        });

        it("generate stream", async () => {
            const client = new ElevenLabsClient();
            const audioStream = await client.generate({
                stream: true,
                text: DEFAULT_TEXT,
                model_id: DEFAULT_MODEL,
            });
            await playIfNotGithub(audioStream);
        });
    });

    describe("textToSpeech", () => {
        it("convert", async () => {
            const client = new ElevenLabsClient();
            const audioStream = await client.textToSpeech.convert(DEFAULT_VOICE, {
                text: DEFAULT_TEXT,
                model_id: DEFAULT_MODEL,
            });
            const audio = Buffer.concat(await streamToBuffer(audioStream));
            expect(Buffer.isBuffer(audio)).toBeTruthy();
            await playIfNotGithub(audio);
        });
        it("convertAsStream", async () => {
            const client = new ElevenLabsClient();
            const audioStream = await client.textToSpeech.convertAsStream(DEFAULT_VOICE, {
                text: DEFAULT_TEXT,
                model_id: DEFAULT_MODEL,
            });
            await playIfNotGithub(audioStream);
        });
        it("convertWithTimestamps", async () => {
            const client = new ElevenLabsClient();
            const result = (await client.textToSpeech.convertWithTimestamps(DEFAULT_VOICE, {
                text: DEFAULT_TEXT,
                model_id: DEFAULT_MODEL,
            })) as unknown as { audio_base64: string; alignment: string }; // Fern type-gen issue
            expect(result.audio_base64).toBeDefined();
            expect(result.alignment).toBeDefined();
            await playIfNotGithub(Buffer.from(result.audio_base64, "base64"));
        });
        it("streamWithTimestamps", async () => {
            const client = new ElevenLabsClient();
            let audioData = Buffer.alloc(0);

            const stream = await client.textToSpeech.streamWithTimestamps(DEFAULT_VOICE, {
                text: DEFAULT_TEXT,
                model_id: DEFAULT_MODEL,
            });
            for await (const chunk of stream) {
                if ("audio_base64" in chunk) {
                    if (chunk.audio_base64) {
                        const audioChunk = Buffer.from(chunk.audio_base64, "base64");
                        audioData = Buffer.concat([audioData, audioChunk]);
                    }
                }
            }
            expect(audioData.length).toBeGreaterThan(0);
            await playIfNotGithub(audioData);
        });
    });

    describe("audioIsolation", () => {
        it("audioIsolation", async () => {
            const client = new ElevenLabsClient();

            const audioFile = fs.readFileSync(DEFAULT_VOICE_FILE);
            const audioStream = await client.audioIsolation.audioIsolation({
                audio: new Blob([audioFile], { type: "audio/mp3" }),
            });
            const audio = Buffer.concat(await streamToBuffer(audioStream));
            expect(Buffer.isBuffer(audio)).toBeTruthy();
            await playIfNotGithub(audio);
        });

        it("audioIsolationStream", async () => {
            const client = new ElevenLabsClient();
            const audioFile = fs.readFileSync(DEFAULT_VOICE_FILE);
            const audioStream = await client.audioIsolation.audioIsolationStream({
                audio: new Blob([audioFile], { type: "audio/mp3" }),
            });
            await playIfNotGithub(audioStream);
        });
    });

    describe("voices", () => {
        it("getAll", async () => {
            const client = new ElevenLabsClient();

            const response = await client.voices.getAll();
            expect(response.voices.length).toBeGreaterThan(0);
        });

        it("get", async () => {
            const client = new ElevenLabsClient();

            const voice = await client.voices.get(DEFAULT_VOICE);
            expect(voice.voice_id).toBe(DEFAULT_VOICE);
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
                voice_description: description,
                text: sampleText,
            });

            expect(previews.previews.length).toBeGreaterThan(0);
            expect(previews.previews[0].generated_voice_id).toBeDefined();
            expect(previews.previews[0].audio_base_64).toBeDefined();

            await playIfNotGithub(Buffer.from(previews.previews[0].audio_base_64, "base64"));
        });
    });

    describe("textToSoundEffects", () => {
        it("convert", async () => {
            const client = new ElevenLabsClient();

            const audioStream = await client.textToSoundEffects.convert({
                text: "Hypnotic throbbing sound effect. Increases in intensity.",
                duration_seconds: 2,
            });
            const audio = Buffer.concat(await streamToBuffer(audioStream));
            expect(Buffer.isBuffer(audio)).toBeTruthy();
            await playIfNotGithub(audio);
        });
    });

    describe("models", () => {
        it("getAll", async () => {
            const client = new ElevenLabsClient();
            const models = await client.models.getAll();
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
            const audioStream = await client.speechToSpeech.convertAsStream(DEFAULT_VOICE, {
                audio: new Blob([audioFile], { type: "audio/mp3" }),
            });
            await playIfNotGithub(audioStream);
        });
    });

    describe("history", () => {
        it("getAll", async () => {
            const client = new ElevenLabsClient();
            const history = await client.history.getAll({ page_size: 5 });
            expect(history.history).toBeDefined();
            expect(Array.isArray(history.history)).toBeTruthy();
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
