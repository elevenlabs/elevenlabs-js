/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface SubscriptionResponse {
    /** The tier of the user's subscription. */
    tier: string;
    /** The number of characters used by the user. */
    characterCount: number;
    /** The maximum number of characters allowed in the current billing period. */
    characterLimit: number;
    /** Maximum number of characters that the character limit can be exceeded by. Managed by the workspace admin. */
    maxCharacterLimitExtension?: number;
    /** Whether the user can extend their character limit. */
    canExtendCharacterLimit: boolean;
    /** Whether the user is allowed to extend their character limit. */
    allowedToExtendCharacterLimit: boolean;
    /** The Unix timestamp of the next character count reset. */
    nextCharacterCountResetUnix?: number;
    /** The number of voice slots used by the user. */
    voiceSlotsUsed: number;
    /** The number of professional voice slots used by the workspace/user if single seat. */
    professionalVoiceSlotsUsed: number;
    /** The maximum number of voice slots allowed for the user. */
    voiceLimit: number;
    /** The maximum number of voice add/edits allowed for the user. */
    maxVoiceAddEdits?: number;
    /** The number of voice add/edits used by the user. */
    voiceAddEditCounter: number;
    /** The maximum number of professional voices allowed for the user. */
    professionalVoiceLimit: number;
    /** Whether the user can extend their voice limit. */
    canExtendVoiceLimit: boolean;
    /** Whether the user can use instant voice cloning. */
    canUseInstantVoiceCloning: boolean;
    /** Whether the user can use professional voice cloning. */
    canUseProfessionalVoiceCloning: boolean;
    /** The currency of the user's subscription. */
    currency?: ElevenLabs.SubscriptionResponseModelCurrency;
    /** The status of the user's subscription. */
    status: ElevenLabs.SubscriptionStatusType;
    /** The billing period of the user's subscription. */
    billingPeriod?: ElevenLabs.SubscriptionResponseModelBillingPeriod;
    /** The character refresh period of the user's subscription. */
    characterRefreshPeriod?: ElevenLabs.SubscriptionResponseModelCharacterRefreshPeriod;
}
