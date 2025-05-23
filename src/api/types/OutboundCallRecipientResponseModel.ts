/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface OutboundCallRecipientResponseModel {
    id: string;
    phoneNumber: string;
    status: ElevenLabs.BatchCallRecipientStatus;
    createdAtUnix: number;
    updatedAtUnix: number;
    conversationId?: string;
    conversationInitiationClientData?: ElevenLabs.ConversationInitiationClientDataInternal;
}
