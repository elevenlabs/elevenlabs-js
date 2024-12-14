/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../../../../index";

/**
 * @example
 *     {
 *         feedback: "like"
 *     }
 */
export interface BodySendConversationFeedbackV1ConvaiConversationsConversationIdFeedbackPost {
    /** Either 'like' or 'dislike' to indicate the feedback for the conversation. */
    feedback: ElevenLabs.UserFeedbackScore;
}