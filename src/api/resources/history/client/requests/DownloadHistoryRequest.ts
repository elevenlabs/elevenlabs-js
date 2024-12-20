/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * @example
 *     {
 *         history_item_ids: ["HISTORY_ITEM_ID"]
 *     }
 */
export interface DownloadHistoryRequest {
    /** A list of history items to download, you can get IDs of history items and other metadata using the GET https://api.elevenlabs.io/v1/history endpoint. */
    history_item_ids: string[];
    /** Output format to transcode the audio file, can be wav or default. */
    output_format?: string;
}
