import { Music as GeneratedMusic } from "../api/resources/music/client/Client";
import type * as ElevenLabs from "../api";
import type { CompositionPlan } from "../api/resources/music/resources/compositionPlan/client/Client";
import * as core from "../core";
import type { WithRawResponse } from "../core/fetcher/RawResponse";

export declare namespace Music {
    interface Options extends GeneratedMusic.Options {}
    interface RequestOptions extends GeneratedMusic.RequestOptions {}
}

export interface SongMetadata {
    title: string;
    description: string;
    genres: string[];
    languages: string[];
    is_explicit: boolean;
}

export interface MultipartResponse {
    json: {
        compositionPlan: CompositionPlan;
        songMetadata: SongMetadata;
    };
    audio: Buffer;
    filename: string;
}

export class Music extends GeneratedMusic {
    constructor(options: Music.Options = {}) {
        super(options);
    }

    /**
     * Compose a song from a prompt or a composition plan with detailed response parsing.
     * This method calls composeDetailed and then parses the multipart stream response,
     * extracting both the composition metadata and the audio file.
     * @throws {@link ElevenLabs.UnprocessableEntityError}
     */
    public composeDetailedWithMetadata(
        request: ElevenLabs.BodyComposeMusicWithADetailedResponseV1MusicDetailedPost = {},
        requestOptions?: Music.RequestOptions,
    ): core.HttpResponsePromise<MultipartResponse> {
        return core.HttpResponsePromise.fromPromise(this.__composeDetailedWithMetadata(request, requestOptions));
    }

    private async __composeDetailedWithMetadata(
        request: ElevenLabs.BodyComposeMusicWithADetailedResponseV1MusicDetailedPost = {},
        requestOptions?: Music.RequestOptions,
    ): Promise<WithRawResponse<MultipartResponse>> {
        // Call the parent method to get the stream with raw response
        const { data: stream, rawResponse } = await this.composeDetailed(request, requestOptions).withRawResponse();

        // Parse the stream using the existing parsing method
        const parsedResponse = await this.parseMultipart(stream);

        return { data: parsedResponse, rawResponse };
    }

    /**
     * Reads a ReadableStream containing multipart data and parses it into JSON and audio parts
     * @param stream - ReadableStream from ElevenLabs music API response
     * @returns Object containing parsed JSON metadata, audio Buffer, and filename
     */
    private async parseMultipart(stream: ReadableStream): Promise<MultipartResponse> {
        // Read the stream and collect all chunks
        const reader = stream.getReader();
        const chunks: Uint8Array[] = [];

        let done = false;
        while (!done) {
            const result = await reader.read();
            done = result.done;
            if (result.value) {
                chunks.push(result.value);
            }
        }

        // Combine all chunks into a single buffer
        const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
        const responseBytes = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of chunks) {
            responseBytes.set(chunk, offset);
            offset += chunk.length;
        }

        // Parse the multipart content
        const responseText = new TextDecoder().decode(responseBytes);
        const lines = responseText.split("\n");
        const boundary = lines[0].trim();

        // Find the JSON part (should be early in the response)
        let jsonData = null;
        let filename = "generated_music.mp3";

        // Parse JSON from the text representation
        for (let i = 0; i < Math.min(10, lines.length); i++) {
            if (lines[i].includes("Content-Type: application/json") && i + 2 < lines.length) {
                const jsonLine = lines[i + 2];
                if (jsonLine.trim() && jsonLine.startsWith("{")) {
                    try {
                        const rawJson = JSON.parse(jsonLine);
                        // Convert snake_case keys to camelCase
                        jsonData = this.toCamelCase(rawJson);
                        console.log("✓ Successfully parsed JSON metadata");
                    } catch (e) {
                        console.warn("Failed to parse JSON:", e);
                    }
                    break;
                }
            }
        }

        // Extract filename from headers
        for (let i = 0; i < Math.min(20, lines.length); i++) {
            if (lines[i].includes("filename=")) {
                const match = lines[i].match(/filename="([^"]+)"/);
                if (match) {
                    filename = match[1];
                    break;
                }
            }
        }

        // Find where the audio data starts (after the second boundary and headers)
        const boundaryBytes = new TextEncoder().encode(boundary);
        let firstBoundary = -1;
        let secondBoundary = -1;

        for (let i = 0; i <= responseBytes.length - boundaryBytes.length; i++) {
            let match = true;
            for (let j = 0; j < boundaryBytes.length; j++) {
                if (responseBytes[i + j] !== boundaryBytes[j]) {
                    match = false;
                    break;
                }
            }
            if (match) {
                if (firstBoundary === -1) {
                    firstBoundary = i;
                } else if (secondBoundary === -1) {
                    secondBoundary = i;
                    break;
                }
            }
        }

        if (secondBoundary === -1) {
            throw new Error("Could not find audio part boundary");
        }

        // Find the start of audio data (after headers and empty line)
        let audioStart = secondBoundary + boundaryBytes.length;

        // Skip past the headers to find the empty line
        while (audioStart < responseBytes.length - 1) {
            if (responseBytes[audioStart] === 0x0a && responseBytes[audioStart + 1] === 0x0a) {
                // Found \n\n - audio starts after this
                audioStart += 2;
                break;
            }
            audioStart++;
        }

        // Audio goes until the end (or until we find another boundary, but usually it's the end)
        const audioBuffer = Buffer.from(responseBytes.slice(audioStart));

        if (!jsonData) {
            throw new Error("Could not parse JSON data");
        }

        return {
            json: jsonData as { compositionPlan: CompositionPlan; songMetadata: SongMetadata },
            audio: audioBuffer,
            filename: filename,
        };
    }

    /**
     * Converts snake_case keys to camelCase recursively
     */
    private toCamelCase(obj: unknown): unknown {
        if (Array.isArray(obj)) {
            return obj.map((item: unknown) => this.toCamelCase(item));
        } else if (obj !== null && typeof obj === "object") {
            return Object.keys(obj as Record<string, unknown>).reduce(
                (result, key) => {
                    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
                    result[camelKey] = this.toCamelCase((obj as Record<string, unknown>)[key]);
                    return result;
                },
                {} as Record<string, unknown>,
            );
        }
        return obj;
    }
}
