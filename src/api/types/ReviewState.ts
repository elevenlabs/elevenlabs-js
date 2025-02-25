/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * An enumeration.
 */
export type ReviewState = "unclaimed" | "claimed" | "submitted" | "done" | "rejected" | "in_progress";
export const ReviewState = {
    Unclaimed: "unclaimed",
    Claimed: "claimed",
    Submitted: "submitted",
    Done: "done",
    Rejected: "rejected",
    InProgress: "in_progress",
} as const;
