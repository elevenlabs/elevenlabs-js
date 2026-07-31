import WebSocket from "ws";
import type { ChildProcess } from "node:child_process";
import { EventEmitter } from "node:events";
import type { AudioFormat } from "./scribe";

export interface InputAudioChunk {
    message_type: "input_audio_chunk";
    audio_base_64: string;
    commit: boolean;
    sample_rate: number;
    previous_text?: string;
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

/**
 * The session configuration echoed back by the server in the session_started message.
 */
export interface Config {
    sample_rate?: number;
    audio_format?: AudioFormat;
    language_code?: string | null;
    secondary_languages?: string[];
    timestamps_granularity?: "word" | "character";
    /** True when the session commits automatically via VAD rather than manually. */
    vad_commit_strategy?: boolean;
    vad_silence_threshold_secs?: number;
    vad_threshold?: number;
    min_speech_duration_ms?: number;
    min_silence_duration_ms?: number;
    max_tokens_to_recompute?: number;
    model_id?: string;
    disable_logging?: boolean;
    include_timestamps?: boolean;
    include_language_detection?: boolean;
    filter_background_audio?: boolean;
    keyterms?: string[];
    no_verbatim?: boolean;
    /** The entity types being detected, or null when detection is disabled. */
    entity_detection?: string[] | null;
}

/**
 * An entity detected within a committed transcript.
 */
export interface DetectedEntity {
    /** The text that was identified as an entity. */
    text: string;
    /** The type of entity detected (e.g. 'credit_card', 'email_address', 'person_name'). */
    entity_type: string;
    /** Start character position in the transcript text. */
    start_char: number;
    /** End character position in the transcript text. */
    end_char: number;
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

/**
 * A final transcript for a segment, sent once speech has settled.
 * Unlike a partial transcript this will not change, but the segment is not yet committed.
 */
export interface FinalTranscriptMessage {
    message_type: "final_transcript";
    text: string;
}

/**
 * A delayed final transcript with word-level timestamps and/or the detected language.
 * Only sent when includeTimestamps or includeLanguageDetection is enabled.
 */
export interface FinalTranscriptWithTimestampsMessage {
    message_type: "final_transcript_with_timestamps";
    text: string;
    language_code?: string | null;
    words?: WordsItem[] | null;
}

export interface CommittedTranscriptMessage {
    message_type: "committed_transcript";
    text: string;
}

export interface CommittedTranscriptWithTimestampsMessage {
    message_type: "committed_transcript_with_timestamps";
    text: string;
    language_code?: string | null;
    words?: WordsItem[] | null;
}

/**
 * Entities detected in a committed transcript.
 * Only sent when the entityDetection option is set.
 */
export interface CommittedTranscriptEntitiesMessage {
    message_type: "committed_transcript_entities";
    /** The committed transcript text the entities were detected in. */
    text: string;
    /** Detected entities. Empty when none were found. */
    entities: DetectedEntity[];
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

export interface CommitThrottledErrorMessage {
    message_type: "commit_throttled";
    error: string;
}

export interface TranscriberErrorMessage {
    message_type: "transcriber_error";
    error: string;
}

export interface UnacceptedTermsErrorMessage {
    // The server sends "unaccepted_terms"; "unaccepted_terms_error" is kept for
    // backwards compatibility with the name this SDK originally matched on.
    message_type: "unaccepted_terms" | "unaccepted_terms_error";
    error: string;
}

/**
 * Sent when the connection parameters were rejected. The session is closed afterwards.
 */
export interface InvalidRequestErrorMessage {
    message_type: "invalid_request";
    error: string;
}

export interface RateLimitedErrorMessage {
    message_type: "rate_limited";
    error: string;
}

export interface InputErrorMessage {
    message_type: "input_error";
    error: string;
}

export interface QueueOverflowErrorMessage {
    message_type: "queue_overflow";
    error: string;
}

export interface ResourceExhaustedErrorMessage {
    message_type: "resource_exhausted";
    error: string;
}

export interface SessionTimeLimitExceededErrorMessage {
    message_type: "session_time_limit_exceeded";
    error: string;
}

export interface ChunkSizeExceededErrorMessage {
    message_type: "chunk_size_exceeded";
    error: string;
}

export interface InsufficientAudioActivityErrorMessage {
    message_type: "insufficient_audio_activity";
    error: string;
}

/**
 * Union type for all server error messages.
 */
export type ServerErrorMessage =
    | ErrorMessage
    | AuthErrorMessage
    | QuotaExceededErrorMessage
    | CommitThrottledErrorMessage
    | TranscriberErrorMessage
    | UnacceptedTermsErrorMessage
    | RateLimitedErrorMessage
    | InputErrorMessage
    | InvalidRequestErrorMessage
    | QueueOverflowErrorMessage
    | ResourceExhaustedErrorMessage
    | SessionTimeLimitExceededErrorMessage
    | ChunkSizeExceededErrorMessage
    | InsufficientAudioActivityErrorMessage;

export type WebSocketMessage =
    | SessionStartedMessage
    | PartialTranscriptMessage
    | FinalTranscriptMessage
    | FinalTranscriptWithTimestampsMessage
    | CommittedTranscriptMessage
    | CommittedTranscriptWithTimestampsMessage
    | CommittedTranscriptEntitiesMessage
    | ServerErrorMessage;

/**
 * Union type for all possible error payloads emitted by the ERROR event.
 * Includes server error messages and native WebSocket errors.
 */
export type RealtimeErrorPayload = ServerErrorMessage | Error;

/**
 * Events emitted by the RealtimeConnection.
 */
export enum RealtimeEvents {
    /** Emitted when the session is successfully started */
    SESSION_STARTED = "session_started",
    /** Emitted when a partial (interim) transcript is available */
    PARTIAL_TRANSCRIPT = "partial_transcript",
    /** Emitted when a final transcript for a segment is available, before it is committed */
    FINAL_TRANSCRIPT = "final_transcript",
    /** Emitted when a delayed final transcript with timestamps and/or detected language is available */
    FINAL_TRANSCRIPT_WITH_TIMESTAMPS = "final_transcript_with_timestamps",
    /** Emitted when a committed transcript is available */
    COMMITTED_TRANSCRIPT = "committed_transcript",
    /** Emitted when a committed transcript with timestamps is available */
    COMMITTED_TRANSCRIPT_WITH_TIMESTAMPS = "committed_transcript_with_timestamps",
    /** Emitted when entities detected in a committed transcript are available */
    COMMITTED_TRANSCRIPT_ENTITIES = "committed_transcript_entities",
    /** Emitted when an error occurs - can be any error message from the server or a native WebSocket error */
    ERROR = "error",
    /** Emitted when an auth error occurs */
    AUTH_ERROR = "auth_error",
    /** Emitted when a quota exceeded error occurs */
    QUOTA_EXCEEDED = "quota_exceeded",
    /** Emitted when the WebSocket connection is opened */
    OPEN = "open",
    /** Emitted when the WebSocket connection is closed */
    CLOSE = "close",
    /** Emitted when a commit throttled error occurs */
    COMMIT_THROTTLED = "commit_throttled",
    /** Emitted when a transcriber error occurs */
    TRANSCRIBER_ERROR = "transcriber_error",
    /** Emitted when a unaccepted terms error occurs */
    UNACCEPTED_TERMS_ERROR = "unaccepted_terms_error",
    /** Emitted when a rate limited error occurs */
    RATE_LIMITED = "rate_limited",
    /** Emitted when a input error occurs */
    INPUT_ERROR = "input_error",
    /** Emitted when the connection parameters were rejected by the server */
    INVALID_REQUEST = "invalid_request",
    /** Emitted when a queue overflow error occurs */
    QUEUE_OVERFLOW = "queue_overflow",
    /** Emitted when a resource exhausted error occurs */
    RESOURCE_EXHAUSTED = "resource_exhausted",
    /** Emitted when a session time limit exceeded error occurs */
    SESSION_TIME_LIMIT_EXCEEDED = "session_time_limit_exceeded",
    /** Emitted when a chunk size exceeded error occurs */
    CHUNK_SIZE_EXCEEDED = "chunk_size_exceeded",
    /** Emitted when a insufficient audio activity error occurs */
    INSUFFICIENT_AUDIO_ACTIVITY = "insufficient_audio_activity",
}

/**
 * Type-safe event map for RealtimeConnection events.
 */
export interface RealtimeEventMap {
    [RealtimeEvents.SESSION_STARTED]: SessionStartedMessage;
    [RealtimeEvents.PARTIAL_TRANSCRIPT]: PartialTranscriptMessage;
    [RealtimeEvents.FINAL_TRANSCRIPT]: FinalTranscriptMessage;
    [RealtimeEvents.FINAL_TRANSCRIPT_WITH_TIMESTAMPS]: FinalTranscriptWithTimestampsMessage;
    [RealtimeEvents.COMMITTED_TRANSCRIPT]: CommittedTranscriptMessage;
    [RealtimeEvents.COMMITTED_TRANSCRIPT_WITH_TIMESTAMPS]: CommittedTranscriptWithTimestampsMessage;
    [RealtimeEvents.COMMITTED_TRANSCRIPT_ENTITIES]: CommittedTranscriptEntitiesMessage;
    [RealtimeEvents.ERROR]: RealtimeErrorPayload;
    [RealtimeEvents.AUTH_ERROR]: AuthErrorMessage;
    [RealtimeEvents.QUOTA_EXCEEDED]: QuotaExceededErrorMessage;
    [RealtimeEvents.OPEN]: undefined;
    [RealtimeEvents.CLOSE]: undefined;
    [RealtimeEvents.COMMIT_THROTTLED]: CommitThrottledErrorMessage;
    [RealtimeEvents.TRANSCRIBER_ERROR]: TranscriberErrorMessage;
    [RealtimeEvents.UNACCEPTED_TERMS_ERROR]: UnacceptedTermsErrorMessage;
    [RealtimeEvents.RATE_LIMITED]: RateLimitedErrorMessage;
    [RealtimeEvents.INPUT_ERROR]: InputErrorMessage;
    [RealtimeEvents.INVALID_REQUEST]: InvalidRequestErrorMessage;
    [RealtimeEvents.QUEUE_OVERFLOW]: QueueOverflowErrorMessage;
    [RealtimeEvents.RESOURCE_EXHAUSTED]: ResourceExhaustedErrorMessage;
    [RealtimeEvents.SESSION_TIME_LIMIT_EXCEEDED]: SessionTimeLimitExceededErrorMessage;
    [RealtimeEvents.CHUNK_SIZE_EXCEEDED]: ChunkSizeExceededErrorMessage;
    [RealtimeEvents.INSUFFICIENT_AUDIO_ACTIVITY]: InsufficientAudioActivityErrorMessage;
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
                case "final_transcript":
                    this.eventEmitter.emit(RealtimeEvents.FINAL_TRANSCRIPT, data);
                    break;
                case "final_transcript_with_timestamps":
                    this.eventEmitter.emit(RealtimeEvents.FINAL_TRANSCRIPT_WITH_TIMESTAMPS, data);
                    break;
                case "committed_transcript":
                    this.eventEmitter.emit(RealtimeEvents.COMMITTED_TRANSCRIPT, data);
                    break;
                case "committed_transcript_with_timestamps":
                    this.eventEmitter.emit(RealtimeEvents.COMMITTED_TRANSCRIPT_WITH_TIMESTAMPS, data);
                    break;
                case "committed_transcript_entities":
                    this.eventEmitter.emit(RealtimeEvents.COMMITTED_TRANSCRIPT_ENTITIES, data);
                    break;
                case "error":
                    this.eventEmitter.emit(RealtimeEvents.ERROR, data);
                    break;
                case "auth_error":
                    this.eventEmitter.emit(RealtimeEvents.AUTH_ERROR, data);
                    this.eventEmitter.emit(RealtimeEvents.ERROR, data);
                    break;
                case "quota_exceeded":
                    this.eventEmitter.emit(RealtimeEvents.QUOTA_EXCEEDED, data);
                    this.eventEmitter.emit(RealtimeEvents.ERROR, data);
                    break;
                case "commit_throttled":
                    this.eventEmitter.emit(RealtimeEvents.COMMIT_THROTTLED, data);
                    this.eventEmitter.emit(RealtimeEvents.ERROR, data);
                    break;
                case "transcriber_error":
                    this.eventEmitter.emit(RealtimeEvents.TRANSCRIBER_ERROR, data);
                    this.eventEmitter.emit(RealtimeEvents.ERROR, data);
                    break;
                case "unaccepted_terms":
                case "unaccepted_terms_error":
                    this.eventEmitter.emit(RealtimeEvents.UNACCEPTED_TERMS_ERROR, data);
                    this.eventEmitter.emit(RealtimeEvents.ERROR, data);
                    break;
                case "rate_limited":
                    this.eventEmitter.emit(RealtimeEvents.RATE_LIMITED, data);
                    this.eventEmitter.emit(RealtimeEvents.ERROR, data);
                    break;
                case "input_error":
                    this.eventEmitter.emit(RealtimeEvents.INPUT_ERROR, data);
                    this.eventEmitter.emit(RealtimeEvents.ERROR, data);
                    break;
                case "invalid_request":
                    this.eventEmitter.emit(RealtimeEvents.INVALID_REQUEST, data);
                    this.eventEmitter.emit(RealtimeEvents.ERROR, data);
                    break;
                case "queue_overflow":
                    this.eventEmitter.emit(RealtimeEvents.QUEUE_OVERFLOW, data);
                    this.eventEmitter.emit(RealtimeEvents.ERROR, data);
                    break;
                case "resource_exhausted":
                    this.eventEmitter.emit(RealtimeEvents.RESOURCE_EXHAUSTED, data);
                    this.eventEmitter.emit(RealtimeEvents.ERROR, data);
                    break;
                case "session_time_limit_exceeded":
                    this.eventEmitter.emit(RealtimeEvents.SESSION_TIME_LIMIT_EXCEEDED, data);
                    this.eventEmitter.emit(RealtimeEvents.ERROR, data);
                    break;
                case "chunk_size_exceeded":
                    this.eventEmitter.emit(RealtimeEvents.CHUNK_SIZE_EXCEEDED, data);
                    this.eventEmitter.emit(RealtimeEvents.ERROR, data);
                    break;
                case "insufficient_audio_activity":
                    this.eventEmitter.emit(RealtimeEvents.INSUFFICIENT_AUDIO_ACTIVITY, data);
                    this.eventEmitter.emit(RealtimeEvents.ERROR, data);
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
     *
     * connection.on(RealtimeEvents.ERROR, (error) => {
     *     // error can be any error message type or native Error
     *     if ('message_type' in error) {
     *         console.error("Server error:", error.message_type, error.error);
     *     } else {
     *         console.error("WebSocket error:", error.message);
     *     }
     * });
     * ```
     */
    public on<E extends RealtimeEvents>(
        event: E,
        listener: (data: RealtimeEventMap[E]) => void
    ): void {
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
    public off<E extends RealtimeEvents>(
        event: E,
        listener: (data: RealtimeEventMap[E]) => void
    ): void {
        this.eventEmitter.off(event, listener);
    }

    /**
     * Sends audio data to the transcription service.
     *
     * @param data - Audio data configuration
     * @param data.audioBase64 - Base64-encoded audio data
     * @param data.commit - Whether to commit the transcription after this chunk. You likely want to use connection.commit() instead (default: false)
     * @param data.sampleRate - Sample rate of the audio (default: configured sample rate)
     * @param data.previousText - Send text context to the model. Can only be sent alongside the first audio chunk. If sent in a subsequent chunk, an error will be returned.
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
    public send(data: { audioBase64: string; commit?: boolean; sampleRate?: number; previousText?: string }): void {
        if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
            throw new Error("WebSocket is not connected");
        }

        const message: InputAudioChunk = {
            message_type: "input_audio_chunk",
            audio_base_64: data.audioBase64,
            commit: data.commit ?? false,
            sample_rate: data.sampleRate ?? this.currentSampleRate,
            previous_text: data.previousText,
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

