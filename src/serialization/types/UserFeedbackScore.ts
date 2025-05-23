/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";

export const UserFeedbackScore: core.serialization.Schema<
    serializers.UserFeedbackScore.Raw,
    ElevenLabs.UserFeedbackScore
> = core.serialization.enum_(["like", "dislike"]);

export declare namespace UserFeedbackScore {
    export type Raw = "like" | "dislike";
}
