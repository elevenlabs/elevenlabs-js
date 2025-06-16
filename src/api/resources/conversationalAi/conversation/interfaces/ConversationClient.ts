export interface ConversationClient {
    conversationalAi: {
        conversations: {
            getSignedUrl(params: { agentId: string }): Promise<{ signedUrl: string }>;
        };
    };
} 