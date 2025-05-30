/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../../../index";
import * as ElevenLabs from "../../../../../api/index";
import * as core from "../../../../../core";

export const BodyAddSharedVoiceV1VoicesAddPublicUserIdVoiceIdPost: core.serialization.Schema<
    serializers.BodyAddSharedVoiceV1VoicesAddPublicUserIdVoiceIdPost.Raw,
    ElevenLabs.BodyAddSharedVoiceV1VoicesAddPublicUserIdVoiceIdPost
> = core.serialization.object({
    newName: core.serialization.property("new_name", core.serialization.string()),
});

export declare namespace BodyAddSharedVoiceV1VoicesAddPublicUserIdVoiceIdPost {
    export interface Raw {
        new_name: string;
    }
}
