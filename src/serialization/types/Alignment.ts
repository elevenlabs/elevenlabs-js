/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";

export const Alignment: core.serialization.ObjectSchema<serializers.Alignment.Raw, ElevenLabs.Alignment> =
    core.serialization.object({
        charStartTimesMs: core.serialization.list(core.serialization.number()).optional(),
        charsDurationsMs: core.serialization.list(core.serialization.number()).optional(),
        chars: core.serialization.list(core.serialization.string()).optional(),
    });

export declare namespace Alignment {
    export interface Raw {
        charStartTimesMs?: number[] | null;
        charsDurationsMs?: number[] | null;
        chars?: string[] | null;
    }
}
