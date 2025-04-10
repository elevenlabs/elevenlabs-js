/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

/**
 * A webhook tool is a tool that calls an external webhook from our server
 */
export interface WebhookToolConfigOutput {
    id?: string;
    name: string;
    description: string;
    /** The schema for the outgoing webhoook, including parameters and URL specification */
    api_schema: ElevenLabs.WebhookToolApiSchemaConfigOutput;
    /** Configuration for dynamic variables */
    dynamic_variables?: ElevenLabs.DynamicVariablesConfig;
}
