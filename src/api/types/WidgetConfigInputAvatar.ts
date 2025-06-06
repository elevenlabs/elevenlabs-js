/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as ElevenLabs from "../index";

/**
 * The avatar of the widget
 */
export type WidgetConfigInputAvatar =
    | ElevenLabs.WidgetConfigInputAvatar.Orb
    | ElevenLabs.WidgetConfigInputAvatar.Url
    | ElevenLabs.WidgetConfigInputAvatar.Image;

export namespace WidgetConfigInputAvatar {
    export interface Orb extends ElevenLabs.OrbAvatar {
        type: "orb";
    }

    export interface Url extends ElevenLabs.UrlAvatar {
        type: "url";
    }

    export interface Image extends ElevenLabs.ImageAvatar {
        type: "image";
    }
}
