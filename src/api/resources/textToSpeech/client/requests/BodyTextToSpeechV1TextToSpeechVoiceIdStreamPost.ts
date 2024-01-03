/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../../../..";

export interface BodyTextToSpeechV1TextToSpeechVoiceIdStreamPost {
    /**
     * You can turn on latency optimizations at some cost of quality. The best possible final latency varies by model. Possible values:
     * 0 - default mode (no latency optimizations)
     * 1 - normal latency optimizations (about 50% of possible latency improvement of option 3)
     * 2 - strong latency optimizations (about 75% of possible latency improvement of option 3)
     * 3 - max latency optimizations
     * 4 - max latency optimizations, but also with text normalizer turned off for even more latency savings (best latency, but can mispronounce eg numbers and dates).
     *
     * Defaults to 0.
     */
    optimize_streaming_latency?: number;
    /**
     * Output format of the generated audio. Must be one of:
     * mp3_22050_32 - output format, mp3 with 22.05kHz sample rate at 32kbps.
     * mp3_44100_32 - output format, mp3 with 44.1kHz sample rate at 32kbps.
     * mp3_44100_64 - output format, mp3 with 44.1kHz sample rate at 64kbps.
     * mp3_44100_96 - output format, mp3 with 44.1kHz sample rate at 96kbps.
     * mp3_44100_128 - default output format, mp3 with 44.1kHz sample rate at 128kbps.
     * mp3_44100_192 - output format, mp3 with 44.1kHz sample rate at 192kbps. Requires you to be subscribed to Creator tier or above.
     * pcm_16000 - PCM format (S16LE) with 16kHz sample rate.
     * pcm_22050 - PCM format (S16LE) with 22.05kHz sample rate.
     * pcm_24000 - PCM format (S16LE) with 24kHz sample rate.
     * pcm_44100 - PCM format (S16LE) with 44.1kHz sample rate. Requires you to be subscribed to Independent Publisher tier or above.
     * ulaw_8000 - μ-law format (sometimes written mu-law, often approximated as u-law) with 8kHz sample rate. Note that this format is commonly used for Twilio audio inputs.
     */
    output_format?: string;
    /** The text that will get converted into speech. */
    text: string;
    /** Identifier of the model that will be used, you can query them using GET /v1/models. The model needs to have support for text to speech, you can check this using the can_do_text_to_speech property. */
    model_id?: string;
    /** Voice settings overriding stored setttings for the given voice. They are applied only on the given request. */
    voice_settings?: ElevenLabs.VoiceSettings;
}
