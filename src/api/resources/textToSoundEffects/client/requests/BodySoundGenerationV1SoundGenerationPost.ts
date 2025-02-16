/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * @example
 *     {
 *         text: "Spacious braam suitable for high-impact movie trailer moments"
 *     }
 */
export interface BodySoundGenerationV1SoundGenerationPost {
    /** The text that will get converted into a sound effect. */
    text: string;
    /** The duration of the sound which will be generated in seconds. Must be at least 0.5 and at most 22. If set to None we will guess the optimal duration using the prompt. Defaults to None. */
    duration_seconds?: number;
    /** A higher prompt influence makes your generation follow the prompt more closely while also making generations less variable. Must be a value between 0 and 1. Defaults to 0.3. */
    prompt_influence?: number;
}
