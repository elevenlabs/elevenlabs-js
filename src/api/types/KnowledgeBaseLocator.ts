/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface KnowledgeBaseLocator {
    /** The type of the knowledge base */
    type: ElevenLabs.KnowledgeBaseDocumentType;
    /** The name of the knowledge base */
    name: string;
    /** The ID of the knowledge base */
    id: string;
    /** The usage mode of the knowledge base */
    usageMode?: ElevenLabs.DocumentUsageModeEnum;
}
