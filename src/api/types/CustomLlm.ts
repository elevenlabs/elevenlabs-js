/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface CustomLlm {
    /** The URL of the Chat Completions compatible endpoint */
    url: string;
    /** The model ID to be used if URL serves multiple models */
    modelId?: string;
    /** The API key for authentication */
    apiKey?: ElevenLabs.ConvAiSecretLocator;
    /** Headers that should be included in the request */
    requestHeaders?: Record<string, ElevenLabs.CustomLlmRequestHeadersValue>;
    /** The API version to use for the request */
    apiVersion?: string;
}
