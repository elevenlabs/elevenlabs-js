/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * @example
 *     {}
 */
export interface DocumentsDeleteRequest {
    /**
     * If set to true, the document will be deleted regardless of whether it is used by any agents and it will be deleted from the dependent agents.
     */
    force?: boolean;
}
