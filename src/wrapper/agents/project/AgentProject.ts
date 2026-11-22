import { Agent } from "../agent/Agent";
import type { WireObject } from "../agent/wire";
import { Tool } from "../tools/Tool";
import { formatConfig, formatIndex, normalizePath, uniquePath } from "./format";

export const AGENTS_FILE = "agents.json";
export const TOOLS_FILE = "tools.json";
export const AGENT_CONFIGS_DIR = "agent_configs";
export const TOOL_CONFIGS_DIR = "tool_configs";

/** One entry in `agents.json`, as the CLI writes it. */
export interface AgentEntry {
    /** Path to the agent's config file, relative to the project root. */
    config: string;
    id?: string;
    branch_id?: string;
    version_id?: string;
    branches?: Record<string, { config: string; branch_id: string; version_id?: string }>;
}

/** One entry in `tools.json`, as the CLI writes it. */
export interface ToolEntry {
    /** `"webhook"` or `"client"`. */
    type: string;
    /** Path to the tool's config file, relative to the project root. */
    config: string;
    id?: string;
}

/** Thrown when a project's files can't be read: a missing or malformed file, or a format the SDK can't read yet. */
export class AgentProjectError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "AgentProjectError";
    }
}

interface AgentSlot {
    entry: AgentEntry;
    agent: Agent;
}

interface ToolSlot {
    entry: ToolEntry;
    tool: Tool;
    /** The config as loaded, in API format, sent as-is while the tool is unchanged so unmodeled fields survive. */
    raw?: WireObject;
    /** `tool.toJSON()` as loaded, to tell whether the tool was edited since. */
    baseline?: string;
}

/**
 * An agents-as-code project in the CLI's layout: `agents.json` and `tools.json` list the agents and tools with their
 * ids, and each one's config sits in `agent_configs/` or `tool_configs/` in API format. A project made by
 * `elevenlabs agents init` / `pull` works here, and one written here works with the CLI.
 *
 * Pass it to `agents.push(agent, { project })` and `agents.pull(agentId, { project })`: the project records which
 * agent and tools on the server each definition is, so pushing again updates them instead of making copies. A push to
 * a branch is the exception: it copies a tool it changes, so the main branch keeps its own.
 *
 * @example
 * const project = await AgentProject.open(".");
 * const agent = project.agent("Support line");
 * agent.update({ prompt: "..." });
 * await client.conversationalAi.agents.push(agent, { project });
 */
export class AgentProject {
    /** The directory the project was opened from, if any. `save()` writes there. */
    readonly dir: string | undefined;
    private readonly _files: Map<string, string>;
    private readonly _agents: AgentSlot[] = [];
    private readonly _tools: ToolSlot[] = [];
    /** Paths written since loading, with their new contents. */
    private readonly _changed = new Map<string, string>();
    /** Paths in use on disk, so new files don't overwrite one the project doesn't list. */
    private readonly _taken: Set<string>;

    /** @internal */
    constructor(files: Record<string, string>, dir?: string, taken: Iterable<string> = []) {
        this.dir = dir;
        this._files = new Map(Object.entries(files).map(([path, text]) => [normalizePath(path), text]));
        this._taken = new Set([...this._files.keys(), ...[...taken].map(normalizePath)]);
        this._load();
    }

    /**
     * A project from file contents, keyed by path relative to the project root. Only `agents.json`, `tools.json` and
     * the config files they list are read. Missing index files mean an empty project.
     */
    static fromFiles(files: Record<string, string>): AgentProject {
        return new AgentProject(files);
    }

    /**
     * Reads the project in `dir` (Node.js only). A directory without `agents.json` and `tools.json` opens as an empty
     * project, and `save()` creates them.
     */
    static async open(dir: string): Promise<AgentProject> {
        const { readProject } = await import("./fs");
        const { files, taken } = await readProject(dir);
        return new AgentProject(files, dir, taken);
    }

    /** Every agent in the project, in `agents.json` order. */
    agents(): Agent[] {
        return this._agents.map((slot) => slot.agent);
    }

    /**
     * The agent named `name`. The same object every time, so edits to it are what `agents.push(agent, { project })`
     * sends.
     *
     * @throws {AgentProjectError} if no agent, or more than one, has that name
     */
    agent(name: string): Agent {
        const matches = this._agents.filter((slot) => slot.agent.name === name);
        if (matches.length !== 1) {
            throw new AgentProjectError(
                matches.length === 0
                    ? `No agent named "${name}" in ${AGENTS_FILE}`
                    : `${matches.length} agents in ${AGENTS_FILE} are named "${name}"`,
            );
        }
        return matches[0].agent;
    }

    /** Every tool in `tools.json`, in order. */
    tools(): Tool[] {
        return this._tools.map((slot) => slot.tool);
    }

    /** The id `agents.json` records for this agent, if it was pushed or pulled. */
    agentId(agent: Agent): string | undefined {
        return this._agentSlot(agent)?.entry.id;
    }

    /**
     * The id `tools.json` records for this tool, if it was pushed or pulled.
     *
     * @throws {AgentProjectError} for a tool the project didn't load, when several entries have its name and no single
     * one is used by a main-branch agent config. A branch's own copy of a tool doesn't count.
     */
    toolId(tool: Tool): string | undefined {
        return (this._tools.find((slot) => slot.tool === tool) ?? this._toolSlot(tool))?.entry.id;
    }

    /**
     * The project's files, keyed by path: the index files and every config they list, with what push and pull wrote
     * since loading. Files nothing changed keep their exact text.
     */
    toFiles(): Record<string, string> {
        const files: Record<string, string> = {};
        files[AGENTS_FILE] = this._changed.get(AGENTS_FILE) ?? this._files.get(AGENTS_FILE) ?? this._agentsIndex();
        files[TOOLS_FILE] = this._changed.get(TOOLS_FILE) ?? this._files.get(TOOLS_FILE) ?? this._toolsIndex();
        for (const path of [
            ...this._agents.map((slot) => slot.entry.config),
            ...this._agents.flatMap((slot) => Object.values(slot.entry.branches ?? {}).map((b) => b.config)),
            ...this._tools.map((slot) => slot.entry.config),
        ]) {
            const text = this._changed.get(normalizePath(path)) ?? this._files.get(normalizePath(path));
            if (text !== undefined) {
                files[path] = text;
            }
        }
        return files;
    }

    /** The paths push and pull changed since the project was loaded or last saved. */
    get changedFiles(): string[] {
        return [...this._changed.keys()];
    }

    /**
     * Writes the files push and pull changed to the project's directory (Node.js only). `agents.push()` and
     * `agents.pull()` call this themselves for a project opened with `open()`.
     */
    async save(): Promise<string[]> {
        if (this.dir === undefined) {
            throw new AgentProjectError("This project wasn't opened from a directory; use toFiles() instead");
        }
        const written = [...this._changed];
        if (written.length === 0) {
            return [];
        }
        const { writeProjectFiles } = await import("./fs");
        await writeProjectFiles(this.dir, written);
        for (const [path, text] of written) {
            this._files.set(path, text);
        }
        this._changed.clear();
        return written.map(([path]) => path);
    }

    /** @internal The entry for an agent: the one it was loaded from, else the only one with its name. */
    _agentSlot(agent: Agent): AgentSlot | undefined {
        return (
            this._agents.find((slot) => slot.agent === agent) ??
            single(
                this._agents.filter((slot) => slot.agent.name === agent.name),
                AGENTS_FILE,
                agent.name,
            )
        );
    }

    /**
     * @internal The entry for a tool: the one it was loaded from, else one with its name. Several can share a name
     * once a branch has its own copy. A copy only branch configs use counts only as `attachedId`, the id the target
     * agent already uses. That entry wins; otherwise the only entry is taken, or the only one a main-branch config
     * uses.
     */
    _toolSlot(tool: Tool, attachedId?: string): ToolSlot | undefined {
        const { main, branches } = this._agentConfigs();
        const onMain = (slot: ToolSlot) => slot.entry.id !== undefined && this._configsUse(main, slot.entry.id);
        const branchOnly = (slot: ToolSlot) =>
            slot.entry.id !== undefined &&
            slot.entry.id !== attachedId &&
            !onMain(slot) &&
            this._configsUse(branches, slot.entry.id);
        const loaded = this._tools.find((slot) => slot.tool === tool && !branchOnly(slot));
        if (loaded !== undefined) {
            return loaded;
        }
        const named = this._tools.filter((slot) => slot.tool.name === tool.name && !branchOnly(slot));
        const attached = attachedId === undefined ? undefined : named.find((slot) => slot.entry.id === attachedId);
        if (attached !== undefined || named.length < 2) {
            return attached ?? named[0];
        }
        const used = named.filter(onMain);
        if (used.length === 1) {
            return used[0];
        }
        throw new AgentProjectError(
            `${named.length} entries in ${TOOLS_FILE} are named "${tool.name}" and nothing says which one this is; ` +
                "push the loaded one (project.tools())",
        );
    }

    /**
     * @internal The loaded config to send for a tool whose definition matches its project entry (the loaded object, or
     * one rebuilt in code with the same name), so fields this SDK doesn't model survive.
     */
    _unchangedRaw(tool: Tool, attachedId?: string): WireObject | undefined {
        const slot = this._toolSlot(tool, attachedId);
        if (slot?.raw === undefined || slot.baseline === undefined) {
            return undefined;
        }
        try {
            return tool.toJSONString() === slot.baseline ? slot.raw : undefined;
        } catch {
            return undefined;
        }
    }

    /**
     * @internal Every entry holding exactly this definition, the tool's own entry first: what a branch push can attach
     * instead of creating another copy. `raw` is the loaded config, with the fields this SDK doesn't model.
     */
    _sameDefinitionEntries(tool: Tool): { id?: string; raw: WireObject }[] {
        const json = safeJson(tool);
        if (json === undefined) {
            return [];
        }
        const copies: { id?: string; raw: WireObject }[] = [];
        for (const slot of this._tools) {
            if (slot.raw === undefined || slot.baseline !== json) {
                continue;
            }
            if (slot.tool === tool) {
                copies.unshift({ id: slot.entry.id, raw: slot.raw });
            } else if (slot.tool.name === tool.name) {
                copies.push({ id: slot.entry.id, raw: slot.raw });
            }
        }
        return copies;
    }

    /**
     * @internal Records a tool's id and the config now on the server, adding an entry if it's new. Push finds the
     * entry by definition; pull, by id.
     */
    _recordTool(tool: Tool, id: string, config: WireObject, matchBy: "definition" | "id" = "definition"): void {
        let slot = matchBy === "id" ? this._tools.find((s) => s.entry.id === id) : this._toolSlot(tool, id);
        if (slot === undefined) {
            const path = uniquePath(TOOL_CONFIGS_DIR, tool.name, this._taken);
            this._taken.add(path);
            slot = { entry: { type: tool.kind, config: path }, tool };
            this._tools.push(slot);
        }
        slot.tool = tool;
        this._writeTool(slot, tool, id, config);
    }

    /**
     * @internal Records the tool a branch push attached to the branch, under the entry with that id. A new copy
     * takes the entry of the copy it replaced (`replacedId`) if nothing else in the project uses that one, so
     * repeated edits keep one entry. Failing that it takes an entry that was never pushed, or a new one. The main
     * branch's entry is never taken over.
     */
    _recordBranchTool(
        tool: Tool,
        id: string,
        config: WireObject,
        branch: { agent: Agent; branchId: string; replacedId?: string },
    ): void {
        let slot =
            this._tools.find((s) => s.entry.id === id) ?? this._replacedCopy(id, branch) ?? this._unpushedSlot(tool);
        if (slot === undefined) {
            const path = uniquePath(TOOL_CONFIGS_DIR, tool.name, this._taken);
            this._taken.add(path);
            // Its own Tool object: the caller's must not start resolving to the branch's copy on a main push.
            slot = { entry: { type: tool.kind, config: path }, tool: Tool.fromJSON(config) };
            this._tools.push(slot);
        } else if (slot.tool !== tool && slot.baseline !== safeJson(tool)) {
            slot.tool = Tool.fromJSON(config);
        }
        this._writeTool(slot, tool, id, config);
    }

    /** The entry of the tool a branch push just replaced, if the branch was the only thing in the project using it. */
    private _replacedCopy(
        id: string,
        { agent, branchId, replacedId }: { agent: Agent; branchId: string; replacedId?: string },
    ): ToolSlot | undefined {
        if (replacedId === undefined || replacedId === id) {
            return undefined;
        }
        const branchFiles = Object.values(this._agentSlot(agent)?.entry.branches ?? {});
        const branchConfig = branchFiles.find((b) => b.branch_id === branchId)?.config;
        const { main, branches } = this._agentConfigs();
        // Without a file of the branch's own, nothing shows the replaced tool was only the branch's.
        if (branchConfig === undefined || main.some((path) => samePath(path, branchConfig))) {
            return undefined;
        }
        const others = [...main, ...branches].filter((path) => !samePath(path, branchConfig));
        return this._configsUse(others, replacedId) ? undefined : this._tools.find((s) => s.entry.id === replacedId);
    }

    /** Every agent config file: each entry's own, which is its main branch's, and the ones under `branches`. */
    private _agentConfigs(): { main: string[]; branches: string[] } {
        return {
            main: this._agents.map(({ entry }) => entry.config),
            branches: this._agents.flatMap(({ entry }) => Object.values(entry.branches ?? {}).map((b) => b.config)),
        };
    }

    /** An entry without an id for this tool: the one it was loaded from, else the only one with its name. */
    private _unpushedSlot(tool: Tool): ToolSlot | undefined {
        const unpushed = this._tools.filter((s) => s.entry.id === undefined);
        const named = unpushed.filter((s) => s.tool.name === tool.name);
        return unpushed.find((s) => s.tool === tool) ?? (named.length === 1 ? named[0] : undefined);
    }

    /** Whether any of these agent config files, as they stand now, mentions the tool id. */
    private _configsUse(configPaths: string[], toolId: string): boolean {
        const needle = JSON.stringify(toolId);
        return configPaths.some((path) => {
            const key = normalizePath(path);
            return (this._changed.get(key) ?? this._files.get(key))?.includes(needle) === true;
        });
    }

    private _writeTool(slot: ToolSlot, tool: Tool, id: string, config: WireObject): void {
        slot.entry.id = id;
        slot.entry.type = tool.kind;
        slot.raw = config;
        slot.baseline = safeJson(tool);
        this._write(slot.entry.config, formatConfig(config));
        this._write(TOOLS_FILE, this._toolsIndex());
    }

    /** @internal Records an agent's id and its config, adding an entry if it's new. Push matches like `_recordTool`. */
    _recordAgent(
        agent: Agent,
        id: string,
        config: WireObject,
        options: { branchId?: string; versionId?: string; matchBy?: "definition" | "id" } = {},
    ): void {
        const { branchId, versionId, matchBy = "definition" } = options;
        let slot = matchBy === "id" ? this._agents.find((s) => s.entry.id === id) : this._agentSlot(agent);
        if (slot === undefined) {
            const path = uniquePath(AGENT_CONFIGS_DIR, agent.name, this._taken);
            this._taken.add(path);
            slot = { entry: { config: path }, agent };
            this._agents.push(slot);
        }
        slot.entry.id = id;
        const branch = Object.values(slot.entry.branches ?? {}).find((b) => b.branch_id === branchId);
        // A branch has its own file; the slot's agent is the main branch's, which a branch must not replace.
        if (branch === undefined) {
            slot.agent = agent;
        }
        // Like the CLI: the version the server reports, on the branch entry it belongs to.
        if (versionId !== undefined) {
            if (branch !== undefined) {
                branch.version_id = versionId;
            } else {
                slot.entry.version_id = versionId;
            }
        }
        this._write(branch?.config ?? slot.entry.config, formatConfig(config));
        this._write(AGENTS_FILE, this._agentsIndex());
    }

    /**
     * @internal Rejects a branch the project has no file for, before anything is written: its settings would otherwise
     * land in the main branch's file, and a later CLI push would send them to the main branch.
     */
    _checkBranch(agent: Agent, branchId: string | undefined): void {
        this._checkBranchOf(this._agentSlot(agent), agent.name, branchId);
    }

    /** @internal Whether this is the agent's main branch: the CLI records its id on the agent's own entry. */
    _isMainBranch(agent: Agent, branchId: string): boolean {
        return this._agentSlot(agent)?.entry.branch_id === branchId;
    }

    /** @internal `_checkBranch` for `pull`, which finds the agent by id. */
    _checkBranchById(agentId: string, branchId: string | undefined): void {
        this._checkBranchOf(
            this._agents.find((s) => s.entry.id === agentId),
            agentId,
            branchId,
        );
    }

    private _checkBranchOf(slot: AgentSlot | undefined, label: string, branchId: string | undefined): void {
        if (branchId === undefined || slot?.entry.branch_id === branchId) {
            return;
        }
        if (!Object.values(slot?.entry.branches ?? {}).some((b) => b.branch_id === branchId)) {
            throw new AgentProjectError(
                `Branch ${branchId} of "${label}" has no config file in ${AGENTS_FILE}. Add it under "branches" ` +
                    "(the CLI's `agents pull --all-branches` does), or push the main branch",
            );
        }
    }

    private _write(path: string, text: string): void {
        const key = normalizePath(path);
        if (this._files.get(key) === text) {
            this._changed.delete(key);
        } else {
            this._changed.set(key, text);
        }
    }

    private _load(): void {
        const agentsIndex = this._readIndex<{ agents?: AgentEntry[] }>(AGENTS_FILE).agents ?? [];
        const toolsIndex = this._readIndex<{ tools?: ToolEntry[] }>(TOOLS_FILE).tools ?? [];

        const byId = new Map<string, Tool>();
        for (const entry of toolsIndex) {
            const raw = this._readConfig(entry.config, TOOLS_FILE);
            let tool: Tool;
            try {
                tool = Tool.fromJSON(raw);
            } catch (err) {
                throw new AgentProjectError(`${entry.config} isn't a valid tool config: ${(err as Error).message}`);
            }
            this._tools.push({ entry: { ...entry }, tool, raw, baseline: safeJson(tool) });
            if (entry.id !== undefined) {
                byId.set(entry.id, tool);
            }
        }
        for (const entry of agentsIndex) {
            const raw = this._readConfig(entry.config, AGENTS_FILE);
            this._agents.push({ entry: { ...entry }, agent: Agent.fromJSON(raw, { toolsById: byId }) });
        }
    }

    private _readIndex<T>(path: string): T {
        const text = this._files.get(path);
        if (text === undefined) {
            return {} as T;
        }
        try {
            return JSON.parse(text) as T;
        } catch (err) {
            throw new AgentProjectError(`${path} isn't valid JSON: ${(err as Error).message}`);
        }
    }

    private _readConfig(path: string, index: string): WireObject {
        if (!/\.json$/i.test(path)) {
            throw new AgentProjectError(
                `${index} points at ${path}: only JSON config files are supported yet (YAML and TOML aren't)`,
            );
        }
        const text = this._files.get(normalizePath(path));
        if (text === undefined) {
            throw new AgentProjectError(`${index} points at ${path}, which doesn't exist`);
        }
        try {
            return JSON.parse(text) as WireObject;
        } catch (err) {
            throw new AgentProjectError(`${path} isn't valid JSON: ${(err as Error).message}`);
        }
    }

    private _agentsIndex(): string {
        return formatIndex({
            agents: this._agents.map(({ entry }) =>
                // The CLI writes fields in this order and leaves unset ones out.
                dropUndefined({
                    config: entry.config,
                    id: entry.id,
                    branch_id: entry.branch_id,
                    version_id: entry.version_id,
                    branches: entry.branches,
                }),
            ),
        });
    }

    private _toolsIndex(): string {
        return formatIndex({
            tools: this._tools.map(({ entry }) =>
                dropUndefined({ type: entry.type, config: entry.config, id: entry.id }),
            ),
        });
    }
}

function single<T>(matches: T[], index: string, name: string): T | undefined {
    if (matches.length > 1) {
        throw new AgentProjectError(`${matches.length} entries in ${index} are named "${name}"; push the loaded one`);
    }
    return matches[0];
}

function samePath(a: string, b: string): boolean {
    return normalizePath(a) === normalizePath(b);
}

function safeJson(tool: Tool): string | undefined {
    try {
        return tool.toJSONString();
    } catch {
        return undefined;
    }
}

function dropUndefined(value: Record<string, unknown>): Record<string, unknown> {
    return Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined));
}
