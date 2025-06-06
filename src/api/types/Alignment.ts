/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * Alignment information for the generated audio given the input text sequence.
 */
export interface Alignment {
    /**
     * A list of starting times (in milliseconds) for each character in the text as it
     * corresponds to the audio. For instance, the character 'H' starts at time 0 ms in the audio.
     * Note these times are relative to the returned chunk from the model, and not the
     * full audio response.
     */
    charStartTimesMs?: number[];
    /**
     * A list of durations (in milliseconds) for each character in the text as it
     * corresponds to the audio. For instance, the character 'H' lasts for 3 ms in the audio.
     * Note these times are relative to the returned chunk from the model, and not the
     * full audio response.
     */
    charsDurationsMs?: number[];
    /**
     * A list of characters in the text sequence. For instance, the first character is 'H'.
     * Note that this list may contain spaces, punctuation, and other special characters.
     * The length of this list should be the same as the lengths of `charStartTimesMs` and `charsDurationsMs`.
     */
    chars?: string[];
}
