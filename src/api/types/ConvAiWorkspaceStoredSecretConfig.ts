/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface ConvAiWorkspaceStoredSecretConfig {
    type: "stored";
    secret_id: string;
    name: string;
    used_by: ElevenLabs.ConvAiStoredSecretDependencies;
}
