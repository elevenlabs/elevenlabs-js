/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface SimilarVoice {
    voiceId: string;
    name: string;
    category: ElevenLabs.SimilarVoiceCategory;
    description?: string;
    previewUrl?: string;
}
