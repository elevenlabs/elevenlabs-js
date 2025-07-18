/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";
import { SipTrunkTransportEnum } from "./SipTrunkTransportEnum";
import { SipMediaEncryptionEnum } from "./SipMediaEncryptionEnum";
import { SipTrunkCredentialsRequestModel } from "./SipTrunkCredentialsRequestModel";

export const OutboundSipTrunkConfigRequestModel: core.serialization.ObjectSchema<
    serializers.OutboundSipTrunkConfigRequestModel.Raw,
    ElevenLabs.OutboundSipTrunkConfigRequestModel
> = core.serialization.object({
    address: core.serialization.string(),
    transport: SipTrunkTransportEnum.optional(),
    mediaEncryption: core.serialization.property("media_encryption", SipMediaEncryptionEnum.optional()),
    headers: core.serialization.record(core.serialization.string(), core.serialization.string()).optional(),
    credentials: SipTrunkCredentialsRequestModel.optional(),
});

export declare namespace OutboundSipTrunkConfigRequestModel {
    export interface Raw {
        address: string;
        transport?: SipTrunkTransportEnum.Raw | null;
        media_encryption?: SipMediaEncryptionEnum.Raw | null;
        headers?: Record<string, string> | null;
        credentials?: SipTrunkCredentialsRequestModel.Raw | null;
    }
}
