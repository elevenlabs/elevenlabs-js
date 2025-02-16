/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface ConversationTokenDbModel {
    agent_id: string;
    conversation_token: string;
    expiration_time_unix_secs?: number;
    purpose?: ElevenLabs.ConversationTokenPurpose;
}
