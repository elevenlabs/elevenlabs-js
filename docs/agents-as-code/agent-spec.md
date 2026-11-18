# Agents as code: SDK specification

This file specifies the agent builder, `agents.push` / `agents.pull`, and the project layout every ElevenLabs SDK implements, after `workflow-spec.md` and `tool-spec.md`. The JS SDK is the reference implementation.

An `Agent` composes an agent's settings, its `Tool` objects and its `Workflow`. `agents.push(agent)` creates or updates the tools and the agent in one call. `AgentProject` stores agents in the ElevenLabs CLI's project layout, so a repo works with both the SDK and the CLI.

Like the other builders, this sits **on top of** the generated client and doesn't change generated code. The portability rules, the wire format and how validation works are the same as in the workflow spec.

## Example

```ts
const agent = new Agent("Support line", {
    prompt: "You are a support agent for Acme.",
    firstMessage: "Hi, how can I help?",
    tools: [SystemTool.endCall(), showOrder],
    workflow: wf, // tool nodes may take Tool objects
});

const { agentId } = await client.conversationalAi.agents.push(agent);
await client.conversationalAi.agents.push(agent, { agentId });

const project = await AgentProject.open(".");
await client.conversationalAi.agents.push(agent, { project });
const pulled = await client.conversationalAi.agents.pull("agent_123", { project });
```

`push` and `pull` live on the client, not on the agent. An `Agent` holds no client: it can be validated without an API key, pushed to several workspaces, and ported to languages where a value type can't easily own a client.

## Vocabulary

### `Agent`

| Member | Behaviour |
|---|---|
| `new Agent(name, options?)` | Options below. |
| `Agent.fromJSON(config, { toolsById? })` | Loads an API-format agent config (a CLI `agent_configs/*.json` file). Ids in `tool_ids` that are in `toolsById` become `Tool` objects; the others stay as `toolIds`. Fields the SDK doesn't model are kept. |
| `name` | The agent's name. |
| `workflow` | The agent's `Workflow`. A loaded workflow stays in API format until this is first read, then it's loaded with its tool ids swapped for the matching `Tool` objects. |
| `update(options)` | Typed options, `tools`, `toolIds` and `workflow` replace what was there. `conversationConfig` and `platformSettings` merge. Also takes `name`. |
| `addTool(tool)` | Appends to `tools`. |
| `tools()` | Every webhook and client tool the agent and its workflow use, each once, in first-use order: the tools `push` manages. |
| `toolIds` | The ids of existing tools attached as they are, which `push` doesn't manage. |
| `validate({ onWarning? })` | Runs every check that needs no ids. Throws `AgentValidationError`. |
| `toJSON({ toolIds })` | The API-format config, with keys sorted at every level. `toolIds` maps each managed tool's name to its id. |
| `build({ toolIds })` | `toJSON()` parsed into the SDK's generated create-agent request. |

### Options

| Option | API field (wire format) |
|---|---|
| `prompt` | `conversation_config.agent.prompt.prompt` |
| `firstMessage` | `conversation_config.agent.first_message` |
| `language` | `conversation_config.agent.language` |
| `llm` | `conversation_config.agent.prompt.llm` |
| `temperature` | `conversation_config.agent.prompt.temperature` |
| `voiceId` | `conversation_config.tts.voice_id` |
| `ttsModel` | `conversation_config.tts.model_id` |
| `tags` | `tags` |
| `tools` | Webhook and client tools go in `conversation_config.agent.prompt.tool_ids`, by id. Each system tool goes in `conversation_config.agent.prompt.built_in_tools.<system_tool_type>`. |
| `toolIds` | `conversation_config.agent.prompt.tool_ids`, first |
| `workflow` | `workflow`, built with the tools' ids |
| `conversationConfig`, `platformSettings` | Raw generated types, merged under everything above |

### Assembling the config

The steps, in order:

1. Start from the loaded config, if there is one, without its `tool_ids`.
2. Deep-merge the raw `conversationConfig` and `platformSettings`, converted to wire format. Objects merge key by key; arrays and scalars replace.
3. Set each typed option at its path.
4. Set `tool_ids` to `toolIds` followed by the managed tools' ids. For a loaded agent, ids it had keep their original order.
5. Set the system tools.
6. Set the workflow.
7. Set `name`, `tags` (default `[]`), `conversation_config` (default `{}`) and `platform_settings` (default `{}`).
8. Sort the keys.

### Workflow tool references

`node.tool(id, tools)` and the subagent `toolIds` option accept tool ids, `Tool` objects, or a mix.
- **In the JS SDK** this is a union; the portability rules allow that as sugar.
- **In the canonical signature** the two kinds are separate fields: `tools: Tool[]` and `toolIds: string[]`.

While the workflow is being built, a `Tool` object stands under the placeholder `<tool:NAME>`. `Workflow.build({ toolIds })` swaps in each tool's id. A `Tool` object with no id is reported as `unresolved_tool`. `Workflow.tools()` lists the `Tool` objects the nodes use. For a `Tool` object, `schemaOverrides` may be keyed by the tool's name.

## `agents.push(agent, options?)`

| Option | |
|---|---|
| `agentId` | The agent to update. Not allowed together with `project`. |
| `project` | An `AgentProject`. It supplies the ids and records new ones. |
| `branchId` | Update this branch. |
| `versionDescription` | Describes the new version. |
| `requestOptions` | Passed to every request. |

Steps:

1. **Validate.** Call `agent.validate()`, which throws before any request.
2. **Find the tools the agent already uses.** This needs the agent's id: `options.agentId`, or with a project, the id recorded for it. Call `GET /v1/convai/tools?used_by_agent_id=…&page_size=100` and follow the cursor.
3. **Push each tool in `agent.tools()`, in order.**
   - **Its known id:**
     - With a project, the id recorded for the tool. A project entry matches a tool by object if the project loaded it, otherwise by name. More than one entry with the same name is an error.
     - Without a project, the id of the tool with the same name among the tools from step 2.
     - Tools no other route reaches are never matched. In particular, a tool with the same name that only another agent uses is never touched.
   - **Fetch it:** if there's a known id, `GET /v1/convai/tools/{id}`, unless step 2 already returned it.
   - **Compare.** The tool is `"unchanged"` if `Tool.fromResponse(remote).toJSON()` equals `tool.toJSON()`, and then it makes no request.
   - **Otherwise update or create:** `PATCH /v1/convai/tools/{id}` (`"updated"`), or `POST /v1/convai/tools` (`"created"`).
   - **Request body:** the tool's wire config. For a tool loaded from a project and not edited since, that's the loaded config exactly, so fields the SDK doesn't model survive.
4. **Mark detached tools.** Tools from step 2 that the agent no longer references, by managed id or `toolIds`, are reported as `"detached"`. They are never deleted.
5. **Push the agent.** `POST /v1/convai/agents/create`, or `PATCH /v1/convai/agents/{id}` with `branch_id`. The body is `agent.toJSON({ toolIds })`, sent in full, so fields kept from a loaded config reach the API.
6. **Record in the project.**
   - New ids, and the configs that were sent, are written into the project.
   - If the project was opened from a directory, it's saved, also when a request failed partway.

**Result:** `{ agentId, action: "created" | "updated", tools: { [name]: { id, action } } }`.

**On failure:** `AgentPushError(message, result, cause)`.
- `message` names the step, e.g. `Couldn't create tool "get_order"`.
- `result` holds what was written before the failure.

## `agents.pull(agentId, options?)`

1. **Fetch the agent.** `GET /v1/convai/agents/{id}` (with `branch_id`). Build the CLI's pulled-config shape: `name`, `conversation_config`, `platform_settings`, `tags`, and `workflow` only when present.
2. **Fetch its tools.** For each id in `tool_ids` and in the workflow's tool nodes and `additional_tool_ids`, call `GET /v1/convai/tools/{id}`. Webhook and client tools become `Tool` objects; other kinds stay attached by id.
3. **Return the agent:** `Agent.fromJSON(config, { toolsById })`.
4. **Write the project, if one was given.** Record each tool and the agent, matching entries **by id**: an entry with that id is updated, and anything else gets a new file. Then save if the project was opened from a directory.

## Project layout

This is the ElevenLabs CLI's layout:

| File | Content |
|---|---|
| `agents.json` | `{ "agents": [{ "config", "id"?, "branch_id"?, "version_id"?, "branches"? }] }`. Fields are written in that order, and unset ones are left out. |
| `tools.json` | `{ "tools": [{ "type", "config", "id"? }] }`. `type` is `"webhook"` or `"client"`. |
| `agent_configs/*.json` | The agent's wire config. |
| `tool_configs/*.json` | The tool's wire `tool_config`, without the `tool_config` wrapper. |

**Format.** JSON with a 4-space indent and no trailing newline. Config files have their keys sorted at every level. Files are written owner-only (`0600`), never through a symlink, and never outside the project. A config path that leads outside the project, including through a symlinked directory, is an error.

**Naming new files.** A new entry's file is `agent_configs/<name>.json` or `tool_configs/<name>.json`.
- The name is sanitized: `/ \ : * ? " < > |` and whitespace become `-`, runs of `-` collapse, leading and trailing `.` and `-` are stripped, a name that started with `.` gets a `_` prefix, an empty result becomes `unnamed`, and names are cut at 100 characters.
- On a clash, `-1`, `-2`… is appended. A file already in the directory counts as taken even if the project doesn't list it.

**What gets written.** Files are written only by `push` and `pull`, after they know every id. A file nothing changed keeps its exact text.

| Member | Behaviour |
|---|---|
| `AgentProject.fromFiles(files)` | No I/O. `files` maps project-relative paths to their text. |
| `AgentProject.open(dir)` | Node.js only, through a lazy import. A directory with no index files opens as an empty project. |
| `agents()`, `agent(name)`, `tools()` | Loaded objects. `agent(name)` returns the same object every time. |
| `agentId(agent)`, `toolId(tool)` | Recorded ids. |
| `toFiles()` | The index files, plus every config file they list, branch configs included. |
| `changedFiles`, `save()` | The paths `push` and `pull` changed, and writing them. |

**Not supported yet:** YAML and TOML configs (an `AgentProjectError` naming the file), `tests.json`, and creating branches.

## Validation

`AgentValidationError.issues` holds `{ code, severity, message, path? }`.

| Code | Severity | When |
|---|---|---|
| `missing_name` | error | The name is empty |
| `missing_prompt` | warning | No `prompt` after assembling the config |
| `duplicate_tool_name` | error | Two different `Tool` objects share a name. The same object used twice is fine. |
| `invalid_tool` | error | A tool's own `build()` fails. `path` is `tools.<name>`. |
| `invalid_workflow` | error | The workflow's own `build()` fails |
| `invalid_config` | error | The raw `conversationConfig` or `platformSettings` doesn't serialize |
| `option_conflict` | error | The raw config sets a field that a typed option, `tools` or a system tool also sets |
| `unresolved_tool` | error | `toJSON()` / `build()` without an id for a managed tool. Never reported by `validate()`. |
| `system_tool_in_workflow` | error | A workflow tool node or subagent references a system tool |

## Portability

| SDK | Call | Errors |
|---|---|---|
| JS | `client.conversationalAi.agents.push(agent, { project })` | throws |
| Python | `client.conversational_ai.agents.push(agent, project=project)` | raises |
| Go | `client.ConversationalAI.Agents.Push(ctx, agent, &PushOptions{Project: p})` | `(result, error)` |
| Rust | `client.conversational_ai().agents().push(&agent, PushOptions { project: Some(&mut p), .. })` | `Result` |

`toJSON` on `Workflow` and `Tool` keeps its 2-space, trailing-newline format for files you store yourself. Files in a project use the CLI's format above.

## Fixtures

- `fixtures/project/cli-graph/` is a project in the CLI's layout, adapted from the CLI's own test fixtures so its tools are complete. It has a branch, a tool id the project doesn't list, a system tool, a workflow, and a tool field the SDK doesn't model.
- Every SDK must pass these checks:
  - load it with the same agents, tools, ids and attached ids;
  - give back every file byte-identical when nothing was pushed;
  - round-trip `agent_configs/support.json` through `Agent.fromJSON(...).toJSON(...)` to its sorted form.

## Not yet covered

- Declared dynamic variables, and checking `{{vars}}` against `fromVariable` and `assign`.
- Agent tests as code (`tests.json`).
- A dry run that shows the diff before pushing.
- Deleting detached tools.
