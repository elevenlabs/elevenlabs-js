/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface GetVoicesV2ResponseModel {
    voices: ElevenLabs.Voice[];
    has_more: boolean;
    total_count: number;
    next_page_token?: string;
}
