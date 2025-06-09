/**
 * Event types that can be sent from client to orchestrator.
 */
export enum ClientToOrchestratorEvent {
    /** Response to a ping request. */
    PONG = "pong",
    CLIENT_TOOL_RESULT = "client_tool_result",
    CONVERSATION_INITIATION_CLIENT_DATA = "conversation_initiation_client_data",
    FEEDBACK = "feedback",
    /** Non-interrupting content that is sent to the server to update the conversation state. */
    CONTEXTUAL_UPDATE = "contextual_update",
    /** User text message. */
    USER_MESSAGE = "user_message",
    USER_ACTIVITY = "user_activity",
}

/**
 * Base interface for all client-to-orchestrator events.
 */
export interface BaseClientToOrchestratorEvent {
    type: ClientToOrchestratorEvent;
}

/**
 * Event for sending user text messages.
 */
export interface UserMessageClientToOrchestratorEvent extends BaseClientToOrchestratorEvent {
    type: ClientToOrchestratorEvent.USER_MESSAGE;
    text?: string;
}

/**
 * Event for registering user activity (ping to prevent timeout).
 */
export interface UserActivityClientToOrchestratorEvent extends BaseClientToOrchestratorEvent {
    type: ClientToOrchestratorEvent.USER_ACTIVITY;
}

/**
 * Event for sending non-interrupting contextual updates to the conversation state.
 */
export interface ContextualUpdateClientToOrchestratorEvent extends BaseClientToOrchestratorEvent {
    type: ClientToOrchestratorEvent.CONTEXTUAL_UPDATE;
    content: string;
}

/**
 * Event for conversation initiation with client data.
 */
export interface ConversationInitiationClientDataEvent extends BaseClientToOrchestratorEvent {
    type: ClientToOrchestratorEvent.CONVERSATION_INITIATION_CLIENT_DATA;
    custom_llm_extra_body?: Record<string, any>;
    conversation_config_override?: Record<string, any>;
    dynamic_variables?: Record<string, any>;
}

/**
 * Event for client tool results.
 */
export interface ClientToolResultEvent extends BaseClientToOrchestratorEvent {
    type: ClientToOrchestratorEvent.CLIENT_TOOL_RESULT;
    tool_call_id?: string;
    result: any;
    is_error: boolean;
}

/**
 * Event for pong response.
 */
export interface PongEvent extends BaseClientToOrchestratorEvent {
    type: ClientToOrchestratorEvent.PONG;
    event_id: string;
}

/**
 * Event for sending feedback.
 */
export interface FeedbackEvent extends BaseClientToOrchestratorEvent {
    type: ClientToOrchestratorEvent.FEEDBACK;
    feedback: string;
    rating?: number;
}

/**
 * Event for sending user audio chunks.
 */
export interface UserAudioChunkEvent {
    user_audio_chunk: string; // base64 encoded audio
}

/**
 * Union type for all client-to-orchestrator events.
 */
export type ClientToOrchestratorEventUnion =
    | UserMessageClientToOrchestratorEvent
    | UserActivityClientToOrchestratorEvent
    | ContextualUpdateClientToOrchestratorEvent
    | ConversationInitiationClientDataEvent
    | ClientToolResultEvent
    | PongEvent
    | FeedbackEvent; 