import { afterEach, describe, expect, it, jest } from "@jest/globals";
import {
    ClientTools,
    Conversation,
    RealtimeConnectionError,
} from "../../src/api/resources/conversationalAi/conversation";
import {
    MockAudioInterface,
    MockConversationClient,
    MockWebSocket,
    MockWebSocketFactory,
} from "../../src/api/resources/conversationalAi/conversation/mocks/MockConversation";
import {
    RealtimeAudioConverter,
    ulawDecode,
    ulawEncode,
} from "../../src/api/resources/conversationalAi/conversation/RealtimeAudio";
import {
    NativeServerEvent,
    RealtimeProtocolTranslator,
    RealtimeUnsupportedFeatureError,
} from "../../src/api/resources/conversationalAi/conversation/RealtimeProtocol";
import {
    RealtimeClientEvent,
    RealtimeWireFormat,
    buildSessionUpdate,
} from "../../src/api/resources/conversationalAi/conversation/RealtimeSession";
import { SDK_VERSION } from "../../src/version";

const PCM_24K: RealtimeWireFormat = { encoding: "pcm", sampleRate: 24000 };
const ULAW_8K: RealtimeWireFormat = { encoding: "ulaw", sampleRate: 8000 };
const PCM_24K_BYTES_PER_MS = 48;

const EFFECTIVE_SESSION = {
    type: "realtime",
    id: "sess_123",
    audio: {
        input: {
            format: { type: "audio/pcm", rate: 24000 },
            turn_detection: { type: "semantic_vad", interrupt_response: true },
        },
        output: { format: { type: "audio/pcm", rate: 24000 }, voice: "marin" },
    },
};

function pcmChunk(durationMs: number): string {
    return Buffer.alloc(durationMs * PCM_24K_BYTES_PER_MS).toString("base64");
}

/** The resampler holds back its last sample for the next chunk, so lengths are approximate. */
function expectPcm16Samples(audio: Buffer, expected: number): void {
    expect(Math.abs(audio.length / 2 - expected)).toBeLessThanOrEqual(2);
}

function assistantMessage(itemId: string, transcript: string) {
    return {
        id: itemId,
        type: "message",
        role: "assistant",
        content: [{ type: "output_audio", transcript }],
    };
}

class TranslatorHarness {
    public now = 10_000;
    public emitted: NativeServerEvent[] = [];
    public sent: RealtimeClientEvent[] = [];
    public readonly translator: RealtimeProtocolTranslator;

    constructor(interruptOnSpeech = true) {
        this.translator = new RealtimeProtocolTranslator({
            outputFormat: PCM_24K,
            interruptOnSpeech,
            emit: (event) => this.emitted.push(event),
            send: (event) => this.sent.push(event),
            now: () => this.now,
        });
    }

    server(event: Record<string, any>): void {
        this.translator.handleServerEvent(event as any);
    }

    outgoing(message: Record<string, any>): void {
        this.translator.handleOutgoingEvent(message as any);
    }

    startResponse(responseId: string): void {
        this.server({ type: "response.created", response: { id: responseId, status: "in_progress" } });
    }

    audioDelta(responseId: string, itemId: string, durationMs: number): void {
        this.server({
            type: "response.output_audio.delta",
            response_id: responseId,
            item_id: itemId,
            content_index: 0,
            delta: pcmChunk(durationMs),
        });
    }

    finishResponse(responseId: string, status: string, output: unknown[] = []): void {
        this.server({ type: "response.done", response: { id: responseId, status, output } });
    }

    speechStarted(): void {
        this.server({ type: "input_audio_buffer.speech_started", audio_start_ms: 0, item_id: "user_1" });
    }

    types(): string[] {
        return this.emitted.map((event) => event.type);
    }
}

describe("RealtimeProtocolTranslator", () => {
    describe("agent turns", () => {
        it("streams text, audio and the final response in native order", () => {
            const h = new TranslatorHarness();
            h.startResponse("resp_1");
            h.server({ type: "response.output_audio_transcript.delta", response_id: "resp_1", delta: "Hello" });
            h.audioDelta("resp_1", "item_1", 100);
            h.server({ type: "response.output_audio_transcript.delta", response_id: "resp_1", delta: " there" });
            h.finishResponse("resp_1", "completed", [assistantMessage("item_1", "Hello there")]);

            expect(h.types()).toEqual([
                "agent_chat_response_part",
                "agent_chat_response_part",
                "audio",
                "agent_chat_response_part",
                "agent_response",
                "agent_chat_response_part",
            ]);
            expect(h.emitted[0].text_response_part).toEqual({
                text: "",
                type: "start",
                event_id: 1,
                response_id: "resp_1",
            });
            expect(h.emitted[2]).toEqual({ type: "audio", audio_event: { audio_base_64: pcmChunk(100), event_id: 1 } });
            expect(h.emitted[4].agent_response_event).toEqual({
                agent_response: "Hello there",
                event_id: 1,
                response_id: "resp_1",
            });
            expect(h.emitted[5].text_response_part.type).toBe("stop");
        });

        it("reports failed responses as errors", () => {
            const h = new TranslatorHarness();
            h.startResponse("resp_1");
            h.server({
                type: "response.done",
                response: {
                    id: "resp_1",
                    status: "failed",
                    status_details: { error: { type: "server_error", message: "Model overloaded" } },
                },
            });
            const last = h.emitted[h.emitted.length - 1];
            expect(last.type).toBe("error");
            expect(last.error_event.message).toBe("Model overloaded");
            expect(last.error_event.code).toBe(1011);
        });

        it("maps speech start and stop to VAD scores", () => {
            const h = new TranslatorHarness();
            h.speechStarted();
            h.server({ type: "input_audio_buffer.speech_stopped" });
            expect(h.emitted.map((e) => e.vad_score_event.vad_score)).toEqual([1, 0]);
        });

        it("emits user transcripts", () => {
            const h = new TranslatorHarness();
            h.server({ type: "conversation.item.input_audio_transcription.completed", transcript: "Hi there" });
            expect(h.emitted).toEqual([
                { type: "user_transcript", user_transcription_event: { user_transcript: "Hi there", event_id: 1 } },
            ]);
        });
    });

    describe("interruptions", () => {
        it("interrupts playback and truncates to the audio the user heard", () => {
            const h = new TranslatorHarness();
            h.startResponse("resp_1");
            h.audioDelta("resp_1", "item_1", 1000);
            h.audioDelta("resp_1", "item_1", 1000);
            h.finishResponse("resp_1", "completed", [assistantMessage("item_1", "A long answer that keeps going")]);

            h.now += 700;
            h.speechStarted();

            expect(h.emitted).toContainEqual({ type: "interruption", interruption_event: { event_id: 2 } });
            expect(h.sent).toEqual([
                {
                    type: "conversation.item.truncate",
                    item_id: "item_1",
                    content_index: 0,
                    audio_end_ms: 700,
                    event_id: "sdk_1",
                },
            ]);

            h.server({ type: "conversation.item.truncated", item_id: "item_1", content_index: 0, audio_end_ms: 700 });
            expect(h.sent[1]).toEqual({ type: "conversation.item.retrieve", item_id: "item_1", event_id: "sdk_2" });

            h.server({ type: "conversation.item.retrieved", item: assistantMessage("item_1", "A long answer") });
            expect(h.emitted[h.emitted.length - 1]).toEqual({
                type: "agent_response_correction",
                agent_response_correction_event: {
                    original_agent_response: "A long answer that keeps going",
                    corrected_agent_response: "A long answer",
                    event_id: 1,
                    response_id: "resp_1",
                },
            });
        });

        it("defers truncation until the interrupted response is done", () => {
            const h = new TranslatorHarness();
            h.startResponse("resp_1");
            h.audioDelta("resp_1", "item_1", 1000);
            h.now += 300;
            h.speechStarted();
            expect(h.types()).toContain("interruption");
            expect(h.sent).toEqual([]);

            h.audioDelta("resp_1", "item_1", 1000);
            expect(h.types().filter((type) => type === "audio")).toHaveLength(1);

            h.finishResponse("resp_1", "cancelled", [assistantMessage("item_1", "Partial")]);
            expect(h.sent).toHaveLength(1);
            expect(h.sent[0].type).toBe("conversation.item.truncate");
            expect(h.sent[0].audio_end_ms).toBe(300);
        });

        it("does not interrupt once playback has finished", () => {
            const h = new TranslatorHarness();
            h.startResponse("resp_1");
            h.audioDelta("resp_1", "item_1", 500);
            h.finishResponse("resp_1", "completed", [assistantMessage("item_1", "Hi")]);
            h.now += 600;
            h.speechStarted();
            expect(h.types()).not.toContain("interruption");
            expect(h.sent).toEqual([]);
        });

        it("keeps playing when interrupt_response is disabled", () => {
            const h = new TranslatorHarness(false);
            h.startResponse("resp_1");
            h.audioDelta("resp_1", "item_1", 1000);
            h.now += 100;
            h.speechStarted();
            expect(h.types()).not.toContain("interruption");
        });

        it("gives the next response an event id above the interruption", () => {
            const h = new TranslatorHarness();
            h.startResponse("resp_1");
            h.audioDelta("resp_1", "item_1", 1000);
            h.now += 100;
            h.speechStarted();
            h.finishResponse("resp_1", "cancelled");
            h.startResponse("resp_2");
            h.audioDelta("resp_2", "item_2", 100);

            const interruption = h.emitted.find((e) => e.type === "interruption")!;
            const audio = h.emitted.filter((e) => e.type === "audio").pop()!;
            expect(interruption.interruption_event.event_id).toBe(2);
            expect(audio.audio_event.event_id).toBe(3);
        });

        it("ignores errors caused by its own requests", () => {
            const h = new TranslatorHarness();
            h.startResponse("resp_1");
            h.audioDelta("resp_1", "item_1", 1000);
            h.finishResponse("resp_1", "completed", [assistantMessage("item_1", "Hi")]);
            h.now += 100;
            h.speechStarted();
            h.emitted = [];

            h.server({
                type: "error",
                error: { type: "invalid_request_error", message: "out of range", event_id: "sdk_1" },
            });
            expect(h.emitted).toEqual([]);
        });

        it("reports other errors", () => {
            const h = new TranslatorHarness();
            h.server({ type: "error", error: { type: "invalid_request_error", message: "Bad tool" } });
            expect(h.emitted[0].error_event.code).toBe(1008);
            expect(h.emitted[0].error_event.message).toBe("Bad tool");
        });
    });

    describe("client tools", () => {
        it("calls tools from completed responses and resumes once all results are in", () => {
            const h = new TranslatorHarness();
            h.startResponse("resp_1");
            h.finishResponse("resp_1", "completed", [
                { type: "function_call", call_id: "call_1", name: "get_weather", arguments: '{"city":"Paris"}' },
                { type: "function_call", call_id: "call_2", name: "get_time", arguments: "" },
            ]);
            expect(h.emitted).toEqual([
                {
                    type: "client_tool_call",
                    client_tool_call: {
                        tool_name: "get_weather",
                        tool_call_id: "call_1",
                        parameters: { city: "Paris" },
                        event_id: 1,
                    },
                },
                {
                    type: "client_tool_call",
                    client_tool_call: { tool_name: "get_time", tool_call_id: "call_2", parameters: {}, event_id: 1 },
                },
            ]);

            h.outgoing({ type: "client_tool_result", tool_call_id: "call_1", result: "Sunny", is_error: false });
            expect(h.sent).toEqual([
                {
                    type: "conversation.item.create",
                    item: { type: "function_call_output", call_id: "call_1", output: "Sunny" },
                },
            ]);

            h.outgoing({ type: "client_tool_result", tool_call_id: "call_2", result: { time: "noon" } });
            expect(h.sent.slice(1)).toEqual([
                {
                    type: "conversation.item.create",
                    item: { type: "function_call_output", call_id: "call_2", output: '{"time":"noon"}' },
                },
                { type: "response.create" },
            ]);
        });

        it("does not call tools from responses that did not complete", () => {
            const h = new TranslatorHarness();
            h.startResponse("resp_1");
            h.finishResponse("resp_1", "cancelled", [
                { type: "function_call", call_id: "call_1", name: "x", arguments: "{}" },
            ]);
            expect(h.types()).not.toContain("client_tool_call");
        });
    });

    describe("outgoing events", () => {
        it("appends user audio to the input buffer", () => {
            const h = new TranslatorHarness();
            h.outgoing({ user_audio_chunk: "AAAA" });
            expect(h.sent).toEqual([{ type: "input_audio_buffer.append", audio: "AAAA" }]);
        });

        it("sends user messages and requests a response", () => {
            const h = new TranslatorHarness();
            h.outgoing({ type: "user_message", text: "Hi" });
            expect(h.sent).toEqual([
                {
                    type: "conversation.item.create",
                    item: { type: "message", role: "user", content: [{ type: "input_text", text: "Hi" }] },
                },
                { type: "response.create" },
            ]);
        });

        it("cancels the active response before sending a user message", () => {
            const h = new TranslatorHarness();
            h.startResponse("resp_1");
            h.audioDelta("resp_1", "item_1", 1000);
            h.outgoing({ type: "user_message", text: "Stop" });
            expect(h.types()).toContain("interruption");
            expect(h.sent.map((e) => e.type)).toEqual([
                "response.cancel",
                "conversation.item.create",
                "response.create",
            ]);
        });

        it("drops events that need no wire equivalent", () => {
            const h = new TranslatorHarness();
            h.outgoing({ type: "pong", event_id: 1 });
            h.outgoing({ type: "user_activity" });
            expect(h.sent).toEqual([]);
        });

        it.each([
            { type: "contextual_update", text: "The user is on the pricing page" },
            { type: "feedback", feedback: "like" },
            { type: "multimodal_message", text: { type: "user_message", text: "x" } },
        ])("rejects unsupported event %o", (message) => {
            const h = new TranslatorHarness();
            expect(() => h.outgoing(message)).toThrow(RealtimeUnsupportedFeatureError);
            expect(h.sent).toEqual([]);
        });
    });
});

describe("buildSessionUpdate", () => {
    it("sends only the formats by default", () => {
        expect(buildSessionUpdate({}, false)).toEqual({
            type: "session.update",
            session: {
                type: "realtime",
                output_modalities: ["audio"],
                audio: {
                    input: { format: { type: "audio/pcm", rate: 24000 } },
                    output: { format: { type: "audio/pcm", rate: 24000 } },
                },
            },
        });
    });

    it("maps every option to its wire field", () => {
        const update = buildSessionUpdate(
            {
                instructions: "Be brief.",
                voice: "marin",
                inputAudioFormat: "ulaw_8000",
                outputAudioFormat: "ulaw_8000",
                turnDetection: { type: "semantic_vad", eagerness: "high", interruptResponse: false },
                tools: [{ name: "get_weather", description: "Weather", parameters: { type: "object" } }],
                temperature: 0.7,
                maxOutputTokens: "inf",
            },
            true,
        );
        expect(update.session).toEqual({
            type: "realtime",
            output_modalities: ["text"],
            instructions: "Be brief.",
            audio: {
                input: {
                    format: { type: "audio/pcmu" },
                    turn_detection: { type: "semantic_vad", eagerness: "high", interrupt_response: false },
                },
                output: { format: { type: "audio/pcmu" }, voice: "marin" },
            },
            tools: [{ type: "function", name: "get_weather", description: "Weather", parameters: { type: "object" } }],
            temperature: 0.7,
            max_output_tokens: "inf",
        });
    });

    it("sends null turn detection to disable it", () => {
        const update = buildSessionUpdate({ turnDetection: null }, false) as any;
        expect(update.session.audio.input.turn_detection).toBeNull();
    });
});

describe("RealtimeAudioConverter", () => {
    it("resamples PCM between 16kHz and 24kHz", () => {
        const converter = new RealtimeAudioConverter(PCM_24K, PCM_24K);
        const wire = converter.encodeInput(Buffer.alloc(16000 * 2));
        expect(Math.abs(wire.length / 2 - 24000)).toBeLessThanOrEqual(2);

        const back = converter.decodeOutput(Buffer.alloc(24000 * 2));
        expect(Math.abs(back.length / 2 - 16000)).toBeLessThanOrEqual(2);
    });

    it("produces the same output when streamed in odd-sized chunks", () => {
        const pcm = Buffer.alloc(1600 * 2);
        for (let n = 0; n < 1600; n++) {
            pcm.writeInt16LE(Math.trunc(10000 * Math.sin((2 * Math.PI * 440 * n) / 16000)), n * 2);
        }

        const oneShot = new RealtimeAudioConverter(PCM_24K, PCM_24K).encodeInput(pcm);
        const chunkedConverter = new RealtimeAudioConverter(PCM_24K, PCM_24K);
        const chunks: Buffer[] = [];
        for (let i = 0; i < pcm.length; i += 333) {
            chunks.push(chunkedConverter.encodeInput(pcm.subarray(i, i + 333)));
        }
        expect(Buffer.concat(chunks).equals(oneShot)).toBe(true);
    });

    it("round-trips μ-law within the codec's quantisation error", () => {
        const samples = [0, 1000, -1000, 8000, -8000, 32000, -32000];
        for (const sample of samples) {
            const roundTrip = ulawDecode(ulawEncode(sample));
            expect(Math.abs(sample - roundTrip)).toBeLessThanOrEqual(Math.max(Math.floor(Math.abs(sample) / 16), 8));
        }

        const pcm16k = Buffer.alloc(samples.length * 2 * 2);
        const converter = new RealtimeAudioConverter(ULAW_8K, ULAW_8K);
        expect(converter.encodeInput(pcm16k).length).toBe(samples.length);
        expectPcm16Samples(converter.decodeOutput(Buffer.alloc(800, 0xff)), 1600);
    });
});

describe("Conversation options", () => {
    const audioInterface = new MockAudioInterface();

    it("requires a client secret", () => {
        expect(
            () => new Conversation({ connectionType: "websocket-realtime", clientSecret: "", audioInterface }),
        ).toThrow(/clientSecret/);
    });

    it("rejects saved-agent options", () => {
        expect(
            () =>
                new Conversation({
                    connectionType: "websocket-realtime",
                    clientSecret: "ek_test",
                    audioInterface,
                    agentId: "agent",
                    requiresAuth: true,
                    config: { extraBody: {} },
                } as any),
        ).toThrow("websocket-realtime connections do not support: agentId, requiresAuth, config.");
    });

    it("allows requiresAuth: false", () => {
        expect(
            () =>
                new Conversation({
                    connectionType: "websocket-realtime",
                    clientSecret: "ek_test",
                    audioInterface,
                    requiresAuth: false,
                } as any),
        ).not.toThrow();
    });

    it("rejects session options the endpoint does not support", () => {
        expect(
            () =>
                new Conversation({
                    connectionType: "websocket-realtime",
                    clientSecret: "ek_test",
                    audioInterface,
                    realtime: { inputAudioFormat: "pcm_16000" as any },
                }),
        ).toThrow(/Unsupported realtime audio format "pcm_16000"/);
        expect(
            () =>
                new Conversation({
                    connectionType: "websocket-realtime",
                    clientSecret: "ek_test",
                    audioInterface,
                    realtime: { tools: [{ name: "a" }, { name: "a" }] },
                }),
        ).toThrow(/Duplicate realtime tool name "a"/);
    });

    it("rejects unknown connection types", () => {
        expect(
            () =>
                new Conversation({
                    connectionType: "webrtc",
                    agentId: "agent",
                    requiresAuth: false,
                    audioInterface,
                } as any),
        ).toThrow(/Unsupported connectionType "webrtc"/);
    });
});

describe("Conversation over websocket-realtime", () => {
    let conversation: Conversation | undefined;

    afterEach(() => {
        jest.useRealTimers();
        if (conversation?.isSessionActive()) conversation.endSession();
        conversation = undefined;
    });

    function createConversation(overrides: Record<string, unknown> = {}) {
        const factory = new MockWebSocketFactory();
        const audioInterface = new MockAudioInterface();
        const clientTools = new ClientTools();
        const callbacks = {
            agentResponse: jest.fn<(response: string) => void>(),
            userTranscript: jest.fn<(transcript: string) => void>(),
        };
        conversation = new Conversation({
            connectionType: "websocket-realtime",
            clientSecret: "ek_test",
            realtime: { instructions: "Be brief.", tools: [{ name: "get_weather" }] },
            webSocketFactory: factory,
            audioInterface,
            clientTools,
            callbackAgentResponse: callbacks.agentResponse,
            callbackUserTranscript: callbacks.userTranscript,
            ...overrides,
        } as any);
        return { conversation, factory, ws: factory.getMockWebSocket(), audioInterface, clientTools, callbacks };
    }

    async function completeHandshake(ws: MockWebSocket, session: object = EFFECTIVE_SESSION): Promise<void> {
        ws.simulateMessage({ type: "session.created", session: { id: "sess_123" } });
        ws.simulateMessage({ type: "session.updated", session });
    }

    function nextTick(): Promise<void> {
        return new Promise((resolve) => setImmediate(resolve));
    }

    it("authenticates with subprotocols and configures the session before starting", async () => {
        const { conversation, factory, ws, audioInterface } = createConversation();
        const started = jest.fn();
        conversation.on("conversation_started", started);

        const session = conversation.startSession();
        expect(factory.lastUrl).toBe(`wss://api.elevenlabs.io/v1/convai/realtime?source=js_sdk&version=${SDK_VERSION}`);
        expect(factory.lastProtocols).toEqual(["realtime", "openai-insecure-api-key.ek_test"]);
        expect(audioInterface.isAudioStarted()).toBe(false);

        ws.simulateMessage({ type: "session.created", session: { id: "sess_123" } });
        expect(ws.getLastMessage()).toEqual(
            buildSessionUpdate({ instructions: "Be brief.", tools: [{ name: "get_weather" }] }, false),
        );

        ws.simulateMessage({ type: "session.updated", session: EFFECTIVE_SESSION });
        await session;

        expect(started).toHaveBeenCalledWith("sess_123");
        expect(conversation.getConversationId()).toBe("sess_123");
        expect(audioInterface.isAudioStarted()).toBe(true);
        expect(conversation.isSessionActive()).toBe(true);
    });

    it("uses a custom origin", async () => {
        const { conversation, factory, ws } = createConversation({ origin: "wss://api.eu.residency.elevenlabs.io" });
        const session = conversation.startSession();
        await completeHandshake(ws);
        await session;
        expect(factory.lastUrl).toMatch(/^wss:\/\/api\.eu\.residency\.elevenlabs\.io\/v1\/convai\/realtime\?/);
    });

    it("translates audio, messages and transcripts in both directions", async () => {
        const { conversation, ws, audioInterface, callbacks } = createConversation();
        const session = conversation.startSession();
        await completeHandshake(ws);
        await session;
        ws.clearMessages();

        audioInterface.simulateAudioInput(Buffer.alloc(16 * 2 * 10));
        const append = ws.getLastMessage();
        expect(append.type).toBe("input_audio_buffer.append");
        expectPcm16Samples(Buffer.from(append.audio, "base64"), 240);

        conversation.sendUserMessage("What's the weather?");
        expect(ws.getSentMessages().slice(1)).toEqual([
            {
                type: "conversation.item.create",
                item: {
                    type: "message",
                    role: "user",
                    content: [{ type: "input_text", text: "What's the weather?" }],
                },
            },
            { type: "response.create" },
        ]);

        ws.simulateMessage({ type: "conversation.item.input_audio_transcription.completed", transcript: " Hello " });
        expect(callbacks.userTranscript).toHaveBeenCalledWith("Hello");

        ws.simulateMessage({ type: "response.created", response: { id: "resp_1" } });
        ws.simulateMessage({
            type: "response.output_audio.delta",
            response_id: "resp_1",
            item_id: "item_1",
            content_index: 0,
            delta: pcmChunk(10),
        });
        ws.simulateMessage({
            type: "response.done",
            response: { id: "resp_1", status: "completed", output: [assistantMessage("item_1", "Sunny.")] },
        });

        const output = audioInterface.getOutputBuffer();
        expect(output).toHaveLength(1);
        expectPcm16Samples(output[0], 160);
        expect(callbacks.agentResponse).toHaveBeenCalledWith("Sunny.");
    });

    it("runs client tools and sends their results back", async () => {
        const { conversation, ws, clientTools } = createConversation();
        const handler = jest.fn((parameters: Record<string, any>) => `Sunny in ${parameters.city}`);
        clientTools.register("get_weather", handler, false);

        const session = conversation.startSession();
        await completeHandshake(ws);
        await session;
        ws.clearMessages();

        ws.simulateMessage({ type: "response.created", response: { id: "resp_1" } });
        ws.simulateMessage({
            type: "response.done",
            response: {
                id: "resp_1",
                status: "completed",
                output: [
                    { type: "function_call", call_id: "call_1", name: "get_weather", arguments: '{"city":"Paris"}' },
                ],
            },
        });
        await nextTick();
        await nextTick();

        expect(handler).toHaveBeenCalledWith({ tool_call_id: "call_1", city: "Paris" });
        expect(ws.getSentMessages()).toEqual([
            {
                type: "conversation.item.create",
                item: { type: "function_call_output", call_id: "call_1", output: "Sunny in Paris" },
            },
            { type: "response.create" },
        ]);
    });

    it("throws for features the endpoint does not support", async () => {
        const { conversation, ws } = createConversation();
        const session = conversation.startSession();
        await completeHandshake(ws);
        await session;
        ws.clearMessages();

        expect(() => conversation.sendContextualUpdate("On the pricing page")).toThrow(RealtimeUnsupportedFeatureError);
        expect(() => conversation.sendMultimodalMessage({ text: "Hi", fileIds: ["file_1"] })).toThrow(
            RealtimeUnsupportedFeatureError,
        );
        conversation.registerUserActivity();
        expect(ws.getSentMessages()).toEqual([]);
    });

    it("decodes μ-law output when the server selects it", async () => {
        const { conversation, ws, audioInterface } = createConversation({
            realtime: { inputAudioFormat: "ulaw_8000", outputAudioFormat: "ulaw_8000" },
        });
        const session = conversation.startSession();
        await completeHandshake(ws, {
            id: "sess_123",
            audio: { input: { format: { type: "audio/pcmu" } }, output: { format: { type: "audio/pcmu" } } },
        });
        await session;
        ws.clearMessages();

        audioInterface.simulateAudioInput(Buffer.alloc(160 * 2));
        expect(Buffer.from(ws.getLastMessage().audio, "base64").length).toBe(80);

        ws.simulateMessage({ type: "response.created", response: { id: "resp_1" } });
        ws.simulateMessage({
            type: "response.output_audio.delta",
            response_id: "resp_1",
            item_id: "item_1",
            delta: Buffer.alloc(80, 0xff).toString("base64"),
        });
        expectPcm16Samples(audioInterface.getOutputBuffer()[0], 160);
    });

    it("rejects with the close reason when the workspace has no Realtime access", async () => {
        const { conversation, ws, audioInterface } = createConversation();
        const session = conversation.startSession();
        ws.emit("close", 4003, Buffer.from(""));

        await expect(session).rejects.toThrow(RealtimeConnectionError);
        await expect(session).rejects.toMatchObject({
            message: "The Realtime API is not enabled for this workspace.",
            closeCode: 4003,
        });
        expect(audioInterface.isAudioStarted()).toBe(false);
        expect(conversation.isSessionActive()).toBe(false);
    });

    it("rejects when the server reports an error during the handshake", async () => {
        const { conversation, ws } = createConversation();
        const session = conversation.startSession();
        ws.simulateMessage({ type: "session.created", session: { id: "sess_123" } });
        ws.simulateMessage({ type: "error", error: { type: "invalid_request_error", message: "Unknown voice" } });

        await expect(session).rejects.toThrow(new RealtimeConnectionError("Unknown voice"));
        expect(ws.readyState).toBe(3);
    });

    it("rejects when the handshake times out", async () => {
        jest.useFakeTimers();
        const { conversation } = createConversation();
        const session = conversation.startSession();
        jest.advanceTimersByTime(10000);

        await expect(session).rejects.toThrow(/Timed out waiting for the Realtime session/);
    });
});

describe("Conversation over websocket", () => {
    it("still connects to the saved agent without subprotocols", async () => {
        const factory = new MockWebSocketFactory();
        const conversation = new Conversation({
            agentId: "agent_123",
            requiresAuth: false,
            client: {} as any,
            conversationClient: new MockConversationClient(),
            webSocketFactory: factory,
            audioInterface: new MockAudioInterface(),
        });

        const session = conversation.startSession();
        factory.getMockWebSocket().simulateOpen();
        await session;

        expect(factory.lastUrl).toBe(
            `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=agent_123&source=js_sdk&version=${SDK_VERSION}`,
        );
        expect(factory.lastProtocols).toBeUndefined();
        expect(factory.getMockWebSocket().getSentMessages()[0].type).toBe("conversation_initiation_client_data");

        conversation.sendContextualUpdate("On the pricing page");
        expect(factory.getMockWebSocket().getLastMessage()).toEqual({
            type: "contextual_update",
            text: "On the pricing page",
        });
        conversation.endSession();
    });
});
