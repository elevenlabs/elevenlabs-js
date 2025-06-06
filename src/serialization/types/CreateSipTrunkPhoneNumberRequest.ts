/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";
import { SipTrunkTransportEnum } from "./SipTrunkTransportEnum";
import { SipMediaEncryptionEnum } from "./SipMediaEncryptionEnum";
import { SipTrunkCredentials } from "./SipTrunkCredentials";

export const CreateSipTrunkPhoneNumberRequest: core.serialization.ObjectSchema<
    serializers.CreateSipTrunkPhoneNumberRequest.Raw,
    ElevenLabs.CreateSipTrunkPhoneNumberRequest
> = core.serialization.object({
    phoneNumber: core.serialization.property("phone_number", core.serialization.string()),
    label: core.serialization.string(),
    terminationUri: core.serialization.property("termination_uri", core.serialization.string()),
    address: core.serialization.string().optional(),
    transport: SipTrunkTransportEnum.optional(),
    mediaEncryption: core.serialization.property("media_encryption", SipMediaEncryptionEnum.optional()),
    headers: core.serialization.record(core.serialization.string(), core.serialization.string()).optional(),
    credentials: SipTrunkCredentials.optional(),
});

export declare namespace CreateSipTrunkPhoneNumberRequest {
    export interface Raw {
        phone_number: string;
        label: string;
        termination_uri: string;
        address?: string | null;
        transport?: SipTrunkTransportEnum.Raw | null;
        media_encryption?: SipMediaEncryptionEnum.Raw | null;
        headers?: Record<string, string> | null;
        credentials?: SipTrunkCredentials.Raw | null;
    }
}
