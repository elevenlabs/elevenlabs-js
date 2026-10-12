import type { ClientToOrchestratorEventUnion, UserAudioChunkEvent } from "./events";
import type { RealtimeClientEvent, RealtimeServerEvent, RealtimeWireFormat } from "./RealtimeSession";

/** Raised for conversation features that have no equivalent on the Realtime endpoint. */
export class RealtimeUnsupportedFeatureError extends Error {
    constructor(feature: string) {
        super(`${feature} is not supported by websocket-realtime connections.`);
        this.name = "RealtimeUnsupportedFeatureError";
    }
}

/** A native server event, as the conversation handles it. */
export type NativeServerEvent = { type: string; [key: string]: any };

export type RealtimeOutgoingEvent = ClientToOrchestratorEventUnion | UserAudioChunkEvent;

export interface RealtimeProtocolTranslatorOptions {
    outputFormat: RealtimeWireFormat;
    interruptOnSpeech: boolean;
    emit: (event: NativeServerEvent) => void;
    send: (event: RealtimeClientEvent) => void;
    debug?: (info: unknown) => void;
    now?: () => number;
}

type ResponseState = {
    id: string;
    eventId: number;
    text: string;
    agentResponse?: string;
    streaming: boolean;
    done: boolean;
    interrupted: boolean;
    audioItemId?: string;
    audioContentIndex: number;
    audioReceivedMs: number;
    playbackStartAt?: number;
    truncateAtMs?: number;
};

const SPEECH_STARTED_VAD_SCORE = 1;
const SPEECH_STOPPED_VAD_SCORE = 0;

/** Translates between the Realtime wire protocol and the native conversation event stream. */
export class RealtimeProtocolTranslator {
    private lastEventId = 0;
    private internalEventCount = 0;
    private readonly internalEventIds = new Set<string>();
    private readonly responses = new Map<string, ResponseState>();
    private activeResponseId: string | null = null;
    private lastAudioResponse: ResponseState | null = null;
    private playbackEndsAt = 0;
    private readonly pendingToolCalls = new Set<string>();
    private readonly pendingCorrections = new Map<string, ResponseState>();
    private readonly now: () => number;

    constructor(private readonly options: RealtimeProtocolTranslatorOptions) {
        this.now = options.now ?? (() => Date.now());
    }

    public handleServerEvent(event: RealtimeServerEvent): void {
        switch (event.type) {
            case "response.created": {
                const id = event.response?.id;
                if (typeof id === "string") {
                    this.ensureResponse(id);
                    this.activeResponseId = id;
                }
                return;
            }
            case "response.output_audio.delta":
                this.handleAudioDelta(event);
                return;
            case "response.output_audio_transcript.delta":
            case "response.output_text.delta":
                this.handleTextDelta(event);
                return;
            case "response.done":
                this.handleResponseDone(event);
                return;
            case "input_audio_buffer.speech_started":
                this.emitVadScore(SPEECH_STARTED_VAD_SCORE);
                if (this.options.interruptOnSpeech) {
                    this.interrupt();
                }
                return;
            case "input_audio_buffer.speech_stopped":
                this.emitVadScore(SPEECH_STOPPED_VAD_SCORE);
                return;
            case "conversation.item.input_audio_transcription.completed":
                this.options.emit({
                    type: "user_transcript",
                    user_transcription_event: {
                        user_transcript: event.transcript ?? "",
                        event_id: this.nextEventId(),
                    },
                });
                return;
            case "conversation.item.truncated":
                if (this.pendingCorrections.has(event.item_id)) {
                    this.sendInternal({ type: "conversation.item.retrieve", item_id: event.item_id });
                }
                return;
            case "conversation.item.retrieved":
                this.handleItemRetrieved(event);
                return;
            case "error":
                this.handleError(event);
                return;
            default:
                this.options.debug?.({ type: "realtime_event", event });
        }
    }

    /** @throws {RealtimeUnsupportedFeatureError} For native events with no Realtime equivalent. */
    public handleOutgoingEvent(message: RealtimeOutgoingEvent): void {
        if (!("type" in message)) {
            this.options.send({ type: "input_audio_buffer.append", audio: message.user_audio_chunk });
            return;
        }

        switch (message.type) {
            case "user_message": {
                this.interrupt();
                if (this.activeResponseId) {
                    this.sendInternal({ type: "response.cancel" });
                }
                this.options.send({
                    type: "conversation.item.create",
                    item: {
                        type: "message",
                        role: "user",
                        content: [{ type: "input_text", text: message.text ?? "" }],
                    },
                });
                this.options.send({ type: "response.create" });
                return;
            }
            case "client_tool_result": {
                const callId = message.tool_call_id ?? "";
                this.options.send({
                    type: "conversation.item.create",
                    item: {
                        type: "function_call_output",
                        call_id: message.tool_call_id,
                        output: toolOutput(message.result),
                    },
                });
                // The model only continues once every call from the response has an output.
                if (this.pendingToolCalls.delete(callId) && this.pendingToolCalls.size === 0) {
                    this.options.send({ type: "response.create" });
                }
                return;
            }
            case "pong":
            case "user_activity":
                return;
            default:
                throw new RealtimeUnsupportedFeatureError(message.type);
        }
    }

    // Interruption ids must sit between response ids for stale audio to be dropped.
    private nextEventId(): number {
        return ++this.lastEventId;
    }

    private ensureResponse(id: string): ResponseState {
        let state = this.responses.get(id);
        if (!state) {
            state = {
                id,
                eventId: this.nextEventId(),
                text: "",
                streaming: false,
                done: false,
                interrupted: false,
                audioContentIndex: 0,
                audioReceivedMs: 0,
            };
            this.responses.set(id, state);
        }
        return state;
    }

    private releaseResponse(state: ResponseState): void {
        if (
            state.done &&
            state !== this.lastAudioResponse &&
            !(state.audioItemId && this.pendingCorrections.has(state.audioItemId))
        ) {
            this.responses.delete(state.id);
        }
    }

    private handleAudioDelta(event: RealtimeServerEvent): void {
        if (typeof event.response_id !== "string" || !event.delta) return;
        const state = this.ensureResponse(event.response_id);
        if (state.interrupted) return;

        // The server never reports playback position, so assume back-to-back playback on receipt.
        const now = this.now();
        const durationMs = this.audioDurationMs(event.delta);
        const startAt = Math.max(now, this.playbackEndsAt);
        state.playbackStartAt ??= startAt;
        state.audioReceivedMs += durationMs;
        state.audioItemId = event.item_id;
        state.audioContentIndex = event.content_index ?? 0;
        this.playbackEndsAt = startAt + durationMs;

        const previous = this.lastAudioResponse;
        this.lastAudioResponse = state;
        if (previous && previous !== state) this.releaseResponse(previous);

        this.options.emit({
            type: "audio",
            audio_event: { audio_base_64: event.delta, event_id: state.eventId },
        });
    }

    private handleTextDelta(event: RealtimeServerEvent): void {
        if (typeof event.response_id !== "string") return;
        const state = this.ensureResponse(event.response_id);
        if (state.interrupted || state.done) return;

        if (!state.streaming) {
            state.streaming = true;
            this.emitTextPart(state, "start", "");
        }
        const delta: string = event.delta ?? "";
        state.text += delta;
        this.emitTextPart(state, "delta", delta);
    }

    private handleResponseDone(event: RealtimeServerEvent): void {
        const response = event.response ?? {};
        if (typeof response.id !== "string") return;
        const state = this.ensureResponse(response.id);
        state.done = true;
        if (this.activeResponseId === response.id) {
            this.activeResponseId = null;
        }

        const output: any[] = Array.isArray(response.output) ? response.output : [];
        const text = extractAssistantText(output) || state.text;
        const reachedClient = state.audioReceivedMs > 0 || state.text !== "";
        if (text && (response.status !== "cancelled" || reachedClient)) {
            state.agentResponse = text;
            this.options.emit({
                type: "agent_response",
                agent_response_event: { agent_response: text, event_id: state.eventId, response_id: state.id },
            });
        }
        if (state.streaming) {
            state.streaming = false;
            this.emitTextPart(state, "stop", "");
        }

        if (response.status === "failed") {
            const error = response.status_details?.error ?? {};
            this.emitError(error.message ?? error.code ?? "The response failed.", error);
        }

        if (response.status === "completed") {
            for (const item of output) {
                if (item?.type !== "function_call" || !item.call_id) continue;
                this.pendingToolCalls.add(item.call_id);
                this.options.emit({
                    type: "client_tool_call",
                    client_tool_call: {
                        tool_name: item.name,
                        tool_call_id: item.call_id,
                        parameters: parseToolArguments(item.arguments),
                        event_id: state.eventId,
                    },
                });
            }
        }

        this.sendPendingTruncate(state);
        this.releaseResponse(state);
    }

    /** Stops playback of the latest response and truncates its server-side item to what was heard. */
    private interrupt(): void {
        const now = this.now();

        // Drop what a not-yet-audible response sends before the server-side cancellation lands.
        if (this.activeResponseId) {
            const active = this.responses.get(this.activeResponseId);
            if (active && active.audioReceivedMs === 0) active.interrupted = true;
        }

        const state = this.lastAudioResponse;
        if (!state || state.interrupted) return;
        const isPlaying = this.activeResponseId === state.id || now < this.playbackEndsAt;
        if (!isPlaying) return;

        state.interrupted = true;
        this.playbackEndsAt = now;
        this.options.emit({ type: "interruption", interruption_event: { event_id: this.nextEventId() } });

        const playedMs = Math.floor(Math.min(Math.max(now - (state.playbackStartAt ?? now), 0), state.audioReceivedMs));
        if (state.audioItemId && playedMs < Math.floor(state.audioReceivedMs)) {
            state.truncateAtMs = playedMs;
            if (state.done) this.sendPendingTruncate(state);
        }
    }

    private sendPendingTruncate(state: ResponseState): void {
        if (state.truncateAtMs === undefined || !state.audioItemId) return;
        const audioEndMs = state.truncateAtMs;
        state.truncateAtMs = undefined;
        this.pendingCorrections.set(state.audioItemId, state);
        this.sendInternal({
            type: "conversation.item.truncate",
            item_id: state.audioItemId,
            content_index: state.audioContentIndex,
            audio_end_ms: audioEndMs,
        });
    }

    private handleItemRetrieved(event: RealtimeServerEvent): void {
        const item = event.item ?? {};
        const state = this.pendingCorrections.get(item.id);
        if (!state) return;
        this.pendingCorrections.delete(item.id);

        const corrected = extractAssistantText([item]);
        const original = state.agentResponse;
        if (original !== undefined && corrected !== original) {
            this.options.emit({
                type: "agent_response_correction",
                agent_response_correction_event: {
                    original_agent_response: original,
                    corrected_agent_response: corrected,
                    event_id: state.eventId,
                    response_id: state.id,
                },
            });
        }
        this.releaseResponse(state);
    }

    private handleError(event: RealtimeServerEvent): void {
        const error = event.error ?? {};
        if (error.event_id && this.internalEventIds.has(error.event_id)) {
            // Errors from SDK-initiated requests don't affect the conversation.
            this.options.debug?.({ type: "realtime_internal_error", error });
            return;
        }
        this.emitError(error.message ?? "Unknown error", error);
    }

    private emitError(message: string, error: Record<string, unknown>): void {
        this.options.emit({
            type: "error",
            error_event: {
                code: error.type === "invalid_request_error" ? 1008 : 1011,
                message,
                error_type: "unknown",
                details: { type: error.type, code: error.code, param: error.param, event_id: error.event_id },
            },
        });
    }

    private emitVadScore(vadScore: number): void {
        this.options.emit({ type: "vad_score", vad_score_event: { vad_score: vadScore } });
    }

    private emitTextPart(state: ResponseState, type: "start" | "delta" | "stop", text: string): void {
        this.options.emit({
            type: "agent_chat_response_part",
            text_response_part: { text, type, event_id: state.eventId, response_id: state.id },
        });
    }

    private sendInternal(event: RealtimeClientEvent): void {
        const eventId = `sdk_${++this.internalEventCount}`;
        this.internalEventIds.add(eventId);
        this.options.send({ ...event, event_id: eventId });
    }

    private audioDurationMs(base64: string): number {
        const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
        const bytes = Math.floor((base64.length * 3) / 4) - padding;
        const { encoding, sampleRate } = this.options.outputFormat;
        const bytesPerSample = encoding === "ulaw" ? 1 : 2;
        return (bytes / bytesPerSample / sampleRate) * 1000;
    }
}

function toolOutput(result: unknown): string {
    if (result === undefined || result === null) return "";
    if (typeof result === "string") return result;
    try {
        return JSON.stringify(result) ?? String(result);
    } catch {
        return String(result);
    }
}

function extractAssistantText(items: any[]): string {
    let text = "";
    for (const item of items) {
        if (item?.type !== "message" || item.role !== "assistant") continue;
        for (const part of Array.isArray(item.content) ? item.content : []) {
            text += part?.transcript ?? part?.text ?? "";
        }
    }
    return text;
}

function parseToolArguments(args: unknown): Record<string, any> {
    if (typeof args !== "string" || args === "") return {};
    try {
        const parsed = JSON.parse(args);
        return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
        return {};
    }
}
