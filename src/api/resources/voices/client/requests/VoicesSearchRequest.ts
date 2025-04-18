/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * @example
 *     {
 *         include_total_count: true
 *     }
 */
export interface VoicesSearchRequest {
    /**
     * The next page token to use for pagination. Returned from the previous request.
     */
    next_page_token?: string;
    /**
     * How many voices to return at maximum. Can not exceed 100, defaults to 10. Page 0 may include more voices due to default voices being included.
     */
    page_size?: number;
    /**
     * Search term to filter voices by. Searches in name, description, labels, category.
     */
    search?: string;
    /**
     * Which field to sort by, one of 'created_at_unix' or 'name'. 'created_at_unix' may not be available for older voices.
     */
    sort?: string;
    /**
     * Which direction to sort the voices in. 'asc' or 'desc'.
     */
    sort_direction?: string;
    /**
     * Type of the voice to filter by. One of 'personal', 'community', 'default', 'workspace'.
     */
    voice_type?: string;
    /**
     * Category of the voice to filter by. One of 'premade', 'cloned', 'generated', 'professional'
     */
    category?: string;
    /**
     * State of the voice's fine tuning to filter by. Applicable only to professional voices clones. One of 'draft', 'not_verified', 'not_started', 'queued', 'fine_tuning', 'fine_tuned', 'failed', 'delayed'
     */
    fine_tuning_state?: string;
    /**
     * Collection ID to filter voices by.
     */
    collection_id?: string;
    /**
     * Whether to include the total count of voices found in the response. Incurs a performance cost.
     */
    include_total_count?: boolean;
}
