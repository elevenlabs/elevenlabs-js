/**
 * This file was auto-generated by Fern from our API Definition.
 */

export interface ManualVerificationFileResponse {
    /** The ID of the file. */
    file_id: string;
    /** The name of the file. */
    file_name: string;
    /** The MIME type of the file. */
    mime_type: string;
    /** The size of the file in bytes. */
    size_bytes: number;
    /** The date of the file in Unix time. */
    upload_date_unix: number;
}
