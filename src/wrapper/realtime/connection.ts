import WebSocket from "ws";
import type { ChildProcess } from "node:child_process";
import { EventEmitter } from "node:events";

interface InputAudioChunk {
    message_type: "input_audio_chunk";
    audio_base_64: string;
    commit: boolean;
    sample_rate: number;
}

interface SessionStartedMessage {
    message_type: "session_started";
}

interface PartialTranscriptMessage {
    message_type: "partial_transcript";
    transcript: string;
}

interface FinalTranscriptMessage {
    message_type: "final_transcript";
    transcript: string;
}

type WebSocketMessage = SessionStartedMessage | PartialTranscriptMessage | FinalTranscriptMessage;

export enum RealtimeEvents {
    SESSION_STARTED = "session_started",
    PARTIAL_TRANSCRIPT = "partial_transcript",
    FINAL_TRANSCRIPT = "final_transcript",
    ERROR = "error",
}

export class RealtimeConnection {
    private websocket: WebSocket | null = null;
    private eventEmitter: EventEmitter = new EventEmitter();
    private ffmpegProcess: ChildProcess | null = null;
    private currentSampleRate: number = 16000;

    constructor(sampleRate: number) {
        this.currentSampleRate = sampleRate;
    }

    public setWebSocket(websocket: WebSocket): void {
        this.websocket = websocket;

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
            }
        });

        this.websocket.on("error", (error: Error) => {
            this.eventEmitter.emit(RealtimeEvents.ERROR, error);
        });

        this.websocket.on("close", () => {
            this.cleanup();
        });
    }

    public setFfmpegProcess(ffmpegProcess: ChildProcess): void {
        this.ffmpegProcess = ffmpegProcess;
    }

    public on(event: RealtimeEvents, listener: (...args: unknown[]) => void): void {
        this.eventEmitter.on(event, listener);
    }

    public off(event: RealtimeEvents, listener: (...args: unknown[]) => void): void {
        this.eventEmitter.off(event, listener);
    }

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

