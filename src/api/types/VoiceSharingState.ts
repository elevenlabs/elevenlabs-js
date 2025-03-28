/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * The status of the voice sharing.
 */
export type VoiceSharingState = "enabled" | "disabled" | "copied" | "copied_disabled";
export const VoiceSharingState = {
    Enabled: "enabled",
    Disabled: "disabled",
    Copied: "copied",
    CopiedDisabled: "copied_disabled",
} as const;
