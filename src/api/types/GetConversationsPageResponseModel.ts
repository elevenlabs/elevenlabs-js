/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface GetConversationsPageResponseModel {
    conversations: ElevenLabs.ConversationSummaryResponseModel[];
    next_cursor?: string;
    has_more: boolean;
}
