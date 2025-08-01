/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";
import { ForcedAlignmentCharacterResponseModel } from "./ForcedAlignmentCharacterResponseModel";
import { ForcedAlignmentWordResponseModel } from "./ForcedAlignmentWordResponseModel";

export const ForcedAlignmentResponseModel: core.serialization.ObjectSchema<
    serializers.ForcedAlignmentResponseModel.Raw,
    ElevenLabs.ForcedAlignmentResponseModel
> = core.serialization.object({
    characters: core.serialization.list(ForcedAlignmentCharacterResponseModel),
    words: core.serialization.list(ForcedAlignmentWordResponseModel),
    loss: core.serialization.number(),
});

export declare namespace ForcedAlignmentResponseModel {
    export interface Raw {
        characters: ForcedAlignmentCharacterResponseModel.Raw[];
        words: ForcedAlignmentWordResponseModel.Raw[];
        loss: number;
    }
}
