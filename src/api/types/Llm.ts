/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * An enumeration.
 */
export type Llm =
    | "gpt-4o-mini"
    | "gpt-4o"
    | "gpt-4"
    | "gpt-4-turbo"
    | "gpt-3.5-turbo"
    | "gemini-1.5-pro"
    | "gemini-1.5-flash"
    | "gemini-2.0-flash-001"
    | "gemini-2.0-flash-lite"
    | "gemini-1.0-pro"
    | "claude-3-7-sonnet"
    | "claude-3-5-sonnet"
    | "claude-3-5-sonnet-v1"
    | "claude-3-haiku"
    | "grok-beta"
    | "custom-llm";
export const Llm = {
    Gpt4OMini: "gpt-4o-mini",
    Gpt4O: "gpt-4o",
    Gpt4: "gpt-4",
    Gpt4Turbo: "gpt-4-turbo",
    Gpt35Turbo: "gpt-3.5-turbo",
    Gemini15Pro: "gemini-1.5-pro",
    Gemini15Flash: "gemini-1.5-flash",
    Gemini20Flash001: "gemini-2.0-flash-001",
    Gemini20FlashLite: "gemini-2.0-flash-lite",
    Gemini10Pro: "gemini-1.0-pro",
    Claude37Sonnet: "claude-3-7-sonnet",
    Claude35Sonnet: "claude-3-5-sonnet",
    Claude35SonnetV1: "claude-3-5-sonnet-v1",
    Claude3Haiku: "claude-3-haiku",
    GrokBeta: "grok-beta",
    CustomLlm: "custom-llm",
} as const;
