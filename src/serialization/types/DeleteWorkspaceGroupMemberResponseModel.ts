/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";

export const DeleteWorkspaceGroupMemberResponseModel: core.serialization.ObjectSchema<
    serializers.DeleteWorkspaceGroupMemberResponseModel.Raw,
    ElevenLabs.DeleteWorkspaceGroupMemberResponseModel
> = core.serialization.object({
    status: core.serialization.string(),
});

export declare namespace DeleteWorkspaceGroupMemberResponseModel {
    export interface Raw {
        status: string;
    }
}
