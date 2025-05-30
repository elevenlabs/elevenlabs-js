/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";

export const KeepContextAlive: core.serialization.ObjectSchema<
    serializers.KeepContextAlive.Raw,
    ElevenLabs.KeepContextAlive
> = core.serialization.object({
    text: core.serialization.stringLiteral(""),
    contextId: core.serialization.property("context_id", core.serialization.string()),
});

export declare namespace KeepContextAlive {
    export interface Raw {
        text: "";
        context_id: string;
    }
}
