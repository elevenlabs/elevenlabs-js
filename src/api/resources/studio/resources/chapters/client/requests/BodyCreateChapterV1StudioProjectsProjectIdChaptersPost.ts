/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * @example
 *     {
 *         name: "name"
 *     }
 */
export interface BodyCreateChapterV1StudioProjectsProjectIdChaptersPost {
    /** The name of the chapter, used for identification only. */
    name: string;
    /** An optional URL from which we will extract content to initialize the Studio project. If this is set, 'from_url' must be null. If neither 'from_url' or 'from_document' are provided we will initialize the Studio project as blank. */
    from_url?: string;
}
