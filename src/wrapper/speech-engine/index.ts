export * as SpeechEngine from "./namespace";

export { SpeechEngineSession } from "./SpeechEngineSession";
export { SpeechEngineServer, type SpeechEngineServerOptions } from "./SpeechEngineServer";
export { SpeechEngineResource } from "./SpeechEngineResource";
export { SpeechEngineAttachment } from "./SpeechEngineAttachment";
export { SpeechEngineClientWrapper } from "./SpeechEngineClientWrapper";
export type {
    TranscriptMessage,
    InitMessage,
    UserTranscriptMessage,
    PingMessage,
    CloseMessage,
    ErrorMessage,
    IncomingMessage,
    AgentResponseMessage,
    PongMessage,
    OutgoingMessage,
    SpeechEngineEventMap,
    SpeechEngineEventName,
    SpeechEngineCallbacks,
    WebSocketLike,
} from "./types";
