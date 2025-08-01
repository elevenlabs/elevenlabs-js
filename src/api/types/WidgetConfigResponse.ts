/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface WidgetConfigResponse {
    /** The variant of the widget */
    variant?: ElevenLabs.EmbedVariant;
    /** The placement of the widget on the screen */
    placement?: ElevenLabs.WidgetPlacement;
    /** Whether the widget is expandable */
    expandable?: ElevenLabs.WidgetExpandable;
    /** The avatar of the widget */
    avatar?: ElevenLabs.WidgetConfigResponseModelAvatar;
    /** The feedback mode of the widget */
    feedbackMode?: ElevenLabs.WidgetFeedbackMode;
    /** The background color of the widget */
    bgColor?: string;
    /** The text color of the widget */
    textColor?: string;
    /** The button color of the widget */
    btnColor?: string;
    /** The button text color of the widget */
    btnTextColor?: string;
    /** The border color of the widget */
    borderColor?: string;
    /** The focus color of the widget */
    focusColor?: string;
    /** The border radius of the widget */
    borderRadius?: number;
    /** The button radius of the widget */
    btnRadius?: number;
    /** The action text of the widget */
    actionText?: string;
    /** The start call text of the widget */
    startCallText?: string;
    /** The end call text of the widget */
    endCallText?: string;
    /** The expand text of the widget */
    expandText?: string;
    /** The text to display when the agent is listening */
    listeningText?: string;
    /** The text to display when the agent is speaking */
    speakingText?: string;
    /** The text to display when sharing */
    shareablePageText?: string;
    /** Whether to show terms and conditions on the shareable page */
    shareablePageShowTerms?: boolean;
    /** The text to display for terms and conditions */
    termsText?: string;
    /** The HTML to display for terms and conditions */
    termsHtml?: string;
    /** The key to display for terms and conditions */
    termsKey?: string;
    /** Whether to show the avatar when the widget is collapsed */
    showAvatarWhenCollapsed?: boolean;
    /** Whether to disable the banner */
    disableBanner?: boolean;
    /** The override link for the widget */
    overrideLink?: string;
    /** Whether to enable mic muting */
    micMutingEnabled?: boolean;
    /** Whether the widget should show the conversation transcript as it goes on */
    transcriptEnabled?: boolean;
    /** Whether the user should be able to send text messages */
    textInputEnabled?: boolean;
    /** Text contents of the widget */
    textContents?: ElevenLabs.WidgetTextContents;
    /** Styles for the widget */
    styles?: ElevenLabs.WidgetStyles;
    language: string;
    supportedLanguageOverrides?: string[];
    /** Language presets for the widget */
    languagePresets?: Record<string, ElevenLabs.WidgetLanguagePresetResponse>;
    /** Whether the agent uses text-only mode */
    textOnly?: boolean;
    /** Whether the agent can be switched to text-only mode */
    supportsTextOnly?: boolean;
    firstMessage?: string;
}
