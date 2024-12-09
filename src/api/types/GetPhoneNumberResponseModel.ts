/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface GetPhoneNumberResponseModel {
    /** Phone number */
    phone_number: string;
    /** Phone provider */
    provider: ElevenLabs.TelephonyProvider;
    /** Label for the phone number */
    label: string;
    phone_number_id: string;
    assigned_agent?: ElevenLabs.PhoneNumberAgentInfo;
}
