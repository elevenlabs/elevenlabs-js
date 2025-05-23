/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * Output quality of the generated audio. Must be one of:
 * standard - standard output format, 128kbps with 44.1kHz sample rate.
 * high - high quality output format, 192kbps with 44.1kHz sample rate and major improvements on our side. Using this setting increases the credit cost by 20%.
 * ultra - ultra quality output format, 192kbps with 44.1kHz sample rate and highest improvements on our side. Using this setting increases the credit cost by 50%.
 * ultra lossless - ultra quality output format, 705.6kbps with 44.1kHz sample rate and highest improvements on our side in a fully lossless format. Using this setting increases the credit cost by 100%.
 */
export type BodyCreatePodcastV1ProjectsPodcastCreatePostQualityPreset =
    | "standard"
    | "high"
    | "highest"
    | "ultra"
    | "ultra_lossless";
export const BodyCreatePodcastV1ProjectsPodcastCreatePostQualityPreset = {
    Standard: "standard",
    High: "high",
    Highest: "highest",
    Ultra: "ultra",
    UltraLossless: "ultra_lossless",
} as const;
