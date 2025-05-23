/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";
import { ConversationInitiationClientDataWebhookRequestHeadersValue } from "./ConversationInitiationClientDataWebhookRequestHeadersValue";

export const ConversationInitiationClientDataWebhook: core.serialization.ObjectSchema<
    serializers.ConversationInitiationClientDataWebhook.Raw,
    ElevenLabs.ConversationInitiationClientDataWebhook
> = core.serialization.object({
    url: core.serialization.string(),
    requestHeaders: core.serialization.property(
        "request_headers",
        core.serialization.record(
            core.serialization.string(),
            ConversationInitiationClientDataWebhookRequestHeadersValue,
        ),
    ),
});

export declare namespace ConversationInitiationClientDataWebhook {
    export interface Raw {
        url: string;
        request_headers: Record<string, ConversationInitiationClientDataWebhookRequestHeadersValue.Raw>;
    }
}
