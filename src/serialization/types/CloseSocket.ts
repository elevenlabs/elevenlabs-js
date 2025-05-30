/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";

export const CloseSocket: core.serialization.ObjectSchema<serializers.CloseSocket.Raw, ElevenLabs.CloseSocket> =
    core.serialization.object({
        closeSocket: core.serialization.property("close_socket", core.serialization.boolean().optional()),
    });

export declare namespace CloseSocket {
    export interface Raw {
        close_socket?: boolean | null;
    }
}
