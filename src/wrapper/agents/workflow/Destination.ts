import type * as ElevenLabs from "../../../api/index";
import { defined } from "./util";

export interface AgentDestinationOptions {
    /** Node in the destination agent's workflow to start from. */
    nodeId?: string;
}

/** @internal */
export type DestinationModel =
    | { type: "phone_number"; transferDestination: ElevenLabs.WorkflowPhoneNumberNodeModelInputTransferDestination }
    | { type: "standalone_agent"; agentId?: string; nodeId?: string };

/** Where a `transfer()` node hands the conversation off to. */
export class Destination {
    private readonly _model: DestinationModel;

    private constructor(model: DestinationModel) {
        this._model = model;
    }

    /** A phone number in E.164 format. */
    static phone(phoneNumber: string): Destination {
        return new Destination({ type: "phone_number", transferDestination: { type: "phone", phoneNumber } });
    }

    /** A phone number read from a dynamic variable at transfer time. */
    static phoneVariable(variableName: string): Destination {
        return new Destination({
            type: "phone_number",
            transferDestination: { type: "phone_dynamic_variable", phoneNumber: variableName },
        });
    }

    /** A SIP URI. */
    static sip(sipUri: string): Destination {
        return new Destination({ type: "phone_number", transferDestination: { type: "sip_uri", sipUri } });
    }

    /** A SIP URI read from a dynamic variable at transfer time. */
    static sipVariable(variableName: string): Destination {
        return new Destination({
            type: "phone_number",
            transferDestination: { type: "sip_uri_dynamic_variable", sipUri: variableName },
        });
    }

    /** Another ElevenLabs agent. */
    static agent(agentId: string, options: AgentDestinationOptions = {}): Destination {
        return new Destination({ type: "standalone_agent", agentId, ...defined(options) });
    }

    /** @internal */
    toModel(): DestinationModel {
        return this._model;
    }
}
