/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * @example
 *     {
 *         phone_number: "phone_number",
 *         provider: "twilio",
 *         label: "label",
 *         sid: "sid",
 *         token: "token"
 *     }
 */
export interface CreatePhoneNumberRequest {
    /** Phone number */
    phone_number: string;
    /** Label for the phone number */
    label: string;
    /** Twilio Account SID */
    sid: string;
    /** Twilio Token */
    token: string;
}