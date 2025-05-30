/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";

export const DashboardCallSuccessChartModel: core.serialization.ObjectSchema<
    serializers.DashboardCallSuccessChartModel.Raw,
    ElevenLabs.DashboardCallSuccessChartModel
> = core.serialization.object({
    name: core.serialization.string(),
});

export declare namespace DashboardCallSuccessChartModel {
    export interface Raw {
        name: string;
    }
}
