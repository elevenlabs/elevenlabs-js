/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * Model representing a single word with its timing information from the aligner.
 */
export interface ForcedAlignmentWordResponseModel {
    /** The word that was transcribed. */
    text: string;
    /** The start time of the word in seconds. */
    start: number;
    /** The end time of the word in seconds. */
    end: number;
    /** The average alignment loss/confidence score for this word, calculated from its constituent characters. */
    loss: number;
}
