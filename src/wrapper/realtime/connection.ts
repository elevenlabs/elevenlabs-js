import WebSocket from "ws";
import type { ChildProcess } from "node:child_process";
import { EventEmitter } from "node:events";
import type { AudioFormat, CommitStrategy } from "./scribe";

export interface InputAudioChunk {
    message_type: "input_audio_chunk";
    audio_base_64: string;
    commit: boolean;
    sample_rate: number;
}

export type WordsItemType = "word" | "spacing";

export interface WordsItem {
    text?: string;
    start?: number;
    end?: number;
    type?: WordsItemType;
    speaker_id?: string;
    logprob?: number;
    characters?: string[];
}

export interface Config {
    sample_rate?: number;
    audio_format?: AudioFormat;
    language_code?: string;
    vad_commit_strategy?: CommitStrategy;
    vad_silence_threshold_secs?: number;
    vad_threshold?: number;
    min_speech_duration_ms?: number;
    min_silence_duration_ms?: number;
    model_id?: string;
    disable_logging?: boolean;
    include_timestamps?: boolean;
}

export interface SessionStartedMessage {
    message_type: "session_started";
    session_id: string;
    config: Config;
}

export interface PartialTranscriptMessage {
    message_type: "partial_transcript";
    text: string;
}

export interface CommittedTranscriptMessage {
    message_type: "committed_transcript";
    text: string;
}

export interface CommittedTranscriptWithTimestampsMessage {
    message_type: "committed_transcript_with_timestamps";
    text: string;
    language_code?: string;
    words?: WordsItem[];
}

export interface ErrorMessage {
    message_type: "error";
    error: string;
}

export interface AuthErrorMessage {
    message_type: "auth_error";
    error: string;
}

export interface QuotaExceededErrorMessage {
    message_type: "quota_exceeded";
    error: string;
}

export type WebSocketMessage = SessionStartedMessage | PartialTranscriptMessage | CommittedTranscriptMessage | CommittedTranscriptWithTimestampsMessage | ErrorMessage | AuthErrorMessage | QuotaExceededErrorMessage;

/**
 * Events emitted by the RealtimeConnection.
 */
export enum RealtimeEvents {
    /** Emitted when the session is successfully started */
    SESSION_STARTED = "session_started",
    /** Emitted when a partial (interim) transcript is available */
    PARTIAL_TRANSCRIPT = "partial_transcript",
    /** Emitted when a committed transcript is available */
    COMMITTED_TRANSCRIPT = "committed_transcript",
    /** Emitted when a committed transcript with timestamps is available */
    COMMITTED_TRANSCRIPT_WITH_TIMESTAMPS = "committed_transcript_with_timestamps",
    /** Emitted when an error occurs */
    ERROR = "error",
    /** Emitted when an auth error occurs */
    AUTH_ERROR = "auth_error",
    /** Emitted when a quota exceeded error occurs */
    QUOTA_EXCEEDED = "quota_exceeded",
    /** Emitted when the WebSocket connection is opened */
    OPEN = "open",
    /** Emitted when the WebSocket connection is closed */
    CLOSE = "close",
}

/**
 * Manages a real-time transcription WebSocket connection.
 *
 * @remarks
 * **Node.js only**: This class uses Node.js-specific WebSocket implementation.
 *
 * @example
 * ```typescript
 * const connection = await client.speechToText.realtime.connect({
 *     modelId: "scribe_v2_realtime",
 *     audioFormat: AudioFormat.PCM_16000,
 *     sampleRate: 16000,
 * });
 *
 * connection.on(RealtimeEvents.SESSION_STARTED, (data) => {
 *     console.log("Session started");
 * });
 *
 * connection.on(RealtimeEvents.PARTIAL_TRANSCRIPT, (data) => {
 *     console.log("Partial:", data.transcript);
 * });
 *
 * connection.on(RealtimeEvents.COMMITTED_TRANSCRIPT, (data) => {
 *     console.log("Final:", data.transcript);
 *     connection.close();
 * });
 *
 * // Send audio data
 * connection.send({ audioBase64: base64String });
 *
 * // Commit and close
 * connection.commit();
  * ```
 */
export class RealtimeConnection {
    private websocket: WebSocket | null = null;
    private eventEmitter: EventEmitter = new EventEmitter();
    private ffmpegProcess: ChildProcess | null = null;
    private currentSampleRate: number = 16000;

    constructor(sampleRate: number) {
        this.currentSampleRate = sampleRate;
    }

    /**
     * @internal
     * Used internally by ScribeRealtime to attach the WebSocket after connection is created.
     */
    public setWebSocket(websocket: WebSocket): void {
        this.websocket = websocket;

        // If WebSocket is already open, emit OPEN event immediately
        if (this.websocket.readyState === WebSocket.OPEN) {
            this.eventEmitter.emit(RealtimeEvents.OPEN);
        } else {
            // Otherwise, wait for the open event
            this.websocket.on("open", () => {
                this.eventEmitter.emit(RealtimeEvents.OPEN);
            });
        }

        this.websocket.on("message", (event: WebSocket.Data) => {
            const data = JSON.parse(event.toString()) as WebSocketMessage;

            switch (data.message_type) {
                case "session_started":
                    this.eventEmitter.emit(RealtimeEvents.SESSION_STARTED, data);
                    break;
                case "partial_transcript":
                    this.eventEmitter.emit(RealtimeEvents.PARTIAL_TRANSCRIPT, data);
                    break;
                case "committed_transcript":
                    this.eventEmitter.emit(RealtimeEvents.COMMITTED_TRANSCRIPT, data);
                    break;
                case "committed_transcript_with_timestamps":
                    this.eventEmitter.emit(RealtimeEvents.COMMITTED_TRANSCRIPT_WITH_TIMESTAMPS, data);
                    break;
                case "error":
                    this.eventEmitter.emit(RealtimeEvents.ERROR, data);
                    break;
                case "auth_error":
                    this.eventEmitter.emit(RealtimeEvents.AUTH_ERROR, data);
                    break;
                case "quota_exceeded":
                    this.eventEmitter.emit(RealtimeEvents.QUOTA_EXCEEDED, data);
                    break;
            }
        });

        this.websocket.on("error", (error: Error) => {
            this.eventEmitter.emit(RealtimeEvents.ERROR, error);
        });

        this.websocket.on("close", () => {
            this.eventEmitter.emit(RealtimeEvents.CLOSE);
            this.cleanup();
        });
    }

    /**
     * @internal
     * Used internally by ScribeRealtime to attach ffmpeg process for cleanup.
     */
    public setFfmpegProcess(ffmpegProcess: ChildProcess): void {
        this.ffmpegProcess = ffmpegProcess;
    }

    /**
     * Attaches an event listener for the specified event.
     *
     * @param event - The event to listen for (use RealtimeEvents enum)
     * @param listener - The callback function to execute when the event fires
     *
     * @example
     * ```typescript
     * connection.on(RealtimeEvents.SESSION_STARTED, (data) => {
     *     console.log("Session started", data);
     * });
     *
     * connection.on(RealtimeEvents.PARTIAL_TRANSCRIPT, (data) => {
     *     console.log("Partial:", data.transcript);
     * });
     *
     * connection.on(RealtimeEvents.COMMITTED_TRANSCRIPT, (data) => {
     *     console.log("Final:", data.transcript);
     * });
     * ```
     */
    public on(event: RealtimeEvents, listener: (...args: unknown[]) => void): void {
        this.eventEmitter.on(event, listener);
    }

    /**
     * Removes an event listener for the specified event.
     *
     * @param event - The event to stop listening for
     * @param listener - The callback function to remove
     *
     * @example
     * ```typescript
     * const handler = (data) => console.log(data);
     * connection.on(RealtimeEvents.PARTIAL_TRANSCRIPT, handler);
     *
     * // Later, remove the listener
     * connection.off(RealtimeEvents.PARTIAL_TRANSCRIPT, handler);
     * ```
     */
    public off(event: RealtimeEvents, listener: (...args: unknown[]) => void): void {
        this.eventEmitter.off(event, listener);
    }

    /**
     * Sends audio data to the transcription service.
     *
     * @param data - Audio data configuration
     * @param data.audioBase64 - Base64-encoded audio data
     * @param data.commit - Whether to commit the transcription after this chunk. You likely want to use connection.commit() instead (default: false)
     * @param data.sampleRate - Sample rate of the audio (default: configured sample rate)
     *
     * @throws {Error} If the WebSocket connection is not open
     *
     * @example
     * ```typescript
     * // Send audio chunk without committing
     * connection.send({
     *     audioBase64: base64EncodedAudio,
     * });
     *
     * // Send audio chunk with custom sample rate
     * connection.send({
     *     audioBase64: base64EncodedAudio,
     *     sampleRate: 16000,
     * });
     * ```
     */
    public send(data: { audioBase64: string; commit?: boolean; sampleRate?: number }): void {
        if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
            throw new Error("WebSocket is not connected");
        }

        const message: InputAudioChunk = {
            message_type: "input_audio_chunk",
            audio_base_64: data.audioBase64,
            commit: data.commit ?? false,
            sample_rate: data.sampleRate ?? this.currentSampleRate,
        };

        this.websocket.send(JSON.stringify(message));
    }

    /**
     * Commits the segment, triggering a COMMITTED_TRANSCRIPT event and clearing the buffer.
     * It's recommend to commit often when using CommitStrategy.MANUAL to keep latency low.
     *
     * @throws {Error} If the WebSocket connection is not open
     *
     * @remarks
     * Only needed when using CommitStrategy.MANUAL.
     * When using CommitStrategy.VAD, commits are handled automatically by the server.
     *
     * @example
     * ```typescript
     * // Send all audio chunks
     * for (const chunk of audioChunks) {
     *     connection.send({ audioBase64: chunk });
     * }
     *
     * // Finalize the transcription
     * connection.commit();
     * ```
     */
    public commit(): void {
        if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
            throw new Error("WebSocket is not connected");
        }

        const message: InputAudioChunk = {
            message_type: "input_audio_chunk",
            audio_base_64: "",
            commit: true,
            sample_rate: this.currentSampleRate,
        };

        this.websocket.send(JSON.stringify(message));
    }

    /**
     * Closes the WebSocket connection and cleans up resources.
     * This will terminate any ongoing transcription and stop ffmpeg processes if running.
     *
     * @remarks
     * After calling close(), this connection cannot be reused.
     * Create a new connection if you need to start transcribing again.
     *
     * @example
     * ```typescript
     * connection.on(RealtimeEvents.COMMITTED_TRANSCRIPT, (data) => {
     *     console.log("Final:", data.transcript);
     *     connection.close();
     * });
     * ```
     */
    public close(): void {
        this.cleanup();
        if (this.websocket) {
            this.websocket.close();
        }
    }

    private cleanup(): void {
        if (this.ffmpegProcess) {
            this.ffmpegProcess.kill();
            this.ffmpegProcess = null;
        }
    }
}

