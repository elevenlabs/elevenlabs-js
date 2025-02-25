/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * @example
 *     {
 *         email: "john.doe@testmail.com"
 *     }
 */
export interface BodyInviteUserV1WorkspaceInvitesAddPost {
    /** The email of the customer */
    email: string;
    /** The group ids of the user */
    group_ids?: string[];
}
