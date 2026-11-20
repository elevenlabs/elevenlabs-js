import { ConversationalAiClient as GeneratedConversationalAiClient } from "../api/resources/conversationalAi/client/Client";
import { AgentsClient } from "./agents/agent/AgentsClient";

/** `client.conversationalAi`, whose `agents` adds `push()` and `pull()` for agents written as code. */
export class ConversationalAi extends GeneratedConversationalAiClient {
    public override get agents(): AgentsClient {
        if (!(this._agents instanceof AgentsClient)) {
            this._agents = new AgentsClient(this._options);
        }
        return this._agents as AgentsClient;
    }
}
