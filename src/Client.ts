/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as environments from "./environments";
import * as core from "./core";
import { History } from "./api/resources/history/client/Client";
import { TextToSoundEffects } from "./api/resources/textToSoundEffects/client/Client";
import { AudioIsolation } from "./api/resources/audioIsolation/client/Client";
import { Samples } from "./api/resources/samples/client/Client";
import { TextToSpeech } from "./api/resources/textToSpeech/client/Client";
import { SpeechToSpeech } from "./api/resources/speechToSpeech/client/Client";
import { VoiceGeneration } from "./api/resources/voiceGeneration/client/Client";
import { TextToVoice } from "./api/resources/textToVoice/client/Client";
import { User } from "./api/resources/user/client/Client";
import { Voices } from "./api/resources/voices/client/Client";
import { Projects } from "./api/resources/projects/client/Client";
import { Chapters } from "./api/resources/chapters/client/Client";
import { Dubbing } from "./api/resources/dubbing/client/Client";
import { Models } from "./api/resources/models/client/Client";
import { AudioNative } from "./api/resources/audioNative/client/Client";
import { Usage } from "./api/resources/usage/client/Client";
import { PronunciationDictionary } from "./api/resources/pronunciationDictionary/client/Client";
import { Workspace } from "./api/resources/workspace/client/Client";
import { ConversationalAi } from "./api/resources/conversationalAi/client/Client";
import { ReaderPublisherProfiles } from "./api/resources/readerPublisherProfiles/client/Client";

export declare namespace ElevenLabsClient {
    interface Options {
        environment?: core.Supplier<environments.ElevenLabsEnvironment | string>;
        /** Override the xi-api-key header */
        apiKey?: core.Supplier<string | undefined>;
    }

    interface RequestOptions {
        /** The maximum time to wait for a response in seconds. */
        timeoutInSeconds?: number;
        /** The number of times to retry the request. Defaults to 2. */
        maxRetries?: number;
        /** A hook to abort the request. */
        abortSignal?: AbortSignal;
        /** Override the xi-api-key header */
        apiKey?: string | undefined;
    }
}

export class ElevenLabsClient {
    constructor(protected readonly _options: ElevenLabsClient.Options = {}) {}

    protected _history: History | undefined;

    public get history(): History {
        return (this._history ??= new History(this._options));
    }

    protected _textToSoundEffects: TextToSoundEffects | undefined;

    public get textToSoundEffects(): TextToSoundEffects {
        return (this._textToSoundEffects ??= new TextToSoundEffects(this._options));
    }

    protected _audioIsolation: AudioIsolation | undefined;

    public get audioIsolation(): AudioIsolation {
        return (this._audioIsolation ??= new AudioIsolation(this._options));
    }

    protected _samples: Samples | undefined;

    public get samples(): Samples {
        return (this._samples ??= new Samples(this._options));
    }

    protected _textToSpeech: TextToSpeech | undefined;

    public get textToSpeech(): TextToSpeech {
        return (this._textToSpeech ??= new TextToSpeech(this._options));
    }

    protected _speechToSpeech: SpeechToSpeech | undefined;

    public get speechToSpeech(): SpeechToSpeech {
        return (this._speechToSpeech ??= new SpeechToSpeech(this._options));
    }

    protected _voiceGeneration: VoiceGeneration | undefined;

    public get voiceGeneration(): VoiceGeneration {
        return (this._voiceGeneration ??= new VoiceGeneration(this._options));
    }

    protected _textToVoice: TextToVoice | undefined;

    public get textToVoice(): TextToVoice {
        return (this._textToVoice ??= new TextToVoice(this._options));
    }

    protected _user: User | undefined;

    public get user(): User {
        return (this._user ??= new User(this._options));
    }

    protected _voices: Voices | undefined;

    public get voices(): Voices {
        return (this._voices ??= new Voices(this._options));
    }

    protected _projects: Projects | undefined;

    public get projects(): Projects {
        return (this._projects ??= new Projects(this._options));
    }

    protected _chapters: Chapters | undefined;

    public get chapters(): Chapters {
        return (this._chapters ??= new Chapters(this._options));
    }

    protected _dubbing: Dubbing | undefined;

    public get dubbing(): Dubbing {
        return (this._dubbing ??= new Dubbing(this._options));
    }

    protected _models: Models | undefined;

    public get models(): Models {
        return (this._models ??= new Models(this._options));
    }

    protected _audioNative: AudioNative | undefined;

    public get audioNative(): AudioNative {
        return (this._audioNative ??= new AudioNative(this._options));
    }

    protected _usage: Usage | undefined;

    public get usage(): Usage {
        return (this._usage ??= new Usage(this._options));
    }

    protected _pronunciationDictionary: PronunciationDictionary | undefined;

    public get pronunciationDictionary(): PronunciationDictionary {
        return (this._pronunciationDictionary ??= new PronunciationDictionary(this._options));
    }

    protected _workspace: Workspace | undefined;

    public get workspace(): Workspace {
        return (this._workspace ??= new Workspace(this._options));
    }

    protected _conversationalAi: ConversationalAi | undefined;

    public get conversationalAi(): ConversationalAi {
        return (this._conversationalAi ??= new ConversationalAi(this._options));
    }

    protected _readerPublisherProfiles: ReaderPublisherProfiles | undefined;

    public get readerPublisherProfiles(): ReaderPublisherProfiles {
        return (this._readerPublisherProfiles ??= new ReaderPublisherProfiles(this._options));
    }
}
