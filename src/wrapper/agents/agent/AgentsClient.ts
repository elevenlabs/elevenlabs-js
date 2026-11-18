import { AgentsClient as GeneratedAgentsClient } from "../../../api/resources/conversationalAi/resources/agents/client/Client";
import { ToolsClient as GeneratedToolsClient } from "../../../api/resources/conversationalAi/resources/tools/client/Client";
import type { Agent } from "./Agent";
import type { AgentPushResult } from "./errors";
import { type AgentPullOptions, type AgentPushOptions, pullAgent, pushAgent } from "./push";

/** `client.conversationalAi.agents`, with `push()` and `pull()` for agents written as code. */
export class AgentsClient extends GeneratedAgentsClient {
    private _toolsForPush: GeneratedToolsClient | undefined;

    /**
     * Creates or updates an agent and every webhook and client tool it uses, in one call.
     *
     * 1. Validates the agent, so an invalid one writes nothing.
     * 2. Creates each tool that's new and updates each one that changed. Which tools already exist comes from the
     *    project's `tools.json`, or, without a project, from the tools the agent (`agentId`) already uses, by name.
     *    Tools other agents use are never touched.
     * 3. Creates the agent, or updates it, with the tools' ids filled in.
     *
     * Settings the SDK doesn't model, kept from a loaded config, are sent too. Tools the agent stops using are
     * reported as `"detached"`, not deleted.
     *
     * @throws {AgentValidationError} if the agent is invalid, before any API call
     * @throws {AgentPushError} if an API call fails, with what was already written
     *
     * @example
     * const { agentId } = await client.conversationalAi.agents.push(agent);
     * await client.conversationalAi.agents.push(agent, { agentId });            // later: update it
     * await client.conversationalAi.agents.push(agent, { project });            // or let a project track the ids
     */
    public push(agent: Agent, options: AgentPushOptions = {}): Promise<AgentPushResult> {
        return pushAgent({ agents: this, tools: this._pushTools() }, agent, options);
    }

    /**
     * Loads an existing agent as an `Agent`, with its webhook and client tools as `Tool` objects. With a project, also
     * writes the agent and its tools there, in the CLI's layout, and records their ids.
     *
     * @example
     * const agent = await client.conversationalAi.agents.pull(agentId, { project });
     * agent.update({ firstMessage: "Hello!" });
     * await client.conversationalAi.agents.push(agent, { project });
     */
    public pull(agentId: string, options: AgentPullOptions = {}): Promise<Agent> {
        return pullAgent({ agents: this, tools: this._pushTools() }, agentId, options);
    }

    private _pushTools(): GeneratedToolsClient {
        if (this._toolsForPush === undefined) {
            this._toolsForPush = new GeneratedToolsClient(this._options);
        }
        return this._toolsForPush;
    }
}
