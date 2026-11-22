import type * as ElevenLabs from "../../../api/index";
import type { AgentsClient as GeneratedAgentsClient } from "../../../api/resources/conversationalAi/resources/agents/client/Client";
import type { ToolsClient as GeneratedToolsClient } from "../../../api/resources/conversationalAi/resources/tools/client/Client";
import type { BaseRequestOptions } from "../../../BaseClient";
import { ElevenLabsError } from "../../../errors";
import * as serializers from "../../../serialization/index";
import type { AgentProject } from "../project/AgentProject";
import { Tool } from "../tools/Tool";
import { sortKeys } from "../workflow/util";
import { Agent, rawWorkflowToolIds } from "./Agent";
import { AgentPushError, type AgentPushResult } from "./errors";
import { getPath, isObject, isSubset, type WireObject } from "./wire";

export interface AgentPushOptions {
    /**
     * The agent to update. Without it (and without a project that knows the agent), `push` creates a new agent, so
     * keep the returned `agentId`. Not allowed with `project`, which records the id itself.
     */
    agentId?: string;
    /**
     * An agents-as-code project in the CLI's layout. Its `agents.json` and `tools.json` say which agent and tools on
     * the server this definition is; `push` records new ids there and writes the configs it sent. With `branchId`,
     * the branch's own tools come first, and a copy made for the branch gets its own entry in `tools.json`.
     */
    project?: AgentProject;
    /**
     * Update this branch of the agent instead of its main branch. Needs `agentId`, or a project that has the agent's
     * id. A tool the push changes is created as a new tool for this branch, never updated in place, because other
     * branches and versions share the existing one.
     */
    branchId?: string;
    /** Describes the new version, for agents with versioning. */
    versionDescription?: string;
    /** Passed to every API call `push` makes. */
    requestOptions?: BaseRequestOptions;
}

export interface AgentPullOptions {
    /** Writes the agent and its tools into this project, and records their ids. */
    project?: AgentProject;
    /** Pull this branch instead of the main one. */
    branchId?: string;
    /** Passed to every API call `pull` makes. */
    requestOptions?: BaseRequestOptions;
}

interface Clients {
    agents: GeneratedAgentsClient;
    tools: GeneratedToolsClient;
}

const SERIALIZER_OPTIONS = {
    unrecognizedObjectKeys: "passthrough",
    allowUnrecognizedUnionMembers: true,
    allowUnrecognizedEnumValues: true,
} as const;

/** The steps of `agents.push()`. See `AgentsClient.push` for what it does. */
export async function pushAgent(clients: Clients, agent: Agent, options: AgentPushOptions): Promise<AgentPushResult> {
    const { project, branchId, versionDescription, requestOptions } = options;
    if (project !== undefined && options.agentId !== undefined) {
        throw new Error("Pass agentId or project to agents.push(), not both: the project records the agent's id");
    }
    agent.validate();
    project?._checkBranch(agent, branchId);

    const tools = agent.tools();
    const agentId = project !== undefined ? project.agentId(agent) : options.agentId;
    if (branchId !== undefined && agentId === undefined) {
        throw new Error("agents.push() with branchId needs the agent: pass agentId, or a project that has its id");
    }
    // The branch whose tools are copied, not updated. The main branch isn't one, also when named by its id.
    const branch = branchId !== undefined && !project?._isMainBranch(agent, branchId) ? branchId : undefined;
    const result: AgentPushError["result"] = { tools: {} };
    const ids: Record<string, string> = {};
    let step = "Couldn't read the agent's tools";
    try {
        // The tools the agent already uses: name matching stays among them, so a same-named tool only another agent
        // uses is never touched. A branch reads them from its own config; the main branch's may differ.
        const inUse =
            agentId === undefined
                ? []
                : branch !== undefined
                  ? await toolsOnBranch(clients, agentId, branch, requestOptions)
                  : await listToolsUsedBy(clients.tools, agentId, requestOptions);
        const usedByName = new Map<string, ElevenLabs.ToolResponseModel>();
        for (const remote of inUse) {
            usedByName.set(toolName(remote), remote);
        }
        // Sets `step` and reports the tool as "created".
        const create = async (tool: Tool, config: WireObject): Promise<ElevenLabs.ToolResponseModel> => {
            step = `Couldn't create tool "${tool.name}"`;
            const body = { ...requestOptions, additionalBodyParameters: { tool_config: config } };
            const created = await clients.tools.create(tool.build(), body);
            result.tools[tool.name] = { id: created.id, action: "created" };
            return created;
        };

        for (const tool of tools) {
            const attachedId = usedByName.get(tool.name)?.id;

            if (branch !== undefined) {
                // A tool's definition is shared by every branch and version that uses its id, so a branch push never
                // updates one. It attaches a tool that already has this definition (the branch's own, else one the
                // project recorded, such as the main branch's or the copy a failed push left), else a new one.
                const same = project?._sameDefinitionEntries(tool) ?? [];
                const candidates = same.flatMap((entry) =>
                    entry.id !== undefined && entry.id !== attachedId ? [{ id: entry.id, raw: entry.raw }] : [],
                );
                if (attachedId !== undefined) {
                    const raw = same.find((entry) => entry.id === attachedId)?.raw;
                    candidates.unshift({ id: attachedId, raw: raw ?? toolWire(tool) });
                }
                let id: string | undefined;
                let config: WireObject | undefined;
                for (const candidate of candidates) {
                    step = `Couldn't read tool "${tool.name}" (${candidate.id})`;
                    let remote: ElevenLabs.ToolResponseModel;
                    try {
                        remote = await readTool(clients, inUse, candidate.id, requestOptions);
                    } catch (err) {
                        // A tool the project remembers may be gone by now; only the branch's own has to exist.
                        if (candidate.id !== attachedId && err instanceof ElevenLabsError && err.statusCode === 404) {
                            continue;
                        }
                        throw err;
                    }
                    if (sameTool(remote, tool, candidate.raw)) {
                        id = candidate.id;
                        config = candidate.raw;
                        result.tools[tool.name] = { id, action: "unchanged" };
                        break;
                    }
                }
                if (id === undefined || config === undefined) {
                    config = same[0]?.raw ?? toolWire(tool);
                    const created = await create(tool, config);
                    id = created.id;
                    // If the server didn't keep a field that was sent, the next push would see a difference and
                    // make yet another copy. Record what the server has, so it finds this one.
                    if (!sameTool(created, tool, config)) {
                        config = responseWire(created) ?? config;
                    }
                }
                ids[tool.name] = id;
                project?._recordBranchTool(tool, id, config, { agent, branchId: branch, replacedId: attachedId });
                continue;
            }

            step = `Couldn't match tool "${tool.name}"`;
            // The project's record first; a tool it has no id for is the same-named one the agent already uses.
            const knownId = project?._toolSlot(tool, attachedId)?.entry.id ?? attachedId;
            let remote: ElevenLabs.ToolResponseModel | undefined;
            if (knownId !== undefined) {
                step = `Couldn't read tool "${tool.name}" (${knownId})`;
                remote = await readTool(clients, inUse, knownId, requestOptions);
            }
            const config = project?._unchangedRaw(tool, attachedId) ?? toolWire(tool);
            if (remote !== undefined && sameTool(remote, tool, config)) {
                ids[tool.name] = remote.id;
                result.tools[tool.name] = { id: remote.id, action: "unchanged" };
            } else if (remote !== undefined) {
                step = `Couldn't update tool "${tool.name}" (${remote.id})`;
                const body = { ...requestOptions, additionalBodyParameters: { tool_config: config } };
                await clients.tools.update(remote.id, tool.build(), body);
                ids[tool.name] = remote.id;
                result.tools[tool.name] = { id: remote.id, action: "updated" };
            } else {
                ids[tool.name] = (await create(tool, config)).id;
            }
            // Also when unchanged: the server already matches, but the project may hold an older definition.
            project?._recordTool(tool, ids[tool.name], config);
        }

        // The typed body goes through the generated client; the API-format config, sent as extra body parameters,
        // replaces its top-level fields, so settings this SDK doesn't model reach the API too.
        const config = agent.toJSON({ toolIds: ids });

        // Every id the new config still uses, wherever it is: the agent's tool_ids and the workflow's nodes.
        const promptIds = getPath(config, ["conversation_config", "agent", "prompt", "tool_ids"]);
        const kept = new Set([
            ...(Array.isArray(promptIds) ? (promptIds as string[]) : []),
            ...rawWorkflowToolIds(isObject(config.workflow) ? config.workflow : undefined),
        ]);
        for (const remote of inUse) {
            if (!kept.has(remote.id) && result.tools[toolName(remote)] === undefined) {
                result.tools[toolName(remote)] = { id: remote.id, action: "detached" };
            }
        }

        const typed = agent.build({ toolIds: ids });
        const body = { ...requestOptions, additionalBodyParameters: config };
        let id: string;
        let versionId: string | undefined;
        if (agentId === undefined) {
            step = `Couldn't create agent "${agent.name}"`;
            id = (await clients.agents.create(typed, body)).agentId;
            result.action = "created";
        } else {
            step = `Couldn't update agent "${agent.name}" (${agentId})`;
            const updated = await clients.agents.update(agentId, { ...typed, branchId, versionDescription }, body);
            versionId = updated.versionId;
            id = agentId;
            result.action = "updated";
        }
        result.agentId = id;
        project?._recordAgent(agent, id, config, { branchId, versionId });
    } catch (err) {
        await saveQuietly(project);
        throw new AgentPushError(step, result, err);
    }
    if (project?.dir !== undefined) {
        await project.save();
    }
    return result as AgentPushResult;
}

/** The steps of `agents.pull()`. */
export async function pullAgent(clients: Clients, agentId: string, options: AgentPullOptions): Promise<Agent> {
    const { project, branchId, requestOptions } = options;
    project?._checkBranchById(agentId, branchId);
    const response = await clients.agents.get(agentId, { branchId }, requestOptions);
    const live = serializers.GetAgentResponseModel.jsonOrThrow(response, SERIALIZER_OPTIONS) as unknown as WireObject;
    // The CLI's pulled-config shape: these keys only, so ids and server metadata stay out of the file.
    const config: WireObject = {
        name: live.name,
        conversation_config: live.conversation_config ?? {},
        platform_settings: live.platform_settings ?? {},
        tags: live.tags ?? [],
    };
    if (isObject(live.workflow)) {
        config.workflow = live.workflow;
    }

    const wanted = toolIdsIn(config);
    const toolsById = new Map<string, Tool>();
    const toolConfigs = new Map<string, WireObject>();
    for (const id of wanted) {
        const remote = await clients.tools.get(id, {}, requestOptions);
        const wire = serializers.ToolResponseModelToolConfig.jsonOrThrow(remote.toolConfig, SERIALIZER_OPTIONS);
        const tool = Tool.fromJSON(wire as object);
        // tools.json lists webhook and client tools; others (MCP...) stay attached by id.
        if (tool.kind === "webhook" || tool.kind === "client") {
            toolsById.set(id, tool);
            toolConfigs.set(id, sortKeys(wire) as WireObject);
        }
    }

    const agent = Agent.fromJSON(config, { toolsById });
    if (project !== undefined) {
        for (const [id, tool] of toolsById) {
            project._recordTool(tool, id, toolConfigs.get(id) as WireObject, "id");
        }
        project._recordAgent(agent, agentId, config, { branchId, versionId: response.versionId, matchBy: "id" });
        if (project.dir !== undefined) {
            await project.save();
        }
    }
    return agent;
}

/** Every tool id an agent config uses, in the agent's `tool_ids` and the workflow's nodes, once each, in order. */
function toolIdsIn(config: WireObject): string[] {
    const toolIds = getPath(config, ["conversation_config", "agent", "prompt", "tool_ids"]);
    return [
        ...new Set([
            ...(Array.isArray(toolIds) ? (toolIds as string[]) : []),
            ...rawWorkflowToolIds(isObject(config.workflow) ? config.workflow : undefined),
        ]),
    ];
}

/**
 * The tools a branch of the agent uses. The tools API's `usedByAgentId` covers the main branch only, so they come from
 * the branch's config, by id.
 */
async function toolsOnBranch(
    clients: Clients,
    agentId: string,
    branchId: string,
    requestOptions: BaseRequestOptions | undefined,
): Promise<ElevenLabs.ToolResponseModel[]> {
    const branch = await clients.agents.get(agentId, { branchId }, requestOptions);
    const wire = serializers.GetAgentResponseModel.jsonOrThrow(branch, SERIALIZER_OPTIONS) as unknown as WireObject;
    const tools: ElevenLabs.ToolResponseModel[] = [];
    for (const id of toolIdsIn(wire)) {
        tools.push(await clients.tools.get(id, {}, requestOptions));
    }
    return tools;
}

/** A tool by id: from the ones already fetched, else from the API. */
async function readTool(
    clients: Clients,
    fetched: ElevenLabs.ToolResponseModel[],
    id: string,
    requestOptions: BaseRequestOptions | undefined,
): Promise<ElevenLabs.ToolResponseModel> {
    return fetched.find((tool) => tool.id === id) ?? (await clients.tools.get(id, {}, requestOptions));
}

async function listToolsUsedBy(
    tools: GeneratedToolsClient,
    agentId: string,
    requestOptions: BaseRequestOptions | undefined,
): Promise<ElevenLabs.ToolResponseModel[]> {
    const all: ElevenLabs.ToolResponseModel[] = [];
    let cursor: string | undefined;
    do {
        const page = await tools.list({ usedByAgentId: agentId, pageSize: 100, cursor }, requestOptions);
        all.push(...page.tools);
        cursor = page.hasMore ? page.nextCursor : undefined;
    } while (cursor !== undefined);
    return all;
}

function toolName(remote: ElevenLabs.ToolResponseModel): string {
    return (remote.toolConfig as { name?: string }).name ?? remote.id;
}

function toolWire(tool: Tool): WireObject {
    return sortKeys(
        serializers.ToolRequestModelToolConfig.jsonOrThrow(tool.buildConfig(), SERIALIZER_OPTIONS),
    ) as WireObject;
}

/** A tool response's config in API format, as a project file holds it. */
function responseWire(remote: ElevenLabs.ToolResponseModel): WireObject | undefined {
    try {
        return sortKeys(
            serializers.ToolResponseModelToolConfig.jsonOrThrow(remote.toolConfig, SERIALIZER_OPTIONS),
        ) as WireObject;
    } catch {
        return undefined;
    }
}

/**
 * Whether the server already has this tool as defined. Modeled fields are compared through the builder, so both sides
 * normalize alike; the config to send must also be contained in the server's, so a change to a field the builder
 * doesn't model still counts.
 */
function sameTool(remote: ElevenLabs.ToolResponseModel, tool: Tool, config: WireObject): boolean {
    try {
        const wire = serializers.ToolResponseModelToolConfig.jsonOrThrow(remote.toolConfig, SERIALIZER_OPTIONS);
        return Tool.fromResponse(remote).toJSONString() === tool.toJSONString() && isSubset(config, wire);
    } catch {
        return false;
    }
}

async function saveQuietly(project: AgentProject | undefined): Promise<void> {
    if (project?.dir === undefined) {
        return;
    }
    try {
        await project.save();
    } catch {
        // The push error is the one to report; the ids it carries are in the thrown result.
    }
}
