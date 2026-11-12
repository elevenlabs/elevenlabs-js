# Agent tools as code: SDK specification

This file specifies the tool builder that every ElevenLabs SDK implements, after the workflow builder in `workflow-spec.md`. It covers webhook, client and system tools, the `Schema` helper they share, the rules that make output byte-identical across languages, and the fixtures every SDK must pass.

The builder sits **on top of** the generated API client and never changes generated code. `build()` returns the SDK's own generated `ToolRequestModel`, which `tools.create` / `tools.update` already accept. `toJSON()` returns API wire-format JSON, the same shape the ElevenLabs CLI keeps in `tool_configs/*.json`.

The portability rules, wire format and validation style are the workflow spec's, and are not repeated here except where tools differ.

## Example

```ts
import { ElevenLabsClient, Tool, SystemTool, Schema, Header, Destination } from "@elevenlabs/elevenlabs-js";

const getOrder = Tool.webhook("get_order", "Look up an order by the number the caller gives")
    .get("https://api.example.com/orders/{order_id}")
    .pathParam("order_id", Schema.string().describe("The order number, e.g. A-1042"))
    .queryParam("include", Schema.string().constant("items"))
    .header("Authorization", Header.secret("sec_orders_api"))
    .header("X-Caller", Header.variable("system__caller_id"))
    .assign("order_status", "order.status")
    .options({ responseTimeoutSecs: 10, preToolSpeech: "force" });

const refund = Tool.webhook("issue_refund", "Refund an order the caller asked to return")
    .post("https://api.example.com/refunds")
    .body(
        Schema.object()
            .property("order_id", Schema.string().fromVariable("order_id"))
            .property("reason", Schema.string().describe("Why the caller wants a refund").choices(["damaged", "late", "other"]))
            .property("note", Schema.string().describe("Anything else the caller said").optional()),
    );

const showMap = Tool.client("show_store_map", "Show the caller a map of the nearest store")
    .param("store_id", Schema.string().describe("The store to show"))
    .options({ expectsResponse: false });

const transfer = SystemTool.transferToNumber()
    .transfer("Caller asks for billing", Destination.phone("+15551234567"))
    .transfer("Caller asks for a manager", Destination.sipVariable("manager_sip"), { transferType: "sip_refer" });

const client = new ElevenLabsClient();
const { id } = await client.conversationalAi.tools.create(getOrder.build());
await writeFile("tool_configs/issue_refund.json", refund.toJSONString());
```

## Vocabulary

Names are given in camelCase. Each SDK applies its own casing, as in the workflow spec.

### Tool kinds

| Constructor | API `tool_config.type` |
|---|---|
| `Tool.webhook(name, description)` | `webhook`: the server calls an HTTP endpoint |
| `Tool.client(name, description)` | `client`: the agent sends an event to the user's client |
| `SystemTool.endCall()`, `.skipTurn()`, `.languageDetection()`, `.playKeypadTouchTone()`, `.voicemailDetection()`, `.transferToNumber()`, `.transferToAgent()`, `.knowledgeBase()` | `system`, with `params.system_tool_type` set to the snake_case name (`end_call`, `skip_turn`, …) |

`name` is what the LLM calls the tool by. A system tool's `name` defaults to its `system_tool_type`, and its description is left out so the API uses its own optimized one; both can be set with `options`.

### Members on every tool

| Member | Description |
|---|---|
| `options(options)` | Merges the options for the tool's kind (see "Options"). Returns the tool. A key that doesn't apply records `invalid_option`. |
| `name` | The tool's name. |
| `kind` | `"webhook"`, `"client"`, `"system"`, or `"other"` for a loaded tool of a type the builder has no constructor for. |
| `asWebhook()` / `asClient()` / `asSystem()` | The same tool typed as that kind, or nothing (`undefined`, `None`, `nil`, `null`, empty `Option`) if it is another kind. For statically typed callers of `fromJSON`. |
| `build(options?)` | Validates, then returns the SDK's `ToolRequestModel` (`{ toolConfig }`). `options.onWarning` is called once per warning. |
| `buildConfig(options?)` | Validates, then returns only the tool config: for a system tool, its `prompt.built_in_tools` entry. Webhook and client tools go to `tools.create` and are attached by id in `prompt.tool_ids`. The API still accepts them inline in `prompt.tools`, but that field is deprecated, can't be combined with `tool_ids`, and replaces `built_in_tools` with the system tools it contains. |
| `toJSON()` | The wire-format tool config (the `tool_config` object, with its `type`). Validates like `build()`. |
| `toJSONString()` | The canonical file format, as in the workflow spec. |
| `Tool.fromJSON(json)` | Loads wire-format JSON, a string or a parsed object: a bare tool config, or a request or response with a `tool_config` key. Returns a tool of the matching kind. |
| `Tool.fromResponse(response)` | Loads a get-tool response. |

`SystemTool.*` constructors return a `SystemTool`; `Tool.fromJSON` and `Tool.fromResponse` are the only loaders, for every kind.

### Webhook tools

Each method returns the tool, so a tool is written as one chain.

| Method | API field |
|---|---|
| `get(url)`, `post(url)`, `put(url)`, `patch(url)`, `delete(url)` | `api_schema.method` and `api_schema.url`. The URL may contain `{name}` placeholders, one per path param. A later call replaces both. |
| `pathParam(name, schema)` | `api_schema.path_params_schema[name]`. `schema` must be a literal (`string`, `integer`, `number`, `bool`). |
| `queryParam(name, schema)` | `api_schema.query_params_schema.properties[name]`, and `required` unless the schema is optional. Literal only. |
| `body(schema)` | `api_schema.request_body_schema`. `schema` must be an object. |
| `response(schema)` | `api_schema.response_body_schema`. `schema` must be an object. |
| `header(name, value)` | `api_schema.request_headers[name]`. `value` is a `Header`. |
| `auth(connection)` | `api_schema.auth_connection`. `connection` is `AuthConnection.id(authConnectionId)` or `AuthConnection.envVar(label)`. |
| `assign(variable, valuePath, options?)` | Appends to `assignments`: `{source: "response", dynamic_variable, value_path}`. `options.sanitize`, `options.preserveNativeType`. |
| `removePathParam(name)`, `removeQueryParam(name)`, `removeHeader(name)`, `removeAssignment(variable)` | Remove the entry. Removing one that doesn't exist does nothing. |

Setting a param or header whose name already exists replaces it and keeps its position. Read the current body or response schema with `bodySchema` / `responseSchema` to edit it (see "Schema"), then set it again with `body()` / `response()`.

### Client tools

| Method | API field |
|---|---|
| `param(name, schema)` | `parameters.properties[name]`, and `parameters.required` unless the schema is optional. Any schema kind. |
| `removeParam(name)` | Removes the param. |
| `parametersSchema` | The params as an `ObjectSchema`, for reading. |

### System tools

Each constructor takes an optional options object with the params for its type:

| Constructor | Options (→ `params` field) |
|---|---|
| `endCall()` | none |
| `skipTurn(options?)` | `waitTimeoutSecs` |
| `languageDetection(options?)` | `onlyAtConversationStart` |
| `playKeypadTouchTone(options?)` | `useOutOfBandDtmf`, `suppressTurnAfterDtmf` |
| `voicemailDetection(options?)` | `voicemailMessage` |
| `knowledgeBase(options?)` | `enabledStrategies` |
| `transferToNumber(options?)` | `enableClientMessage` |
| `transferToAgent()` | none |

The two transfer tools add one entry to `params.transfers` per call:

| Method | Builds |
|---|---|
| `transfer(condition, destination, options?)` | On `transferToNumber`: a `PhoneNumberTransfer` with `condition` and `transfer_destination` from a phone or SIP `Destination`. Options: `transferType`, `customSipHeaders`, `sipReferPlayDialtone`, `uui`, `postDialDigits`. On `transferToAgent`: an `AgentTransfer` with `condition`, `agent_id` and, if set, `node_id` from `Destination.agent(...)`. Options: `delayMs`, `transferMessage`, `enableTransferredAgentFirstMessage`, `preserveClientTtsOverrides`, `preserveVoiceSettings`. |

`condition` is plain text the LLM reads, not a workflow `Condition`, because the API field is a string. `Destination` and the transfer option names are the workflow builder's, shared between the two builders.

### Options

| Kind | Options (→ API field) |
|---|---|
| all | `name`, `description`, `responseTimeoutSecs`, `interruptionMode`, `preToolSpeech`, `toolCallSound`, `toolCallSoundBehavior`, `toolErrorHandlingMode` |
| webhook | `dynamicVariablePlaceholders` → `dynamic_variables.dynamic_variable_placeholders`, `executionMode`, `contentType` → `api_schema.content_type`, `responseFilter` → `api_schema.response_filter`, `followRedirects`, `followRedirectsAllowedDomains` |
| client | `dynamicVariablePlaceholders`, `executionMode`, `expectsResponse` |
| system | none beyond "all" |

Deprecated API fields (`disable_interruptions`, `force_pre_tool_speech`, a literal's `allowed_values_dynamic_variable`) have no option. Loaded values round-trip unchanged.

### Schema

`Schema` builds the JSON-schema dialect the API uses for tool params. It is a value type: every method returns a new `Schema` and never changes the one it is called on, so one schema can be reused across tools and properties.

The literal constructors return a `LiteralSchema`, `object()` an `ObjectSchema` and `array()` an `ArraySchema`, all subtypes of `Schema`. Methods that only apply to one kind live on that subtype, so calling them on the wrong kind doesn't compile in typed languages. Every method returns the same subtype it was called on. `kind` (`"string"`, `"integer"`, `"number"`, `"boolean"`, `"object"`, `"array"`) and `isOptional` are readable on all of them.

**Types**

| Constructor | Wire `type` |
|---|---|
| `Schema.string()`, `Schema.integer()`, `Schema.number()`, `Schema.bool()` | `string`, `integer`, `number`, `boolean` (literals) |
| `Schema.object()` | `object` |
| `Schema.array(items)` | `array`, with `items` set to the `Schema` given |

**Where the value comes from.** Every literal needs exactly one of these, wherever it appears: in params, in a body, in a response schema, and under a container whose own value comes from a variable or a constant. The API checks each one. An object or array may have at most one, and needs none.

| Method | Wire field | Applies to |
|---|---|---|
| `describe(text)` | `description`: the LLM provides the value | all |
| `fromVariable(name)` | `dynamic_variable` | all |
| `constant(value)` | `constant_value`. `value` is the language's JSON value type, since object and array constants are arbitrary JSON. | all |
| `systemProvided()` | `is_system_provided: true` | `LiteralSchema` |
| `omit()` | `is_omitted: true`: the param is left out of the request | all; the schema must be optional |

On an object or array, `describe` documents the container for the LLM; it isn't a value source for its properties or items, so a described object may still have properties with their own sources.

**Other methods**

| Method | Wire field |
|---|---|
| `optional()` (all) | Leaves the property out of its parent's `required`. Properties are required unless marked optional. |
| `choices(values)` (`LiteralSchema`) | `enum`. Strings only. |
| `allowedFrom(variable)` (`LiteralSchema`) | `allowed_values: {dynamic_variable}`: the runtime rejects an LLM value outside the list in that variable. Needs `describe`. |
| `property(name, schema)` (`ObjectSchema`) | Adds or replaces `properties[name]`. A replaced property keeps its position. |
| `without(name)` (`ObjectSchema`) | Removes `properties[name]`. |
| `requireAnyOf(names)` / `requireAllOf(names)` (`ObjectSchema`) | Appends `{required: names}` to `required_constraints.any_of` / `.all_of`. |
| `propertyNames`, `propertySchema(name)` (`ObjectSchema`) | Read access to the properties, in order. |
| `items` (`ArraySchema`) | The element schema. |

`Schema.fromJSON(json)` loads a wire-format schema. `schema.toJSON()` returns one, without validating.

### Header

`Header.value(text)` (a plain string), `Header.secret(secretId)` → `{secret_id}`, `Header.variable(name)` → `{variable_name}`, `Header.envVar(label)` → `{env_var_label}`.

## Portability rules

The workflow spec's rules apply. Tool-specific notes:

1. **`Schema.bool()`, not `boolean()`.** `boolean` is reserved in Java. `bool` is a type name in C#, Go and Rust, but none of them reserves it as a method or function name.
2. **`choices`, not `enum`.** `enum` is reserved in Java, C#, Rust, TypeScript and PHP 8.1+.
3. **`delete(url)`** is allowed as a method name in every target language (JS allows reserved words as property names). Go spells it `Delete`.
4. **Go:** `Schema` constructors are package functions (`tool.String()`), never a method named `String()` on a type, which `go vet` would read as a broken `fmt.Stringer`.
5. **Objects are built with `property(name, schema)` calls, never from a map literal.** Go maps and some others don't keep insertion order, and `required` is emitted in property order.
6. **`constant(value)` is the one parameter whose type varies.** It takes the language's JSON value type (`any`, `Object`, `object`, `serde_json::Value`), and `build()` checks it against the schema type.

## Deterministic output

- **Wire format.** As in the workflow spec: snake_case keys sorted at every level, absent values omitted, arrays in order, 2-space indentation and a trailing newline.
- **Only what was set.** The builder writes the fields the program set, plus the ones the API requires (`type`, `name`, `description`, `api_schema.url`, a literal's `type`). It never fills in API defaults.
- **`required`.** Emitted in property insertion order, and left out when empty. A loaded schema keeps its `required` order for the properties it still has; new required properties follow in insertion order.
- **Arrays the program builds** (`assignments`, `transfers`, `required_constraints`) keep call order.
- **API defaults.** A config pulled from the API fills unset fields with defaults: `""` for `description` and `dynamic_variable`, `""` for a literal's `constant_value`, `false` for `is_system_provided` and `is_omitted`, and empty `required` and `properties`. A loaded default is not a value source. It is written back as loaded, and setting that field replaces it. `null` values are read as absent and are not written back.
- **Loaded fields the builder doesn't model** (such as a loaded `request_headers` value of a kind `Header` doesn't cover) are kept exactly as loaded.

## Validation

`build()`, `buildConfig()` and `toJSON()` report every problem at once.

| Code | Severity | When |
|---|---|---|
| `missing_url` | error | A webhook tool has no method and URL |
| `missing_path_param` | error | The URL has a `{name}` placeholder with no path param |
| `unknown_path_param` | error | A path param has no `{name}` placeholder in the URL, or its placeholder is filled by the auth connection |
| `param_not_literal` | error | A path or query param is an object or array |
| `body_not_object` | error | `body()` or `response()` is given a schema that isn't an object |
| `body_not_allowed` | error | A body is set on a `GET` (`contentType` is allowed; the API sets it on every webhook) |
| `missing_body` | error | A `POST`, `PUT` or `PATCH` has no body. A `DELETE` may have one or not |
| `duplicate_param` | error | A name is used in more than one of the path params, query params and body properties |
| `conflicting_value_source` | error | A schema sets more than one of `describe`, `fromVariable`, `constant`, `systemProvided`, `omit` |
| `omitted_required` | error | `omit()` is used on a schema that isn't optional |
| `invalid_choices` | error | `choices` is used on a schema that isn't a string |
| `allowed_values_needs_description` | error | `allowedFrom` is used without `describe` |
| `constant_type_mismatch` | error | A constant's JSON type doesn't match the schema type (`null` matches a loaded type list that includes `"null"`, and a list's kind is its non-null member), or a literal's constant is `""`, which the API reads as unset |
| `unknown_required_property` | error | A name in `requireAnyOf` / `requireAllOf` isn't a property of the object |
| `missing_array_items` | error | An array schema has no `items` (only possible when loaded) |
| `duplicate_header` | error | Two header names differ only in case |
| `invalid_destination` | error | `transferToNumber` is given an agent destination, or a SIP URI destination (static or from a dynamic variable) without `transferType: "sip_refer"` (the API defaults to `conference`); or `transferToAgent` a phone or SIP one |
| `no_transfers` | error | A transfer system tool has no `transfer()` entries |
| `invalid_option` | error | An option doesn't apply to the tool's kind, or a documented range is broken: a webhook `responseTimeoutSecs` outside 5–300, a client one outside 1–120 other than -1, -1 without `expectsResponse: true`, or `followRedirects` without `followRedirectsAllowedDomains` |
| `missing_value_source` | error | A literal has none of `describe`, `fromVariable`, `constant`, `systemProvided`, `omit`. An empty description or variable name doesn't count, since the API reads `""` as unset |
| `unknown_tool_type` | warning | A loaded tool's type has no constructor in this SDK version (kind `"other"`); it round-trips but can't be edited |

Path-placeholder matching uses `{name}` where `name` is one or more characters other than `{` and `}`, as the API does. Environment variable templates (`{{system__env_<label>}}`, label matching `[a-z][a-z0-9_]*`) aren't placeholders. A placeholder listed in a loaded `api_schema.auth_resolved_params` is filled by the auth connection: it needs no path param, and may not have one (`unknown_path_param`).

## Fixtures

`fixtures/tools/*.json` are the conformance tests, run like the workflow fixtures.

```jsonc
{
  "name": "…", "description": "…",
  "tool": { "webhook": ["get_order", "Look up an order"] },  // or "client": [name, description], "system": "transfer_to_number" + "systemOptions": {…}, or "from": <wire JSON>
  "ops": [ … ],
  "expected": { … },            // toJSON() output, or:
  "errors": ["code", …]         // sorted error codes from build()
}
```

Each op calls one tool method. `{"op": "<method>", "args": [ … ]}`, where a schema argument is in wire format and loaded with `Schema.fromJSON`, or `{"build": [ops]}` for a schema built with `Schema` methods (needed for `optional()`, which has no wire form of its own), a header is `{"value"}`, `{"secret"}`, `{"variable"}` or `{"envVar"}`, and a destination is as in the workflow fixtures. Schema-only cases use `{"schema": <ops>}`, where the first op is a constructor (`string`, `integer`, `number`, `bool`, `object`, `array` with a schema argument, or `fromJSON` with a wire schema), each later op is a method called on the previous result, and `expected` is `schema.toJSON()`. In JS the runner is `tests/custom/agents/tools/fixtureRunner.ts`.

The fixtures cover the example above, both transfer tools and a system tool with params, every value source, `required` order across a load, a replacement and a `without`, editing a loaded tool, a byte-identical round-trip with fields the builder doesn't model, a config with the API's defaults for unset fields, an unknown tool type, and every validation error.

## Not yet covered

- `response_mocks`. The API stores them on the tool, but the CLI's `tool_configs/*.json` holds only the tool config. They belong with the test builder, which will set them by tool id.
- MCP tools and API-integration webhook tools. They load as kind `"other"` and round-trip.
- The `start_procedure` and `end_procedure` system tools, until the procedures builder exists to name the procedures they refer to.
- Checking an agent's tool references (workflow `tool()` nodes, `prompt.tool_ids`) against the tools defined in code. That belongs to the `Agent` builder.
- The API's rule that a body sent with a content type other than JSON has no nested objects, arrays of objects or nested arrays. `build()` doesn't check it yet.
