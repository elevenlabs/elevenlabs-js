/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface Model {
    /** The unique identifier of the model. */
    model_id: string;
    /** The name of the model. */
    name?: string;
    /** Whether the model can be finetuned. */
    can_be_finetuned?: boolean;
    /** Whether the model can do text-to-speech. */
    can_do_text_to_speech?: boolean;
    /** Whether the model can do voice conversion. */
    can_do_voice_conversion?: boolean;
    /** Whether the model can use style. */
    can_use_style?: boolean;
    /** Whether the model can use speaker boost. */
    can_use_speaker_boost?: boolean;
    /** Whether the model serves pro voices. */
    serves_pro_voices?: boolean;
    /** The cost factor for the model. */
    token_cost_factor?: number;
    /** The description of the model. */
    description?: string;
    /** Whether the model requires alpha access. */
    requires_alpha_access?: boolean;
    /** The maximum number of characters that can be requested by a free user. */
    max_characters_request_free_user?: number;
    /** The maximum number of characters that can be requested by a subscribed user. */
    max_characters_request_subscribed_user?: number;
    /** The maximum length of text that can be requested for this model. */
    maximum_text_length_per_request?: number;
    /** The languages supported by the model. */
    languages?: ElevenLabs.LanguageResponse[];
    /** The rates for the model. */
    model_rates?: ElevenLabs.ModelRatesResponseModel;
    /** The concurrency group for the model. */
    concurrency_group?: ElevenLabs.ModelResponseModelConcurrencyGroup;
}
