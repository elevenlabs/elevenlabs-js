/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";

export const AuthorizationMethod: core.serialization.Schema<
    serializers.AuthorizationMethod.Raw,
    ElevenLabs.AuthorizationMethod
> = core.serialization.enum_([
    "invalid",
    "public",
    "authorization_header",
    "signed_url",
    "shareable_link",
    "livekit_token",
    "livekit_token_website",
    "genesys_api_key",
]);

export declare namespace AuthorizationMethod {
    export type Raw =
        | "invalid"
        | "public"
        | "authorization_header"
        | "signed_url"
        | "shareable_link"
        | "livekit_token"
        | "livekit_token_website"
        | "genesys_api_key";
}
