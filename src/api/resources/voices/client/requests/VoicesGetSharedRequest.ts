/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../../../../index";

/**
 * @example
 *     {
 *         featured: true,
 *         readerAppEnabled: true
 *     }
 */
export interface VoicesGetSharedRequest {
    /**
     * How many shared voices to return at maximum. Can not exceed 100, defaults to 30.
     */
    pageSize?: number;
    /**
     * Voice category used for filtering
     */
    category?: ElevenLabs.VoicesGetSharedRequestCategory;
    /**
     * Gender used for filtering
     */
    gender?: string;
    /**
     * Age used for filtering
     */
    age?: string;
    /**
     * Accent used for filtering
     */
    accent?: string;
    /**
     * Language used for filtering
     */
    language?: string;
    /**
     * Locale used for filtering
     */
    locale?: string;
    /**
     * Search term used for filtering
     */
    search?: string;
    /**
     * Use-case used for filtering
     */
    useCases?: string | string[];
    /**
     * Search term used for filtering
     */
    descriptives?: string | string[];
    /**
     * Filter featured voices
     */
    featured?: boolean;
    /**
     * Filter voices with a minimum notice period of the given number of days.
     */
    minNoticePeriodDays?: number;
    /**
     * Include/exclude voices with custom rates
     */
    includeCustomRates?: boolean;
    /**
     * Include/exclude voices that are live moderated
     */
    includeLiveModerated?: boolean;
    /**
     * Filter voices that are enabled for the reader app
     */
    readerAppEnabled?: boolean;
    /**
     * Filter voices by public owner ID
     */
    ownerId?: string;
    /**
     * Sort criteria
     */
    sort?: string;
    page?: number;
}
