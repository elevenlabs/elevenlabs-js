/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as fs from "fs";

/**
 * @example
 *     {}
 */
export interface BodyUpdateAudioNativeProjectContentV1AudioNativeProjectIdContentPost {
    file?: File | fs.ReadStream | Blob | undefined;
    /** Whether to auto convert the project to audio or not. */
    autoConvert?: boolean;
    /** Whether to auto publish the new project snapshot after it's converted. */
    autoPublish?: boolean;
}
