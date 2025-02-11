/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface PromptAgent {
    prompt?: string;
    llm?: ElevenLabs.Llm;
    temperature?: number;
    max_tokens?: number;
    tools?: ElevenLabs.PromptAgentToolsItem[];
    tool_ids?: string[];
    knowledge_base?: ElevenLabs.KnowledgeBaseLocator[];
    knowledge_base_document_ids?: string[];
    custom_llm?: ElevenLabs.CustomLlm;
}
