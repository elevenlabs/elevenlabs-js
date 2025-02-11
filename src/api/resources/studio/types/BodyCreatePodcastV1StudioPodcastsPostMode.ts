/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../../../index";

/**
 * The type of podcast to generate
 */
export type BodyCreatePodcastV1StudioPodcastsPostMode =
    | ElevenLabs.BodyCreatePodcastV1StudioPodcastsPostMode.Conversation
    | ElevenLabs.BodyCreatePodcastV1StudioPodcastsPostMode.Bulletin;

export namespace BodyCreatePodcastV1StudioPodcastsPostMode {
    export interface Conversation extends ElevenLabs.PodcastConversationMode {
        type: "conversation";
    }

    export interface Bulletin extends ElevenLabs.PodcastBulletinMode {
        type: "bulletin";
    }
}
