/**
 * This file was auto-generated by Fern from our API Definition.
 */

export type ClientEvent =
    | "conversation_initiation_metadata"
    | "asr_initiation_metadata"
    | "ping"
    | "audio"
    | "interruption"
    | "user_transcript"
    | "agent_response"
    | "agent_response_correction"
    | "client_tool_call"
    | "vad_score"
    | "internal_turn_probability"
    | "internal_tentative_agent_response";
export const ClientEvent = {
    ConversationInitiationMetadata: "conversation_initiation_metadata",
    AsrInitiationMetadata: "asr_initiation_metadata",
    Ping: "ping",
    Audio: "audio",
    Interruption: "interruption",
    UserTranscript: "user_transcript",
    AgentResponse: "agent_response",
    AgentResponseCorrection: "agent_response_correction",
    ClientToolCall: "client_tool_call",
    VadScore: "vad_score",
    InternalTurnProbability: "internal_turn_probability",
    InternalTentativeAgentResponse: "internal_tentative_agent_response",
} as const;
