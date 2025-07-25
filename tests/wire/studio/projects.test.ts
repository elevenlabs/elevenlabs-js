/**
 * This file was auto-generated by Fern from our API Definition.
 */

import { mockServerPool } from "../../mock-server/MockServerPool";
import { ElevenLabsClient } from "../../../src/Client";

describe("Projects", () => {
    test("list", async () => {
        const server = mockServerPool.createServer();
        const client = new ElevenLabsClient({ apiKey: "test", environment: server.baseUrl });

        const rawResponseBody = {
            projects: [
                {
                    project_id: "aw1NgEzBg83R7vgmiJt6",
                    name: "My Project",
                    create_date_unix: 1714204800,
                    default_title_voice_id: "JBFqnCBsd6RMkjVDRZzb",
                    default_paragraph_voice_id: "JBFqnCBsd6RMkjVDRZzb",
                    default_model_id: "eleven_multilingual_v2",
                    last_conversion_date_unix: 1714204800,
                    can_be_downloaded: true,
                    title: "My Project",
                    author: "John Doe",
                    description: "This is a description of my project.",
                    genres: ["Novel", "Short Story"],
                    cover_image_url: "https://example.com/cover.jpg",
                    target_audience: "young adult",
                    language: "en",
                    content_type: "Novel",
                    original_publication_date: "2025-01-01",
                    mature_content: false,
                    isbn_number: "978-90-274-3964-2",
                    volume_normalization: true,
                    state: "default",
                    access_level: "viewer",
                    fiction: "fiction",
                    quality_check_on: false,
                    quality_check_on_when_bulk_convert: false,
                    creation_meta: { creation_progress: 0.5, status: "pending", type: "blank" },
                    source_type: "blank",
                    chapters_enabled: true,
                },
            ],
        };
        server
            .mockEndpoint()
            .get("/v1/studio/projects")
            .respondWith()
            .statusCode(200)
            .jsonBody(rawResponseBody)
            .build();

        const response = await client.studio.projects.list();
        expect(response).toEqual({
            projects: [
                {
                    projectId: "aw1NgEzBg83R7vgmiJt6",
                    name: "My Project",
                    createDateUnix: 1714204800,
                    defaultTitleVoiceId: "JBFqnCBsd6RMkjVDRZzb",
                    defaultParagraphVoiceId: "JBFqnCBsd6RMkjVDRZzb",
                    defaultModelId: "eleven_multilingual_v2",
                    lastConversionDateUnix: 1714204800,
                    canBeDownloaded: true,
                    title: "My Project",
                    author: "John Doe",
                    description: "This is a description of my project.",
                    genres: ["Novel", "Short Story"],
                    coverImageUrl: "https://example.com/cover.jpg",
                    targetAudience: "young adult",
                    language: "en",
                    contentType: "Novel",
                    originalPublicationDate: "2025-01-01",
                    matureContent: false,
                    isbnNumber: "978-90-274-3964-2",
                    volumeNormalization: true,
                    state: "default",
                    accessLevel: "viewer",
                    fiction: "fiction",
                    qualityCheckOn: false,
                    qualityCheckOnWhenBulkConvert: false,
                    creationMeta: {
                        creationProgress: 0.5,
                        status: "pending",
                        type: "blank",
                    },
                    sourceType: "blank",
                    chaptersEnabled: true,
                },
            ],
        });
    });

    test("get", async () => {
        const server = mockServerPool.createServer();
        const client = new ElevenLabsClient({ apiKey: "test", environment: server.baseUrl });

        const rawResponseBody = {
            project_id: "aw1NgEzBg83R7vgmiJt6",
            name: "My Project",
            create_date_unix: 1714204800,
            default_title_voice_id: "JBFqnCBsd6RMkjVDRZzb",
            default_paragraph_voice_id: "JBFqnCBsd6RMkjVDRZzb",
            default_model_id: "eleven_multilingual_v2",
            last_conversion_date_unix: 1714204800,
            can_be_downloaded: true,
            title: "My Project",
            author: "John Doe",
            description: "This is a description of my project.",
            genres: ["Novel", "Short Story"],
            cover_image_url: "https://example.com/cover.jpg",
            target_audience: "young adult",
            language: "en",
            content_type: "Novel",
            original_publication_date: "2025-01-01",
            mature_content: false,
            isbn_number: "978-90-274-3964-2",
            volume_normalization: true,
            state: "default",
            access_level: "viewer",
            fiction: "fiction",
            quality_check_on: false,
            quality_check_on_when_bulk_convert: false,
            creation_meta: { creation_progress: 0.5, status: "pending", type: "blank" },
            source_type: "blank",
            chapters_enabled: true,
            quality_preset: "standard",
            chapters: [
                {
                    chapter_id: "aw1NgEzBg83R7vgmiJt6",
                    name: "Chapter 1",
                    last_conversion_date_unix: 1714204800,
                    conversion_progress: 0.5,
                    can_be_downloaded: true,
                    state: "converting",
                    has_video: true,
                    statistics: {
                        characters_unconverted: 1000,
                        characters_converted: 500,
                        paragraphs_converted: 20,
                        paragraphs_unconverted: 10,
                    },
                    last_conversion_error: "Error message",
                },
            ],
            pronunciation_dictionary_versions: [
                {
                    version_id: "version_id",
                    version_rules_num: 1,
                    pronunciation_dictionary_id: "pronunciation_dictionary_id",
                    dictionary_name: "dictionary_name",
                    version_name: "version_name",
                    permission_on_resource: "admin",
                    created_by: "created_by",
                    creation_time_unix: 1,
                    archived_time_unix: 1,
                },
            ],
            pronunciation_dictionary_locators: [
                { pronunciation_dictionary_id: "pronunciation_dictionary_id", version_id: "version_id" },
            ],
            apply_text_normalization: "auto",
            experimental: { key: "value" },
        };
        server
            .mockEndpoint()
            .get("/v1/studio/projects/21m00Tcm4TlvDq8ikWAM")
            .respondWith()
            .statusCode(200)
            .jsonBody(rawResponseBody)
            .build();

        const response = await client.studio.projects.get("21m00Tcm4TlvDq8ikWAM");
        expect(response).toEqual({
            projectId: "aw1NgEzBg83R7vgmiJt6",
            name: "My Project",
            createDateUnix: 1714204800,
            defaultTitleVoiceId: "JBFqnCBsd6RMkjVDRZzb",
            defaultParagraphVoiceId: "JBFqnCBsd6RMkjVDRZzb",
            defaultModelId: "eleven_multilingual_v2",
            lastConversionDateUnix: 1714204800,
            canBeDownloaded: true,
            title: "My Project",
            author: "John Doe",
            description: "This is a description of my project.",
            genres: ["Novel", "Short Story"],
            coverImageUrl: "https://example.com/cover.jpg",
            targetAudience: "young adult",
            language: "en",
            contentType: "Novel",
            originalPublicationDate: "2025-01-01",
            matureContent: false,
            isbnNumber: "978-90-274-3964-2",
            volumeNormalization: true,
            state: "default",
            accessLevel: "viewer",
            fiction: "fiction",
            qualityCheckOn: false,
            qualityCheckOnWhenBulkConvert: false,
            creationMeta: {
                creationProgress: 0.5,
                status: "pending",
                type: "blank",
            },
            sourceType: "blank",
            chaptersEnabled: true,
            qualityPreset: "standard",
            chapters: [
                {
                    chapterId: "aw1NgEzBg83R7vgmiJt6",
                    name: "Chapter 1",
                    lastConversionDateUnix: 1714204800,
                    conversionProgress: 0.5,
                    canBeDownloaded: true,
                    state: "converting",
                    hasVideo: true,
                    statistics: {
                        charactersUnconverted: 1000,
                        charactersConverted: 500,
                        paragraphsConverted: 20,
                        paragraphsUnconverted: 10,
                    },
                    lastConversionError: "Error message",
                },
            ],
            pronunciationDictionaryVersions: [
                {
                    versionId: "version_id",
                    versionRulesNum: 1,
                    pronunciationDictionaryId: "pronunciation_dictionary_id",
                    dictionaryName: "dictionary_name",
                    versionName: "version_name",
                    permissionOnResource: "admin",
                    createdBy: "created_by",
                    creationTimeUnix: 1,
                    archivedTimeUnix: 1,
                },
            ],
            pronunciationDictionaryLocators: [
                {
                    pronunciationDictionaryId: "pronunciation_dictionary_id",
                    versionId: "version_id",
                },
            ],
            applyTextNormalization: "auto",
            experimental: {
                key: "value",
            },
        });
    });

    test("update", async () => {
        const server = mockServerPool.createServer();
        const client = new ElevenLabsClient({ apiKey: "test", environment: server.baseUrl });
        const rawRequestBody = {
            name: "Project 1",
            default_title_voice_id: "21m00Tcm4TlvDq8ikWAM",
            default_paragraph_voice_id: "21m00Tcm4TlvDq8ikWAM",
        };
        const rawResponseBody = {
            project: {
                project_id: "aw1NgEzBg83R7vgmiJt6",
                name: "My Project",
                create_date_unix: 1714204800,
                default_title_voice_id: "JBFqnCBsd6RMkjVDRZzb",
                default_paragraph_voice_id: "JBFqnCBsd6RMkjVDRZzb",
                default_model_id: "eleven_multilingual_v2",
                last_conversion_date_unix: 1714204800,
                can_be_downloaded: true,
                title: "My Project",
                author: "John Doe",
                description: "This is a description of my project.",
                genres: ["Novel", "Short Story"],
                cover_image_url: "https://example.com/cover.jpg",
                target_audience: "young adult",
                language: "en",
                content_type: "Novel",
                original_publication_date: "2025-01-01",
                mature_content: false,
                isbn_number: "978-90-274-3964-2",
                volume_normalization: true,
                state: "default",
                access_level: "viewer",
                fiction: "fiction",
                quality_check_on: false,
                quality_check_on_when_bulk_convert: false,
                creation_meta: { creation_progress: 0.5, status: "pending", type: "blank" },
                source_type: "blank",
                chapters_enabled: true,
            },
        };
        server
            .mockEndpoint()
            .post("/v1/studio/projects/21m00Tcm4TlvDq8ikWAM")
            .jsonBody(rawRequestBody)
            .respondWith()
            .statusCode(200)
            .jsonBody(rawResponseBody)
            .build();

        const response = await client.studio.projects.update("21m00Tcm4TlvDq8ikWAM", {
            name: "Project 1",
            defaultTitleVoiceId: "21m00Tcm4TlvDq8ikWAM",
            defaultParagraphVoiceId: "21m00Tcm4TlvDq8ikWAM",
        });
        expect(response).toEqual({
            project: {
                projectId: "aw1NgEzBg83R7vgmiJt6",
                name: "My Project",
                createDateUnix: 1714204800,
                defaultTitleVoiceId: "JBFqnCBsd6RMkjVDRZzb",
                defaultParagraphVoiceId: "JBFqnCBsd6RMkjVDRZzb",
                defaultModelId: "eleven_multilingual_v2",
                lastConversionDateUnix: 1714204800,
                canBeDownloaded: true,
                title: "My Project",
                author: "John Doe",
                description: "This is a description of my project.",
                genres: ["Novel", "Short Story"],
                coverImageUrl: "https://example.com/cover.jpg",
                targetAudience: "young adult",
                language: "en",
                contentType: "Novel",
                originalPublicationDate: "2025-01-01",
                matureContent: false,
                isbnNumber: "978-90-274-3964-2",
                volumeNormalization: true,
                state: "default",
                accessLevel: "viewer",
                fiction: "fiction",
                qualityCheckOn: false,
                qualityCheckOnWhenBulkConvert: false,
                creationMeta: {
                    creationProgress: 0.5,
                    status: "pending",
                    type: "blank",
                },
                sourceType: "blank",
                chaptersEnabled: true,
            },
        });
    });

    test("delete", async () => {
        const server = mockServerPool.createServer();
        const client = new ElevenLabsClient({ apiKey: "test", environment: server.baseUrl });

        const rawResponseBody = { status: "ok" };
        server
            .mockEndpoint()
            .delete("/v1/studio/projects/21m00Tcm4TlvDq8ikWAM")
            .respondWith()
            .statusCode(200)
            .jsonBody(rawResponseBody)
            .build();

        const response = await client.studio.projects.delete("21m00Tcm4TlvDq8ikWAM");
        expect(response).toEqual({
            status: "ok",
        });
    });

    test("convert", async () => {
        const server = mockServerPool.createServer();
        const client = new ElevenLabsClient({ apiKey: "test", environment: server.baseUrl });

        const rawResponseBody = { status: "ok" };
        server
            .mockEndpoint()
            .post("/v1/studio/projects/21m00Tcm4TlvDq8ikWAM/convert")
            .respondWith()
            .statusCode(200)
            .jsonBody(rawResponseBody)
            .build();

        const response = await client.studio.projects.convert("21m00Tcm4TlvDq8ikWAM");
        expect(response).toEqual({
            status: "ok",
        });
    });
});
