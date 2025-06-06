/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";

export const AddPronunciationDictionaryResponseModelPermissionOnResource: core.serialization.Schema<
    serializers.AddPronunciationDictionaryResponseModelPermissionOnResource.Raw,
    ElevenLabs.AddPronunciationDictionaryResponseModelPermissionOnResource
> = core.serialization.enum_(["admin", "editor", "viewer"]);

export declare namespace AddPronunciationDictionaryResponseModelPermissionOnResource {
    export type Raw = "admin" | "editor" | "viewer";
}
