export type ToolIssueCode =
    | "missing_url"
    | "missing_path_param"
    | "unknown_path_param"
    | "param_not_literal"
    | "body_not_object"
    | "body_not_allowed"
    | "conflicting_value_source"
    | "omitted_required"
    | "invalid_choices"
    | "allowed_values_needs_description"
    | "constant_type_mismatch"
    | "unknown_required_property"
    | "missing_array_items"
    | "duplicate_header"
    | "invalid_destination"
    | "no_transfers"
    | "invalid_option"
    | "missing_description"
    | "unknown_tool_type";

export interface ToolIssue {
    code: ToolIssueCode;
    severity: "error" | "warning";
    message: string;
    /** Where the problem is, e.g. `"body.reason"` or `"pathParams.order_id"`. */
    path?: string;
}

/** Thrown by a tool's `build()` when the tool is invalid. Lists every problem found. */
export class ToolValidationError extends Error {
    readonly issues: ToolIssue[];

    constructor(name: string, issues: ToolIssue[]) {
        super(`Invalid tool "${name}":\n${issues.map((issue) => `  - ${issue.message}`).join("\n")}`);
        this.name = "ToolValidationError";
        this.issues = issues;
    }
}
