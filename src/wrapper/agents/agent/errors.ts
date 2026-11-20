export type AgentIssueCode =
    | "missing_name"
    | "missing_prompt"
    | "duplicate_tool_name"
    | "invalid_tool"
    | "invalid_workflow"
    | "invalid_config"
    | "option_conflict"
    | "unresolved_tool"
    | "system_tool_in_workflow";

export interface AgentIssue {
    code: AgentIssueCode;
    severity: "error" | "warning";
    message: string;
    /** Where the problem is, e.g. `"tools.get_order"` or `"workflow.lookup"`. */
    path?: string;
}

/** Thrown by `Agent.validate()` and `Agent.build()` when the agent is invalid. Lists every problem found. */
export class AgentValidationError extends Error {
    readonly issues: AgentIssue[];

    constructor(name: string, issues: AgentIssue[]) {
        super(`Invalid agent "${name}":\n${issues.map((issue) => `  - ${issue.message}`).join("\n")}`);
        this.name = "AgentValidationError";
        this.issues = issues;
    }
}

/** What `agents.push()` did to one tool. `"detached"`: the agent used it before and no longer does; it isn't deleted. */
export type ToolPushAction = "created" | "updated" | "unchanged" | "detached";

export interface AgentPushResult {
    agentId: string;
    /** What happened to the agent: created, or updated in place. */
    action: "created" | "updated";
    /** Each tool `push` touched, by name. */
    tools: Record<string, { id: string; action: ToolPushAction }>;
}

/**
 * Thrown by `agents.push()` when an API call fails after it started writing. `result` lists what was written before
 * the failure, so nothing created goes unreported; with a project, those ids are saved to it too.
 */
export class AgentPushError extends Error {
    readonly result: Partial<AgentPushResult> & { tools: AgentPushResult["tools"] };
    readonly cause: unknown;

    constructor(message: string, result: AgentPushError["result"], cause: unknown) {
        super(`${message}: ${cause instanceof Error ? cause.message : String(cause)}`);
        this.name = "AgentPushError";
        this.result = result;
        this.cause = cause;
    }
}
