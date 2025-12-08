import { SpeechToTextClient as GeneratedSpeechToText } from "../api/resources/speechToText/client/Client";
import { ScribeRealtime } from "./realtime";

export class SpeechToText extends GeneratedSpeechToText {
    private _realtime: ScribeRealtime | undefined;

    public get realtime(): ScribeRealtime {
        if (!this._realtime) {
            this._realtime = new ScribeRealtime(this._options);
        }
        return this._realtime;
    }
}

