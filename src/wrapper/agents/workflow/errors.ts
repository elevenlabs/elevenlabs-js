export type WorkflowIssueCode =
    | "duplicate_node_id"
    | "unknown_node"
    | "unknown_edge"
    | "invalid_option"
    | "edge_into_start"
    | "end_has_outgoing_edges"
    | "tool_edge_needs_result"
    | "result_edge_needs_tool"
    | "cannot_remove_start"
    | "missing_insert_result"
    | "unreachable_node"
    | "unknown_node_type";

export interface WorkflowIssue {
    code: WorkflowIssueCode;
    severity: "error" | "warning";
    message: string;
    nodeId?: string;
}

/** Thrown by `Workflow.build()` when the workflow is invalid. Lists every problem found. */
export class WorkflowValidationError extends Error {
    readonly issues: WorkflowIssue[];

    constructor(issues: WorkflowIssue[]) {
        super(`Invalid workflow:\n${issues.map((issue) => `  - ${issue.message}`).join("\n")}`);
        this.name = "WorkflowValidationError";
        this.issues = issues;
    }
}
