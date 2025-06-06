/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";
import { ExtendedSubscriptionResponseModelCurrency } from "./ExtendedSubscriptionResponseModelCurrency";
import { SubscriptionStatusType } from "./SubscriptionStatusType";
import { ExtendedSubscriptionResponseModelBillingPeriod } from "./ExtendedSubscriptionResponseModelBillingPeriod";
import { ExtendedSubscriptionResponseModelCharacterRefreshPeriod } from "./ExtendedSubscriptionResponseModelCharacterRefreshPeriod";
import { InvoiceResponse } from "./InvoiceResponse";

export const Subscription: core.serialization.ObjectSchema<serializers.Subscription.Raw, ElevenLabs.Subscription> =
    core.serialization.object({
        tier: core.serialization.string(),
        characterCount: core.serialization.property("character_count", core.serialization.number()),
        characterLimit: core.serialization.property("character_limit", core.serialization.number()),
        maxCharacterLimitExtension: core.serialization.property(
            "max_character_limit_extension",
            core.serialization.number().optional(),
        ),
        canExtendCharacterLimit: core.serialization.property(
            "can_extend_character_limit",
            core.serialization.boolean(),
        ),
        allowedToExtendCharacterLimit: core.serialization.property(
            "allowed_to_extend_character_limit",
            core.serialization.boolean(),
        ),
        nextCharacterCountResetUnix: core.serialization.property(
            "next_character_count_reset_unix",
            core.serialization.number().optional(),
        ),
        voiceSlotsUsed: core.serialization.property("voice_slots_used", core.serialization.number()),
        professionalVoiceSlotsUsed: core.serialization.property(
            "professional_voice_slots_used",
            core.serialization.number(),
        ),
        voiceLimit: core.serialization.property("voice_limit", core.serialization.number()),
        maxVoiceAddEdits: core.serialization.property("max_voice_add_edits", core.serialization.number().optional()),
        voiceAddEditCounter: core.serialization.property("voice_add_edit_counter", core.serialization.number()),
        professionalVoiceLimit: core.serialization.property("professional_voice_limit", core.serialization.number()),
        canExtendVoiceLimit: core.serialization.property("can_extend_voice_limit", core.serialization.boolean()),
        canUseInstantVoiceCloning: core.serialization.property(
            "can_use_instant_voice_cloning",
            core.serialization.boolean(),
        ),
        canUseProfessionalVoiceCloning: core.serialization.property(
            "can_use_professional_voice_cloning",
            core.serialization.boolean(),
        ),
        currency: ExtendedSubscriptionResponseModelCurrency.optional(),
        status: SubscriptionStatusType,
        billingPeriod: core.serialization.property(
            "billing_period",
            ExtendedSubscriptionResponseModelBillingPeriod.optional(),
        ),
        characterRefreshPeriod: core.serialization.property(
            "character_refresh_period",
            ExtendedSubscriptionResponseModelCharacterRefreshPeriod.optional(),
        ),
        nextInvoice: core.serialization.property("next_invoice", InvoiceResponse.optional()),
        hasOpenInvoices: core.serialization.property("has_open_invoices", core.serialization.boolean()),
    });

export declare namespace Subscription {
    export interface Raw {
        tier: string;
        character_count: number;
        character_limit: number;
        max_character_limit_extension?: number | null;
        can_extend_character_limit: boolean;
        allowed_to_extend_character_limit: boolean;
        next_character_count_reset_unix?: number | null;
        voice_slots_used: number;
        professional_voice_slots_used: number;
        voice_limit: number;
        max_voice_add_edits?: number | null;
        voice_add_edit_counter: number;
        professional_voice_limit: number;
        can_extend_voice_limit: boolean;
        can_use_instant_voice_cloning: boolean;
        can_use_professional_voice_cloning: boolean;
        currency?: ExtendedSubscriptionResponseModelCurrency.Raw | null;
        status: SubscriptionStatusType.Raw;
        billing_period?: ExtendedSubscriptionResponseModelBillingPeriod.Raw | null;
        character_refresh_period?: ExtendedSubscriptionResponseModelCharacterRefreshPeriod.Raw | null;
        next_invoice?: InvoiceResponse.Raw | null;
        has_open_invoices: boolean;
    }
}
