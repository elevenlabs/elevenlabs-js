/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";
import { EndCallToolConfig } from "./EndCallToolConfig";
import { LanguageDetectionToolConfig } from "./LanguageDetectionToolConfig";
import { TransferToAgentToolConfig } from "./TransferToAgentToolConfig";
import { TransferToNumberToolConfig } from "./TransferToNumberToolConfig";

export const SystemToolConfigOutputParams: core.serialization.Schema<
    serializers.SystemToolConfigOutputParams.Raw,
    ElevenLabs.SystemToolConfigOutputParams
> = core.serialization
    .union(core.serialization.discriminant("systemToolType", "system_tool_type"), {
        end_call: EndCallToolConfig,
        language_detection: LanguageDetectionToolConfig,
        transfer_to_agent: TransferToAgentToolConfig,
        transfer_to_number: TransferToNumberToolConfig,
    })
    .transform<ElevenLabs.SystemToolConfigOutputParams>({
        transform: (value) => value,
        untransform: (value) => value,
    });

export declare namespace SystemToolConfigOutputParams {
    export type Raw =
        | SystemToolConfigOutputParams.EndCall
        | SystemToolConfigOutputParams.LanguageDetection
        | SystemToolConfigOutputParams.TransferToAgent
        | SystemToolConfigOutputParams.TransferToNumber;

    export interface EndCall extends EndCallToolConfig.Raw {
        system_tool_type: "end_call";
    }

    export interface LanguageDetection extends LanguageDetectionToolConfig.Raw {
        system_tool_type: "language_detection";
    }

    export interface TransferToAgent extends TransferToAgentToolConfig.Raw {
        system_tool_type: "transfer_to_agent";
    }

    export interface TransferToNumber extends TransferToNumberToolConfig.Raw {
        system_tool_type: "transfer_to_number";
    }
}
