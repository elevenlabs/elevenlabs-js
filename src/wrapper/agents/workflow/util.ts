/** Drops keys whose value is `undefined`, so they don't serialize as `null`. */
export function defined<T extends object>(value: T): T {
    return Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined)) as T;
}
