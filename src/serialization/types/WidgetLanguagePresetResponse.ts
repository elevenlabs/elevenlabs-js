/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";
import { WidgetTextContents } from "./WidgetTextContents";

export const WidgetLanguagePresetResponse: core.serialization.ObjectSchema<
    serializers.WidgetLanguagePresetResponse.Raw,
    ElevenLabs.WidgetLanguagePresetResponse
> = core.serialization.object({
    firstMessage: core.serialization.property("first_message", core.serialization.string().optional()),
    textContents: core.serialization.property("text_contents", WidgetTextContents.optional()),
});

export declare namespace WidgetLanguagePresetResponse {
    export interface Raw {
        first_message?: string | null;
        text_contents?: WidgetTextContents.Raw | null;
    }
}
