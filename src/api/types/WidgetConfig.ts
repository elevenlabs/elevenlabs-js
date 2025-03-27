/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface WidgetConfig {
    /** The variant of the widget */
    variant?: ElevenLabs.EmbedVariant;
    /** Whether the widget is expandable */
    expandable?: ElevenLabs.WidgetExpandable;
    /** The avatar of the widget */
    avatar?: ElevenLabs.WidgetConfigAvatar;
    /** The feedback mode of the widget */
    feedback_mode?: ElevenLabs.WidgetFeedbackMode;
    /** The background color of the widget */
    bg_color?: string;
    /** The text color of the widget */
    text_color?: string;
    /** The button color of the widget */
    btn_color?: string;
    /** The button text color of the widget */
    btn_text_color?: string;
    /** The border color of the widget */
    border_color?: string;
    /** The focus color of the widget */
    focus_color?: string;
    /** The border radius of the widget */
    border_radius?: number;
    /** The button radius of the widget */
    btn_radius?: number;
    /** The action text of the widget */
    action_text?: string;
    /** The start call text of the widget */
    start_call_text?: string;
    /** The end call text of the widget */
    end_call_text?: string;
    /** The expand text of the widget */
    expand_text?: string;
    /** The text to display when the agent is listening */
    listening_text?: string;
    /** The text to display when the agent is speaking */
    speaking_text?: string;
    /** The text to display when sharing */
    shareable_page_text?: string;
    /** Whether to show terms and conditions on the shareable page */
    shareable_page_show_terms?: boolean;
    /** The text to display for terms and conditions */
    terms_text?: string;
    /** The HTML to display for terms and conditions */
    terms_html?: string;
    /** The key to display for terms and conditions */
    terms_key?: string;
    /** Whether to show the avatar when the widget is collapsed */
    show_avatar_when_collapsed?: boolean;
    /** Whether to disable the banner */
    disable_banner?: boolean;
    /** Whether to enable mic muting */
    mic_muting_enabled?: boolean;
    /** Whether to show the language selector */
    language_selector?: boolean;
    /** The custom avatar path */
    custom_avatar_path?: string;
}
