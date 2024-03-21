/**
 * This file was auto-generated by Fern from our API Definition.
 */

export interface BodyAddVoiceV1VoicesAddPost {
    /** The name that identifies this voice. This will be displayed in the dropdown of the website. */
    name: string;
    /** How would you describe the voice? */
    description?: string;
    /** Serialized labels dictionary for the voice. */
    labels?: string;
}
