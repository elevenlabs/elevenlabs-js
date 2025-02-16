/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * A locator for other documents to be able to reference a specific dictionary and it's version.
 * This is a pydantic version of PronunciationDictionaryVersionLocatorDBModel.
 * Required to ensure compat with the rest of the agent data models.
 */
export interface PydanticPronunciationDictionaryVersionLocator {
    pronunciation_dictionary_id: string;
    version_id: string;
}
