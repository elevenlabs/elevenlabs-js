import type { SpeechToText } from "../../api/resources/speechToText/client/Client";
import WebSocket from "ws";
import { RealtimeConnection } from "./connection";
import * as core from "../../core";
import * as environments from "../../environments";

export enum AudioFormat {
    PCM_8000 = "pcm_8000",
    PCM_16000 = "pcm_16000",
    PCM_22050 = "pcm_22050",
    PCM_24000 = "pcm_24000",
    PCM_44100 = "pcm_44100",
    PCM_48000 = "pcm_48000",
    ULAW_8000 = "ulaw_8000",
}

export enum CommitStrategy {
    MANUAL = "manual",
    VAD = "vad",
}

interface BaseOptions {
    /**
     * Strategy for committing transcriptions.
     * @default CommitStrategy.MANUAL
     */
    commitStrategy?: CommitStrategy;
    /**
     * Silence threshold in seconds for VAD (Voice Activity Detection).
     * Must be a positive number between 0.3 and 3.0
     */
    vadSilenceThresholdSecs?: number;
    /**
     * Threshold for voice activity detection.
     * Must be between 0.1 and 0.9.
     */
    vadThreshold?: number;
    /**
     * Minimum speech duration in milliseconds.
     * Must be a positive integer between 50 and 2000.
     */
    minSpeechDurationMs?: number;
    /**
     * Minimum silence duration in milliseconds.
     * Must be a positive integer between 50 and 2000.
     */
    minSilenceDurationMs?: number;
}

export interface AudioOptions extends BaseOptions {
    audioFormat: AudioFormat;
    sampleRate: number;
    url?: never;
}

/**
 * Options for streaming audio from a URL.
 * @remarks
 * **Node.js only**: Requires ffmpeg to be installed and available in PATH.
 * This will not work in browsers, Deno, or Cloudflare Workers.
 */
export interface UrlOptions extends BaseOptions {
    url: string;
    audioFormat?: never;
    sampleRate?: never;
}

/**
 * Real-time speech-to-text transcription client.
 * @remarks
 * **Node.js only**: This class uses Node.js-specific APIs (WebSocket from 'ws', child_process).
 * It will not work in browsers, Deno, or Cloudflare Workers without modifications.
 */
export class ScribeRealtime {
    private options: SpeechToText.Options;

    constructor(options: SpeechToText.Options = {}) {
        this.options = options;
    }

    private async getWebSocketUri(): Promise<string> {
        // Get base URL from options, preferring baseUrl, then environment, then default Production
        const baseUrl =
            (await core.Supplier.get(this.options.baseUrl)) ??
            (await core.Supplier.get(this.options.environment)) ??
            environments.ElevenLabsEnvironment.Production;

        // Convert HTTP(S) to WS(S)
        const wsUrl = baseUrl.replace(/^https?:\/\//i, (match) =>
            match.toLowerCase() === "https://" ? "wss://" : "ws://"
        );

        return `${wsUrl}/v1/speech-to-text/realtime-beta`;
    }

    private async checkFfmpegInstalled(): Promise<void> {
        try {
            const { execSync } = await import("node:child_process");
            const command = process.platform === "win32" ? "where ffmpeg" : "which ffmpeg";
            execSync(command, { stdio: "ignore" });
        } catch {
            throw new Error(
                "ffmpeg is required for URL streaming but was not found. " +
                "Please install ffmpeg and ensure it is available in your PATH. " +
                "Visit https://ffmpeg.org/download.html for installation instructions."
            );
        }
    }

    private async buildWebSocketUri(options: AudioOptions | UrlOptions): Promise<string> {
        const baseUri = await this.getWebSocketUri();
        const params = new URLSearchParams();

        // Add optional parameters if provided, with validation
        if (options.commitStrategy !== undefined) {
            params.append("commit_strategy", options.commitStrategy);
        }
        if (options.vadSilenceThresholdSecs !== undefined) {
            if (options.vadSilenceThresholdSecs <= 0.3 || options.vadSilenceThresholdSecs > 3.0) {
                throw new Error("vadSilenceThresholdSecs must be between 0.3 and 3.0");
            }
            params.append("vad_silence_threshold_secs", options.vadSilenceThresholdSecs.toString());
        }
        if (options.vadThreshold !== undefined) {
            if (options.vadThreshold < 0.1 || options.vadThreshold > 0.9) {
                throw new Error("vadThreshold must be between 0.1 and 0.9");
            }
            params.append("vad_threshold", options.vadThreshold.toString());
        }
        if (options.minSpeechDurationMs !== undefined) {
            if (options.minSpeechDurationMs <= 50 || options.minSpeechDurationMs > 2000) {
                throw new Error("minSpeechDurationMs must be between 50 and 2000");
            }
            params.append("min_speech_duration_ms", options.minSpeechDurationMs.toString());
        }
        if (options.minSilenceDurationMs !== undefined) {
            if (options.minSilenceDurationMs <= 50 || options.minSilenceDurationMs > 2000) {
                throw new Error("minSilenceDurationMs must be between 50 and 2000");
            }
            params.append("min_silence_duration_ms", options.minSilenceDurationMs.toString());
        }

        const queryString = params.toString();
        return queryString ? `${baseUri}?${queryString}` : baseUri;
    }

    /**
     * Establishes a WebSocket connection for real-time speech-to-text transcription.
     *
     * @param options - Configuration options for the connection
     * @returns A promise that resolves to a RealtimeConnection instance
     *
     * @remarks
     * **Node.js only**: This method uses Node.js-specific APIs.
     *
     * When using `UrlOptions` with a URL, ffmpeg must be installed and available in PATH.
     * The SDK will automatically convert the stream to 16kHz mono PCM format.
     *
     * @example
     * ```typescript
     * // Manual audio streaming
     * const connection = await client.speechToText.realtime.connect({
     *     audioFormat: AudioFormat.PCM_16000,
     *     sampleRate: 16000,
     * });
     *
     * // Automatic URL streaming (requires ffmpeg)
     * const connection = await client.speechToText.realtime.connect({
     *     url: "https://example.com/stream.mp3",
     * });
     * ```
     */
    public async connect(options: AudioOptions | UrlOptions): Promise<RealtimeConnection> {
        let apiKey = this.options.apiKey;
        if (!apiKey) {
            throw new Error("API key is required");
        }

        // Resolve API key if it's a function or promise
        if (typeof apiKey === "function") {
            apiKey = apiKey();
        }
        if (apiKey instanceof Promise) {
            apiKey = await apiKey;
        }

        if (!apiKey) {
            throw new Error("API key is required");
        }

        // Create connection object first so users can attach event listeners before messages arrive
        const sampleRate = "url" in options ? 16000 : options.sampleRate;
        const connection = new RealtimeConnection(sampleRate);

        // Build WebSocket URI with query parameters
        const uri = await this.buildWebSocketUri(options);

        return new Promise((resolve) => {
            const websocket = new WebSocket(uri, {
                headers: {
                    "xi-api-key": apiKey as string,
                },
            });

            // Attach websocket to connection immediately so error handlers are registered
            // This ensures errors during handshake (like 403) are properly emitted via event emitter
            connection.setWebSocket(websocket);

            // Resolve immediately with connection so users can attach listeners
            resolve(connection);

            websocket.on("open", () => {
                // If UrlOptions, start streaming from URL with ffmpeg
                if ("url" in options) {
                    const commitStrategy = options.commitStrategy ?? CommitStrategy.MANUAL;
                    this.streamFromUrl(options as UrlOptions, connection, commitStrategy);
                }
            });
        });
    }

    private async streamFromUrl(options: UrlOptions, connection: RealtimeConnection, commitStrategy: CommitStrategy): Promise<void> {
        // Check if ffmpeg is installed before attempting to use it
        await this.checkFfmpegInstalled();

        // Dynamically import spawn to avoid bundling issues in non-Node.js environments
        const { spawn } = await import("node:child_process");

        // Spawn ffmpeg to convert the stream to 16kHz mono PCM
        const ffmpegProcess = spawn("ffmpeg", [
            "-i", options.url,
            "-f", "s16le",           // 16-bit PCM, little-endian
            "-acodec", "pcm_s16le",  // PCM codec
            "-ar", "16000",          // 16kHz sample rate
            "-ac", "1",              // mono (1 channel)
            "pipe:1"                 // output to stdout
        ]);

        connection.setFfmpegProcess(ffmpegProcess);

        ffmpegProcess.stdout?.on("data", (chunk: Buffer) => {
            const base64Audio = chunk.toString("base64");
            connection.send({
                audioBase64: base64Audio,
            });
        });

        ffmpegProcess.stdout?.on("end", () => {
            if (commitStrategy === CommitStrategy.MANUAL) {
                // Manual strategy: commit to finalize transcription, then close
                console.log("Stream ended, sending final commit");
                connection.commit();
            }
            // Close connection since no more audio will be sent
            connection.close();
        });

        ffmpegProcess.stderr?.on("data", (data) => {
            // ffmpeg outputs progress info to stderr, only log errors
            const message = data.toString();
            if (message.includes("Error") || message.includes("error")) {
                console.error("ffmpeg error:", message);
            }
        });

        ffmpegProcess.on("error", (error: Error) => {
            console.error("Failed to start ffmpeg:", error);
        });

        ffmpegProcess.on("close", (code: number | null) => {
            console.log(`ffmpeg process exited with code ${code}`);
        });
    }
}

