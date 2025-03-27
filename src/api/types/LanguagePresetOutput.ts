/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface LanguagePresetOutput {
    /** The overrides for the language preset */
    overrides: ElevenLabs.ConversationConfigClientOverrideOutput;
    /** The translation of the first message */
    first_message_translation?: ElevenLabs.LanguagePresetTranslation;
}
