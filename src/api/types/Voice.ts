/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "..";

export interface Voice {
    voice_id: string;
    name?: string;
    samples?: ElevenLabs.VoiceSample[];
    category?: string;
    fine_tuning?: ElevenLabs.FineTuningResponse;
    labels?: Record<string, string>;
    description?: string;
    preview_url?: string;
    available_for_tiers?: string[];
    settings?: ElevenLabs.VoiceSettings;
    sharing?: ElevenLabs.VoiceSharingResponse;
    high_quality_base_model_ids?: string[];
    safety_control?: ElevenLabs.VoiceResponseModelSafetyControl;
    voice_verification?: ElevenLabs.VoiceVerificationResponse;
}
