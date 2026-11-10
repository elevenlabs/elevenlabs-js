import type { ToolIssue } from "./errors";
import type { Schema, SchemaKind } from "./Schema";

export interface SchemaCheckOptions {
    /** The schema is a property (or a param), so `omit()` needs it to be optional. */
    isProperty: boolean;
}

/** Checks a schema and everything under it. `path` names it in messages, e.g. `"body.reason"`. */
export function checkSchema(schema: Schema, path: string, options: SchemaCheckOptions, issues: ToolIssue[]): void {
    const s = schema.state;
    const sources = [
        s.description !== undefined,
        s.dynamicVariable !== undefined,
        s.hasConstant,
        s.systemProvided,
        s.omitted,
    ].filter(Boolean).length;
    if (sources > 1) {
        issues.push(
            error(
                "conflicting_value_source",
                path,
                `"${path}" sets more than one of describe(), fromVariable(), constant(), systemProvided() and omit()`,
            ),
        );
    }
    if (s.omitted && options.isProperty && !s.optional) {
        issues.push(error("omitted_required", path, `"${path}" uses omit(), so it must be optional()`));
    }
    if (s.choices !== undefined && s.kind !== "string") {
        issues.push(error("invalid_choices", path, `"${path}" uses choices(), which only applies to strings`));
    }
    if (s.allowedFrom !== undefined && s.description === undefined) {
        issues.push(
            error(
                "allowed_values_needs_description",
                path,
                `"${path}" uses allowedFrom(), which needs describe() so the LLM provides the value`,
            ),
        );
    }
    if (s.hasConstant && !matchesKind(s.kind, s.constantValue)) {
        issues.push(error("constant_type_mismatch", path, `"${path}" has a constant that isn't a ${s.kind}`));
    } else if (s.hasConstant && s.constantValue === "") {
        issues.push(
            error("constant_type_mismatch", path, `"${path}" can't have "" as a constant: the API reads it as unset`),
        );
    }
    // The API rejects a literal with no value source wherever it appears, response schemas included.
    if (sources === 0 && isLiteral(s.kind)) {
        issues.push(
            error(
                "missing_value_source",
                path,
                `"${path}" needs one of describe(), fromVariable(), constant(), systemProvided() or omit()`,
            ),
        );
    }

    if (s.kind === "object") {
        const names = s.properties.map(([name]) => name);
        for (const group of [...s.anyOf, ...s.allOf]) {
            for (const name of group.filter((n) => !names.includes(n))) {
                issues.push(
                    error(
                        "unknown_required_property",
                        path,
                        `"${path}" requires "${name}" in requireAnyOf()/requireAllOf(), but has no such property`,
                    ),
                );
            }
        }
        for (const [name, child] of s.properties) {
            checkSchema(child, `${path}.${name}`, { ...options, isProperty: true }, issues);
        }
    }
    if (s.kind === "array") {
        if (s.items === undefined) {
            issues.push(error("missing_array_items", path, `Array "${path}" has no items schema`));
        } else {
            checkSchema(s.items, `${path}[]`, { ...options, isProperty: false }, issues);
        }
    }
}

export function isLiteral(kind: SchemaKind): boolean {
    return kind !== "object" && kind !== "array";
}

export function error(code: ToolIssue["code"], path: string | undefined, message: string): ToolIssue {
    return { code, severity: "error", message, ...(path !== undefined && { path }) };
}

function matchesKind(kind: SchemaKind, value: unknown): boolean {
    switch (kind) {
        case "string":
            return typeof value === "string";
        case "integer":
            return typeof value === "number" && Number.isInteger(value);
        case "number":
            return typeof value === "number";
        case "boolean":
            return typeof value === "boolean";
        case "object":
            return typeof value === "object" && value !== null && !Array.isArray(value);
        case "array":
            return Array.isArray(value);
    }
}
