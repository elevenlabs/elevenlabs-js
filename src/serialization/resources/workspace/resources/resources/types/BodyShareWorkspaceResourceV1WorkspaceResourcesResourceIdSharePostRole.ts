/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../../../../index";
import * as ElevenLabs from "../../../../../../api/index";
import * as core from "../../../../../../core";

export const BodyShareWorkspaceResourceV1WorkspaceResourcesResourceIdSharePostRole: core.serialization.Schema<
    serializers.workspace.BodyShareWorkspaceResourceV1WorkspaceResourcesResourceIdSharePostRole.Raw,
    ElevenLabs.workspace.BodyShareWorkspaceResourceV1WorkspaceResourcesResourceIdSharePostRole
> = core.serialization.enum_(["admin", "editor", "viewer"]);

export declare namespace BodyShareWorkspaceResourceV1WorkspaceResourcesResourceIdSharePostRole {
    export type Raw = "admin" | "editor" | "viewer";
}
