/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as ElevenLabs from "../../api/index";
import * as core from "../../core";
import { OrbAvatar } from "./OrbAvatar";
import { UrlAvatar } from "./UrlAvatar";
import { ImageAvatar } from "./ImageAvatar";

export const WidgetConfigOutputAvatar: core.serialization.Schema<
    serializers.WidgetConfigOutputAvatar.Raw,
    ElevenLabs.WidgetConfigOutputAvatar
> = core.serialization
    .union("type", {
        orb: OrbAvatar,
        url: UrlAvatar,
        image: ImageAvatar,
    })
    .transform<ElevenLabs.WidgetConfigOutputAvatar>({
        transform: (value) => value,
        untransform: (value) => value,
    });

export declare namespace WidgetConfigOutputAvatar {
    export type Raw = WidgetConfigOutputAvatar.Orb | WidgetConfigOutputAvatar.Url | WidgetConfigOutputAvatar.Image;

    export interface Orb extends OrbAvatar.Raw {
        type: "orb";
    }

    export interface Url extends UrlAvatar.Raw {
        type: "url";
    }

    export interface Image extends ImageAvatar.Raw {
        type: "image";
    }
}
