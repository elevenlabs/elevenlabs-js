import { describe, it } from "@jest/globals";
import { ElevenLabsClient, play, stream } from "../src";

describe("eleven labs", () => {
    it.skip("list voices", async () => {
        const eleven = new ElevenLabsClient({
            apiKey: process.env.ELEVENLABS_API_KEY,
        });
        const response = await eleven.voices.getAll();
        console.log(response);
    });

    it.skip("text to speech", async () => {
        const eleven = new ElevenLabsClient({
            apiKey: process.env.ELEVENLABS_API_KEY,
        });
        const audio = await eleven.textToSpeech.convert("21m00Tcm4TlvDq8ikWAM", {
            text: "We support two main models: the newest eleven_multilingual_v2, a single foundational model supporting 29 languages including English, Chinese, Spanish, Hindi, Portuguese, French, German, Japanese, Arabic, Korean, Indonesian, Italian, Dutch, Turkish, Polish, Swedish, Filipino, Malay, Russian, Romanian, Ukrainian, Greek, Czech, Danish, Finnish, Bulgarian, Croatian, Slovak, and Tamil; and eleven_monolingual_v1, a low-latency model specifically trained for English speech.",
            model_id: "eleven_multilingual_v2",
        });
        play(audio);
    });

    it.skip("text to speech stream", async () => {
        const eleven = new ElevenLabsClient({
            apiKey: process.env.ELEVENLABS_API_KEY,
        });
        const audioStream = await eleven.textToSpeech.convertAsStream("21m00Tcm4TlvDq8ikWAM", {
            text: "We support two main models: the newest eleven_multilingual_v2, a single foundational model supporting 29 languages including English, Chinese, Spanish, Hindi, Portuguese, French, German, Japanese, Arabic, Korean, Indonesian, Italian, Dutch, Turkish, Polish, Swedish, Filipino, Malay, Russian, Romanian, Ukrainian, Greek, Czech, Danish, Finnish, Bulgarian, Croatian, Slovak, and Tamil; and eleven_monolingual_v1, a low-latency model specifically trained for English speech.",
            model_id: "eleven_multilingual_v2",
        });
        stream(audioStream);
    });
});
