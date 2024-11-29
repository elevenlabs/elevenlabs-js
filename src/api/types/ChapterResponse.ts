/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface ChapterResponse {
    chapter_id: string;
    name: string;
    last_conversion_date_unix?: number;
    conversion_progress?: number;
    can_be_downloaded: boolean;
    state: ElevenLabs.ChapterState;
    statistics?: ElevenLabs.ChapterStatisticsResponse;
    last_conversion_error?: string;
}
