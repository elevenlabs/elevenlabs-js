/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface TaskInstanceEventResponseModel {
    timestamp: string;
    kind: ElevenLabs.TaskInstanceEventKind;
    meta?: Record<string, string>;
}
