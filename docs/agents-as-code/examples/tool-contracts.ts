/** Application-side teaching example; no SDK calls or customer data. */
export interface ToolContext {
    /** Derive from the authenticated service session, never model arguments. */
    allowedReference: string;
    canRequestReview: boolean;
}

export interface ToolBackend {
    lookup(reference: string): Promise<unknown>;
    requestReview(reference: string): Promise<unknown>;
}

type Facts = Record<string, string>;
export type ToolResult =
    | { outcome: "known" | "pending_review"; facts: Facts }
    | { outcome: "unknown"; reference: string }
    | { outcome: "invalid_tool" | "invalid_arguments" | "forbidden" | "invalid_response" | "unavailable" };

function record(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasExactly(value: Record<string, unknown>, fields: string[]): boolean {
    return Object.keys(value).length === fields.length && fields.every((key) => Object.hasOwn(value, key));
}

/** Validate before effects; validate returned facts before calling them known. */
export async function dispatchTool(
    name: string,
    args: unknown,
    context: ToolContext,
    backend: ToolBackend,
): Promise<ToolResult> {
    if (name !== "lookup_order" && name !== "request_review") return { outcome: "invalid_tool" };
    if (!record(args) || !hasExactly(args, ["reference"])) return { outcome: "invalid_arguments" };
    const reference = args.reference;
    if (typeof reference !== "string" || !/^ORD-[0-9]{4}$/.test(reference) || reference.length !== 8) {
        return { outcome: "invalid_arguments" };
    }
    if (reference !== context.allowedReference || (name === "request_review" && context.canRequestReview !== true)) {
        return { outcome: "forbidden" };
    }
    let result: unknown;
    try {
        result = await (name === "lookup_order" ? backend.lookup(reference) : backend.requestReview(reference));
    } catch {
        // A rejection is unavailable, not proof that the record does not exist.
        // Do not expose exception messages or automatically retry a write.
        return { outcome: "unavailable" };
    }
    if (name === "lookup_order") {
        if (result === null) return { outcome: "unknown", reference };
        if (
            !record(result) ||
            !hasExactly(result, ["reference", "status"]) ||
            result.reference !== reference ||
            typeof result.status !== "string" ||
            !["processing", "shipped", "held"].includes(result.status)
        )
            return { outcome: "invalid_response" };
        return { outcome: "known", facts: { reference, status: result.status } };
    }
    if (
        !record(result) ||
        !hasExactly(result, ["reference", "review_id", "status"]) ||
        result.reference !== reference ||
        typeof result.review_id !== "string" ||
        !/^REV-[0-9]{4}$/.test(result.review_id) ||
        result.review_id.length !== 8 ||
        result.status !== "pending_review"
    )
        return { outcome: "invalid_response" };
    return { outcome: "pending_review", facts: { reference, review_id: result.review_id, status: "pending_review" } };
}
