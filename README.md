# ElevenLabs JS Library

![LOGO](https://github.com/elevenlabs/elevenlabs-python/assets/12028621/21267d89-5e82-4e7e-9c81-caf30b237683)

[![fern shield](https://img.shields.io/badge/%F0%9F%8C%BF-SDK%20generated%20by%20Fern-brightgreen)](https://buildwithfern.com/?utm_source=fern-elevenlabs/elevenlabs-python/readme)
[![Discord](https://badgen.net/badge/black/ElevenLabs/icon?icon=discord&label)](https://discord.gg/elevenlabs)
[![Twitter](https://badgen.net/badge/black/elevenlabsio/icon?icon=twitter&label)](https://twitter.com/elevenlabsio)
[![npm shield](https://img.shields.io/npm/v/elevenlabs)](https://www.npmjs.com/package/elevenlabs)

The official JS API for [ElevenLabs](https://elevenlabs.io/) [text-to-speech software.](https://elevenlabs.io/text-to-speech) Eleven brings the most compelling, rich and lifelike voices to creators and developers in just a few lines of code.

## 📖 API & Docs

Check out the [HTTP API documentation](https://elevenlabs.io/docs/api-reference).

## ⚙️ Install

```bash
npm install elevenlabs
# or 
yarn add elevenlabs
```

## 🗣️ Usage
[![Open in Spaces](https://img.shields.io/badge/🤗-Open%20in%20Spaces-blue.svg)](https://huggingface.co/spaces/elevenlabs/tts)
[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/gist/flavioschneider/49468d728a816c6538fd2f56b3b50b96/elevenlabs-python.ipynb)

We support two main models: the newest `eleven_multilingual_v2`, a single foundational model supporting 29 languages including English, Chinese, Spanish, Hindi, Portuguese, French, German, Japanese, Arabic, Korean, Indonesian, Italian, Dutch, Turkish, Polish, Swedish, Filipino, Malay, Russian, Romanian, Ukrainian, Greek, Czech, Danish, Finnish, Bulgarian, Croatian, Slovak, and Tamil; and `eleven_monolingual_v1`, a low-latency model specifically trained for English speech.

```ts
import { ElevenLabsClient, play } from "elevenlabs";

const elevenlabs = new ElevenLabsClient({
  apiKey: "YOUR_API_KEY" // Defaults to process.env.ELEVENLABS_API_KEY
})

const audio = await elevenlabs.generate({
  voice: "Rachel",
  text: "Hello! 你好! Hola! नमस्ते! Bonjour! こんにちは! مرحبا! 안녕하세요! Ciao! Cześć! Привіт! வணக்கம்!",
  model_id: "eleven_multilingual_v2"
});

await play(audio);
```

<details> <summary> Play </summary>

<i> Don't forget to unmute the player! </i>

[audio (3).webm](https://github.com/elevenlabs/elevenlabs-python/assets/12028621/778fd3ed-0a3a-4d66-8f73-faee099dfdd6)

</details>

## 🗣️ Voices

List all your available voices with `voices()`.
```ts
import { ElevenLabsClient } from "elevenlabs";

const elevenlabs = new ElevenLabsClient({
  apiKey: "YOUR_API_KEY" // Defaults to process.env.ELEVENLABS_API_KEY
})
const voices = await elevenlabs.voices.getAll();
```

<details> <summary> Show output </summary> 

```ts
    {
      voices: [
        {
          voice_id: '21m00Tcm4TlvDq8ikWAM',
          name: 'Rachel',
          samples: null,
          category: 'premade',
          fine_tuning: [Object],
          labels: [Object],
          description: null,
          preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/21m00Tcm4TlvDq8ikWAM/df6788f9-5c96-470d-8312-aab3b3d8f50a.mp3',
          available_for_tiers: [],
          settings: null,
          sharing: null,
          high_quality_base_model_ids: []
        },
        {
          voice_id: '29vD33N1CtxCmqQRPOHJ',
          name: 'Drew',
          samples: null,
          category: 'premade',
          fine_tuning: [Object],
          labels: [Object],
          description: null,
          preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/29vD33N1CtxCmqQRPOHJ/e8b52a3f-9732-440f-b78a-16d5e26407a1.mp3',
          available_for_tiers: [],
          settings: null,
          sharing: null,
          high_quality_base_model_ids: []
        },
        ...
      ]
    }
```
</details>

## 🚿 Streaming

Stream audio in real-time, as it's being generated.

```ts
const audioStream = await elevenlabs.generate({
  stream: true,
  voice: "Bella",
  text: "This is a... streaming voice",
  model_id: "eleven_multilingual_v2"
});

stream(audioStream)
```

## Retries

This Node SDK is instrumented with automatic retries with exponential backoff. A request will be
retried as long as the request is deemed retriable and the number of retry attempts has not grown larger
than the configured retry limit (default: 2).

A request is deemed retriable when any of the following HTTP status codes is returned:

- [408](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/408) (Timeout)
- [409](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/409) (Conflict)
- [429](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429) (Too Many Requests)
- [5XX](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500) (Internal Server Errors)
  
Use the `maxRetries` request option to configure this behavior. 

```ts
const response = await elevenlabs.voices.getAll({
  maxRetries: 0 // override maxRetries at the request level
});
```

## Timeouts

The SDK defaults to a 60 second timout. Use the `timeoutInSeconds` option to 
configure this behavior. 

```ts
const response = elevenlabs.voices.getAll({
  timeoutInSeconds: 30 // override timeout to 30s
});
```

## Runtime compatiblity

The SDK defaults to `node-fetch` but will use the global fetch client if present. The SDK 
works in the following runtimes: 

The following runtimes are supported:

- Node.js 15+ 
- Vercel 
- Cloudflare Workers
- Deno v1.25+
- Bun 1.0+

### Customizing Fetch client

The SDK provides a way for you to customize the underlying HTTP client / Fetch function. If you're 
running in an unsupported environment, this provides a way for you to break the glass and 
ensure the SDK works. 

```ts
import { ElevenLabsClient } from "elevenlabs";

const elevenlabs = new ElevenLabsClient({
  apiKey: "...",
  fetcher: // provide your implementation here
});
```


## Elevenlabs Namespace
All of the ElevenLabs models are nested within the `ElevenLabs` namespace. 

![Alt text](assets/namespace.png)

## Languages Supported

We support 29 languages and 100+ accents. Explore [all languages](https://elevenlabs.io/languages).

![Alt text](assets/languages.png)

## Contributing

While we value open-source contributions to this SDK, this library is generated programmatically. Additions made directly to this library would have to be moved over to our generation code, otherwise they would be overwritten upon the next generated release. Feel free to open a PR as a proof of concept, but know that we will not be able to merge it as-is. We suggest opening an issue first to discuss with us! 

On the other hand, contributions to the README are always very welcome!
