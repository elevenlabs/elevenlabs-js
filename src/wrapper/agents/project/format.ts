import { sortKeys } from "../workflow/util";

/** The CLI's file format: 4-space indent, no trailing newline (serde_json's pretty printer). */
export function formatIndex(value: unknown): string {
    return JSON.stringify(value, null, 4);
}

/** Config files: like `formatIndex()`, with keys sorted at every level, as the CLI writes them. */
export function formatConfig(value: unknown): string {
    return JSON.stringify(sortKeys(value), null, 4);
}

/** The CLI's `sanitize_filename`: a filesystem-safe file stem for an agent or tool name. */
export function sanitizeFilename(name: string): string {
    const trimmed = name.trim();
    if (trimmed === "") {
        return "unnamed";
    }
    let sanitized = [...trimmed].map((c) => (/[/\\:*?"<>|]/.test(c) || /\s/u.test(c) ? "-" : c)).join("");
    while (sanitized.includes("--")) {
        sanitized = sanitized.split("--").join("-");
    }
    const stripped = sanitized.replace(/^[.-]+|[.-]+$/g, "");
    if (stripped === "") {
        return "unnamed";
    }
    const result = trimmed.startsWith(".") ? `_${stripped}` : stripped;
    return [...result].slice(0, 100).join("");
}

/** The CLI's `generate_unique_filename`: `<dir>/<name>.json`, then `-1`, `-2`... while the path is taken. */
export function uniquePath(dir: string, name: string, taken: Set<string>): string {
    const stem = sanitizeFilename(name);
    let candidate = `${dir}/${stem}.json`;
    for (let n = 1; taken.has(candidate); n++) {
        candidate = `${dir}/${stem}-${n}.json`;
    }
    return candidate;
}

/** A project-relative path in one canonical spelling: forward slashes, no `./` or empty segments. */
export function normalizePath(path: string): string {
    return path
        .replace(/\\/g, "/")
        .split("/")
        .filter((part) => part !== "" && part !== ".")
        .join("/");
}
