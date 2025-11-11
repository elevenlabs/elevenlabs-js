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

export class Music {
    private _client: GeneratedMusic;
    protected readonly _options: Music.Options;
    protected _compositionPlan: CompositionPlan | undefined;

    constructor(options: Music.Options = {}) {
        this._options = options;
        this._client = new GeneratedMusic(options);
    }

    /**
     * Get the composition plan client
     */
    public get compositionPlan(): CompositionPlan {
        return this._client.compositionPlan;
    }

    /**
     * Compose a song from a prompt or a composition plan.
     * @throws {@link ElevenLabs.UnprocessableEntityError}
     */
    public compose(
        request: ElevenLabs.BodyComposeMusicV1MusicPost = {},
        requestOptions?: Music.RequestOptions,
    ): core.HttpResponsePromise<ReadableStream<Uint8Array>> {
        return this._client.compose(request, requestOptions);
    }

    // Private method for structural compatibility with generated Music class
    private __compose(
        request: ElevenLabs.BodyComposeMusicV1MusicPost = {},
        requestOptions?: Music.RequestOptions,
    ): Promise<core.WithRawResponse<ReadableStream<Uint8Array>>> {
        // This method exists for type compatibility only
        // The actual implementation is delegated through compose()
        throw new Error("Internal method - should not be called directly");
    }

    /**
     * Compose a song from a prompt or a composition plan with detailed response parsing.
     *
     * Unlike the standard `compose()` method which returns a raw audio stream, this method
     * automatically parses the multipart response to extract both the audio file and rich
     * metadata about the generated composition.
     *
     * @param request - The music composition request containing either:
     *   - `prompt`: A text description of the desired music (e.g., "upbeat electronic dance music")
     *   - `compositionPlan`: A detailed composition plan object created via `compositionPlan.create()`
     *   - `musicLengthMs`: Optional duration in milliseconds (10000-300000ms)
     *
     * @param requestOptions - Optional request configuration (e.g., timeout, signal, headers)
     *
     * @returns A promise that resolves to a `MultipartResponse` containing:
     *   - `json.compositionPlan`: The detailed composition plan structure including sections,
     *     styles, and lyrics
     *   - `json.songMetadata`: Metadata about the generated song (title, description, genres,
     *     languages, explicit content flag)
     *   - `audio`: Buffer containing the complete audio file (MP3 format)
     *   - `filename`: Suggested filename for the audio file
     *
     * @throws {@link ElevenLabs.UnprocessableEntityError} If the request parameters are invalid
     *   or the music generation fails
     *
     * @example
     * ```typescript
     * const client = new ElevenLabs({ apiKey: "your-api-key" });
     *
     * // Generate music from a text prompt
     * const response = await client.music.composeDetailed({
     *   prompt: "Epic orchestral music with dramatic strings and powerful brass",
     *   musicLengthMs: 60000 // 60 seconds
     * });
     *
     * console.log("Title:", response.json.songMetadata.title);
     * console.log("Genres:", response.json.songMetadata.genres);
     *
     * // Save the audio to a file
     * fs.writeFileSync(response.filename, response.audio);
     * ```
     *
     * @example
     * ```typescript
     * // Generate music from a composition plan
     * const plan = await client.music.compositionPlan.create({
     *   prompt: "A progressive rock song about space exploration"
     * });
     *
     * const response = await client.music.composeDetailed({
     *   compositionPlan: plan.compositionPlan
     * });
     *
     * // Access detailed section information
     * for (const section of response.json.compositionPlan.sections) {
     *   console.log(`${section.sectionName}: ${section.durationMs}ms`);
     * }
     * ```
     */
    public composeDetailed(
        request: ElevenLabs.BodyComposeMusicWithADetailedResponseV1MusicDetailedPost = {},
        requestOptions?: Music.RequestOptions,
    ): core.HttpResponsePromise<MultipartResponse> {
        return core.HttpResponsePromise.fromPromise(this._composeDetailed(request, requestOptions)) as any;
    }

    private async _composeDetailed(
        request: ElevenLabs.BodyComposeMusicWithADetailedResponseV1MusicDetailedPost = {},
        requestOptions?: Music.RequestOptions,
    ): Promise<WithRawResponse<MultipartResponse>> {
        // Call the base client method to get the stream with raw response
        try {
            const { data: stream, rawResponse } = await this._client.composeDetailed(request, requestOptions).withRawResponse();

            // Parse the stream using the existing parsing method
            const parsedResponse = await this.parseMultipart(stream);

            return { data: parsedResponse, rawResponse };
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to parse detailed composition response: ${message}`);
        }

    }

    // Private method for structural compatibility with generated Music class
    private __composeDetailed(
        request: ElevenLabs.BodyComposeMusicWithADetailedResponseV1MusicDetailedPost = {},
        requestOptions?: Music.RequestOptions,
    ): Promise<core.WithRawResponse<ReadableStream<Uint8Array>>> {
        // This method exists for type compatibility only
        // The actual implementation is delegated through composeDetailed()
        throw new Error("Internal method - should not be called directly");
    }

    /**
     * Stream a composed song from a prompt or a composition plan.
     * @throws {@link ElevenLabs.UnprocessableEntityError}
     */
    public stream(
        request: ElevenLabs.BodyStreamComposedMusicV1MusicStreamPost = {},
        requestOptions?: Music.RequestOptions,
    ): core.HttpResponsePromise<ReadableStream<Uint8Array>> {
        return this._client.stream(request, requestOptions);
    }

    // Private method for structural compatibility with generated Music class
    private __stream(
        request: ElevenLabs.BodyStreamComposedMusicV1MusicStreamPost = {},
        requestOptions?: Music.RequestOptions,
    ): Promise<core.WithRawResponse<ReadableStream<Uint8Array>>> {
        // This method exists for type compatibility only
        // The actual implementation is delegated through stream()
        throw new Error("Internal method - should not be called directly");
    }

    /**
     * Separate a music file into individual stems
     * @throws {@link ElevenLabs.UnprocessableEntityError}
     */
    public separateStems(
        request: ElevenLabs.BodyStemSeparationV1MusicStemSeparationPost,
        requestOptions?: Music.RequestOptions,
    ): core.HttpResponsePromise<ReadableStream<Uint8Array>> {
        return this._client.separateStems(request, requestOptions);
    }

    // Private method for structural compatibility with generated Music class
    private __separateStems(
        request: ElevenLabs.BodyStemSeparationV1MusicStemSeparationPost,
        requestOptions?: Music.RequestOptions,
    ): Promise<core.WithRawResponse<ReadableStream<Uint8Array>>> {
        // This method exists for type compatibility only
        // The actual implementation is delegated through separateStems()
        throw new Error("Internal method - should not be called directly");
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
