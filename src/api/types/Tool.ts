/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

/**
 * Definition for a tool the client can call.
 */
export interface Tool {
    name: string;
    description?: string;
    inputSchema: Record<string, unknown>;
    annotations?: ElevenLabs.ToolAnnotations;
    /** Accepts any additional properties */
    [key: string]: any;
}
