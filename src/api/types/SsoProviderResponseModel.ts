/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface SsoProviderResponseModel {
    provider_type: ElevenLabs.SsoProviderResponseModelProviderType;
    provider_id: string;
    domains: string[];
}
