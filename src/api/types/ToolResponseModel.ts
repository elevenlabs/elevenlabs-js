/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface ToolResponseModel {
    id: string;
    tool_config: ElevenLabs.ToolResponseModelToolConfig;
    dependent_agents: ElevenLabs.ToolResponseModelDependentAgentsItem[];
}
