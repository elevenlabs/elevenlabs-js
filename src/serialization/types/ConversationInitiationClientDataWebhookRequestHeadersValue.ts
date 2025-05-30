/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";
import { ConvAiSecretLocator } from "./ConvAiSecretLocator";

export const ConversationInitiationClientDataWebhookRequestHeadersValue: core.serialization.Schema<
    serializers.ConversationInitiationClientDataWebhookRequestHeadersValue.Raw,
    ElevenLabs.ConversationInitiationClientDataWebhookRequestHeadersValue
> = core.serialization.undiscriminatedUnion([core.serialization.string(), ConvAiSecretLocator]);

export declare namespace ConversationInitiationClientDataWebhookRequestHeadersValue {
    export type Raw = string | ConvAiSecretLocator.Raw;
}
