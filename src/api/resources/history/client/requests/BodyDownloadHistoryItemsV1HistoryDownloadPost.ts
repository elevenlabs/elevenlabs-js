/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * @example
 *     {
 *         history_item_ids: []
 *     }
 */
export interface BodyDownloadHistoryItemsV1HistoryDownloadPost {
    /** A list of history items to download, you can get IDs of history items and other metadata using the GET https://api.elevenlabs.io/v1/history endpoint. */
    history_item_ids: string[];
}
