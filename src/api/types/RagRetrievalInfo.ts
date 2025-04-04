/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface RagRetrievalInfo {
    chunks: ElevenLabs.RagChunkMetadata[];
    embedding_model: ElevenLabs.EmbeddingModelEnum;
    retrieval_query: string;
    rag_latency_secs: number;
}
