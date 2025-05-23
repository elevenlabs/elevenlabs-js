/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";
import { RealtimeVoiceSettings } from "./RealtimeVoiceSettings";
import { GenerationConfig } from "./GenerationConfig";
import { PronunciationDictionaryLocator } from "./PronunciationDictionaryLocator";

export const WebsocketTtsClientMessageMulti: core.serialization.ObjectSchema<
    serializers.WebsocketTtsClientMessageMulti.Raw,
    ElevenLabs.WebsocketTtsClientMessageMulti
> = core.serialization.object({
    text: core.serialization.string().optional(),
    voiceSettings: core.serialization.property("voice_settings", RealtimeVoiceSettings.optional()),
    generationConfig: core.serialization.property("generation_config", GenerationConfig.optional()),
    xiApiKey: core.serialization.property("xi-api-key", core.serialization.string().optional()),
    authorization: core.serialization.string().optional(),
    flush: core.serialization.boolean().optional(),
    pronunciationDictionaryLocators: core.serialization.property(
        "pronunciation_dictionary_locators",
        core.serialization.list(PronunciationDictionaryLocator).optional(),
    ),
    contextId: core.serialization.string().optional(),
    closeContext: core.serialization.property("close_context", core.serialization.boolean().optional()),
    closeSocket: core.serialization.property("close_socket", core.serialization.boolean().optional()),
});

export declare namespace WebsocketTtsClientMessageMulti {
    export interface Raw {
        text?: string | null;
        voice_settings?: RealtimeVoiceSettings.Raw | null;
        generation_config?: GenerationConfig.Raw | null;
        "xi-api-key"?: string | null;
        authorization?: string | null;
        flush?: boolean | null;
        pronunciation_dictionary_locators?: PronunciationDictionaryLocator.Raw[] | null;
        contextId?: string | null;
        close_context?: boolean | null;
        close_socket?: boolean | null;
    }
}
