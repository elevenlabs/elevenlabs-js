/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

export interface ProjectResponse {
    /** The ID of the project. */
    project_id: string;
    /** The name of the project. */
    name: string;
    /** The creation date of the project. */
    create_date_unix: number;
    /** The default title voice ID. */
    default_title_voice_id: string;
    /** The default paragraph voice ID. */
    default_paragraph_voice_id: string;
    /** The default model ID. */
    default_model_id: string;
    /** The last conversion date of the project. */
    last_conversion_date_unix?: number;
    /** Whether the project can be downloaded. */
    can_be_downloaded: boolean;
    /** The title of the project. */
    title?: string;
    /** The author of the project. */
    author?: string;
    /** The description of the project. */
    description?: string;
    /** List of genres of the project. */
    genres?: string[];
    /** The cover image URL of the project. */
    cover_image_url?: string;
    /** The target audience of the project. */
    target_audience?: ElevenLabs.ProjectResponseModelTargetAudience;
    /** Two-letter language code (ISO 639-1) of the language of the project. */
    language?: string;
    /** The content type of the project, e.g. 'Novel' or 'Short Story' */
    content_type?: string;
    /** The original publication date of the project. */
    original_publication_date?: string;
    /** Whether the project contains mature content. */
    mature_content?: boolean;
    /** The ISBN number of the project. */
    isbn_number?: string;
    /** Whether the project uses volume normalization. */
    volume_normalization: boolean;
    /** The state of the project. */
    state: ElevenLabs.ProjectState;
    /** The access level of the project. */
    access_level: ElevenLabs.ProjectResponseModelAccessLevel;
    /** Whether the project is fiction. */
    fiction?: ElevenLabs.ProjectResponseModelFiction;
    /** Whether quality check is enabled for this project. */
    quality_check_on: boolean;
    /** Whether quality check is enabled on the project when bulk converting. */
    quality_check_on_when_bulk_convert: boolean;
    /** The creation meta of the project. */
    creation_meta?: ElevenLabs.ProjectCreationMetaResponseModel;
    /** The source type of the project. */
    source_type?: ElevenLabs.ProjectResponseModelSourceType;
}
