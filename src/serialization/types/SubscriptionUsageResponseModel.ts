/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";

export const SubscriptionUsageResponseModel: core.serialization.ObjectSchema<
    serializers.SubscriptionUsageResponseModel.Raw,
    ElevenLabs.SubscriptionUsageResponseModel
> = core.serialization.object({
    rolloverCreditsQuota: core.serialization.property("rollover_credits_quota", core.serialization.number()),
    subscriptionCycleCreditsQuota: core.serialization.property(
        "subscription_cycle_credits_quota",
        core.serialization.number(),
    ),
    manuallyGiftedCreditsQuota: core.serialization.property(
        "manually_gifted_credits_quota",
        core.serialization.number(),
    ),
    rolloverCreditsUsed: core.serialization.property("rollover_credits_used", core.serialization.number()),
    subscriptionCycleCreditsUsed: core.serialization.property(
        "subscription_cycle_credits_used",
        core.serialization.number(),
    ),
    manuallyGiftedCreditsUsed: core.serialization.property("manually_gifted_credits_used", core.serialization.number()),
    paidUsageBasedCreditsUsed: core.serialization.property(
        "paid_usage_based_credits_used",
        core.serialization.number(),
    ),
    actualReportedCredits: core.serialization.property("actual_reported_credits", core.serialization.number()),
});

export declare namespace SubscriptionUsageResponseModel {
    export interface Raw {
        rollover_credits_quota: number;
        subscription_cycle_credits_quota: number;
        manually_gifted_credits_quota: number;
        rollover_credits_used: number;
        subscription_cycle_credits_used: number;
        manually_gifted_credits_used: number;
        paid_usage_based_credits_used: number;
        actual_reported_credits: number;
    }
}
