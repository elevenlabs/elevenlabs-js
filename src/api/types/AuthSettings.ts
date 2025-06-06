/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface AuthSettings {
    /** If set to true, starting a conversation with an agent will require a signed token */
    enableAuth?: boolean;
    /** A list of hosts that are allowed to start conversations with the agent */
    allowlist?: ElevenLabs.AllowlistItem[];
    /** A shareable token that can be used to start a conversation with the agent */
    shareableToken?: string;
}
