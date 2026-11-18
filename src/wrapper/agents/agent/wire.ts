/** Helpers for agent configs in API format (snake_case JSON). */

export type WireObject = Record<string, unknown>;

export function isObject(value: unknown): value is WireObject {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** The value at `path`, or `undefined` if any step is missing. */
export function getPath(target: unknown, path: string[]): unknown {
    let current = target;
    for (const key of path) {
        if (!isObject(current)) {
            return undefined;
        }
        current = current[key];
    }
    return current;
}

/** Sets the value at `path`, creating objects along the way. `undefined` deletes the key. */
export function setPath(target: WireObject, path: string[], value: unknown): void {
    let current = target;
    for (const key of path.slice(0, -1)) {
        if (!isObject(current[key])) {
            if (value === undefined) {
                return;
            }
            current[key] = {};
        }
        current = current[key] as WireObject;
    }
    const last = path[path.length - 1];
    if (value === undefined) {
        delete current[last];
    } else {
        current[last] = value;
    }
}

/** Merges `source` into `target`: objects merge key by key, anything else (arrays included) replaces. */
export function deepMerge(target: WireObject, source: WireObject): WireObject {
    for (const [key, value] of Object.entries(source)) {
        if (value === undefined) {
            continue;
        }
        if (isObject(value) && isObject(target[key])) {
            deepMerge(target[key] as WireObject, value);
        } else {
            target[key] = structuredClone(value);
        }
    }
    return target;
}
