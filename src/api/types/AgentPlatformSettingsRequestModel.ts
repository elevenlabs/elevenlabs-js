/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface AgentPlatformSettingsRequestModel {
    /** Settings for authentication */
    auth?: ElevenLabs.AuthSettings;
    /** Settings for evaluation */
    evaluation?: ElevenLabs.EvaluationSettings;
    /** Configuration for the widget */
    widget?: ElevenLabs.WidgetConfig;
    /** Data collection settings */
    data_collection?: Record<string, ElevenLabs.LiteralJsonSchemaProperty>;
    /** Additional overrides for the agent during conversation initiation */
    overrides?: ElevenLabs.ConversationInitiationClientDataConfigInput;
    /** Call limits for the agent */
    call_limits?: ElevenLabs.AgentCallLimits;
    /** Privacy settings for the agent */
    privacy?: ElevenLabs.PrivacyConfig;
    /** Workspace overrides for the agent */
    workspace_overrides?: ElevenLabs.AgentWorkspaceOverridesInput;
}
