import type * as ElevenLabs from "../../../api/index";
import type { AgentsClient as GeneratedAgentsClient } from "../../../api/resources/conversationalAi/resources/agents/client/Client";
import type { ToolsClient as GeneratedToolsClient } from "../../../api/resources/conversationalAi/resources/tools/client/Client";
import type { BaseRequestOptions } from "../../../BaseClient";
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
     * the server this definition is; `push` records new ids there and writes the configs it sent.
     */
    project?: AgentProject;
    /** Update this branch of the agent instead of its main branch. */
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
    const result: AgentPushError["result"] = { tools: {} };
    const ids: Record<string, string> = {};
    let step = "Couldn't read the agent's tools";
    try {
        // The tools the agent already uses. With a project they're matched by recorded id; without one, by name
        // among the tools this agent uses, so a same-named tool another agent uses is never touched.
        const inUse =
            agentId === undefined
                ? []
                : branchId !== undefined
                  ? await toolsOnBranch(clients, agentId, branchId, requestOptions)
                  : await listToolsUsedBy(clients.tools, agentId, requestOptions);
        const usedByName = new Map<string, ElevenLabs.ToolResponseModel>();
        for (const remote of inUse) {
            usedByName.set(toolName(remote), remote);
        }

        for (const tool of tools) {
            const knownId = project !== undefined ? project.toolId(tool) : usedByName.get(tool.name)?.id;
            let remote: ElevenLabs.ToolResponseModel | undefined;
            if (knownId !== undefined) {
                step = `Couldn't read tool "${tool.name}" (${knownId})`;
                remote = inUse.find((t) => t.id === knownId) ?? (await clients.tools.get(knownId, {}, requestOptions));
            }
            const config = project?._unchangedRaw(tool) ?? toolWire(tool);
            const body = { ...requestOptions, additionalBodyParameters: { tool_config: config } };
            if (remote !== undefined && sameTool(remote, tool, config)) {
                ids[tool.name] = remote.id;
                result.tools[tool.name] = { id: remote.id, action: "unchanged" };
                // The server already matches, but the project may hold an older definition: bring it up to date.
                project?._recordTool(tool, remote.id, config);
                continue;
            }
            if (remote !== undefined) {
                step = `Couldn't update tool "${tool.name}" (${remote.id})`;
                await clients.tools.update(remote.id, tool.build(), body);
                ids[tool.name] = remote.id;
                result.tools[tool.name] = { id: remote.id, action: "updated" };
            } else {
                step = `Couldn't create tool "${tool.name}"`;
                const created = await clients.tools.create(tool.build(), body);
                ids[tool.name] = created.id;
                result.tools[tool.name] = { id: created.id, action: "created" };
            }
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
