export * as SpeechEngine from "./namespace";
export { SpeechEngineAttachment } from "./SpeechEngineAttachment";
export { SpeechEngineClientWrapper } from "./SpeechEngineClientWrapper";
export { SpeechEngineResource } from "./SpeechEngineResource";
export { SpeechEngineServer, type SpeechEngineServerOptions } from "./SpeechEngineServer";
export { SpeechEngineSession } from "./SpeechEngineSession";
export type {
    AgentResponseMessage,
    CloseMessage,
    ErrorMessage,
    IncomingMessage,
    InitMessage,
    OutgoingMessage,
    PingMessage,
    PongMessage,
    SpeechEngineCallbacks,
    SpeechEngineEventMap,
    SpeechEngineEventName,
    TranscriptMessage,
    UserTranscriptMessage,
    WebSocketLike,
} from "./types";
