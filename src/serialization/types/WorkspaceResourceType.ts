/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";

export const WorkspaceResourceType: core.serialization.Schema<
    serializers.WorkspaceResourceType.Raw,
    ElevenLabs.WorkspaceResourceType
> = core.serialization.enum_([
    "voice",
    "voice_collection",
    "pronunciation_dictionary",
    "dubbing",
    "project",
    "convai_agents",
    "convai_knowledge_base_documents",
    "convai_tools",
    "convai_settings",
    "convai_secrets",
    "music_latent",
    "convai_phone_numbers",
    "convai_mcps",
    "convai_batch_calls",
]);

export declare namespace WorkspaceResourceType {
    export type Raw =
        | "voice"
        | "voice_collection"
        | "pronunciation_dictionary"
        | "dubbing"
        | "project"
        | "convai_agents"
        | "convai_knowledge_base_documents"
        | "convai_tools"
        | "convai_settings"
        | "convai_secrets"
        | "music_latent"
        | "convai_phone_numbers"
        | "convai_mcps"
        | "convai_batch_calls";
}
