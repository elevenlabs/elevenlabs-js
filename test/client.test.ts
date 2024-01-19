import { ElevenLabs }                                              from "../src";


ElevenLabs.

















import { describe, it } from "@jest/globals";
import { ElevenLabsClient, play } from "../src";

describe("eleven labs", () => {
    it.skip("list voices", async () => {
        const eleven = new ElevenLabsClient({
            apiKey: "197464a32e60dfb6982e479cbbd49748",
        });
        const response = await eleven.voices.getAll();
        console.log(response);
    });

    it("text to speech", async () => {
        const eleven = new ElevenLabsClient({
            apiKey: "197464a32e60dfb6982e479cbbd49748",
        });
        const audio = await eleven.textToSpeech.convert("21m00Tcm4TlvDq8ikWAM", {
            text: "Hello! 你好! Hola! नमस्ते! Bonjour! こんにちは! مرحبا! 안녕하세요! Ciao! Cześć! Привіт! வணக்கம்!",
            model_id: "eleven_multilingual_v2",
        });
        play({ audio });
    });
});
