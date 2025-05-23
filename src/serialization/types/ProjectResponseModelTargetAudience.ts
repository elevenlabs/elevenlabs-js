/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";

export const ProjectResponseModelTargetAudience: core.serialization.Schema<
    serializers.ProjectResponseModelTargetAudience.Raw,
    ElevenLabs.ProjectResponseModelTargetAudience
> = core.serialization.enum_(["children", "young adult", "adult", "all ages"]);

export declare namespace ProjectResponseModelTargetAudience {
    export type Raw = "children" | "young adult" | "adult" | "all ages";
}
