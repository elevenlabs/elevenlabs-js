/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as fs from "fs";
import * as ElevenLabs from "../../../../index";

/**
 * @example
 *     {
 *         name: "name"
 *     }
 */
export interface BodyAddAPronunciationDictionaryV1PronunciationDictionariesAddFromFilePost {
    /** The name of the pronunciation dictionary, used for identification only. */
    name: string;
    file?: File | fs.ReadStream | Blob | undefined;
    /** A description of the pronunciation dictionary, used for identification only. */
    description?: string;
    /** Should be one of 'admin', 'editor' or 'viewer'. If not provided, defaults to no access. */
    workspace_access?: ElevenLabs.PronunciationDictionaryAddFromFileRequestWorkspaceAccess;
}
