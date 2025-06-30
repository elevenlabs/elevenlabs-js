# Reference

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
await client.history.list();
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

## TextToSoundEffects

<details><summary><code>client.textToSoundEffects.<a href="/src/api/resources/textToSoundEffects/client/Client.ts">convert</a>({ ...params }) -> ReadableStream<Uint8Array></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Turn text into sound effects for your videos, voice-overs or video games using the most advanced sound effects model in the world.

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

**request:** `ElevenLabs.TextToSpeechRequest`

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

**request:** `ElevenLabs.TextToSpeechWithTimestampsRequest`

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

<Warning>Eleven v3 API access is currently not publicly available, but will be soon.</Warning><br/>Converts a list of text and voice ID pairs into speech (dialogue) and returns audio.

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

<Warning>Eleven v3 API access is currently not publicly available, but will be soon.</Warning><br/>Converts a list of text and voice ID pairs into speech (dialogue) and returns an audio stream.

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

<details><summary><code>client.textToVoice.<a href="/src/api/resources/textToVoice/client/Client.ts">createVoiceFromPreview</a>({ ...params }) -> ElevenLabs.Voice</code></summary>
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
await client.textToVoice.createVoiceFromPreview({
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

**request:** `ElevenLabs.SaveVoicePreviewRequest`

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

## User

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
await client.voices.getAll();
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
await client.voices.get("21m00Tcm4TlvDq8ikWAM");
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
    featured: true,
    readerAppEnabled: true,
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
await client.dubbing.create({});
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

## Usage

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
await client.pronunciationDictionaries.list();
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

<details><summary><code>client.speechToText.<a href="/src/api/resources/speechToText/client/Client.ts">convert</a>({ ...params }) -> ElevenLabs.SpeechToTextChunkResponseModel</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Transcribe an audio or video file. If webhook is set to true, the request will be processed asynchronously and results sent to configured webhooks.

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

Upload a file or webpage URL to create a knowledge base document. <br> <Note> After creating the document, update the agent's knowledge base by calling [Update agent](/docs/conversational-ai/api-reference/agents/update-agent). </Note>

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
await client.conversationalAi.addToKnowledgeBase({});
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

<details><summary><code>client.conversationalAi.<a href="/src/api/resources/conversationalAi/client/Client.ts">updateSecret</a>(secretId, { ...params }) -> ElevenLabs.PostWorkspaceSecretResponseModel</code></summary>
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
await client.conversationalAi.updateSecret("secret_id", {
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

**request:** `ElevenLabs.PatchWorkspaceSecretRequest`

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
await client.conversationalAi.conversations.list();
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

<details><summary><code>client.conversationalAi.agents.<a href="/src/api/resources/conversationalAi/resources/agents/client/Client.ts">get</a>(agentId) -> ElevenLabs.GetAgentResponseModel</code></summary>
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
await client.conversationalAi.agents.get("21m00Tcm4TlvDq8ikWAM");
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
await client.conversationalAi.agents.delete("21m00Tcm4TlvDq8ikWAM");
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
await client.conversationalAi.agents.update("21m00Tcm4TlvDq8ikWAM");
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
await client.conversationalAi.agents.list();
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
await client.conversationalAi.agents.duplicate("21m00Tcm4TlvDq8ikWAM");
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
await client.conversationalAi.agents.simulateConversation("21m00Tcm4TlvDq8ikWAM", {
    simulationSpecification: {
        simulatedUserConfig: {
            firstMessage: "Hello, how can I help you today?",
            language: "en",
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
await client.conversationalAi.agents.simulateConversationStream("21m00Tcm4TlvDq8ikWAM", {
    simulationSpecification: {
        simulatedUserConfig: {
            firstMessage: "Hello, how can I help you today?",
            language: "en",
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

## ConversationalAi PhoneNumbers

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

Update Phone Number details by ID

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
await client.conversationalAi.knowledgeBase.list();
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

Get all available tools available in the workspace.

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
await client.conversationalAi.tools.getDependentAgents("tool_id");
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
await client.conversationalAi.batchCalls.list();
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

Retry a batch call by setting completed recipients back to pending status.

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
await client.conversationalAi.agents.widget.get("21m00Tcm4TlvDq8ikWAM");
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
await client.conversationalAi.agents.link.get("21m00Tcm4TlvDq8ikWAM");
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
await client.conversationalAi.agents.widget.avatar.create("21m00Tcm4TlvDq8ikWAM", {
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
await client.conversationalAi.knowledgeBase.documents.get("21m00Tcm4TlvDq8ikWAM");
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
await client.conversationalAi.knowledgeBase.documents.delete("21m00Tcm4TlvDq8ikWAM");
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
await client.conversationalAi.knowledgeBase.documents.getAgents("21m00Tcm4TlvDq8ikWAM");
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
