/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface ChapterWithContentResponseModel {
    /** The ID of the chapter. */
    chapter_id: string;
    /** The name of the chapter. */
    name: string;
    /** The last conversion date of the chapter. */
    last_conversion_date_unix?: number;
    /** The conversion progress of the chapter. */
    conversion_progress?: number;
    /** Whether the chapter can be downloaded. */
    can_be_downloaded: boolean;
    /** The state of the chapter. */
    state: ElevenLabs.ChapterWithContentResponseModelState;
    /** The statistics of the chapter. */
    statistics?: ElevenLabs.ChapterStatisticsResponse;
    /** The last conversion error of the chapter. */
    last_conversion_error?: string;
    content: ElevenLabs.ChapterContentResponseModel;
}
