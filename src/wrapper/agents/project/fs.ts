// Node.js file access for AgentProject. Loaded with a dynamic import, so other runtimes never load node:fs.
import { constants } from "node:fs";
import * as fs from "node:fs/promises";
import * as nodePath from "node:path";
import { AGENT_CONFIGS_DIR, AGENTS_FILE, AgentProjectError, TOOL_CONFIGS_DIR, TOOLS_FILE } from "./AgentProject";
import { normalizePath } from "./format";

/** Reads the index files and every config they list. `taken` lists the files already in the config directories. */
export async function readProject(dir: string): Promise<{ files: Record<string, string>; taken: string[] }> {
    const root = await fs.realpath(dir);
    const files: Record<string, string> = {};
    for (const index of [AGENTS_FILE, TOOLS_FILE]) {
        const text = await readIfExists(await resolveInProject(root, index));
        if (text === undefined) {
            continue;
        }
        files[index] = text;
        let parsed: {
            agents?: { config?: unknown; branches?: Record<string, { config?: unknown }> }[];
            tools?: { config?: unknown }[];
        };
        try {
            parsed = JSON.parse(text);
        } catch {
            continue; // AgentProject reports it, with the parse error.
        }
        const configs = [
            ...(parsed.agents ?? []).flatMap((entry) => [
                entry.config,
                ...Object.values(entry.branches ?? {}).map((branch) => branch.config),
            ]),
            ...(parsed.tools ?? []).map((entry) => entry.config),
        ];
        for (const config of configs) {
            if (typeof config !== "string") {
                throw new AgentProjectError(`${index} has an entry without a "config" path`);
            }
            const content = await readIfExists(await resolveInProject(root, config));
            if (content !== undefined) {
                files[normalizePath(config)] = content;
            }
        }
    }
    const taken: string[] = [];
    for (const sub of [AGENT_CONFIGS_DIR, TOOL_CONFIGS_DIR]) {
        try {
            for (const name of await fs.readdir(nodePath.join(root, sub))) {
                taken.push(`${sub}/${name}`);
            }
        } catch {
            // No directory yet.
        }
    }
    return { files, taken };
}

/** Writes each file owner-only, creating directories as needed, never through a symlink or outside the project. */
export async function writeProjectFiles(dir: string, files: [string, string][]): Promise<void> {
    const root = await fs.realpath(dir);
    for (const [path, text] of files) {
        const target = await resolveInProject(root, path);
        await fs.mkdir(nodePath.dirname(target), { recursive: true });
        const noFollow = constants.O_NOFOLLOW ?? 0;
        if (noFollow === 0) {
            const stat = await fs.lstat(target).catch(() => undefined);
            if (stat?.isSymbolicLink()) {
                throw new AgentProjectError(`Refusing to write ${path}: it's a symlink`);
            }
        }
        let handle: fs.FileHandle;
        try {
            handle = await fs.open(
                target,
                constants.O_WRONLY | constants.O_CREAT | constants.O_TRUNC | noFollow,
                0o600,
            );
        } catch (err) {
            if ((err as NodeJS.ErrnoException).code === "ELOOP") {
                throw new AgentProjectError(`Refusing to write ${path}: it's a symlink`);
            }
            throw err;
        }
        try {
            await handle.chmod(0o600).catch(() => undefined);
            await handle.writeFile(text, "utf8");
        } finally {
            await handle.close();
        }
    }
}

/**
 * The CLI's `resolve_in_project`: the absolute path for a project-relative one, refusing anything that escapes the
 * project, including through a symlinked directory.
 */
async function resolveInProject(root: string, path: string): Promise<string> {
    if (path.trim() === "" || /\p{Cc}/u.test(path)) {
        throw new AgentProjectError(`Invalid config path ${JSON.stringify(path)}`);
    }
    const candidate = nodePath.resolve(root, path);
    const inside = (p: string): boolean => p === root || p.startsWith(root + nodePath.sep);
    if (!inside(candidate)) {
        throw new AgentProjectError(`Config path ${path} is outside the project`);
    }
    // The deepest part of the path that exists, with symlinks resolved, must still be inside.
    let ancestor = candidate;
    for (;;) {
        try {
            const real = await fs.realpath(ancestor);
            if (!inside(real)) {
                throw new AgentProjectError(`Config path ${path} leads outside the project through a symlink`);
            }
            return candidate;
        } catch (err) {
            if (err instanceof AgentProjectError) {
                throw err;
            }
            const parent = nodePath.dirname(ancestor);
            if (parent === ancestor) {
                throw new AgentProjectError(`Config path ${path} is outside the project`);
            }
            ancestor = parent;
        }
    }
}

async function readIfExists(path: string): Promise<string | undefined> {
    try {
        return await fs.readFile(path, "utf8");
    } catch (err) {
        if ((err as NodeJS.ErrnoException).code === "ENOENT") {
            return undefined;
        }
        throw err;
    }
}
