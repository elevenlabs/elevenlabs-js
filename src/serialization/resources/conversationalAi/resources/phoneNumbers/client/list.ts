/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../../../../index";
import * as ElevenLabs from "../../../../../../api/index";
import * as core from "../../../../../../core";
import { PhoneNumbersListResponseItem } from "../types/PhoneNumbersListResponseItem";

export const Response: core.serialization.Schema<
    serializers.conversationalAi.phoneNumbers.list.Response.Raw,
    ElevenLabs.conversationalAi.PhoneNumbersListResponseItem[]
> = core.serialization.list(PhoneNumbersListResponseItem);

export declare namespace Response {
    export type Raw = PhoneNumbersListResponseItem.Raw[];
}
