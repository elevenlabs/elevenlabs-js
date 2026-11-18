import { ElevenLabsClient } from "../../../../src";

type Json = Record<string, any>;

export interface Call {
    method: string;
    path: string;
    query: Record<string, string>;
    body?: Json;
}

/** An in-memory stand-in for the agents and tools endpoints `push` and `pull` use. */
export class FakeServer {
    readonly tools = new Map<string, Json>();
    readonly agents = new Map<string, Json>();
    readonly calls: Call[] = [];
    /** Fails every request whose `METHOD path` matches. */
    failOn: RegExp | undefined;
    private _next = 1;

    addTool(id: string, config: Json, usedBy: string[] = []): void {
        this.tools.set(id, { config, usedBy });
    }

    addAgent(id: string, config: Json): void {
        this.agents.set(id, config);
    }

    client(): ElevenLabsClient {
        return new ElevenLabsClient({ apiKey: "test", baseUrl: "https://api.test", fetch: this._fetch as never });
    }

    /** The calls that change something, as `METHOD path`. */
    writes(): string[] {
        return this.calls.filter((c) => c.method !== "GET").map((c) => `${c.method} ${c.path}`);
    }

    private _fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
        const url = new URL(typeof input === "string" ? input : input instanceof URL ? input.href : input.url);
        const method = init?.method ?? "GET";
        const body = typeof init?.body === "string" ? JSON.parse(init.body) : undefined;
        this.calls.push({ method, path: url.pathname, query: Object.fromEntries(url.searchParams), body });
        if (this.failOn?.test(`${method} ${url.pathname}`)) {
            return json({ detail: "boom" }, 500);
        }
        const [, , , kind, id] = url.pathname.split("/"); // /v1/convai/<kind>/<id>
        if (kind === "tools") {
            if (method === "GET" && id === undefined) {
                const agentId = url.searchParams.get("used_by_agent_id");
                const tools = [...this.tools].filter(([, t]) => agentId === null || t.usedBy.includes(agentId));
                return json({ tools: tools.map(([toolId, t]) => toolResponse(toolId, t.config)), has_more: false });
            }
            if (method === "POST") {
                const toolId = `tool_new_${this._next++}`;
                this.tools.set(toolId, { config: body.tool_config, usedBy: [] });
                return json(toolResponse(toolId, body.tool_config));
            }
            const tool = this.tools.get(id);
            if (tool === undefined) {
                return json({ detail: "not found" }, 404);
            }
            if (method === "PATCH") {
                tool.config = body.tool_config;
            }
            return json(toolResponse(id, tool.config));
        }
        if (kind === "agents") {
            if (method === "POST" && id === "create") {
                const agentId = `agent_new_${this._next++}`;
                this._storeAgent(agentId, body);
                return json({ agent_id: agentId });
            }
            if (method === "PATCH") {
                this._storeAgent(id, { ...this.agents.get(id), ...body });
                return json(agentResponse(id, this.agents.get(id) as Json));
            }
            const agent = this.agents.get(id);
            return agent === undefined ? json({ detail: "not found" }, 404) : json(agentResponse(id, agent));
        }
        throw new Error(`unexpected request ${method} ${url.pathname}`);
    };

    private _storeAgent(agentId: string, config: Json): void {
        this.agents.set(agentId, config);
        const ids = [
            ...(config.conversation_config?.agent?.prompt?.tool_ids ?? []),
            ...Object.values(config.workflow?.nodes ?? {}).flatMap((n: any) => [
                ...(n.tools ?? []).map((t: Json) => t.tool_id),
                ...(n.additional_tool_ids ?? []),
            ]),
        ];
        for (const [toolId, tool] of this.tools) {
            tool.usedBy = tool.usedBy.filter((a: string) => a !== agentId);
            if (ids.includes(toolId)) {
                tool.usedBy.push(agentId);
            }
        }
    }
}

function toolResponse(id: string, config: Json): Json {
    return {
        id,
        tool_config: config,
        access_info: { is_creator: true, creator_name: "a", creator_email: "a@example.com", role: "admin" },
        usage_stats: { avg_latency_secs: 0.1 },
    };
}

/** The defaults the API fills into a stored workflow, which the response model requires. */
function withServerDefaults(workflow: Json | undefined): Json | undefined {
    if (workflow === undefined) {
        return undefined;
    }
    const nodes = Object.fromEntries(
        Object.entries(workflow.nodes ?? {}).map(([id, node]: [string, any]) => [
            id,
            node.type === "override_agent"
                ? {
                      conversation_config: {},
                      additional_knowledge_base: [],
                      additional_tool_ids: [],
                      entry_behavior: "generate_immediately",
                      allow_interruptions_on_entry: true,
                      ...node,
                  }
                : node,
        ]),
    );
    const edges = Object.fromEntries(
        Object.entries(workflow.edges ?? {}).map(([id, edge]: [string, any]) => [id, { reroutes: [], ...edge }]),
    );
    return { prevent_subagent_loops: false, ...workflow, nodes, edges };
}

function agentResponse(id: string, config: Json): Json {
    return {
        agent_id: id,
        metadata: { created_at_unix_secs: 1, updated_at_unix_secs: 1 },
        created_at_unix_secs: 1,
        updated_at_unix_secs: 1,
        version_id: "ver_1",
        ...config,
        ...(config.workflow !== undefined && { workflow: withServerDefaults(config.workflow) }),
    };
}

function json(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}
