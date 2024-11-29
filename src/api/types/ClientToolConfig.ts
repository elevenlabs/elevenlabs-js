/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

/**
 * A client tool is one that sends an event to the user's client to trigger something client side
 */
export interface ClientToolConfig {
    name: string;
    description: string;
    parameters?: ElevenLabs.ObjectJsonSchemaProperty;
    expects_response?: boolean;
    response_timeout_secs?: number;
}
