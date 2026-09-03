---
name: elevenlabs:sdk-migration
description: Migrate code from @elevenlabs/elevenlabs-js v2.x to v3. Use when updating code that uses client.conversationalAi, ScribeRealtime, RealtimeConnection, speechToText.realtime.connect, voices.getAll, textToVoice.createPreviews, speechEngine attach, or related APIs. Also trigger when users mention upgrading the ElevenLabs JS SDK, fixing breaking changes after an npm update to @elevenlabs/elevenlabs-js, or encountering type errors or runtime errors after updating to v3.
license: MIT
---

# ElevenLabs JS SDK v2 → v3 Migration

Migration guide for `@elevenlabs/elevenlabs-js` v3 breaking changes.

## Migration order

1. **Check the runtime** — v3 requires Node.js ≥ 18 (native `fetch`; `node-fetch` was removed).
2. **Install**: `npm install @elevenlabs/elevenlabs-js@3` (during prerelease: `@beta`).
3. **Rename the namespace** — every `client.conversationalAi.*` becomes `client.agents.*`.
4. **Replace removed endpoints** — deprecated v2 endpoints are gone (table below).
5. **Migrate realtime code** — the hand-written `ScribeRealtime` client is replaced by generated WebSocket clients.
6. **Update Speech Engine `attach()` calls** to the options-object signature.
7. **Compile** and fix renamed helper types (verb-first names).

## `conversationalAi` → `agents`

API URLs are unchanged (`/v1/convai/*`); only the SDK namespace moves. The former `agents` sub-resource is flattened onto the group:

```ts
// Before
await client.conversationalAi.agents.create({ conversationConfig: {} });
await client.conversationalAi.conversations.list();
await client.conversationalAi.knowledgeBase.documents.createFromUrl({ url });

// After
await client.agents.create({ conversationConfig: {} });
await client.agents.conversations.list();
await client.agents.knowledgeBase.documents.createFromUrl({ url });
```

Mechanical rule: `client.conversationalAi.agents.<x>` → `client.agents.<x>`; every other `client.conversationalAi.<x>` → `client.agents.<x>`. One exception: the per-agent LLM usage endpoint is `client.agents.agents.llmUsage.calculate` (the workspace-level one is `client.agents.llmUsage.calculate`).

## Removed endpoints

Removed | Use instead
-- | --
`client.voices.getAll(...)` | `client.voices.search(...)`
`client.textToVoice.createPreviews(...)` | `client.textToVoice.design(...)`
`client.conversationalAi.addToKnowledgeBase(...)` | `client.agents.knowledgeBase.documents.createFromFile/FromUrl/FromText`
`client.conversationalAi.agents.simulateConversation(...)` (+ `Stream`) | agent-testing endpoints under `client.agents.tests.*`
`client.conversationalAi.mcpServers.approvalPolicy.update(...)` | `client.agents.mcpServers.update(...)`
`client.usage.get(...)` | workspace analytics usage queries
`client.dubbing.resource.*` (all 13 methods) | Dubbing Studio endpoints
`cloudStorageUrl` param on `speechToText.convert` | `sourceUrl`

## Realtime speech-to-text

The `ScribeRealtime` wrapper and its exports (`RealtimeConnection`, `RealtimeEvents`, `AudioFormat`, `CommitStrategy`, `AudioOptions`, `UrlOptions`, message types) are removed from the package root.

**Before:**

```ts
import { AudioFormat, RealtimeEvents } from "@elevenlabs/elevenlabs-js";

const connection = await client.speechToText.realtime.connect({
    modelId: "scribe_v2_realtime",
    audioFormat: AudioFormat.PCM_16000,
    sampleRate: 16000,
});
connection.on(RealtimeEvents.Transcript, (msg) => console.log(msg));
connection.sendAudio(chunk);
```

**After:**

```ts
const socket = await client.speechToText.realtime({
    modelId: "scribe_v2_realtime",
    audioFormat: "pcm_16000",
});
socket.on("message", (msg) => console.log(msg));
socket.on("error", (err) => console.error(err));
await socket.waitForOpen();
socket.sendPublish({ audioBase64: chunk.toString("base64") });
socket.close();
```

- Event names are plain strings: `"open"`, `"message"`, `"close"`, `"error"`.
- URL-based streaming (the v2 `url` option that shelled out to ffmpeg) has no generated equivalent — stream the audio yourself and send chunks.
- Realtime TTS, dialogue, multi-context, and translation have equivalent generated clients (`client.textToSpeech.realtime(...)`, `client.textToDialogue.realtime(...)`, etc.).

## Speech Engine `attach()` options object

```ts
// Before
engine.attach(httpServer, "/ws", { onTranscript });
elevenlabs.speechEngine.attach("seng_123", httpServer, "/ws", { onTranscript });

// After
engine.attach({ server: httpServer, path: "/ws", onTranscript });
elevenlabs.speechEngine.attach("seng_123", { server: httpServer, path: "/ws", onTranscript });
```

The type is `SpeechEngineAttachOptions` (extends `SpeechEngineCallbacks`). Everything else about Speech Engine is unchanged.

## Serialization change

Request-object properties explicitly set to `undefined` are now **omitted** from JSON bodies instead of being sent as `null`. If code intentionally sent `null` by passing `undefined` (e.g. to clear a field on update endpoints), pass an explicit `null` where the API type allows it.

## Module format

Dual CJS/ESM with a full `exports` map. `require()` and `import` both work. Deep imports of build internals (`.../dist/...`) must move to documented subpaths (e.g. `@elevenlabs/elevenlabs-js/agents`).

## Deleted deep imports

`Conversation`, `ClientTools`, `DefaultAudioInterface` (previously reachable only via deep import from `api/resources/conversationalAi/conversation/`) are deleted. Use [`@elevenlabs/client`](https://www.npmjs.com/package/@elevenlabs/client) for browser/edge voice conversations with agents.

## Renamed helper types

Per-endpoint request/response helper types are renamed verb-first: `AgentsListRequest` → `ListAgentsRequest`, `SpeechToTextConvertResponse` → `ConvertSpeechToTextResponse`. When a type import breaks, search for the same words reordered verb-first.
