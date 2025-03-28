/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * @example
 *     {}
 */
export interface ConversationalAiGetAgentsRequest {
    /**
     * Used for fetching next page. Cursor is returned in the response.
     */
    cursor?: string;
    /**
     * How many Agents to return at maximum. Can not exceed 100, defaults to 30.
     */
    page_size?: number;
    /**
     * Search by agents name.
     */
    search?: string;
}
