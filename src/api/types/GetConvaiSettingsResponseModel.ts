/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface GetConvaiSettingsResponseModel {
    conversation_initiation_client_data_webhook?: ElevenLabs.ConversationInitiationClientDataWebhook;
    webhooks?: ElevenLabs.ConvAiWebhooks;
    secrets: ElevenLabs.ConvAiWorkspaceStoredSecretConfig[];
}
