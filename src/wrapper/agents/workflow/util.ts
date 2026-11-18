/** Drops keys whose value is `undefined`, so they don't serialize as `null`. */
export function defined<T extends object>(value: T): T {
    return Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined)) as T;
}

/** Sorts object keys at every level, so serialized JSON is stable. Arrays keep their order. */
export function sortKeys(value: unknown): unknown {
    if (Array.isArray(value)) {
        return value.map(sortKeys);
    }
    if (typeof value === "object" && value !== null) {
        return Object.fromEntries(
            Object.keys(value)
                .sort()
                .map((key) => [key, sortKeys((value as Record<string, unknown>)[key])]),
        );
    }
    return value;
}
