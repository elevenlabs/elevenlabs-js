/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";
import { EndCallToolConfig } from "./EndCallToolConfig";
import { LanguageDetectionToolConfig } from "./LanguageDetectionToolConfig";
import { SkipTurnToolConfig } from "./SkipTurnToolConfig";
import { TransferToAgentToolConfig } from "./TransferToAgentToolConfig";
import { TransferToNumberToolConfig } from "./TransferToNumberToolConfig";

export const SystemToolConfigInputParams: core.serialization.Schema<
    serializers.SystemToolConfigInputParams.Raw,
    ElevenLabs.SystemToolConfigInputParams
> = core.serialization
    .union(core.serialization.discriminant("systemToolType", "system_tool_type"), {
        end_call: EndCallToolConfig,
        language_detection: LanguageDetectionToolConfig,
        skip_turn: SkipTurnToolConfig,
        transfer_to_agent: TransferToAgentToolConfig,
        transfer_to_number: TransferToNumberToolConfig,
    })
    .transform<ElevenLabs.SystemToolConfigInputParams>({
        transform: (value) => value,
        untransform: (value) => value,
    });

export declare namespace SystemToolConfigInputParams {
    export type Raw =
        | SystemToolConfigInputParams.EndCall
        | SystemToolConfigInputParams.LanguageDetection
        | SystemToolConfigInputParams.SkipTurn
        | SystemToolConfigInputParams.TransferToAgent
        | SystemToolConfigInputParams.TransferToNumber;

    export interface EndCall extends EndCallToolConfig.Raw {
        system_tool_type: "end_call";
    }

    export interface LanguageDetection extends LanguageDetectionToolConfig.Raw {
        system_tool_type: "language_detection";
    }

    export interface SkipTurn extends SkipTurnToolConfig.Raw {
        system_tool_type: "skip_turn";
    }

    export interface TransferToAgent extends TransferToAgentToolConfig.Raw {
        system_tool_type: "transfer_to_agent";
    }

    export interface TransferToNumber extends TransferToNumberToolConfig.Raw {
        system_tool_type: "transfer_to_number";
    }
}
