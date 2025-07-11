/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";
import { SystemToolConfigOutput } from "./SystemToolConfigOutput";

export const BuiltInToolsOutput: core.serialization.ObjectSchema<
    serializers.BuiltInToolsOutput.Raw,
    ElevenLabs.BuiltInToolsOutput
> = core.serialization.object({
    endCall: core.serialization.property("end_call", SystemToolConfigOutput.optional()),
    languageDetection: core.serialization.property("language_detection", SystemToolConfigOutput.optional()),
    transferToAgent: core.serialization.property("transfer_to_agent", SystemToolConfigOutput.optional()),
    transferToNumber: core.serialization.property("transfer_to_number", SystemToolConfigOutput.optional()),
    skipTurn: core.serialization.property("skip_turn", SystemToolConfigOutput.optional()),
    playKeypadTouchTone: core.serialization.property("play_keypad_touch_tone", SystemToolConfigOutput.optional()),
});

export declare namespace BuiltInToolsOutput {
    export interface Raw {
        end_call?: SystemToolConfigOutput.Raw | null;
        language_detection?: SystemToolConfigOutput.Raw | null;
        transfer_to_agent?: SystemToolConfigOutput.Raw | null;
        transfer_to_number?: SystemToolConfigOutput.Raw | null;
        skip_turn?: SystemToolConfigOutput.Raw | null;
        play_keypad_touch_tone?: SystemToolConfigOutput.Raw | null;
    }
}
