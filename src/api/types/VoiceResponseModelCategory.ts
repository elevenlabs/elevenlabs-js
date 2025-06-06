/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * The category of the voice.
 */
export type VoiceResponseModelCategory =
    | "generated"
    | "cloned"
    | "premade"
    | "professional"
    | "famous"
    | "high_quality";
export const VoiceResponseModelCategory = {
    Generated: "generated",
    Cloned: "cloned",
    Premade: "premade",
    Professional: "professional",
    Famous: "famous",
    HighQuality: "high_quality",
} as const;
