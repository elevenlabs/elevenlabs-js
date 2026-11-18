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

const UNSAFE_KEYS = new Set(["__proto__", "constructor", "prototype"]);

/**
 * Merges `source` into `target`: objects merge key by key, anything else (arrays included) replaces. Only own keys are
 * followed, and keys that could reach a prototype are skipped, so untrusted config can't pollute `Object.prototype`.
 */
export function deepMerge(target: WireObject, source: WireObject): WireObject {
    for (const [key, value] of Object.entries(source)) {
        if (value === undefined || UNSAFE_KEYS.has(key)) {
            continue;
        }
        const existing = Object.prototype.hasOwnProperty.call(target, key) ? target[key] : undefined;
        if (isObject(value) && isObject(existing)) {
            deepMerge(existing, value);
        } else {
            Object.defineProperty(target, key, {
                value: structuredClone(value),
                enumerable: true,
                writable: true,
                configurable: true,
            });
        }
    }
    return target;
}

/** Whether every value in `local` is in `remote` at the same place. Extra keys in `remote` (server defaults) are fine. */
export function isSubset(local: unknown, remote: unknown): boolean {
    if (Array.isArray(local)) {
        return Array.isArray(remote) && local.length === remote.length && local.every((v, i) => isSubset(v, remote[i]));
    }
    if (isObject(local)) {
        return isObject(remote) && Object.entries(local).every(([k, v]) => v === null || isSubset(v, remote[k]));
    }
    return local === remote;
}
