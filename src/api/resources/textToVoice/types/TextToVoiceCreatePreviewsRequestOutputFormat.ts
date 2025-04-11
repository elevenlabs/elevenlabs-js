/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * Output format of the generated audio. Formatted as codec_sample_rate_bitrate. So an mp3 with 22.05kHz sample rate at 32kbs is represented as mp3_22050_32. MP3 with 192kbps bitrate requires you to be subscribed to Creator tier or above. PCM with 44.1kHz sample rate requires you to be subscribed to Pro tier or above. Note that the μ-law format (sometimes written mu-law, often approximated as u-law) is commonly used for Twilio audio inputs.
 */
export type TextToVoiceCreatePreviewsRequestOutputFormat =
    | "mp3_22050_32"
    | "mp3_44100_32"
    | "mp3_44100_64"
    | "mp3_44100_96"
    | "mp3_44100_128"
    | "mp3_44100_192"
    | "pcm_8000"
    | "pcm_16000"
    | "pcm_22050"
    | "pcm_24000"
    | "pcm_44100"
    | "ulaw_8000"
    | "alaw_8000"
    | "opus_48000_32"
    | "opus_48000_64"
    | "opus_48000_96"
    | "opus_48000_128"
    | "opus_48000_192";
export const TextToVoiceCreatePreviewsRequestOutputFormat = {
    Mp32205032: "mp3_22050_32",
    Mp34410032: "mp3_44100_32",
    Mp34410064: "mp3_44100_64",
    Mp34410096: "mp3_44100_96",
    Mp344100128: "mp3_44100_128",
    Mp344100192: "mp3_44100_192",
    Pcm8000: "pcm_8000",
    Pcm16000: "pcm_16000",
    Pcm22050: "pcm_22050",
    Pcm24000: "pcm_24000",
    Pcm44100: "pcm_44100",
    Ulaw8000: "ulaw_8000",
    Alaw8000: "alaw_8000",
    Opus4800032: "opus_48000_32",
    Opus4800064: "opus_48000_64",
    Opus4800096: "opus_48000_96",
    Opus48000128: "opus_48000_128",
    Opus48000192: "opus_48000_192",
} as const;
