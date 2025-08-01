/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * Resource types that can be shared in the workspace. The name always need to match the collection names
 */
export type WorkspaceResourceType =
    | "voice"
    | "voice_collection"
    | "pronunciation_dictionary"
    | "dubbing"
    | "project"
    | "convai_agents"
    | "convai_knowledge_base_documents"
    | "convai_tools"
    | "convai_settings"
    | "convai_secrets"
    | "workspace_auth_connections"
    | "music_latent"
    | "convai_phone_numbers"
    | "convai_mcp_servers"
    | "convai_batch_calls"
    | "convai_agent_response_tests";
export const WorkspaceResourceType = {
    Voice: "voice",
    VoiceCollection: "voice_collection",
    PronunciationDictionary: "pronunciation_dictionary",
    Dubbing: "dubbing",
    Project: "project",
    ConvaiAgents: "convai_agents",
    ConvaiKnowledgeBaseDocuments: "convai_knowledge_base_documents",
    ConvaiTools: "convai_tools",
    ConvaiSettings: "convai_settings",
    ConvaiSecrets: "convai_secrets",
    WorkspaceAuthConnections: "workspace_auth_connections",
    MusicLatent: "music_latent",
    ConvaiPhoneNumbers: "convai_phone_numbers",
    ConvaiMcpServers: "convai_mcp_servers",
    ConvaiBatchCalls: "convai_batch_calls",
    ConvaiAgentResponseTests: "convai_agent_response_tests",
} as const;
