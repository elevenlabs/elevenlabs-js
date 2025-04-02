/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface Subscription {
    /** The tier of the user's subscription. */
    tier: string;
    /** The number of characters used by the user. */
    character_count: number;
    /** The maximum number of characters allowed in the current billing period. */
    character_limit: number;
    /** Maximum number of characters that the character limit can be exceeded by. Managed by the workspace admin. */
    max_character_limit_extension?: number;
    /** Whether the user can extend their character limit. */
    can_extend_character_limit: boolean;
    /** Whether the user is allowed to extend their character limit. */
    allowed_to_extend_character_limit: boolean;
    /** The Unix timestamp of the next character count reset. */
    next_character_count_reset_unix?: number;
    /** The number of voice slots used by the user. */
    voice_slots_used?: number;
    /** The number of professional voice slots used by the workspace/user if single seat. */
    professional_voice_slots_used?: number;
    /** The maximum number of voice slots allowed for the user. */
    voice_limit: number;
    /** The maximum number of voice add/edits allowed for the user. */
    max_voice_add_edits?: number;
    /** The number of voice add/edits used by the user. */
    voice_add_edit_counter?: number;
    /** The maximum number of professional voices allowed for the user. */
    professional_voice_limit: number;
    /** Whether the user can extend their voice limit. */
    can_extend_voice_limit: boolean;
    /** Whether the user can use instant voice cloning. */
    can_use_instant_voice_cloning: boolean;
    /** Whether the user can use professional voice cloning. */
    can_use_professional_voice_cloning: boolean;
    /** The currency of the user's subscription. */
    currency?: ElevenLabs.ExtendedSubscriptionResponseModelCurrency;
    /** The status of the user's subscription. */
    status?: ElevenLabs.SubscriptionStatus;
    /** The billing period of the user's subscription. */
    billing_period?: ElevenLabs.ExtendedSubscriptionResponseModelBillingPeriod;
    /** The character refresh period of the user's subscription. */
    character_refresh_period?: ElevenLabs.ExtendedSubscriptionResponseModelCharacterRefreshPeriod;
    /** The next invoice for the user. */
    next_invoice?: ElevenLabs.Invoice;
    /** Whether the user has open invoices. */
    has_open_invoices?: boolean;
}
