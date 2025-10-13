# Reference

<details><summary><code>client.<a href="/src/Client.ts">saveAVoicePreview</a>() -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Add a generated voice to the voice library.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.saveAVoicePreview();
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**requestOptions:** `ElevenLabsClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

##

## History

<details><summary><code>client.history.<a href="/src/api/resources/history/client/Client.ts">list</a>({ ...params }) -> ElevenLabs.GetSpeechHistoryResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns a list of your generated audio.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.history.list({
    pageSize: 1,
    startAfterHistoryItemId: "start_after_history_item_id",
    voiceId: "voice_id",
    modelId: "model_id",
    dateBeforeUnix: 1,
    dateAfterUnix: 1,
    sortDirection: "asc",
    search: "search",
    source: "TTS",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.HistoryListRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `History.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.history.<a href="/src/api/resources/history/client/Client.ts">get</a>(historyItemId) -> ElevenLabs.SpeechHistoryItemResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieves a history item.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.history.get("VW7YKqPnjY4h39yTbx2L");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**historyItemId:** `string` — ID of the history item to be used. You can use the [Get generated items](/docs/api-reference/history/get-all) endpoint to retrieve a list of history items.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `History.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.history.<a href="/src/api/resources/history/client/Client.ts">delete</a>(historyItemId) -> ElevenLabs.DeleteHistoryItemResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete a history item by its ID

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.history.delete("VW7YKqPnjY4h39yTbx2L");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**historyItemId:** `string` — ID of the history item to be used. You can use the [Get generated items](/docs/api-reference/history/get-all) endpoint to retrieve a list of history items.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `History.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.history.<a href="/src/api/resources/history/client/Client.ts">getAudio</a>(historyItemId) -> ReadableStream<Uint8Array></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the audio of an history item.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.history.getAudio("history_item_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**historyItemId:** `string` — ID of the history item to be used. You can use the [Get generated items](/docs/api-reference/history/get-all) endpoint to retrieve a list of history items.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `History.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.history.<a href="/src/api/resources/history/client/Client.ts">download</a>({ ...params }) -> ReadableStream<Uint8Array></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Download one or more history items. If one history item ID is provided, we will return a single audio file. If more than one history item IDs are provided, we will provide the history items packed into a .zip file.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.history.download({
    historyItemIds: ["history_item_ids", "history_item_ids"],
    outputFormat: undefined,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.DownloadHistoryRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `History.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## TextToSoundEffects

<details><summary><code>client.textToSoundEffects.<a href="/src/api/resources/textToSoundEffects/client/Client.ts">convert</a>({ ...params }) -> ReadableStream<Uint8Array></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Turn text into sound effects for your videos, voice-overs or video games using the most advanced sound effects models in the world.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.textToSoundEffects.convert({
    text: "Spacious braam suitable for high-impact movie trailer moments",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.CreateSoundEffectRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `TextToSoundEffects.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## AudioIsolation

## Samples

<details><summary><code>client.samples.<a href="/src/api/resources/samples/client/Client.ts">delete</a>(voiceId, sampleId) -> ElevenLabs.DeleteSampleResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Removes a sample by its ID.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.samples.delete("21m00Tcm4TlvDq8ikWAM", "VW7YKqPnjY4h39yTbx2L");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**voiceId:** `string` — ID of the voice to be used. You can use the [Get voices](/docs/api-reference/voices/search) endpoint list all the available voices.

</dd>
</dl>

<dl>
<dd>

**sampleId:** `string` — ID of the sample to be used. You can use the [Get voices](/docs/api-reference/voices/get) endpoint list all the available samples for a voice.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Samples.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## TextToSpeech

<details><summary><code>client.textToSpeech.<a href="/src/api/resources/textToSpeech/client/Client.ts">convert</a>(voiceId, { ...params }) -> ReadableStream<Uint8Array></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Converts text into speech using a voice of your choice and returns audio.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.textToSpeech.convert("JBFqnCBsd6RMkjVDRZzb", {
    outputFormat: "mp3_44100_128",
    text: "The first move is what sets everything in motion.",
    modelId: "eleven_multilingual_v2",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**voiceId:** `string` — ID of the voice to be used. Use the [Get voices](/docs/api-reference/voices/search) endpoint list all the available voices.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.BodyTextToSpeechFull`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `TextToSpeech.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.textToSpeech.<a href="/src/api/resources/textToSpeech/client/Client.ts">convertWithTimestamps</a>(voiceId, { ...params }) -> ElevenLabs.AudioWithTimestampsResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Generate speech from text with precise character-level timing information for audio-text synchronization.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.textToSpeech.convertWithTimestamps("21m00Tcm4TlvDq8ikWAM", {
    enableLogging: true,
    optimizeStreamingLatency: 1,
    outputFormat: "mp3_22050_32",
    text: "This is a test for the API of ElevenLabs.",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**voiceId:** `string` — Voice ID to be used, you can use https://api.elevenlabs.io/v1/voices to list all the available voices.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.BodyTextToSpeechFullWithTimestamps`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `TextToSpeech.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.textToSpeech.<a href="/src/api/resources/textToSpeech/client/Client.ts">stream</a>(voiceId, { ...params }) -> ReadableStream<Uint8Array></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Converts text into speech using a voice of your choice and returns audio as an audio stream.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.textToSpeech.stream("JBFqnCBsd6RMkjVDRZzb", {
    outputFormat: "mp3_44100_128",
    text: "The first move is what sets everything in motion.",
    modelId: "eleven_multilingual_v2",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**voiceId:** `string` — ID of the voice to be used. Use the [Get voices](/docs/api-reference/voices/search) endpoint list all the available voices.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.StreamTextToSpeechRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `TextToSpeech.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.textToSpeech.<a href="/src/api/resources/textToSpeech/client/Client.ts">streamWithTimestamps</a>(voiceId, { ...params }) -> core.Stream<ElevenLabs.StreamingAudioChunkWithTimestampsResponse></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Converts text into speech using a voice of your choice and returns a stream of JSONs containing audio as a base64 encoded string together with information on when which character was spoken.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await client.textToSpeech.streamWithTimestamps("JBFqnCBsd6RMkjVDRZzb", {
    outputFormat: "mp3_44100_128",
    text: "The first move is what sets everything in motion.",
    modelId: "eleven_multilingual_v2",
});
for await (const item of response) {
    console.log(item);
}
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**voiceId:** `string` — ID of the voice to be used. Use the [Get voices](/docs/api-reference/voices/search) endpoint list all the available voices.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.StreamTextToSpeechWithTimestampsRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `TextToSpeech.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## TextToDialogue

<details><summary><code>client.textToDialogue.<a href="/src/api/resources/textToDialogue/client/Client.ts">convert</a>({ ...params }) -> ReadableStream<Uint8Array></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Converts a list of text and voice ID pairs into speech (dialogue) and returns audio.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.textToDialogue.convert({
    inputs: [
        {
            text: "Knock knock",
            voiceId: "JBFqnCBsd6RMkjVDRZzb",
        },
        {
            text: "Who is there?",
            voiceId: "Aw4FAjKCGjjNkVhN1Xmq",
        },
    ],
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.BodyTextToDialogueMultiVoiceV1TextToDialoguePost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `TextToDialogue.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.textToDialogue.<a href="/src/api/resources/textToDialogue/client/Client.ts">stream</a>({ ...params }) -> ReadableStream<Uint8Array></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Converts a list of text and voice ID pairs into speech (dialogue) and returns an audio stream.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.textToDialogue.stream({
    inputs: [
        {
            text: "Knock knock",
            voiceId: "JBFqnCBsd6RMkjVDRZzb",
        },
        {
            text: "Who is there?",
            voiceId: "Aw4FAjKCGjjNkVhN1Xmq",
        },
    ],
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.BodyTextToDialogueMultiVoiceStreamingV1TextToDialogueStreamPost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `TextToDialogue.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## SpeechToSpeech

<details><summary><code>client.speechToSpeech.<a href="/src/api/resources/speechToSpeech/client/Client.ts">convert</a>(voiceId, { ...params }) -> ReadableStream<Uint8Array></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Transform audio from one voice to another. Maintain full control over emotion, timing and delivery.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.speechToSpeech.convert("JBFqnCBsd6RMkjVDRZzb", {
    audio: fs.createReadStream("/path/to/your/file"),
    outputFormat: "mp3_44100_128",
    modelId: "eleven_multilingual_sts_v2",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**voiceId:** `string`

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.BodySpeechToSpeechV1SpeechToSpeechVoiceIdPost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `SpeechToSpeech.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.speechToSpeech.<a href="/src/api/resources/speechToSpeech/client/Client.ts">stream</a>(voiceId, { ...params }) -> ReadableStream<Uint8Array></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Stream audio from one voice to another. Maintain full control over emotion, timing and delivery.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.speechToSpeech.stream("JBFqnCBsd6RMkjVDRZzb", {
    audio: fs.createReadStream("/path/to/your/file"),
    outputFormat: "mp3_44100_128",
    modelId: "eleven_multilingual_sts_v2",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**voiceId:** `string`

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.BodySpeechToSpeechStreamingV1SpeechToSpeechVoiceIdStreamPost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `SpeechToSpeech.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## TextToVoice

<details><summary><code>client.textToVoice.<a href="/src/api/resources/textToVoice/client/Client.ts">createPreviews</a>({ ...params }) -> ElevenLabs.VoiceDesignPreviewResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a voice from a text prompt.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.textToVoice.createPreviews({
    outputFormat: "mp3_22050_32",
    voiceDescription: "A sassy squeaky mouse",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.VoiceDesignRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `TextToVoice.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.textToVoice.<a href="/src/api/resources/textToVoice/client/Client.ts">create</a>({ ...params }) -> ElevenLabs.Voice</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a voice from previously generated voice preview. This endpoint should be called after you fetched a generated_voice_id using POST /v1/text-to-voice/design or POST /v1/text-to-voice/:voice_id/remix.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.textToVoice.create({
    voiceName: "Sassy squeaky mouse",
    voiceDescription: "A sassy squeaky mouse",
    generatedVoiceId: "37HceQefKmEi3bGovXjL",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.BodyCreateANewVoiceFromVoicePreviewV1TextToVoicePost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `TextToVoice.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.textToVoice.<a href="/src/api/resources/textToVoice/client/Client.ts">design</a>({ ...params }) -> ElevenLabs.VoiceDesignPreviewResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Design a voice via a prompt. This method returns a list of voice previews. Each preview has a generated_voice_id and a sample of the voice as base64 encoded mp3 audio. To create a voice use the generated_voice_id of the preferred preview with the /v1/text-to-voice endpoint.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.textToVoice.design({
    outputFormat: "mp3_22050_32",
    voiceDescription: "A sassy squeaky mouse",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.VoiceDesignRequestModel`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `TextToVoice.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.textToVoice.<a href="/src/api/resources/textToVoice/client/Client.ts">remix</a>(voiceId, { ...params }) -> ElevenLabs.VoiceDesignPreviewResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Remix an existing voice via a prompt. This method returns a list of voice previews. Each preview has a generated_voice_id and a sample of the voice as base64 encoded mp3 audio. To create a voice use the generated_voice_id of the preferred preview with the /v1/text-to-voice endpoint.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.textToVoice.remix("21m00Tcm4TlvDq8ikWAM", {
    outputFormat: "mp3_22050_32",
    voiceDescription: "Make the voice have a higher pitch.",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**voiceId:** `string` — Voice ID to be used, you can use https://api.elevenlabs.io/v1/voices to list all the available voices.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.VoiceRemixRequestModel`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `TextToVoice.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## user

<details><summary><code>client.user.<a href="/src/api/resources/user/client/Client.ts">get</a>() -> ElevenLabs.User</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Gets information about the user

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.user.get();
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**requestOptions:** `User.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Voices

<details><summary><code>client.voices.<a href="/src/api/resources/voices/client/Client.ts">getAll</a>({ ...params }) -> ElevenLabs.GetVoicesResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns a list of all available voices for a user.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.voices.getAll({
    showLegacy: true,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.VoicesGetAllRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Voices.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.voices.<a href="/src/api/resources/voices/client/Client.ts">search</a>({ ...params }) -> ElevenLabs.GetVoicesV2Response</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Gets a list of all available voices for a user with search, filtering and pagination.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.voices.search({
    nextPageToken: "next_page_token",
    pageSize: 1,
    search: "search",
    sort: "sort",
    sortDirection: "sort_direction",
    voiceType: "voice_type",
    category: "category",
    fineTuningState: "fine_tuning_state",
    collectionId: "collection_id",
    includeTotalCount: true,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.VoicesSearchRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Voices.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.voices.<a href="/src/api/resources/voices/client/Client.ts">get</a>(voiceId, { ...params }) -> ElevenLabs.Voice</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns metadata about a specific voice.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.voices.get("21m00Tcm4TlvDq8ikWAM", {
    withSettings: true,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**voiceId:** `string` — ID of the voice to be used. You can use the [Get voices](/docs/api-reference/voices/search) endpoint list all the available voices.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.VoicesGetRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Voices.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.voices.<a href="/src/api/resources/voices/client/Client.ts">delete</a>(voiceId) -> ElevenLabs.DeleteVoiceResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes a voice by its ID.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.voices.delete("21m00Tcm4TlvDq8ikWAM");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**voiceId:** `string` — ID of the voice to be used. You can use the [Get voices](/docs/api-reference/voices/search) endpoint list all the available voices.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Voices.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.voices.<a href="/src/api/resources/voices/client/Client.ts">update</a>(voiceId, { ...params }) -> ElevenLabs.EditVoiceResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Edit a voice created by you.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.voices.update("21m00Tcm4TlvDq8ikWAM", {
    name: "name",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**voiceId:** `string`

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.BodyEditVoiceV1VoicesVoiceIdEditPost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Voices.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.voices.<a href="/src/api/resources/voices/client/Client.ts">share</a>(publicUserId, voiceId, { ...params }) -> ElevenLabs.AddVoiceResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Add a shared voice to your collection of Voices

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.voices.share("63e06b7e7cafdc46be4d2e0b3f045940231ae058d508589653d74d1265a574ca", "21m00Tcm4TlvDq8ikWAM", {
    newName: "John Smith",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**publicUserId:** `string` — Public user ID used to publicly identify ElevenLabs users.

</dd>
</dl>

<dl>
<dd>

**voiceId:** `string` — ID of the voice to be used. You can use the [Get voices](/docs/api-reference/voices/search) endpoint list all the available voices.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.BodyAddSharedVoiceV1VoicesAddPublicUserIdVoiceIdPost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Voices.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.voices.<a href="/src/api/resources/voices/client/Client.ts">getShared</a>({ ...params }) -> ElevenLabs.GetLibraryVoicesResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieves a list of shared voices.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.voices.getShared({
    pageSize: 1,
    category: "professional",
    gender: "gender",
    age: "age",
    accent: "accent",
    language: "language",
    locale: "locale",
    search: "search",
    featured: true,
    minNoticePeriodDays: 1,
    includeCustomRates: true,
    includeLiveModerated: true,
    readerAppEnabled: true,
    ownerId: "owner_id",
    sort: "sort",
    page: 1,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.VoicesGetSharedRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Voices.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.voices.<a href="/src/api/resources/voices/client/Client.ts">findSimilarVoices</a>({ ...params }) -> ElevenLabs.GetLibraryVoicesResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns a list of shared voices similar to the provided audio sample. If neither similarity_threshold nor top_k is provided, we will apply default values.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.voices.findSimilarVoices({});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.BodyGetSimilarLibraryVoicesV1SimilarVoicesPost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Voices.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Studio

<details><summary><code>client.studio.<a href="/src/api/resources/studio/client/Client.ts">createPodcast</a>({ ...params }) -> ElevenLabs.PodcastProjectResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create and auto-convert a podcast project. Currently, the LLM cost is covered by us but you will still be charged for the audio generation. In the future, you will be charged for both the LLM and audio generation costs.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.studio.createPodcast({
    modelId: "eleven_multilingual_v2",
    mode: {
        type: "conversation",
        conversation: {
            hostVoiceId: "aw1NgEzBg83R7vgmiJt6",
            guestVoiceId: "aw1NgEzBg83R7vgmiJt7",
        },
    },
    source: {
        text: "This is a test podcast.",
    },
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.BodyCreatePodcastV1StudioPodcastsPost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Studio.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Dubbing

<details><summary><code>client.dubbing.<a href="/src/api/resources/dubbing/client/Client.ts">list</a>({ ...params }) -> ElevenLabs.DubbingMetadataPageResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List the dubs you have access to.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.dubbing.list({
    cursor: "cursor",
    pageSize: 1,
    dubbingStatus: "dubbing",
    filterByCreator: "personal",
    orderBy: "created_at",
    orderDirection: "DESCENDING",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.DubbingListRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Dubbing.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.dubbing.<a href="/src/api/resources/dubbing/client/Client.ts">create</a>({ ...params }) -> ElevenLabs.DoDubbingResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Dubs a provided audio or video file into given language.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.dubbing.create({
    file: fs.createReadStream("/path/to/your/file"),
    csvFile: fs.createReadStream("/path/to/your/file"),
    foregroundAudioFile: fs.createReadStream("/path/to/your/file"),
    backgroundAudioFile: fs.createReadStream("/path/to/your/file"),
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.BodyDubAVideoOrAnAudioFileV1DubbingPost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Dubbing.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.dubbing.<a href="/src/api/resources/dubbing/client/Client.ts">get</a>(dubbingId) -> ElevenLabs.DubbingMetadataResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns metadata about a dubbing project, including whether it's still in progress or not

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.dubbing.get("dubbing_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**dubbingId:** `string` — ID of the dubbing project.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Dubbing.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.dubbing.<a href="/src/api/resources/dubbing/client/Client.ts">delete</a>(dubbingId) -> ElevenLabs.DeleteDubbingResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes a dubbing project.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.dubbing.delete("dubbing_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**dubbingId:** `string` — ID of the dubbing project.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Dubbing.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Models

<details><summary><code>client.models.<a href="/src/api/resources/models/client/Client.ts">list</a>() -> ElevenLabs.Model[]</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Gets a list of available models.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.models.list();
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**requestOptions:** `Models.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## AudioNative

<details><summary><code>client.audioNative.<a href="/src/api/resources/audioNative/client/Client.ts">create</a>({ ...params }) -> ElevenLabs.AudioNativeCreateProjectResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates Audio Native enabled project, optionally starts conversion and returns project ID and embeddable HTML snippet.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.audioNative.create({
    name: "name",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.BodyCreatesAudioNativeEnabledProjectV1AudioNativePost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `AudioNative.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.audioNative.<a href="/src/api/resources/audioNative/client/Client.ts">getSettings</a>(projectId) -> ElevenLabs.GetAudioNativeProjectSettingsResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get player settings for the specific project.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.audioNative.getSettings("21m00Tcm4TlvDq8ikWAM");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The ID of the Studio project.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `AudioNative.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.audioNative.<a href="/src/api/resources/audioNative/client/Client.ts">update</a>(projectId, { ...params }) -> ElevenLabs.AudioNativeEditContentResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates content for the specific AudioNative Project.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.audioNative.update("21m00Tcm4TlvDq8ikWAM", {});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string`

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.BodyUpdateAudioNativeProjectContentV1AudioNativeProjectIdContentPost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `AudioNative.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## usage

<details><summary><code>client.usage.<a href="/src/api/resources/usage/client/Client.ts">get</a>({ ...params }) -> ElevenLabs.UsageCharactersResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the usage metrics for the current user or the entire workspace they are part of. The response provides a time axis based on the specified aggregation interval (default: day), with usage values for each interval along that axis. Usage is broken down by the selected breakdown type. For example, breakdown type "voice" will return the usage of each voice for each interval along the time axis.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.usage.get({
    startUnix: 1,
    endUnix: 1,
    includeWorkspaceMetrics: true,
    breakdownType: "none",
    aggregationInterval: "hour",
    aggregationBucketSize: 1,
    metric: "credits",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.UsageGetRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Usage.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## PronunciationDictionaries

<details><summary><code>client.pronunciationDictionaries.<a href="/src/api/resources/pronunciationDictionaries/client/Client.ts">createFromFile</a>({ ...params }) -> ElevenLabs.AddPronunciationDictionaryResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a new pronunciation dictionary from a lexicon .PLS file

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.pronunciationDictionaries.createFromFile({
    file: fs.createReadStream("/path/to/your/file"),
    name: "name",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.BodyAddAPronunciationDictionaryV1PronunciationDictionariesAddFromFilePost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `PronunciationDictionaries.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.pronunciationDictionaries.<a href="/src/api/resources/pronunciationDictionaries/client/Client.ts">createFromRules</a>({ ...params }) -> ElevenLabs.AddPronunciationDictionaryResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a new pronunciation dictionary from provided rules.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.pronunciationDictionaries.createFromRules({
    rules: [
        {
            type: "alias",
            stringToReplace: "Thailand",
            alias: "tie-land",
        },
    ],
    name: "My Dictionary",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.BodyAddAPronunciationDictionaryV1PronunciationDictionariesAddFromRulesPost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `PronunciationDictionaries.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.pronunciationDictionaries.<a href="/src/api/resources/pronunciationDictionaries/client/Client.ts">get</a>(pronunciationDictionaryId) -> ElevenLabs.GetPronunciationDictionaryMetadataResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get metadata for a pronunciation dictionary

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.pronunciationDictionaries.get("21m00Tcm4TlvDq8ikWAM");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**pronunciationDictionaryId:** `string` — The id of the pronunciation dictionary

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `PronunciationDictionaries.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.pronunciationDictionaries.<a href="/src/api/resources/pronunciationDictionaries/client/Client.ts">update</a>(pronunciationDictionaryId, { ...params }) -> ElevenLabs.GetPronunciationDictionaryMetadataResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Partially update the pronunciation dictionary without changing the version

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.pronunciationDictionaries.update("21m00Tcm4TlvDq8ikWAM");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**pronunciationDictionaryId:** `string` — The id of the pronunciation dictionary

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.BodyUpdatePronunciationDictionaryV1PronunciationDictionariesPronunciationDictionaryIdPatch`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `PronunciationDictionaries.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.pronunciationDictionaries.<a href="/src/api/resources/pronunciationDictionaries/client/Client.ts">download</a>(dictionaryId, versionId) -> ReadableStream<Uint8Array></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get a PLS file with a pronunciation dictionary version rules

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.pronunciationDictionaries.download("dictionary_id", "version_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**dictionaryId:** `string` — The id of the pronunciation dictionary

</dd>
</dl>

<dl>
<dd>

**versionId:** `string` — The id of the pronunciation dictionary version

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `PronunciationDictionaries.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.pronunciationDictionaries.<a href="/src/api/resources/pronunciationDictionaries/client/Client.ts">list</a>({ ...params }) -> ElevenLabs.GetPronunciationDictionariesMetadataResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get a list of the pronunciation dictionaries you have access to and their metadata

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.pronunciationDictionaries.list({
    cursor: "cursor",
    pageSize: 1,
    sort: "creation_time_unix",
    sortDirection: "sort_direction",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.PronunciationDictionariesListRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `PronunciationDictionaries.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## ServiceAccounts

<details><summary><code>client.serviceAccounts.<a href="/src/api/resources/serviceAccounts/client/Client.ts">list</a>() -> ElevenLabs.WorkspaceServiceAccountListResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List all service accounts in the workspace

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.serviceAccounts.list();
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**requestOptions:** `ServiceAccounts.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Webhooks

<details><summary><code>client.webhooks.<a href="/src/api/resources/webhooks/client/Client.ts">list</a>({ ...params }) -> ElevenLabs.WorkspaceWebhookListResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List all webhooks for a workspace

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.webhooks.list({
    includeUsages: false,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.WebhooksListRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Webhooks.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## SpeechToText

<details><summary><code>client.speechToText.<a href="/src/api/resources/speechToText/client/Client.ts">convert</a>({ ...params }) -> ElevenLabs.SpeechToTextConvertResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Transcribe an audio or video file. If webhook is set to true, the request will be processed asynchronously and results sent to configured webhooks. When use_multi_channel is true and the provided audio has multiple channels, a 'transcripts' object with separate transcripts for each channel is returned. Otherwise, returns a single transcript. The optional webhook_metadata parameter allows you to attach custom data that will be included in webhook responses for request correlation and tracking.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.speechToText.convert({
    file: fs.createReadStream("/path/to/your/file"),
    enableLogging: true,
    modelId: "model_id",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.BodySpeechToTextV1SpeechToTextPost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `SpeechToText.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## ForcedAlignment

<details><summary><code>client.forcedAlignment.<a href="/src/api/resources/forcedAlignment/client/Client.ts">create</a>({ ...params }) -> ElevenLabs.ForcedAlignmentResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Force align an audio file to text. Use this endpoint to get the timing information for each character and word in an audio file based on a provided text transcript.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.forcedAlignment.create({
    file: fs.createReadStream("/path/to/your/file"),
    text: "text",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.BodyCreateForcedAlignmentV1ForcedAlignmentPost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ForcedAlignment.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## ConversationalAi

<details><summary><code>client.conversationalAi.<a href="/src/api/resources/conversationalAi/client/Client.ts">addToKnowledgeBase</a>({ ...params }) -> ElevenLabs.AddKnowledgeBaseResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Upload a file or webpage URL to create a knowledge base document. <br> <Note> After creating the document, update the agent's knowledge base by calling [Update agent](/docs/api-reference/agents/update). </Note>

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.addToKnowledgeBase({
    agentId: "agent_id",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.BodyAddToKnowledgeBaseV1ConvaiKnowledgeBasePost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ConversationalAi.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.<a href="/src/api/resources/conversationalAi/client/Client.ts">getDocumentRagIndexes</a>(documentationId) -> ElevenLabs.RagDocumentIndexesResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Provides information about all RAG indexes of the specified knowledgebase document.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.getDocumentRagIndexes("21m00Tcm4TlvDq8ikWAM");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**documentationId:** `string` — The id of a document from the knowledge base. This is returned on document addition.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ConversationalAi.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.<a href="/src/api/resources/conversationalAi/client/Client.ts">deleteDocumentRagIndex</a>(documentationId, ragIndexId) -> ElevenLabs.RagDocumentIndexResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete RAG index for the knowledgebase document.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.deleteDocumentRagIndex("21m00Tcm4TlvDq8ikWAM", "21m00Tcm4TlvDq8ikWAM");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**documentationId:** `string` — The id of a document from the knowledge base. This is returned on document addition.

</dd>
</dl>

<dl>
<dd>

**ragIndexId:** `string` — The id of RAG index of document from the knowledge base.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ConversationalAi.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.<a href="/src/api/resources/conversationalAi/client/Client.ts">ragIndexOverview</a>() -> ElevenLabs.RagIndexOverviewResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Provides total size and other information of RAG indexes used by knowledgebase documents

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.ragIndexOverview();
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**requestOptions:** `ConversationalAi.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Music

<details><summary><code>client.music.<a href="/src/api/resources/music/client/Client.ts">compose</a>({ ...params }) -> ReadableStream<Uint8Array></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Compose a song from a prompt or a composition plan.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.music.compose({
    prompt: undefined,
    musicPrompt: undefined,
    compositionPlan: undefined,
    musicLengthMs: undefined,
    modelId: undefined,
    seed: undefined,
    forceInstrumental: undefined,
    respectSectionsDurations: undefined,
    storeForInpainting: undefined,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.BodyComposeMusicV1MusicPost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Music.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.music.<a href="/src/api/resources/music/client/Client.ts">composeDetailed</a>({ ...params }) -> ReadableStream<Uint8Array></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Compose a song from a prompt or a composition plan.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.music.composeDetailed({
    prompt: undefined,
    musicPrompt: undefined,
    compositionPlan: undefined,
    musicLengthMs: undefined,
    modelId: undefined,
    seed: undefined,
    forceInstrumental: undefined,
    storeForInpainting: undefined,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.BodyComposeMusicWithADetailedResponseV1MusicDetailedPost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Music.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.music.<a href="/src/api/resources/music/client/Client.ts">stream</a>({ ...params }) -> ReadableStream<Uint8Array></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Stream a composed song from a prompt or a composition plan.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.music.stream({
    prompt: undefined,
    musicPrompt: undefined,
    compositionPlan: undefined,
    musicLengthMs: undefined,
    modelId: undefined,
    seed: undefined,
    forceInstrumental: undefined,
    storeForInpainting: undefined,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.BodyStreamComposedMusicV1MusicStreamPost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Music.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## ConversationalAi Conversations

<details><summary><code>client.conversationalAi.conversations.<a href="/src/api/resources/conversationalAi/resources/conversations/client/Client.ts">getSignedUrl</a>({ ...params }) -> ElevenLabs.ConversationSignedUrlResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get a signed url to start a conversation with an agent with an agent that requires authorization

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.conversations.getSignedUrl({
    agentId: "21m00Tcm4TlvDq8ikWAM",
    includeConversationId: true,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.conversationalAi.ConversationsGetSignedUrlRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Conversations.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.conversations.<a href="/src/api/resources/conversationalAi/resources/conversations/client/Client.ts">getWebrtcToken</a>({ ...params }) -> ElevenLabs.TokenResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get a WebRTC session token for real-time communication.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.conversations.getWebrtcToken({
    agentId: "21m00Tcm4TlvDq8ikWAM",
    participantName: "participant_name",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.conversationalAi.ConversationsGetWebrtcTokenRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Conversations.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.conversations.<a href="/src/api/resources/conversationalAi/resources/conversations/client/Client.ts">list</a>({ ...params }) -> ElevenLabs.GetConversationsPageResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get all conversations of agents that user owns. With option to restrict to a specific agent.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.conversations.list({
    cursor: "cursor",
    agentId: "agent_id",
    callSuccessful: "success",
    callStartBeforeUnix: 1,
    callStartAfterUnix: 1,
    userId: "user_id",
    pageSize: 1,
    summaryMode: "exclude",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.conversationalAi.ConversationsListRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Conversations.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.conversations.<a href="/src/api/resources/conversationalAi/resources/conversations/client/Client.ts">get</a>(conversationId) -> ElevenLabs.GetConversationResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get the details of a particular conversation

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.conversations.get("123");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**conversationId:** `string` — The id of the conversation you're taking the action on.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Conversations.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.conversations.<a href="/src/api/resources/conversationalAi/resources/conversations/client/Client.ts">delete</a>(conversationId) -> unknown</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete a particular conversation

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.conversations.delete("21m00Tcm4TlvDq8ikWAM");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**conversationId:** `string` — The id of the conversation you're taking the action on.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Conversations.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## ConversationalAi Twilio

<details><summary><code>client.conversationalAi.twilio.<a href="/src/api/resources/conversationalAi/resources/twilio/client/Client.ts">outboundCall</a>({ ...params }) -> ElevenLabs.TwilioOutboundCallResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Handle an outbound call via Twilio

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.twilio.outboundCall({
    agentId: "agent_id",
    agentPhoneNumberId: "agent_phone_number_id",
    toNumber: "to_number",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.conversationalAi.BodyHandleAnOutboundCallViaTwilioV1ConvaiTwilioOutboundCallPost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Twilio.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## ConversationalAi Agents

<details><summary><code>client.conversationalAi.agents.<a href="/src/api/resources/conversationalAi/resources/agents/client/Client.ts">create</a>({ ...params }) -> ElevenLabs.CreateAgentResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create an agent from a config object

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.agents.create({
    conversationConfig: {},
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.conversationalAi.BodyCreateAgentV1ConvaiAgentsCreatePost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Agents.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.agents.<a href="/src/api/resources/conversationalAi/resources/agents/client/Client.ts">get</a>(agentId, { ...params }) -> ElevenLabs.GetAgentResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve config for an agent

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.agents.get("agent_3701k3ttaq12ewp8b7qv5rfyszkz", {
    versionId: "version_id",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**agentId:** `string` — The id of an agent. This is returned on agent creation.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.conversationalAi.AgentsGetRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Agents.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.agents.<a href="/src/api/resources/conversationalAi/resources/agents/client/Client.ts">delete</a>(agentId) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete an agent

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.agents.delete("agent_3701k3ttaq12ewp8b7qv5rfyszkz");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**agentId:** `string` — The id of an agent. This is returned on agent creation.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Agents.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.agents.<a href="/src/api/resources/conversationalAi/resources/agents/client/Client.ts">update</a>(agentId, { ...params }) -> ElevenLabs.GetAgentResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Patches an Agent settings

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.agents.update("agent_3701k3ttaq12ewp8b7qv5rfyszkz");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**agentId:** `string` — The id of an agent. This is returned on agent creation.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.conversationalAi.UpdateAgentRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Agents.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.agents.<a href="/src/api/resources/conversationalAi/resources/agents/client/Client.ts">list</a>({ ...params }) -> ElevenLabs.GetAgentsPageResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns a list of your agents and their metadata.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.agents.list({
    pageSize: 1,
    search: "search",
    sortDirection: "asc",
    sortBy: "name",
    cursor: "cursor",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.conversationalAi.AgentsListRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Agents.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.agents.<a href="/src/api/resources/conversationalAi/resources/agents/client/Client.ts">duplicate</a>(agentId, { ...params }) -> ElevenLabs.CreateAgentResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a new agent by duplicating an existing one

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.agents.duplicate("agent_3701k3ttaq12ewp8b7qv5rfyszkz");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**agentId:** `string` — The id of an agent. This is returned on agent creation.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.conversationalAi.BodyDuplicateAgentV1ConvaiAgentsAgentIdDuplicatePost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Agents.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.agents.<a href="/src/api/resources/conversationalAi/resources/agents/client/Client.ts">simulateConversation</a>(agentId, { ...params }) -> ElevenLabs.AgentSimulatedChatTestResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Run a conversation between the agent and a simulated user.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.agents.simulateConversation("agent_3701k3ttaq12ewp8b7qv5rfyszkz", {
    simulationSpecification: {
        simulatedUserConfig: {
            firstMessage: "Hello, how can I help you today?",
            language: "en",
            disableFirstMessageInterruptions: false,
        },
    },
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**agentId:** `string` — The id of an agent. This is returned on agent creation.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.conversationalAi.BodySimulatesAConversationV1ConvaiAgentsAgentIdSimulateConversationPost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Agents.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.agents.<a href="/src/api/resources/conversationalAi/resources/agents/client/Client.ts">simulateConversationStream</a>(agentId, { ...params }) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Run a conversation between the agent and a simulated user and stream back the response. Response is streamed back as partial lists of messages that should be concatenated and once the conversation has complete a single final message with the conversation analysis will be sent.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.agents.simulateConversationStream("agent_3701k3ttaq12ewp8b7qv5rfyszkz", {
    simulationSpecification: {
        simulatedUserConfig: {
            firstMessage: "Hello, how can I help you today?",
            language: "en",
            disableFirstMessageInterruptions: false,
        },
    },
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**agentId:** `string` — The id of an agent. This is returned on agent creation.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.conversationalAi.BodySimulatesAConversationStreamV1ConvaiAgentsAgentIdSimulateConversationStreamPost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Agents.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.agents.<a href="/src/api/resources/conversationalAi/resources/agents/client/Client.ts">runTests</a>(agentId, { ...params }) -> ElevenLabs.GetTestSuiteInvocationResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Run selected tests on the agent with provided configuration. If the agent configuration is provided, it will be used to override default agent configuration.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.agents.runTests("agent_3701k3ttaq12ewp8b7qv5rfyszkz", {
    tests: [
        {
            testId: "test_id",
        },
    ],
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**agentId:** `string` — The id of an agent. This is returned on agent creation.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.conversationalAi.RunAgentTestsRequestModel`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Agents.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## ConversationalAi Tests

<details><summary><code>client.conversationalAi.tests.<a href="/src/api/resources/conversationalAi/resources/tests/client/Client.ts">create</a>({ ...params }) -> ElevenLabs.CreateUnitTestResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a new agent response test.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.tests.create({
    chatHistory: [
        {
            role: "user",
            timeInCallSecs: 1,
        },
    ],
    successCondition: "success_condition",
    successExamples: [
        {
            response: "response",
            type: "success",
        },
    ],
    failureExamples: [
        {
            response: "response",
            type: "failure",
        },
    ],
    name: "name",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.conversationalAi.CreateUnitTestRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Tests.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.tests.<a href="/src/api/resources/conversationalAi/resources/tests/client/Client.ts">get</a>(testId) -> ElevenLabs.GetUnitTestResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Gets an agent response test by ID.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.tests.get("TeaqRRdTcIfIu2i7BYfT");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**testId:** `string` — The id of a chat response test. This is returned on test creation.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Tests.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.tests.<a href="/src/api/resources/conversationalAi/resources/tests/client/Client.ts">update</a>(testId, { ...params }) -> ElevenLabs.GetUnitTestResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates an agent response test by ID.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.tests.update("TeaqRRdTcIfIu2i7BYfT", {
    chatHistory: [
        {
            role: "user",
            timeInCallSecs: 1,
        },
    ],
    successCondition: "success_condition",
    successExamples: [
        {
            response: "response",
            type: "success",
        },
    ],
    failureExamples: [
        {
            response: "response",
            type: "failure",
        },
    ],
    name: "name",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**testId:** `string` — The id of a chat response test. This is returned on test creation.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.conversationalAi.UpdateUnitTestRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Tests.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.tests.<a href="/src/api/resources/conversationalAi/resources/tests/client/Client.ts">delete</a>(testId) -> unknown</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes an agent response test by ID.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.tests.delete("TeaqRRdTcIfIu2i7BYfT");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**testId:** `string` — The id of a chat response test. This is returned on test creation.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Tests.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.tests.<a href="/src/api/resources/conversationalAi/resources/tests/client/Client.ts">summaries</a>({ ...params }) -> ElevenLabs.GetTestsSummariesByIdsResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Gets multiple agent response tests by their IDs. Returns a dictionary mapping test IDs to test summaries.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.tests.summaries({
    testIds: ["test_id_1", "test_id_2"],
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.conversationalAi.ListTestsByIdsRequestModel`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Tests.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.tests.<a href="/src/api/resources/conversationalAi/resources/tests/client/Client.ts">list</a>({ ...params }) -> ElevenLabs.GetTestsPageResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists all agent response tests with pagination support and optional search filtering.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.tests.list({
    cursor: "cursor",
    pageSize: 1,
    search: "search",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.conversationalAi.TestsListRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Tests.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## ConversationalAi PhoneNumbers

<details><summary><code>client.conversationalAi.phoneNumbers.<a href="/src/api/resources/conversationalAi/resources/phoneNumbers/client/Client.ts">list</a>() -> ElevenLabs.PhoneNumbersListResponseItem[]</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve all Phone Numbers

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.phoneNumbers.list();
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**requestOptions:** `PhoneNumbers.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.phoneNumbers.<a href="/src/api/resources/conversationalAi/resources/phoneNumbers/client/Client.ts">create</a>({ ...params }) -> ElevenLabs.CreatePhoneNumberResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Import Phone Number from provider configuration (Twilio or SIP trunk)

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.phoneNumbers.create({
    provider: "twilio",
    phoneNumber: "phone_number",
    label: "label",
    sid: "sid",
    token: "token",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.PhoneNumbersCreateRequestBody`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `PhoneNumbers.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.phoneNumbers.<a href="/src/api/resources/conversationalAi/resources/phoneNumbers/client/Client.ts">get</a>(phoneNumberId) -> ElevenLabs.PhoneNumbersGetResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve Phone Number details by ID

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.phoneNumbers.get("TeaqRRdTcIfIu2i7BYfT");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**phoneNumberId:** `string` — The id of an agent. This is returned on agent creation.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `PhoneNumbers.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.phoneNumbers.<a href="/src/api/resources/conversationalAi/resources/phoneNumbers/client/Client.ts">delete</a>(phoneNumberId) -> unknown</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete Phone Number by ID

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.phoneNumbers.delete("TeaqRRdTcIfIu2i7BYfT");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**phoneNumberId:** `string` — The id of an agent. This is returned on agent creation.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `PhoneNumbers.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.phoneNumbers.<a href="/src/api/resources/conversationalAi/resources/phoneNumbers/client/Client.ts">update</a>(phoneNumberId, { ...params }) -> ElevenLabs.PhoneNumbersUpdateResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update assigned agent of a phone number

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.phoneNumbers.update("TeaqRRdTcIfIu2i7BYfT");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**phoneNumberId:** `string` — The id of an agent. This is returned on agent creation.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.conversationalAi.UpdatePhoneNumberRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `PhoneNumbers.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## ConversationalAi LlmUsage

<details><summary><code>client.conversationalAi.llmUsage.<a href="/src/api/resources/conversationalAi/resources/llmUsage/client/Client.ts">calculate</a>({ ...params }) -> ElevenLabs.LlmUsageCalculatorResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns a list of LLM models and the expected cost for using them based on the provided values.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.llmUsage.calculate({
    promptLength: 1,
    numberOfPages: 1,
    ragEnabled: true,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.conversationalAi.LlmUsageCalculatorPublicRequestModel`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `LlmUsage.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## ConversationalAi KnowledgeBase

<details><summary><code>client.conversationalAi.knowledgeBase.<a href="/src/api/resources/conversationalAi/resources/knowledgeBase/client/Client.ts">list</a>({ ...params }) -> ElevenLabs.GetKnowledgeBaseListResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get a list of available knowledge base documents

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.knowledgeBase.list({
    pageSize: 1,
    search: "search",
    showOnlyOwnedDocuments: true,
    sortDirection: "asc",
    sortBy: "name",
    useTypesense: true,
    cursor: "cursor",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.conversationalAi.KnowledgeBaseListRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `KnowledgeBase.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## ConversationalAi Tools

<details><summary><code>client.conversationalAi.tools.<a href="/src/api/resources/conversationalAi/resources/tools/client/Client.ts">list</a>() -> ElevenLabs.ToolsResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get all available tools in the workspace.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.tools.list();
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**requestOptions:** `Tools.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.tools.<a href="/src/api/resources/conversationalAi/resources/tools/client/Client.ts">create</a>({ ...params }) -> ElevenLabs.ToolResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Add a new tool to the available tools in the workspace.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.tools.create({
    toolConfig: {
        type: "client",
        name: "name",
        description: "description",
        expectsResponse: false,
    },
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.ToolRequestModel`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Tools.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.tools.<a href="/src/api/resources/conversationalAi/resources/tools/client/Client.ts">get</a>(toolId) -> ElevenLabs.ToolResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get tool that is available in the workspace.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.tools.get("tool_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**toolId:** `string` — ID of the requested tool.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Tools.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.tools.<a href="/src/api/resources/conversationalAi/resources/tools/client/Client.ts">delete</a>(toolId) -> unknown</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete tool from the workspace.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.tools.delete("tool_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**toolId:** `string` — ID of the requested tool.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Tools.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.tools.<a href="/src/api/resources/conversationalAi/resources/tools/client/Client.ts">update</a>(toolId, { ...params }) -> ElevenLabs.ToolResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update tool that is available in the workspace.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.tools.update("tool_id", {
    toolConfig: {
        type: "client",
        name: "name",
        description: "description",
        expectsResponse: false,
    },
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**toolId:** `string` — ID of the requested tool.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.ToolRequestModel`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Tools.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.tools.<a href="/src/api/resources/conversationalAi/resources/tools/client/Client.ts">getDependentAgents</a>(toolId, { ...params }) -> ElevenLabs.GetToolDependentAgentsResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get a list of agents depending on this tool

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.tools.getDependentAgents("tool_id", {
    cursor: "cursor",
    pageSize: 1,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**toolId:** `string` — ID of the requested tool.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.conversationalAi.ToolsGetDependentAgentsRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Tools.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## ConversationalAi Settings

<details><summary><code>client.conversationalAi.settings.<a href="/src/api/resources/conversationalAi/resources/settings/client/Client.ts">get</a>() -> ElevenLabs.GetConvAiSettingsResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve Convai settings for the workspace

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.settings.get();
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**requestOptions:** `Settings.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.settings.<a href="/src/api/resources/conversationalAi/resources/settings/client/Client.ts">update</a>({ ...params }) -> ElevenLabs.GetConvAiSettingsResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update Convai settings for the workspace

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.settings.update();
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.conversationalAi.PatchConvAiSettingsRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Settings.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## ConversationalAi Secrets

<details><summary><code>client.conversationalAi.secrets.<a href="/src/api/resources/conversationalAi/resources/secrets/client/Client.ts">list</a>() -> ElevenLabs.GetWorkspaceSecretsResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get all workspace secrets for the user

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.secrets.list();
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**requestOptions:** `Secrets.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.secrets.<a href="/src/api/resources/conversationalAi/resources/secrets/client/Client.ts">create</a>({ ...params }) -> ElevenLabs.PostWorkspaceSecretResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a new secret for the workspace

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.secrets.create({
    name: "name",
    value: "value",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.conversationalAi.PostWorkspaceSecretRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Secrets.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.secrets.<a href="/src/api/resources/conversationalAi/resources/secrets/client/Client.ts">delete</a>(secretId) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete a workspace secret if it's not in use

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.secrets.delete("secret_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**secretId:** `string`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Secrets.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.secrets.<a href="/src/api/resources/conversationalAi/resources/secrets/client/Client.ts">update</a>(secretId, { ...params }) -> ElevenLabs.PostWorkspaceSecretResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update an existing secret for the workspace

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.secrets.update("secret_id", {
    name: "name",
    value: "value",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**secretId:** `string`

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.conversationalAi.PatchWorkspaceSecretRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Secrets.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## ConversationalAi BatchCalls

<details><summary><code>client.conversationalAi.batchCalls.<a href="/src/api/resources/conversationalAi/resources/batchCalls/client/Client.ts">create</a>({ ...params }) -> ElevenLabs.BatchCallResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Submit a batch call request to schedule calls for multiple recipients.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.batchCalls.create({
    callName: "call_name",
    agentId: "agent_id",
    agentPhoneNumberId: "agent_phone_number_id",
    recipients: [
        {
            phoneNumber: "phone_number",
        },
    ],
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.conversationalAi.BodySubmitABatchCallRequestV1ConvaiBatchCallingSubmitPost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `BatchCalls.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.batchCalls.<a href="/src/api/resources/conversationalAi/resources/batchCalls/client/Client.ts">list</a>({ ...params }) -> ElevenLabs.WorkspaceBatchCallsResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get all batch calls for the current workspace.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.batchCalls.list({
    limit: 1,
    lastDoc: "last_doc",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.conversationalAi.BatchCallsListRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `BatchCalls.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.batchCalls.<a href="/src/api/resources/conversationalAi/resources/batchCalls/client/Client.ts">get</a>(batchId) -> ElevenLabs.BatchCallDetailedResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get detailed information about a batch call including all recipients.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.batchCalls.get("batch_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**batchId:** `string`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `BatchCalls.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.batchCalls.<a href="/src/api/resources/conversationalAi/resources/batchCalls/client/Client.ts">cancel</a>(batchId) -> ElevenLabs.BatchCallResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Cancel a running batch call and set all recipients to cancelled status.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.batchCalls.cancel("batch_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**batchId:** `string`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `BatchCalls.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.batchCalls.<a href="/src/api/resources/conversationalAi/resources/batchCalls/client/Client.ts">retry</a>(batchId) -> ElevenLabs.BatchCallResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retry a batch call, calling failed and no-response recipients again.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.batchCalls.retry("batch_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**batchId:** `string`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `BatchCalls.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## ConversationalAi SipTrunk

<details><summary><code>client.conversationalAi.sipTrunk.<a href="/src/api/resources/conversationalAi/resources/sipTrunk/client/Client.ts">outboundCall</a>({ ...params }) -> ElevenLabs.SipTrunkOutboundCallResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Handle an outbound call via SIP trunk

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.sipTrunk.outboundCall({
    agentId: "agent_id",
    agentPhoneNumberId: "agent_phone_number_id",
    toNumber: "to_number",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.conversationalAi.BodyHandleAnOutboundCallViaSipTrunkV1ConvaiSipTrunkOutboundCallPost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `SipTrunk.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## ConversationalAi McpServers

<details><summary><code>client.conversationalAi.mcpServers.<a href="/src/api/resources/conversationalAi/resources/mcpServers/client/Client.ts">list</a>() -> ElevenLabs.McpServersResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve all MCP server configurations available in the workspace.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.mcpServers.list();
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**requestOptions:** `McpServers.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.mcpServers.<a href="/src/api/resources/conversationalAi/resources/mcpServers/client/Client.ts">create</a>({ ...params }) -> ElevenLabs.McpServerResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a new MCP server configuration in the workspace.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.mcpServers.create({
    config: {
        url: "url",
        name: "name",
    },
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.conversationalAi.McpServerRequestModel`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `McpServers.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.mcpServers.<a href="/src/api/resources/conversationalAi/resources/mcpServers/client/Client.ts">get</a>(mcpServerId) -> ElevenLabs.McpServerResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve a specific MCP server configuration from the workspace.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.mcpServers.get("mcp_server_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**mcpServerId:** `string` — ID of the MCP Server.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `McpServers.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.mcpServers.<a href="/src/api/resources/conversationalAi/resources/mcpServers/client/Client.ts">update</a>(mcpServerId, { ...params }) -> ElevenLabs.McpServerResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update the configuration settings for an MCP server.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.mcpServers.update("mcp_server_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**mcpServerId:** `string` — ID of the MCP Server.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.conversationalAi.McpServerConfigUpdateRequestModel`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `McpServers.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## ConversationalAi Agents Widget

<details><summary><code>client.conversationalAi.agents.widget.<a href="/src/api/resources/conversationalAi/resources/agents/resources/widget/client/Client.ts">get</a>(agentId, { ...params }) -> ElevenLabs.GetAgentEmbedResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve the widget configuration for an agent

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.agents.widget.get("agent_3701k3ttaq12ewp8b7qv5rfyszkz", {
    conversationSignature: "conversation_signature",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**agentId:** `string` — The id of an agent. This is returned on agent creation.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.conversationalAi.agents.WidgetGetRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Widget.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## ConversationalAi Agents Link

<details><summary><code>client.conversationalAi.agents.link.<a href="/src/api/resources/conversationalAi/resources/agents/resources/link/client/Client.ts">get</a>(agentId) -> ElevenLabs.GetAgentLinkResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get the current link used to share the agent with others

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.agents.link.get("agent_3701k3ttaq12ewp8b7qv5rfyszkz");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**agentId:** `string` — The id of an agent. This is returned on agent creation.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Link.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## ConversationalAi Agents KnowledgeBase

<details><summary><code>client.conversationalAi.agents.knowledgeBase.<a href="/src/api/resources/conversationalAi/resources/agents/resources/knowledgeBase/client/Client.ts">size</a>(agentId) -> ElevenLabs.GetAgentKnowledgebaseSizeResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the number of pages in the agent's knowledge base.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.agents.knowledgeBase.size("agent_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**agentId:** `string`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `KnowledgeBase.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## ConversationalAi Agents LlmUsage

<details><summary><code>client.conversationalAi.agents.llmUsage.<a href="/src/api/resources/conversationalAi/resources/agents/resources/llmUsage/client/Client.ts">calculate</a>(agentId, { ...params }) -> ElevenLabs.LlmUsageCalculatorResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Calculates expected number of LLM tokens needed for the specified agent.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.agents.llmUsage.calculate("agent_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**agentId:** `string`

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.conversationalAi.agents.LlmUsageCalculatorRequestModel`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `LlmUsage.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## ConversationalAi Agents Widget Avatar

<details><summary><code>client.conversationalAi.agents.widget.avatar.<a href="/src/api/resources/conversationalAi/resources/agents/resources/widget/resources/avatar/client/Client.ts">create</a>(agentId, { ...params }) -> ElevenLabs.PostAgentAvatarResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Sets the avatar for an agent displayed in the widget

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.agents.widget.avatar.create("agent_3701k3ttaq12ewp8b7qv5rfyszkz", {
    avatarFile: fs.createReadStream("/path/to/your/file"),
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**agentId:** `string`

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.conversationalAi.agents.widget.BodyPostAgentAvatarV1ConvaiAgentsAgentIdAvatarPost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Avatar.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## ConversationalAi Conversations Audio

<details><summary><code>client.conversationalAi.conversations.audio.<a href="/src/api/resources/conversationalAi/resources/conversations/resources/audio/client/Client.ts">get</a>(conversationId) -> ReadableStream<Uint8Array></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get the audio recording of a particular conversation

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.conversations.audio.get("conversation_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**conversationId:** `string` — The id of the conversation you're taking the action on.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Audio.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## ConversationalAi Conversations Feedback

<details><summary><code>client.conversationalAi.conversations.feedback.<a href="/src/api/resources/conversationalAi/resources/conversations/resources/feedback/client/Client.ts">create</a>(conversationId, { ...params }) -> unknown</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Send the feedback for the given conversation

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.conversations.feedback.create("21m00Tcm4TlvDq8ikWAM", {
    feedback: "like",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**conversationId:** `string` — The id of the conversation you're taking the action on.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.conversationalAi.conversations.BodySendConversationFeedbackV1ConvaiConversationsConversationIdFeedbackPost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Feedback.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## ConversationalAi Dashboard Settings

<details><summary><code>client.conversationalAi.dashboard.settings.<a href="/src/api/resources/conversationalAi/resources/dashboard/resources/settings/client/Client.ts">get</a>() -> ElevenLabs.GetConvAiDashboardSettingsResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve Convai dashboard settings for the workspace

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.dashboard.settings.get();
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**requestOptions:** `Settings.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.dashboard.settings.<a href="/src/api/resources/conversationalAi/resources/dashboard/resources/settings/client/Client.ts">update</a>({ ...params }) -> ElevenLabs.GetConvAiDashboardSettingsResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update Convai dashboard settings for the workspace

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.dashboard.settings.update();
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.conversationalAi.dashboard.PatchConvAiDashboardSettingsRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Settings.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## ConversationalAi KnowledgeBase Documents

<details><summary><code>client.conversationalAi.knowledgeBase.documents.<a href="/src/api/resources/conversationalAi/resources/knowledgeBase/resources/documents/client/Client.ts">createFromUrl</a>({ ...params }) -> ElevenLabs.AddKnowledgeBaseResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a knowledge base document generated by scraping the given webpage.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.knowledgeBase.documents.createFromUrl({
    url: "url",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.conversationalAi.knowledgeBase.BodyCreateUrlDocumentV1ConvaiKnowledgeBaseUrlPost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Documents.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.knowledgeBase.documents.<a href="/src/api/resources/conversationalAi/resources/knowledgeBase/resources/documents/client/Client.ts">createFromFile</a>({ ...params }) -> ElevenLabs.AddKnowledgeBaseResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a knowledge base document generated form the uploaded file.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.knowledgeBase.documents.createFromFile({
    file: fs.createReadStream("/path/to/your/file"),
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.conversationalAi.knowledgeBase.BodyCreateFileDocumentV1ConvaiKnowledgeBaseFilePost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Documents.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.knowledgeBase.documents.<a href="/src/api/resources/conversationalAi/resources/knowledgeBase/resources/documents/client/Client.ts">createFromText</a>({ ...params }) -> ElevenLabs.AddKnowledgeBaseResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a knowledge base document containing the provided text.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.knowledgeBase.documents.createFromText({
    text: "text",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.conversationalAi.knowledgeBase.BodyCreateTextDocumentV1ConvaiKnowledgeBaseTextPost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Documents.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.knowledgeBase.documents.<a href="/src/api/resources/conversationalAi/resources/knowledgeBase/resources/documents/client/Client.ts">get</a>(documentationId, { ...params }) -> ElevenLabs.DocumentsGetResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get details about a specific documentation making up the agent's knowledge base

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.knowledgeBase.documents.get("21m00Tcm4TlvDq8ikWAM", {
    agentId: "agent_id",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**documentationId:** `string` — The id of a document from the knowledge base. This is returned on document addition.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.conversationalAi.knowledgeBase.DocumentsGetRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Documents.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.knowledgeBase.documents.<a href="/src/api/resources/conversationalAi/resources/knowledgeBase/resources/documents/client/Client.ts">delete</a>(documentationId, { ...params }) -> unknown</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete a document from the knowledge base

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.knowledgeBase.documents.delete("21m00Tcm4TlvDq8ikWAM", {
    force: true,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**documentationId:** `string` — The id of a document from the knowledge base. This is returned on document addition.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.conversationalAi.knowledgeBase.DocumentsDeleteRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Documents.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.knowledgeBase.documents.<a href="/src/api/resources/conversationalAi/resources/knowledgeBase/resources/documents/client/Client.ts">update</a>(documentationId, { ...params }) -> ElevenLabs.DocumentsUpdateResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update the name of a document

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.knowledgeBase.documents.update("21m00Tcm4TlvDq8ikWAM", {
    name: "name",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**documentationId:** `string` — The id of a document from the knowledge base. This is returned on document addition.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.conversationalAi.knowledgeBase.BodyUpdateDocumentV1ConvaiKnowledgeBaseDocumentationIdPatch`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Documents.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.knowledgeBase.documents.<a href="/src/api/resources/conversationalAi/resources/knowledgeBase/resources/documents/client/Client.ts">getAgents</a>(documentationId, { ...params }) -> ElevenLabs.GetKnowledgeBaseDependentAgentsResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get a list of agents depending on this knowledge base document

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.knowledgeBase.documents.getAgents("21m00Tcm4TlvDq8ikWAM", {
    cursor: "cursor",
    pageSize: 1,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**documentationId:** `string` — The id of a document from the knowledge base. This is returned on document addition.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.conversationalAi.knowledgeBase.DocumentsGetAgentsRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Documents.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.knowledgeBase.documents.<a href="/src/api/resources/conversationalAi/resources/knowledgeBase/resources/documents/client/Client.ts">getContent</a>(documentationId) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get the entire content of a document from the knowledge base

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.knowledgeBase.documents.getContent("21m00Tcm4TlvDq8ikWAM");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**documentationId:** `string` — The id of a document from the knowledge base. This is returned on document addition.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Documents.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## ConversationalAi KnowledgeBase Document

<details><summary><code>client.conversationalAi.knowledgeBase.document.<a href="/src/api/resources/conversationalAi/resources/knowledgeBase/resources/document/client/Client.ts">computeRagIndex</a>(documentationId, { ...params }) -> ElevenLabs.RagDocumentIndexResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

In case the document is not RAG indexed, it triggers rag indexing task, otherwise it just returns the current status.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.knowledgeBase.document.computeRagIndex("21m00Tcm4TlvDq8ikWAM", {
    model: "e5_mistral_7b_instruct",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**documentationId:** `string` — The id of a document from the knowledge base. This is returned on document addition.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.conversationalAi.knowledgeBase.RagIndexRequestModel`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Document.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## ConversationalAi KnowledgeBase Documents Chunk

<details><summary><code>client.conversationalAi.knowledgeBase.documents.chunk.<a href="/src/api/resources/conversationalAi/resources/knowledgeBase/resources/documents/resources/chunk/client/Client.ts">get</a>(documentationId, chunkId) -> ElevenLabs.KnowledgeBaseDocumentChunkResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get details about a specific documentation part used by RAG.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.knowledgeBase.documents.chunk.get("21m00Tcm4TlvDq8ikWAM", "chunk_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**documentationId:** `string` — The id of a document from the knowledge base. This is returned on document addition.

</dd>
</dl>

<dl>
<dd>

**chunkId:** `string` — The id of a document RAG chunk from the knowledge base.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Chunk.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## ConversationalAi McpServers Tools

<details><summary><code>client.conversationalAi.mcpServers.tools.<a href="/src/api/resources/conversationalAi/resources/mcpServers/resources/tools/client/Client.ts">list</a>(mcpServerId) -> ElevenLabs.ListMcpToolsResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve all tools available for a specific MCP server configuration.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.mcpServers.tools.list("mcp_server_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**mcpServerId:** `string` — ID of the MCP Server.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Tools.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## ConversationalAi McpServers ApprovalPolicy

<details><summary><code>client.conversationalAi.mcpServers.approvalPolicy.<a href="/src/api/resources/conversationalAi/resources/mcpServers/resources/approvalPolicy/client/Client.ts">update</a>(mcpServerId, { ...params }) -> ElevenLabs.McpServerResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update the approval policy configuration for an MCP server. DEPRECATED: Use PATCH /mcp-servers/{id} endpoint instead.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.mcpServers.approvalPolicy.update("mcp_server_id", {
    approvalPolicy: "auto_approve_all",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**mcpServerId:** `string` — ID of the MCP Server.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.conversationalAi.mcpServers.McpApprovalPolicyUpdateRequestModel`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ApprovalPolicy.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## ConversationalAi McpServers ToolApprovals

<details><summary><code>client.conversationalAi.mcpServers.toolApprovals.<a href="/src/api/resources/conversationalAi/resources/mcpServers/resources/toolApprovals/client/Client.ts">create</a>(mcpServerId, { ...params }) -> ElevenLabs.McpServerResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Add approval for a specific MCP tool when using per-tool approval mode.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.mcpServers.toolApprovals.create("mcp_server_id", {
    toolName: "tool_name",
    toolDescription: "tool_description",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**mcpServerId:** `string` — ID of the MCP Server.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.conversationalAi.mcpServers.McpToolAddApprovalRequestModel`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ToolApprovals.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.mcpServers.toolApprovals.<a href="/src/api/resources/conversationalAi/resources/mcpServers/resources/toolApprovals/client/Client.ts">delete</a>(mcpServerId, toolName) -> ElevenLabs.McpServerResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Remove approval for a specific MCP tool when using per-tool approval mode.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.mcpServers.toolApprovals.delete("mcp_server_id", "tool_name");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**mcpServerId:** `string` — ID of the MCP Server.

</dd>
</dl>

<dl>
<dd>

**toolName:** `string` — Name of the MCP tool to remove approval for.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ToolApprovals.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## ConversationalAi Tests Invocations

<details><summary><code>client.conversationalAi.tests.invocations.<a href="/src/api/resources/conversationalAi/resources/tests/resources/invocations/client/Client.ts">list</a>({ ...params }) -> ElevenLabs.GetTestInvocationsPageResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists all test invocations with pagination support and optional search filtering.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.tests.invocations.list({
    agentId: "agent_id",
    pageSize: 1,
    cursor: "cursor",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.conversationalAi.tests.InvocationsListRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Invocations.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.tests.invocations.<a href="/src/api/resources/conversationalAi/resources/tests/resources/invocations/client/Client.ts">get</a>(testInvocationId) -> ElevenLabs.GetTestSuiteInvocationResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Gets a test invocation by ID.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.tests.invocations.get("test_invocation_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**testInvocationId:** `string` — The id of a test invocation. This is returned when tests are run.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Invocations.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversationalAi.tests.invocations.<a href="/src/api/resources/conversationalAi/resources/tests/resources/invocations/client/Client.ts">resubmit</a>(testInvocationId, { ...params }) -> unknown</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Resubmits specific test runs from a test invocation.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversationalAi.tests.invocations.resubmit("test_invocation_id", {
    testRunIds: ["test_run_ids"],
    agentId: "agent_id",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**testInvocationId:** `string` — The id of a test invocation. This is returned when tests are run.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.conversationalAi.tests.ResubmitTestsRequestModel`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Invocations.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Dubbing Resource

<details><summary><code>client.dubbing.resource.<a href="/src/api/resources/dubbing/resources/resource/client/Client.ts">get</a>(dubbingId) -> ElevenLabs.DubbingResource</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Given a dubbing ID generated from the '/v1/dubbing' endpoint with studio enabled, returns the dubbing resource.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.dubbing.resource.get("dubbing_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**dubbingId:** `string` — ID of the dubbing project.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Resource.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.dubbing.resource.<a href="/src/api/resources/dubbing/resources/resource/client/Client.ts">transcribe</a>(dubbingId, { ...params }) -> ElevenLabs.SegmentTranscriptionResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Regenerate the transcriptions for the specified segments. Does not automatically regenerate translations or dubs.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.dubbing.resource.transcribe("dubbing_id", {
    segments: ["segments"],
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**dubbingId:** `string` — ID of the dubbing project.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.dubbing.BodyTranscribesSegmentsV1DubbingResourceDubbingIdTranscribePost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Resource.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.dubbing.resource.<a href="/src/api/resources/dubbing/resources/resource/client/Client.ts">translate</a>(dubbingId, { ...params }) -> ElevenLabs.SegmentTranslationResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Regenerate the translations for either the entire resource or the specified segments/languages. Will automatically transcribe missing transcriptions. Will not automatically regenerate the dubs.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.dubbing.resource.translate("dubbing_id", {
    segments: ["segments"],
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**dubbingId:** `string` — ID of the dubbing project.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.dubbing.BodyTranslatesAllOrSomeSegmentsAndLanguagesV1DubbingResourceDubbingIdTranslatePost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Resource.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.dubbing.resource.<a href="/src/api/resources/dubbing/resources/resource/client/Client.ts">dub</a>(dubbingId, { ...params }) -> ElevenLabs.SegmentDubResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Regenerate the dubs for either the entire resource or the specified segments/languages. Will automatically transcribe and translate any missing transcriptions and translations.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.dubbing.resource.dub("dubbing_id", {
    segments: ["segments"],
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**dubbingId:** `string` — ID of the dubbing project.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.dubbing.BodyDubsAllOrSomeSegmentsAndLanguagesV1DubbingResourceDubbingIdDubPost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Resource.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.dubbing.resource.<a href="/src/api/resources/dubbing/resources/resource/client/Client.ts">render</a>(dubbingId, language, { ...params }) -> ElevenLabs.DubbingRenderResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Regenerate the output media for a language using the latest Studio state. Please ensure all segments have been dubbed before rendering, otherwise they will be omitted. Renders are generated asynchronously, and to check the status of all renders please use the 'Get Dubbing Resource' endpoint.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.dubbing.resource.render("dubbing_id", "language", {
    renderType: "mp4",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**dubbingId:** `string` — ID of the dubbing project.

</dd>
</dl>

<dl>
<dd>

**language:** `string` — Render this language

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.dubbing.BodyRenderAudioOrVideoForTheGivenLanguageV1DubbingResourceDubbingIdRenderLanguagePost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Resource.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Dubbing Audio

<details><summary><code>client.dubbing.audio.<a href="/src/api/resources/dubbing/resources/audio/client/Client.ts">get</a>(dubbingId, languageCode) -> ReadableStream<Uint8Array></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns dub as a streamed MP3 or MP4 file. If this dub has been edited using Dubbing Studio you need to use the resource render endpoint as this endpoint only returns the original automatic dub result.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.dubbing.audio.get("dubbing_id", "language_code");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**dubbingId:** `string` — ID of the dubbing project.

</dd>
</dl>

<dl>
<dd>

**languageCode:** `string` — ID of the language.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Audio.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Dubbing Transcript

<details><summary><code>client.dubbing.transcript.<a href="/src/api/resources/dubbing/resources/transcript/client/Client.ts">getTranscriptForDub</a>(dubbingId, languageCode, { ...params }) -> string</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns transcript for the dub as an SRT or WEBVTT file.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.dubbing.transcript.getTranscriptForDub("dubbing_id", "language_code");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**dubbingId:** `string` — ID of the dubbing project.

</dd>
</dl>

<dl>
<dd>

**languageCode:** `string` — ID of the language.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.dubbing.TranscriptGetTranscriptForDubRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Transcript.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Dubbing Resource Language

<details><summary><code>client.dubbing.resource.language.<a href="/src/api/resources/dubbing/resources/resource/resources/language/client/Client.ts">add</a>(dubbingId, { ...params }) -> ElevenLabs.LanguageAddedResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Adds the given ElevenLab Turbo V2/V2.5 language code to the resource. Does not automatically generate transcripts/translations/audio.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.dubbing.resource.language.add("dubbing_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**dubbingId:** `string` — ID of the dubbing project.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.dubbing.resource.BodyAddALanguageToTheResourceV1DubbingResourceDubbingIdLanguagePost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Language.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Dubbing Resource Segment

<details><summary><code>client.dubbing.resource.segment.<a href="/src/api/resources/dubbing/resources/resource/resources/segment/client/Client.ts">update</a>(dubbingId, segmentId, language, { ...params }) -> ElevenLabs.SegmentUpdateResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Modifies a single segment with new text and/or start/end times. Will update the values for only a specific language of a segment. Does not automatically regenerate the dub.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.dubbing.resource.segment.update("dubbing_id", "segment_id", "language");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**dubbingId:** `string` — ID of the dubbing project.

</dd>
</dl>

<dl>
<dd>

**segmentId:** `string` — ID of the segment

</dd>
</dl>

<dl>
<dd>

**language:** `string` — ID of the language.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.dubbing.resource.SegmentUpdatePayload`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Segment.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.dubbing.resource.segment.<a href="/src/api/resources/dubbing/resources/resource/resources/segment/client/Client.ts">delete</a>(dubbingId, segmentId) -> ElevenLabs.SegmentDeleteResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes a single segment from the dubbing.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.dubbing.resource.segment.delete("dubbing_id", "segment_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**dubbingId:** `string` — ID of the dubbing project.

</dd>
</dl>

<dl>
<dd>

**segmentId:** `string` — ID of the segment

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Segment.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Dubbing Resource Speaker

<details><summary><code>client.dubbing.resource.speaker.<a href="/src/api/resources/dubbing/resources/resource/resources/speaker/client/Client.ts">update</a>(dubbingId, speakerId, { ...params }) -> ElevenLabs.SpeakerUpdatedResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Amend the metadata associated with a speaker, such as their voice. Both voice cloning and using voices from the ElevenLabs library are supported.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.dubbing.resource.speaker.update("dubbing_id", "speaker_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**dubbingId:** `string` — ID of the dubbing project.

</dd>
</dl>

<dl>
<dd>

**speakerId:** `string` — ID of the speaker.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.dubbing.resource.BodyUpdateMetadataForASpeakerV1DubbingResourceDubbingIdSpeakerSpeakerIdPatch`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Speaker.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.dubbing.resource.speaker.<a href="/src/api/resources/dubbing/resources/resource/resources/speaker/client/Client.ts">findSimilarVoices</a>(dubbingId, speakerId) -> ElevenLabs.SimilarVoicesForSpeakerResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Fetch the top 10 similar voices to a speaker, including the voice IDs, names, descriptions, and, where possible, a sample audio recording.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.dubbing.resource.speaker.findSimilarVoices("dubbing_id", "speaker_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**dubbingId:** `string` — ID of the dubbing project.

</dd>
</dl>

<dl>
<dd>

**speakerId:** `string` — ID of the speaker.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Speaker.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Dubbing Resource Speaker Segment

<details><summary><code>client.dubbing.resource.speaker.segment.<a href="/src/api/resources/dubbing/resources/resource/resources/speaker/resources/segment/client/Client.ts">create</a>(dubbingId, speakerId, { ...params }) -> ElevenLabs.SegmentCreateResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a new segment in dubbing resource with a start and end time for the speaker in every available language. Does not automatically generate transcripts/translations/audio.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.dubbing.resource.speaker.segment.create("dubbing_id", "speaker_id", {
    startTime: 1.1,
    endTime: 1.1,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**dubbingId:** `string` — ID of the dubbing project.

</dd>
</dl>

<dl>
<dd>

**speakerId:** `string` — ID of the speaker.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.dubbing.resource.speaker.SegmentCreatePayload`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Segment.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Music CompositionPlan

<details><summary><code>client.music.compositionPlan.<a href="/src/api/resources/music/resources/compositionPlan/client/Client.ts">create</a>({ ...params }) -> ElevenLabs.MusicPrompt</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a composition plan for music generation. Usage of this endpoint does not cost any credits but is subject to rate limiting depending on your tier.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.music.compositionPlan.create({
    prompt: "prompt",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.music.BodyGenerateCompositionPlanV1MusicPlanPost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `CompositionPlan.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## PronunciationDictionaries Rules

<details><summary><code>client.pronunciationDictionaries.rules.<a href="/src/api/resources/pronunciationDictionaries/resources/rules/client/Client.ts">add</a>(pronunciationDictionaryId, { ...params }) -> ElevenLabs.PronunciationDictionaryRulesResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Add rules to the pronunciation dictionary

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.pronunciationDictionaries.rules.add("21m00Tcm4TlvDq8ikWAM", {
    rules: [
        {
            type: "alias",
            stringToReplace: "Thailand",
            alias: "tie-land",
        },
    ],
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**pronunciationDictionaryId:** `string` — The id of the pronunciation dictionary

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.pronunciationDictionaries.PronunciationDictionary`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Rules.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.pronunciationDictionaries.rules.<a href="/src/api/resources/pronunciationDictionaries/resources/rules/client/Client.ts">remove</a>(pronunciationDictionaryId, { ...params }) -> ElevenLabs.PronunciationDictionaryRulesResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Remove rules from the pronunciation dictionary

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.pronunciationDictionaries.rules.remove("21m00Tcm4TlvDq8ikWAM", {
    ruleStrings: ["rule_strings"],
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**pronunciationDictionaryId:** `string` — The id of the pronunciation dictionary

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.pronunciationDictionaries.RemovePronunciationDictionaryRulesRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Rules.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## ServiceAccounts ApiKeys

<details><summary><code>client.serviceAccounts.apiKeys.<a href="/src/api/resources/serviceAccounts/resources/apiKeys/client/Client.ts">list</a>(serviceAccountUserId) -> ElevenLabs.WorkspaceApiKeyListResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get all API keys for a service account

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.serviceAccounts.apiKeys.list("service_account_user_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**serviceAccountUserId:** `string`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ApiKeys.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.serviceAccounts.apiKeys.<a href="/src/api/resources/serviceAccounts/resources/apiKeys/client/Client.ts">create</a>(serviceAccountUserId, { ...params }) -> ElevenLabs.WorkspaceCreateApiKeyResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a new API key for a service account

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.serviceAccounts.apiKeys.create("service_account_user_id", {
    name: "name",
    permissions: ["text_to_speech"],
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**serviceAccountUserId:** `string`

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.serviceAccounts.BodyCreateServiceAccountApiKeyV1ServiceAccountsServiceAccountUserIdApiKeysPost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ApiKeys.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.serviceAccounts.apiKeys.<a href="/src/api/resources/serviceAccounts/resources/apiKeys/client/Client.ts">delete</a>(serviceAccountUserId, apiKeyId) -> unknown</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete an existing API key for a service account

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.serviceAccounts.apiKeys.delete("service_account_user_id", "api_key_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**serviceAccountUserId:** `string`

</dd>
</dl>

<dl>
<dd>

**apiKeyId:** `string`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ApiKeys.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.serviceAccounts.apiKeys.<a href="/src/api/resources/serviceAccounts/resources/apiKeys/client/Client.ts">update</a>(serviceAccountUserId, apiKeyId, { ...params }) -> unknown</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update an existing API key for a service account

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.serviceAccounts.apiKeys.update("service_account_user_id", "api_key_id", {
    isEnabled: true,
    name: "Sneaky Fox",
    permissions: ["text_to_speech"],
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**serviceAccountUserId:** `string`

</dd>
</dl>

<dl>
<dd>

**apiKeyId:** `string`

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.serviceAccounts.BodyEditServiceAccountApiKeyV1ServiceAccountsServiceAccountUserIdApiKeysApiKeyIdPatch`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ApiKeys.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## SpeechToText Transcripts

<details><summary><code>client.speechToText.transcripts.<a href="/src/api/resources/speechToText/resources/transcripts/client/Client.ts">get</a>(transcriptionId) -> ElevenLabs.TranscriptsGetResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve a previously generated transcript by its ID.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.speechToText.transcripts.get("transcription_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**transcriptionId:** `string` — The unique ID of the transcript to retrieve

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Transcripts.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.speechToText.transcripts.<a href="/src/api/resources/speechToText/resources/transcripts/client/Client.ts">delete</a>(transcriptionId) -> unknown</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete a previously generated transcript by its ID.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.speechToText.transcripts.delete("transcription_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**transcriptionId:** `string` — The unique ID of the transcript to delete

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Transcripts.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Studio Projects

<details><summary><code>client.studio.projects.<a href="/src/api/resources/studio/resources/projects/client/Client.ts">list</a>() -> ElevenLabs.GetProjectsResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns a list of your Studio projects with metadata.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.studio.projects.list();
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**requestOptions:** `Projects.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.studio.projects.<a href="/src/api/resources/studio/resources/projects/client/Client.ts">create</a>({ ...params }) -> ElevenLabs.AddProjectResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a new Studio project, it can be either initialized as blank, from a document or from a URL.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.studio.projects.create({
    fromDocument: fs.createReadStream("/path/to/your/file"),
    name: "name",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.studio.BodyCreateStudioProjectV1StudioProjectsPost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Projects.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.studio.projects.<a href="/src/api/resources/studio/resources/projects/client/Client.ts">get</a>(projectId, { ...params }) -> ElevenLabs.ProjectExtendedResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns information about a specific Studio project. This endpoint returns more detailed information about a project than `GET /v1/studio`.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.studio.projects.get("21m00Tcm4TlvDq8ikWAM", {
    shareId: "share_id",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The ID of the project to be used. You can use the [List projects](/docs/api-reference/studio/get-projects) endpoint to list all the available projects.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.studio.ProjectsGetRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Projects.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.studio.projects.<a href="/src/api/resources/studio/resources/projects/client/Client.ts">update</a>(projectId, { ...params }) -> ElevenLabs.EditProjectResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates the specified Studio project by setting the values of the parameters passed.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.studio.projects.update("21m00Tcm4TlvDq8ikWAM", {
    name: "Project 1",
    defaultTitleVoiceId: "21m00Tcm4TlvDq8ikWAM",
    defaultParagraphVoiceId: "21m00Tcm4TlvDq8ikWAM",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The ID of the project to be used. You can use the [List projects](/docs/api-reference/studio/get-projects) endpoint to list all the available projects.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.studio.BodyUpdateStudioProjectV1StudioProjectsProjectIdPost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Projects.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.studio.projects.<a href="/src/api/resources/studio/resources/projects/client/Client.ts">delete</a>(projectId) -> ElevenLabs.DeleteProjectResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes a Studio project.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.studio.projects.delete("21m00Tcm4TlvDq8ikWAM");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The ID of the project to be used. You can use the [List projects](/docs/api-reference/studio/get-projects) endpoint to list all the available projects.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Projects.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.studio.projects.<a href="/src/api/resources/studio/resources/projects/client/Client.ts">convert</a>(projectId) -> ElevenLabs.ConvertProjectResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Starts conversion of a Studio project and all of its chapters.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.studio.projects.convert("21m00Tcm4TlvDq8ikWAM");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The ID of the project to be used. You can use the [List projects](/docs/api-reference/studio/get-projects) endpoint to list all the available projects.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Projects.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Studio Projects PronunciationDictionaries

<details><summary><code>client.studio.projects.pronunciationDictionaries.<a href="/src/api/resources/studio/resources/projects/resources/pronunciationDictionaries/client/Client.ts">create</a>(projectId, { ...params }) -> ElevenLabs.CreatePronunciationDictionaryResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a set of pronunciation dictionaries acting on a project. This will automatically mark text within this project as requiring reconverting where the new dictionary would apply or the old one no longer does.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.studio.projects.pronunciationDictionaries.create("21m00Tcm4TlvDq8ikWAM", {
    pronunciationDictionaryLocators: [
        {
            pronunciationDictionaryId: "pronunciation_dictionary_id",
        },
    ],
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The ID of the project to be used. You can use the [List projects](/docs/api-reference/studio/get-projects) endpoint to list all the available projects.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.studio.projects.BodyCreatePronunciationDictionariesV1StudioProjectsProjectIdPronunciationDictionariesPost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `PronunciationDictionaries.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Studio Projects Content

<details><summary><code>client.studio.projects.content.<a href="/src/api/resources/studio/resources/projects/resources/content/client/Client.ts">update</a>(projectId, { ...params }) -> ElevenLabs.EditProjectResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates Studio project content.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.studio.projects.content.update("21m00Tcm4TlvDq8ikWAM", {
    fromDocument: fs.createReadStream("/path/to/your/file"),
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string`

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.studio.projects.BodyUpdateStudioProjectContentV1StudioProjectsProjectIdContentPost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Content.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Studio Projects Snapshots

<details><summary><code>client.studio.projects.snapshots.<a href="/src/api/resources/studio/resources/projects/resources/snapshots/client/Client.ts">list</a>(projectId) -> ElevenLabs.ProjectSnapshotsResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieves a list of snapshots for a Studio project.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.studio.projects.snapshots.list("21m00Tcm4TlvDq8ikWAM");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The ID of the Studio project.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Snapshots.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.studio.projects.snapshots.<a href="/src/api/resources/studio/resources/projects/resources/snapshots/client/Client.ts">get</a>(projectId, projectSnapshotId) -> ElevenLabs.ProjectSnapshotExtendedResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the project snapshot.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.studio.projects.snapshots.get("21m00Tcm4TlvDq8ikWAM", "21m00Tcm4TlvDq8ikWAM");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The ID of the Studio project.

</dd>
</dl>

<dl>
<dd>

**projectSnapshotId:** `string` — The ID of the Studio project snapshot.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Snapshots.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.studio.projects.snapshots.<a href="/src/api/resources/studio/resources/projects/resources/snapshots/client/Client.ts">stream</a>(projectId, projectSnapshotId, { ...params }) -> ReadableStream<Uint8Array></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Stream the audio from a Studio project snapshot.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.studio.projects.snapshots.stream("project_id", "project_snapshot_id", {
    convertToMpeg: undefined,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The ID of the project to be used. You can use the [List projects](/docs/api-reference/studio/get-projects) endpoint to list all the available projects.

</dd>
</dl>

<dl>
<dd>

**projectSnapshotId:** `string` — The ID of the Studio project snapshot.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.studio.projects.BodyStreamStudioProjectAudioV1StudioProjectsProjectIdSnapshotsProjectSnapshotIdStreamPost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Snapshots.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.studio.projects.snapshots.<a href="/src/api/resources/studio/resources/projects/resources/snapshots/client/Client.ts">streamArchive</a>(projectId, projectSnapshotId) -> ReadableStream<Uint8Array></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns a compressed archive of the Studio project's audio.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.studio.projects.snapshots.streamArchive("project_id", "project_snapshot_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The ID of the project to be used. You can use the [List projects](/docs/api-reference/studio/get-projects) endpoint to list all the available projects.

</dd>
</dl>

<dl>
<dd>

**projectSnapshotId:** `string` — The ID of the Studio project snapshot.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Snapshots.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Studio Projects Chapters

<details><summary><code>client.studio.projects.chapters.<a href="/src/api/resources/studio/resources/projects/resources/chapters/client/Client.ts">list</a>(projectId) -> ElevenLabs.GetChaptersResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns a list of a Studio project's chapters.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.studio.projects.chapters.list("21m00Tcm4TlvDq8ikWAM");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The ID of the Studio project.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Chapters.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.studio.projects.chapters.<a href="/src/api/resources/studio/resources/projects/resources/chapters/client/Client.ts">create</a>(projectId, { ...params }) -> ElevenLabs.AddChapterResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a new chapter either as blank or from a URL.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.studio.projects.chapters.create("21m00Tcm4TlvDq8ikWAM", {
    name: "Chapter 1",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The ID of the Studio project.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.studio.projects.BodyCreateChapterV1StudioProjectsProjectIdChaptersPost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Chapters.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.studio.projects.chapters.<a href="/src/api/resources/studio/resources/projects/resources/chapters/client/Client.ts">get</a>(projectId, chapterId) -> ElevenLabs.ChapterWithContentResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns information about a specific chapter.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.studio.projects.chapters.get("21m00Tcm4TlvDq8ikWAM", "21m00Tcm4TlvDq8ikWAM");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The ID of the project to be used. You can use the [List projects](/docs/api-reference/studio/get-projects) endpoint to list all the available projects.

</dd>
</dl>

<dl>
<dd>

**chapterId:** `string` — The ID of the chapter to be used. You can use the [List project chapters](/docs/api-reference/studio/get-chapters) endpoint to list all the available chapters.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Chapters.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.studio.projects.chapters.<a href="/src/api/resources/studio/resources/projects/resources/chapters/client/Client.ts">update</a>(projectId, chapterId, { ...params }) -> ElevenLabs.EditChapterResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates a chapter.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.studio.projects.chapters.update("21m00Tcm4TlvDq8ikWAM", "21m00Tcm4TlvDq8ikWAM");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The ID of the project to be used. You can use the [List projects](/docs/api-reference/studio/get-projects) endpoint to list all the available projects.

</dd>
</dl>

<dl>
<dd>

**chapterId:** `string` — The ID of the chapter to be used. You can use the [List project chapters](/docs/api-reference/studio/get-chapters) endpoint to list all the available chapters.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.studio.projects.BodyUpdateChapterV1StudioProjectsProjectIdChaptersChapterIdPost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Chapters.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.studio.projects.chapters.<a href="/src/api/resources/studio/resources/projects/resources/chapters/client/Client.ts">delete</a>(projectId, chapterId) -> ElevenLabs.DeleteChapterResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes a chapter.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.studio.projects.chapters.delete("21m00Tcm4TlvDq8ikWAM", "21m00Tcm4TlvDq8ikWAM");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The ID of the project to be used. You can use the [List projects](/docs/api-reference/studio/get-projects) endpoint to list all the available projects.

</dd>
</dl>

<dl>
<dd>

**chapterId:** `string` — The ID of the chapter to be used. You can use the [List project chapters](/docs/api-reference/studio/get-chapters) endpoint to list all the available chapters.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Chapters.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.studio.projects.chapters.<a href="/src/api/resources/studio/resources/projects/resources/chapters/client/Client.ts">convert</a>(projectId, chapterId) -> ElevenLabs.ConvertChapterResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Starts conversion of a specific chapter.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.studio.projects.chapters.convert("21m00Tcm4TlvDq8ikWAM", "21m00Tcm4TlvDq8ikWAM");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The ID of the project to be used. You can use the [List projects](/docs/api-reference/studio/get-projects) endpoint to list all the available projects.

</dd>
</dl>

<dl>
<dd>

**chapterId:** `string` — The ID of the chapter to be used. You can use the [List project chapters](/docs/api-reference/studio/get-chapters) endpoint to list all the available chapters.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Chapters.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Studio Projects Chapters Snapshots

<details><summary><code>client.studio.projects.chapters.snapshots.<a href="/src/api/resources/studio/resources/projects/resources/chapters/resources/snapshots/client/Client.ts">list</a>(projectId, chapterId) -> ElevenLabs.ChapterSnapshotsResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Gets information about all the snapshots of a chapter. Each snapshot can be downloaded as audio. Whenever a chapter is converted a snapshot will automatically be created.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.studio.projects.chapters.snapshots.list("21m00Tcm4TlvDq8ikWAM", "21m00Tcm4TlvDq8ikWAM");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The ID of the project to be used. You can use the [List projects](/docs/api-reference/studio/get-projects) endpoint to list all the available projects.

</dd>
</dl>

<dl>
<dd>

**chapterId:** `string` — The ID of the chapter to be used. You can use the [List project chapters](/docs/api-reference/studio/get-chapters) endpoint to list all the available chapters.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Snapshots.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.studio.projects.chapters.snapshots.<a href="/src/api/resources/studio/resources/projects/resources/chapters/resources/snapshots/client/Client.ts">get</a>(projectId, chapterId, chapterSnapshotId) -> ElevenLabs.ChapterSnapshotExtendedResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the chapter snapshot.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.studio.projects.chapters.snapshots.get(
    "21m00Tcm4TlvDq8ikWAM",
    "21m00Tcm4TlvDq8ikWAM",
    "21m00Tcm4TlvDq8ikWAM",
);
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The ID of the Studio project.

</dd>
</dl>

<dl>
<dd>

**chapterId:** `string` — The ID of the chapter.

</dd>
</dl>

<dl>
<dd>

**chapterSnapshotId:** `string` — The ID of the chapter snapshot.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Snapshots.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.studio.projects.chapters.snapshots.<a href="/src/api/resources/studio/resources/projects/resources/chapters/resources/snapshots/client/Client.ts">stream</a>(projectId, chapterId, chapterSnapshotId, { ...params }) -> ReadableStream<Uint8Array></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Stream the audio from a chapter snapshot. Use `GET /v1/studio/projects/{project_id}/chapters/{chapter_id}/snapshots` to return the snapshots of a chapter.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.studio.projects.chapters.snapshots.stream("project_id", "chapter_id", "chapter_snapshot_id", {
    convertToMpeg: undefined,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**projectId:** `string` — The ID of the project to be used. You can use the [List projects](/docs/api-reference/studio/get-projects) endpoint to list all the available projects.

</dd>
</dl>

<dl>
<dd>

**chapterId:** `string` — The ID of the chapter to be used. You can use the [List project chapters](/docs/api-reference/studio/get-chapters) endpoint to list all the available chapters.

</dd>
</dl>

<dl>
<dd>

**chapterSnapshotId:** `string` — The ID of the chapter snapshot to be used. You can use the [List project chapter snapshots](/docs/api-reference/studio/get-snapshots) endpoint to list all the available snapshots.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.studio.projects.chapters.BodyStreamChapterAudioV1StudioProjectsProjectIdChaptersChapterIdSnapshotsChapterSnapshotIdStreamPost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Snapshots.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## TextToVoice Preview

<details><summary><code>client.textToVoice.preview.<a href="/src/api/resources/textToVoice/resources/preview/client/Client.ts">stream</a>(generatedVoiceId) -> ReadableStream<Uint8Array></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Stream a voice preview that was created via the /v1/text-to-voice/design endpoint.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.textToVoice.preview.stream("generated_voice_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**generatedVoiceId:** `string` — The generated_voice_id to stream.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Preview.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## User Subscription

<details><summary><code>client.user.subscription.<a href="/src/api/resources/user/resources/subscription/client/Client.ts">get</a>() -> ElevenLabs.Subscription</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Gets extended information about the users subscription

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.user.subscription.get();
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**requestOptions:** `Subscription.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Voices Settings

<details><summary><code>client.voices.settings.<a href="/src/api/resources/voices/resources/settings/client/Client.ts">getDefault</a>() -> ElevenLabs.VoiceSettings</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Gets the default settings for voices. "similarity_boost" corresponds to"Clarity + Similarity Enhancement" in the web app and "stability" corresponds to "Stability" slider in the web app.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.voices.settings.getDefault();
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**requestOptions:** `Settings.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.voices.settings.<a href="/src/api/resources/voices/resources/settings/client/Client.ts">get</a>(voiceId) -> ElevenLabs.VoiceSettings</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the settings for a specific voice. "similarity_boost" corresponds to"Clarity + Similarity Enhancement" in the web app and "stability" corresponds to "Stability" slider in the web app.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.voices.settings.get("21m00Tcm4TlvDq8ikWAM");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**voiceId:** `string` — Voice ID to be used, you can use https://api.elevenlabs.io/v1/voices to list all the available voices.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Settings.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.voices.settings.<a href="/src/api/resources/voices/resources/settings/client/Client.ts">update</a>(voiceId, { ...params }) -> ElevenLabs.EditVoiceSettingsResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Edit your settings for a specific voice. "similarity_boost" corresponds to "Clarity + Similarity Enhancement" in the web app and "stability" corresponds to "Stability" slider in the web app.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.voices.settings.update("21m00Tcm4TlvDq8ikWAM", {
    stability: 1,
    useSpeakerBoost: true,
    similarityBoost: 1,
    style: 0,
    speed: 1,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**voiceId:** `string` — ID of the voice to be used. You can use the [Get voices](/docs/api-reference/voices/search) endpoint list all the available voices.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.VoiceSettings`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Settings.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Voices Ivc

<details><summary><code>client.voices.ivc.<a href="/src/api/resources/voices/resources/ivc/client/Client.ts">create</a>({ ...params }) -> ElevenLabs.AddVoiceIvcResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a voice clone and add it to your Voices

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.voices.ivc.create({
    files: [fs.createReadStream("/path/to/your/file")],
    name: "name",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.voices.BodyAddVoiceV1VoicesAddPost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Ivc.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Voices Pvc

<details><summary><code>client.voices.pvc.<a href="/src/api/resources/voices/resources/pvc/client/Client.ts">create</a>({ ...params }) -> ElevenLabs.AddVoiceResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a new PVC voice with metadata but no samples

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.voices.pvc.create({
    name: "John Smith",
    language: "en",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.voices.CreatePvcVoiceRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Pvc.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.voices.pvc.<a href="/src/api/resources/voices/resources/pvc/client/Client.ts">update</a>(voiceId, { ...params }) -> ElevenLabs.AddVoiceResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Edit PVC voice metadata

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.voices.pvc.update("21m00Tcm4TlvDq8ikWAM");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**voiceId:** `string` — Voice ID to be used, you can use https://api.elevenlabs.io/v1/voices to list all the available voices.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.voices.BodyEditPvcVoiceV1VoicesPvcVoiceIdPost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Pvc.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.voices.pvc.<a href="/src/api/resources/voices/resources/pvc/client/Client.ts">train</a>(voiceId, { ...params }) -> ElevenLabs.StartPvcVoiceTrainingResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Start PVC training process for a voice.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.voices.pvc.train("21m00Tcm4TlvDq8ikWAM");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**voiceId:** `string` — Voice ID to be used, you can use https://api.elevenlabs.io/v1/voices to list all the available voices.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.voices.BodyRunPvcTrainingV1VoicesPvcVoiceIdTrainPost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Pvc.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Voices Pvc Samples

<details><summary><code>client.voices.pvc.samples.<a href="/src/api/resources/voices/resources/pvc/resources/samples/client/Client.ts">create</a>(voiceId, { ...params }) -> ElevenLabs.VoiceSample[]</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Add audio samples to a PVC voice

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.voices.pvc.samples.create("21m00Tcm4TlvDq8ikWAM", {
    files: [fs.createReadStream("/path/to/your/file")],
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**voiceId:** `string`

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.voices.pvc.BodyAddSamplesToPvcVoiceV1VoicesPvcVoiceIdSamplesPost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Samples.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.voices.pvc.samples.<a href="/src/api/resources/voices/resources/pvc/resources/samples/client/Client.ts">update</a>(voiceId, sampleId, { ...params }) -> ElevenLabs.AddVoiceResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update a PVC voice sample - apply noise removal, select speaker, change trim times or file name.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.voices.pvc.samples.update("21m00Tcm4TlvDq8ikWAM", "VW7YKqPnjY4h39yTbx2L");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**voiceId:** `string` — Voice ID to be used, you can use https://api.elevenlabs.io/v1/voices to list all the available voices.

</dd>
</dl>

<dl>
<dd>

**sampleId:** `string` — Sample ID to be used

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.voices.pvc.BodyUpdatePvcVoiceSampleV1VoicesPvcVoiceIdSamplesSampleIdPost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Samples.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.voices.pvc.samples.<a href="/src/api/resources/voices/resources/pvc/resources/samples/client/Client.ts">delete</a>(voiceId, sampleId) -> ElevenLabs.DeleteVoiceSampleResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete a sample from a PVC voice.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.voices.pvc.samples.delete("21m00Tcm4TlvDq8ikWAM", "VW7YKqPnjY4h39yTbx2L");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**voiceId:** `string` — Voice ID to be used, you can use https://api.elevenlabs.io/v1/voices to list all the available voices.

</dd>
</dl>

<dl>
<dd>

**sampleId:** `string` — Sample ID to be used

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Samples.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Voices Pvc Verification

<details><summary><code>client.voices.pvc.verification.<a href="/src/api/resources/voices/resources/pvc/resources/verification/client/Client.ts">request</a>(voiceId, { ...params }) -> ElevenLabs.RequestPvcManualVerificationResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Request manual verification for a PVC voice.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.voices.pvc.verification.request("21m00Tcm4TlvDq8ikWAM", {
    files: [fs.createReadStream("/path/to/your/file")],
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**voiceId:** `string`

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.voices.pvc.BodyRequestManualVerificationV1VoicesPvcVoiceIdVerificationPost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Verification.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Voices Pvc Samples Audio

<details><summary><code>client.voices.pvc.samples.audio.<a href="/src/api/resources/voices/resources/pvc/resources/samples/resources/audio/client/Client.ts">get</a>(voiceId, sampleId, { ...params }) -> ElevenLabs.VoiceSamplePreviewResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve the first 30 seconds of voice sample audio with or without noise removal.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.voices.pvc.samples.audio.get("21m00Tcm4TlvDq8ikWAM", "VW7YKqPnjY4h39yTbx2L", {
    removeBackgroundNoise: true,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**voiceId:** `string` — Voice ID to be used, you can use https://api.elevenlabs.io/v1/voices to list all the available voices.

</dd>
</dl>

<dl>
<dd>

**sampleId:** `string` — Sample ID to be used

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.voices.pvc.samples.AudioGetRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Audio.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Voices Pvc Samples Waveform

<details><summary><code>client.voices.pvc.samples.waveform.<a href="/src/api/resources/voices/resources/pvc/resources/samples/resources/waveform/client/Client.ts">get</a>(voiceId, sampleId) -> ElevenLabs.VoiceSampleVisualWaveformResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve the visual waveform of a voice sample.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.voices.pvc.samples.waveform.get("21m00Tcm4TlvDq8ikWAM", "VW7YKqPnjY4h39yTbx2L");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**voiceId:** `string` — Voice ID to be used, you can use https://api.elevenlabs.io/v1/voices to list all the available voices.

</dd>
</dl>

<dl>
<dd>

**sampleId:** `string` — Sample ID to be used

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Waveform.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Voices Pvc Samples Speakers

<details><summary><code>client.voices.pvc.samples.speakers.<a href="/src/api/resources/voices/resources/pvc/resources/samples/resources/speakers/client/Client.ts">get</a>(voiceId, sampleId) -> ElevenLabs.SpeakerSeparationResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve the status of the speaker separation process and the list of detected speakers if complete.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.voices.pvc.samples.speakers.get("21m00Tcm4TlvDq8ikWAM", "VW7YKqPnjY4h39yTbx2L");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**voiceId:** `string` — Voice ID to be used, you can use https://api.elevenlabs.io/v1/voices to list all the available voices.

</dd>
</dl>

<dl>
<dd>

**sampleId:** `string` — Sample ID to be used

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Speakers.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.voices.pvc.samples.speakers.<a href="/src/api/resources/voices/resources/pvc/resources/samples/resources/speakers/client/Client.ts">separate</a>(voiceId, sampleId) -> ElevenLabs.StartSpeakerSeparationResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Start speaker separation process for a sample

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.voices.pvc.samples.speakers.separate("21m00Tcm4TlvDq8ikWAM", "VW7YKqPnjY4h39yTbx2L");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**voiceId:** `string` — Voice ID to be used, you can use https://api.elevenlabs.io/v1/voices to list all the available voices.

</dd>
</dl>

<dl>
<dd>

**sampleId:** `string` — Sample ID to be used

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Speakers.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Voices Pvc Samples Speakers Audio

<details><summary><code>client.voices.pvc.samples.speakers.audio.<a href="/src/api/resources/voices/resources/pvc/resources/samples/resources/speakers/resources/audio/client/Client.ts">get</a>(voiceId, sampleId, speakerId) -> ElevenLabs.SpeakerAudioResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve the separated audio for a specific speaker.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.voices.pvc.samples.speakers.audio.get(
    "21m00Tcm4TlvDq8ikWAM",
    "VW7YKqPnjY4h39yTbx2L",
    "VW7YKqPnjY4h39yTbx2L",
);
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**voiceId:** `string` — Voice ID to be used, you can use https://api.elevenlabs.io/v1/voices to list all the available voices.

</dd>
</dl>

<dl>
<dd>

**sampleId:** `string` — Sample ID to be used

</dd>
</dl>

<dl>
<dd>

**speakerId:** `string` — Speaker ID to be used, you can use GET https://api.elevenlabs.io/v1/voices/{voice_id}/samples/{sample_id}/speakers to list all the available speakers for a sample.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Audio.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Voices Pvc Verification Captcha

<details><summary><code>client.voices.pvc.verification.captcha.<a href="/src/api/resources/voices/resources/pvc/resources/verification/resources/captcha/client/Client.ts">get</a>(voiceId) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get captcha for PVC voice verification.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.voices.pvc.verification.captcha.get("21m00Tcm4TlvDq8ikWAM");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**voiceId:** `string` — Voice ID to be used, you can use https://api.elevenlabs.io/v1/voices to list all the available voices.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Captcha.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.voices.pvc.verification.captcha.<a href="/src/api/resources/voices/resources/pvc/resources/verification/resources/captcha/client/Client.ts">verify</a>(voiceId, { ...params }) -> ElevenLabs.VerifyPvcVoiceCaptchaResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Submit captcha verification for PVC voice.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.voices.pvc.verification.captcha.verify("21m00Tcm4TlvDq8ikWAM", {
    recording: fs.createReadStream("/path/to/your/file"),
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**voiceId:** `string`

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.voices.pvc.verification.BodyVerifyPvcVoiceCaptchaV1VoicesPvcVoiceIdCaptchaPost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Captcha.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Voices Samples Audio

<details><summary><code>client.voices.samples.audio.<a href="/src/api/resources/voices/resources/samples/resources/audio/client/Client.ts">get</a>(voiceId, sampleId) -> ReadableStream<Uint8Array></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the audio corresponding to a sample attached to a voice.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.voices.samples.audio.get("voice_id", "sample_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**voiceId:** `string` — ID of the voice to be used. You can use the [Get voices](/docs/api-reference/voices/search) endpoint list all the available voices.

</dd>
</dl>

<dl>
<dd>

**sampleId:** `string` — ID of the sample to be used. You can use the [Get voices](/docs/api-reference/voices/get) endpoint list all the available samples for a voice.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Audio.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Workspace Groups

<details><summary><code>client.workspace.groups.<a href="/src/api/resources/workspace/resources/groups/client/Client.ts">search</a>({ ...params }) -> ElevenLabs.WorkspaceGroupByNameResponseModel[]</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Searches for user groups in the workspace. Multiple or no groups may be returned.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.workspace.groups.search({
    name: "name",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.workspace.GroupsSearchRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Groups.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Workspace Invites

<details><summary><code>client.workspace.invites.<a href="/src/api/resources/workspace/resources/invites/client/Client.ts">create</a>({ ...params }) -> ElevenLabs.AddWorkspaceInviteResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Sends an email invitation to join your workspace to the provided email. If the user doesn't have an account they will be prompted to create one. If the user accepts this invite they will be added as a user to your workspace and your subscription using one of your seats. This endpoint may only be called by workspace administrators. If the user is already in the workspace a 400 error will be returned.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.workspace.invites.create({
    email: "john.doe@testmail.com",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.workspace.InviteUserRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Invites.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.workspace.invites.<a href="/src/api/resources/workspace/resources/invites/client/Client.ts">createBatch</a>({ ...params }) -> ElevenLabs.AddWorkspaceInviteResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Sends email invitations to join your workspace to the provided emails. Requires all email addresses to be part of a verified domain. If the users don't have an account they will be prompted to create one. If the users accept these invites they will be added as users to your workspace and your subscription using one of your seats. This endpoint may only be called by workspace administrators.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.workspace.invites.createBatch({
    emails: ["emails"],
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.workspace.BodyInviteMultipleUsersV1WorkspaceInvitesAddBulkPost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Invites.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.workspace.invites.<a href="/src/api/resources/workspace/resources/invites/client/Client.ts">delete</a>({ ...params }) -> ElevenLabs.DeleteWorkspaceInviteResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Invalidates an existing email invitation. The invitation will still show up in the inbox it has been delivered to, but activating it to join the workspace won't work. This endpoint may only be called by workspace administrators.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.workspace.invites.delete({
    email: "john.doe@testmail.com",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.workspace.BodyDeleteExistingInvitationV1WorkspaceInvitesDelete`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Invites.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Workspace Members

<details><summary><code>client.workspace.members.<a href="/src/api/resources/workspace/resources/members/client/Client.ts">update</a>({ ...params }) -> ElevenLabs.UpdateWorkspaceMemberResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates attributes of a workspace member. Apart from the email identifier, all parameters will remain unchanged unless specified. This endpoint may only be called by workspace administrators.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.workspace.members.update({
    email: "email",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `ElevenLabs.workspace.UpdateMemberRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Members.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Workspace Resources

<details><summary><code>client.workspace.resources.<a href="/src/api/resources/workspace/resources/resources/client/Client.ts">get</a>(resourceId, { ...params }) -> ElevenLabs.ResourceMetadataResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Gets the metadata of a resource by ID.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.workspace.resources.get("resource_id", {
    resourceType: "voice",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**resourceId:** `string` — The ID of the target resource.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.workspace.ResourcesGetRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Resources.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.workspace.resources.<a href="/src/api/resources/workspace/resources/resources/client/Client.ts">share</a>(resourceId, { ...params }) -> unknown</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Grants a role on a workspace resource to a user or a group. It overrides any existing role this user/service account/group/workspace api key has on the resource. To target a user or service account, pass only the user email. The user must be in your workspace. To target a group, pass only the group id. To target a workspace api key, pass the api key id. The resource will be shared with the service account associated with the api key. You must have admin access to the resource to share it.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.workspace.resources.share("resource_id", {
    role: "admin",
    resourceType: "voice",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**resourceId:** `string` — The ID of the target resource.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.workspace.BodyShareWorkspaceResourceV1WorkspaceResourcesResourceIdSharePost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Resources.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.workspace.resources.<a href="/src/api/resources/workspace/resources/resources/client/Client.ts">unshare</a>(resourceId, { ...params }) -> unknown</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Removes any existing role on a workspace resource from a user, service account, group or workspace api key. To target a user or service account, pass only the user email. The user must be in your workspace. To target a group, pass only the group id. To target a workspace api key, pass the api key id. The resource will be unshared from the service account associated with the api key. You must have admin access to the resource to unshare it. You cannot remove permissions from the user who created the resource.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.workspace.resources.unshare("resource_id", {
    resourceType: "voice",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**resourceId:** `string` — The ID of the target resource.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.workspace.BodyUnshareWorkspaceResourceV1WorkspaceResourcesResourceIdUnsharePost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Resources.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Workspace Groups Members

<details><summary><code>client.workspace.groups.members.<a href="/src/api/resources/workspace/resources/groups/resources/members/client/Client.ts">remove</a>(groupId, { ...params }) -> ElevenLabs.DeleteWorkspaceGroupMemberResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Removes a member from the specified group. This endpoint may only be called by workspace administrators.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.workspace.groups.members.remove("group_id", {
    email: "email",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**groupId:** `string` — The ID of the target group.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.workspace.groups.BodyDeleteMemberFromUserGroupV1WorkspaceGroupsGroupIdMembersRemovePost`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Members.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.workspace.groups.members.<a href="/src/api/resources/workspace/resources/groups/resources/members/client/Client.ts">add</a>(groupId, { ...params }) -> ElevenLabs.AddWorkspaceGroupMemberResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Adds a member of your workspace to the specified group. This endpoint may only be called by workspace administrators.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.workspace.groups.members.add("group_id", {
    email: "email",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**groupId:** `string` — The ID of the target group.

</dd>
</dl>

<dl>
<dd>

**request:** `ElevenLabs.workspace.groups.AddMemberToGroupRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Members.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>
