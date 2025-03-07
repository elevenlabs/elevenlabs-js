/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * The state of the project.
 */
export type ProjectState = "creating" | "default" | "converting" | "in_queue";
export const ProjectState = {
    Creating: "creating",
    Default: "default",
    Converting: "converting",
    InQueue: "in_queue",
} as const;
