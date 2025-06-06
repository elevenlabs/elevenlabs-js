/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";
import { RenderType } from "./RenderType";
import { DubbingMediaReference } from "./DubbingMediaReference";
import { RenderStatus } from "./RenderStatus";

export const Render: core.serialization.ObjectSchema<serializers.Render.Raw, ElevenLabs.Render> =
    core.serialization.object({
        id: core.serialization.string(),
        version: core.serialization.number(),
        language: core.serialization.string().optional(),
        type: RenderType.optional(),
        mediaRef: core.serialization.property("media_ref", DubbingMediaReference.optional()),
        status: RenderStatus,
    });

export declare namespace Render {
    export interface Raw {
        id: string;
        version: number;
        language?: string | null;
        type?: RenderType.Raw | null;
        media_ref?: DubbingMediaReference.Raw | null;
        status: RenderStatus.Raw;
    }
}
