# Agent workflows as code: SDK specification

This file specifies the workflow builder that every ElevenLabs SDK implements: JS (the reference), Python, and later Go, Rust, PHP, Ruby, .NET and Java. It covers the public vocabulary, the rules that make output byte-identical across languages, and the golden fixtures every SDK must pass.

The builder is a layer **on top of** the generated API client. It never changes generated code. Its output is the SDK's own generated workflow request type (for `agents.create` / `agents.update`), or API wire-format JSON (for storing in git).

## Vocabulary

Names are given in camelCase. Each SDK applies its own casing: `on_success` in Python, Ruby and Rust; `OnSuccess` in Go and C#.

### Workflow

| Member | Description |
|---|---|
| `new Workflow(options?)` | An empty workflow. `options.preventSubagentLoops`. The constructor creates the start node with id `"start"`. |
| `Workflow.fromAgent(agentOrWorkflow)` | Loads the workflow from a get-agent response, or from its `workflow` field. |
| `Workflow.fromJSON(json)` | Loads wire-format JSON, given as a string or a parsed object. The input is either a workflow or a whole agent config with a `workflow` key. |
| `startId` | The start node's id. It is `"start"` unless the workflow was loaded with a different one. |
| `node(id)` | A handle to an existing node. |
| `nodeIds` | Node ids, in insertion order. |
| `remove(id)` | Removes the node and every edge that touches it. |
| `insertBetween(sourceId, targetId, insert)` | Replaces the edge `source → target` with new nodes. See below. |
| `build(options?)` | Validates, then returns the SDK request model. `options.onWarning` is called once per warning. |
| `toJSON()` | Wire-format object. Validates like `build()`. |
| `toJSONString()` | The canonical file format. See "Wire format". |
| Verbs and `when` | The workflow acts as the start node. Calling a verb on it branches from start. |

### Node verbs

Node verbs exist on `Workflow`, `WorkflowNode` and `WorkflowBranch`. Each verb adds a node, connects it to the current point, and returns the new node's handle.

| Verb | API node type |
|---|---|
| `converse(id, prompt, options?)` | `override_agent` (a "subagent" in the UI): the agent holds a conversation with `prompt` added to its instructions until an outgoing condition holds. `prompt` maps to `additional_prompt`. `label` defaults to `id`. |
| `tool(id, toolIds, options?)` | `tool`. Creates one `{tool_id}` locator per id, with `schemaOverrides[toolId]` if given. |
| `transfer(id, destination, options?)` | `phone_number` for phone or SIP destinations; `standalone_agent` for agent destinations. |
| `end(options?)` | `end`. `options.id` defaults to `"end"`. When the id already belongs to an end node, that node is reused. |
| `goTo(target, options?)` | No new node. Moves the conversation to `target` with a new edge to it. `target` is a handle or an id, and may be created later. `options.back` sets the backward condition. |

### Routing

| Member | Defined on | Edge it opens |
|---|---|---|
| `when(condition, options?)` | `Workflow`, `WorkflowNode` | `condition` as the forward condition. `options.back` sets the backward condition. |
| `onSuccess(options?)` / `onFailure(options?)` | `WorkflowNode` | `{type: "result", successful: true/false}`. `options.label` is optional. |
| A verb with no routing call | | `{type: "unconditional"}` |

A `WorkflowBranch` (returned by `when` / `onSuccess` / `onFailure`) only has the node verbs and `goTo`.

### Node options

Option keys are canonical names. Nested values use the SDK's generated types.

| Node kind | Options (→ API field) |
|---|---|
| all | `position` |
| converse | `label`, `toolIds` → `additional_tool_ids`, `knowledgeBase` → `additional_knowledge_base`, `conversationConfig`, `entryBehavior` |
| tool | `schemaOverrides` (`{toolId: {path: override}}`) |
| phone/SIP transfer | `transferType`, `customSipHeaders`, `sipReferPlayDialtone`, `uui`, `postDialDigits` |
| agent transfer | `delayMs`, `transferMessage`, `enableTransferredAgentFirstMessage`, `preserveClientTtsOverrides`, `preserveVoiceSettings` |
| end | `id` |

`WorkflowNode.update(options)` accepts the options for the node's own kind. It also accepts `prompt` (converse), `toolIds` (converse or tool) and `destination` (transfer). Setting a `destination` of the other transfer kind changes the node's type and keeps only its position. A key that doesn't apply to the node's kind records an `invalid_option` error.

### Value types

These are static constructors only, so they translate directly to languages without union types or overloading.

- `Condition.llm(text, {label?})`, `Condition.expr(expr, {label?})`, `Condition.always()`, `Condition.success()`, `Condition.failure()`
- `Destination.phone(number)`, `.phoneVariable(name)`, `.sip(uri)`, `.sipVariable(name)`, `.converse(agentId, {nodeId?})`
- `Expr.variable(name)`, `.literal(value)`, `.llm(prompt)`, `.allOf(...)`, `.anyOf(...)`, `.ifElse(cond, whenTrue, whenFalse)`, `.fromModel(ast)`
- `Expr` instance methods `eq neq gt gte lt lte add sub mul div`. Each takes an `Expr` or a plain value; a plain value becomes a literal.

Optional sugar, where the language allows it:
- A plain string where a `Condition` is expected means `Condition.llm(string)`.
- An `Expr` where a `Condition` is expected means `Condition.expr(expr)`.

JS, Python, Ruby and PHP accept these implicitly. Rust uses `From<&str>` / `From<Expr>`. Java and C# use overloads. Go stays explicit.

## Portability rules

1. **No reserved words.** Use `fromAgent`, not `from` (Python). Use `goTo`, not `goto` (reserved in Java and PHP; PHP 7+ accepts the case-insensitive match `goTo` as a method name). Use `allOf` / `anyOf` / `ifElse`, not `and` / `or` / `if` (Python, Ruby). Kotlin callers need backticks around `when`; the Java SDK may add a `branch` alias for it.
2. **No `then` method.** JS treats any object with a `then` method as a promise.
3. **Positional parameters have one fixed type each.** Everything optional goes in a trailing options object, struct or kwargs.
4. **Chaining never fails.** All problems are recorded and reported together by `build()`, which throws or returns `(model, error)` / `Result` depending on the language. Duplicate ids, unknown targets and bad options all surface there.
5. **Handles are references (workflow, node id).** All state lives in the workflow. Rust may use `Rc<RefCell<…>>` or copyable ids with `wf.at(id)`.
6. **Output types are the SDK's own generated types.** Implementations share nothing at runtime.

## Deterministic output

These rules make every SDK emit byte-identical JSON for the same program.

- **Edge ids.** Edges loaded from an existing workflow keep their ids. A new edge gets `{source}__{target}`; if that id is taken, it gets `__2`, `__3` and so on, assigned in edge-list order.
- **Edge list order.** Edges are kept in creation order. When loading, they are ordered by walking the nodes in document order, each node's `edge_order` in turn, followed by any edges not listed in an `edge_order`. `insertBetween` puts the first new hop where the replaced edge was.
- **`edge_order`.** For each node, the ids of its outgoing edges in edge-list order. Every node gets one, even if it is empty.
- **Positions.** A node that has a `position` keeps it. Otherwise:
  1. Run a breadth-first search from the start node, following edges in edge-list order. A node's column is its BFS depth.
  2. Unreachable nodes go in the column after the deepest one, in insertion order.
  3. Auto-placed nodes are numbered per column in visiting order, which gives each one its row.
  4. The position is `x = column × 300`, `y = row × 200`. The start node, if it has no position, is placed at `(0, 0)`.
- **Node types without a verb.** Node types the builder has no verb for are kept exactly as loaded, whether the SDK's generated types model them (such as `say`) or not (newer API node types). Only their `edge_order` is recomputed. Decide which serialization a node needs from the generated types, not from the builder's own list of verbs, so a regeneration that adds a node type doesn't break round-trips.

## Validation

`build()` reports every error at once. It never stops at the first one.

| Code | Severity | When |
|---|---|---|
| `duplicate_node_id` | error | Two different nodes use the same id (reusing an end node's id with `end()` is fine) |
| `unknown_node` | error | An edge endpoint, `node(id)` or `update` refers to a node that doesn't exist |
| `unknown_edge` | error | `insertBetween` is given a pair of nodes with no edge between them |
| `invalid_option` | error | An option doesn't apply to the node's kind, or a schema override names a tool the node doesn't run |
| `edge_into_start` | error | An edge targets the start node |
| `end_has_outgoing_edges` | error | An end node has an outgoing edge |
| `tool_edge_needs_result` | error | An edge leaving a tool node has a condition other than `result` |
| `result_edge_needs_tool` | error | A `result` condition is used on an edge that doesn't leave a tool node |
| `cannot_remove_start` | error | `remove` is called on the start node |
| `missing_insert_result` | error | An `insertBetween` callback doesn't return a node |
| `unreachable_node` | warning | A node can't be reached from start |

## `insertBetween(sourceId, targetId, insert)`

1. Find the first edge `source → target`. If there is none, record `unknown_edge`.
2. Remove that edge. Call `insert` with a branch from `source` that carries the removed edge's forward and backward conditions.
3. Move the first new edge that leaves `source` into the removed edge's position. It gets a new generated id, because the old id named the old target.
4. Connect the node `insert` returned to `target`. Use `onSuccess` if it's a tool node, otherwise an unconditional edge.

## Wire format

`toJSON()` returns the API wire format: snake_case keys, exactly as the REST API and the ElevenLabs CLI's `agent_configs/*.json` use them. Object keys are sorted at every level, undefined or absent values are omitted, and arrays keep their order. `toJSONString()` serializes that object with 2-space indentation and a trailing newline.

`fromJSON` must accept both request-shaped and response-shaped workflows. It ignores keys it doesn't recognize. Round-trip guarantee: `fromJSON(s).toJSONString() == s` for any `s` produced by `toJSONString()`.

## Fixtures

`fixtures/*.json` are the conformance tests. Each SDK runs every file through its own builder and compares the result exactly. In JS the runner is `tests/custom/agents/workflow/fixtureRunner.ts`.

```jsonc
{
  "name": "…", "description": "…",
  "workflow": { "preventSubagentLoops": true },   // optional: constructor options
  "from": { … },                                 // optional: start from Workflow.fromJSON(from) instead
  "ops": [ … ],
  "expected": { … },                             // toJSON() output, or:
  "errors": ["code", …]                          // expected error codes from build(), compared as a sorted list
}
```

Each op calls one builder method:

| Field | Meaning |
|---|---|
| `op` | `converse`, `tool`, `transfer`, `end`, `goTo`, `update`, `remove` or `insertBetween` |
| `at` | Where the op applies. A node id, or `"$start"` for the workflow. Without it, the op continues from the previous op's result, or from the workflow / insert branch for the first op. |
| `when` + `back` | Call `when(condition, {back})` first. A condition is a string (LLM), `{"llm": text, "label"?}` or `{"expr": <wire AST>, "label"?}`. |
| `onSuccess` / `onFailure` | `true` calls the matching method first. |
| `id`, `prompt`, `toolIds`, `destination`, `target` | Positional arguments. A destination is `{"phone"}`, `{"phoneVariable"}`, `{"sip"}`, `{"sipVariable"}` or `{"agent", "nodeId"?}`. |
| `options` | Canonical option keys. Nested values (such as schema overrides) are in wire format. |
| `node` | Target node for `update` and `remove`. |
| `source`, `target`, `ops` | For `insertBetween`, where `ops` are run on the insert branch and the last op's result is returned. |

Regenerate the expected output in the reference SDK with `UPDATE_FIXTURES=1 yarn test:unit`, after an intentional change only, and review the diff.

## Not yet covered

- Verbs for `say` and `update_state` nodes, planned as `say()` and `setVariable()`. The generated JS types now include both, so loaded nodes of these types round-trip, but they can't be created or updated with the builder yet.
- An end-node `outcome` option on `end()`. The generated JS types now include the field, and loaded values round-trip, but `end()` can't set it yet.
- Structured procedures. This is phase 2 and will reuse `Condition`, `Expr` and these rules.
