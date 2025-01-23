/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * How to break down the information. Cannot be "user" or "api_key" if include_workspace_metrics is False.
 */
export type BreakdownTypes =
    | "none"
    | "voice"
    | "voice_multiplier"
    | "user"
    | "groups"
    | "api_keys"
    | "all_api_keys"
    | "product_type"
    | "model"
    | "resource";
export const BreakdownTypes = {
    None: "none",
    Voice: "voice",
    VoiceMultiplier: "voice_multiplier",
    User: "user",
    Groups: "groups",
    ApiKeys: "api_keys",
    AllApiKeys: "all_api_keys",
    ProductType: "product_type",
    Model: "model",
    Resource: "resource",
} as const;
