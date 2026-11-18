# Test the application behind an agent tool offline

An ElevenAgents tool-call test can check which tool and parameters an agent chooses. Separately test what your application does with those parameters: reject invalid input before effects, enforce resource authorization, validate returned facts and distinguish an unknown record from an unavailable source.

The [runnable TypeScript example](examples/tool-contracts.ts) and [Jest regressions](../../tests/custom/agents/tool-contracts.test.ts) use injected fake backends and synthetic order records. They make no SDK or network calls, require no API key and consume no ElevenLabs credits. From the SDK checkout after installing dependencies:

```sh
yarn test:unit --runInBand --runTestsByPath tests/custom/agents/tool-contracts.test.ts
```

## Boundary contract

`dispatchTool(name, args, context, backend)` supports `lookup_order` and `request_review`. Both accept exactly one string `reference` matching `ORD-0001`. `ToolContext` belongs to your trusted application, not to the model's arguments. Derive its allowed reference and review capability from the authenticated service session and authorization policy. Do not trust a spoken identity claim, a model argument or an unverified dynamic variable as a permission grant. Browser-side checks do not replace server authorization.

The backend lookup returns either `null` for an unknown record or exactly `{reference, status}` with an allowlisted status. A mismatch, missing status or extra field is an invalid response. A thrown error is unavailable, not evidence that the order does not exist. A review response must identify the same reference and remain `pending_review`; it never means the order itself changed or a human approved it.

Tests assert both results and absence of backend calls after denial. They cover malformed arguments, extra authorization fields, resource mismatches, malformed facts, pending-review semantics, private exception redaction and a successful lookup followed by failure. Keeping the last case prevents accidental reuse of a previous known result.

## Connect the handler separately

The result type is an application contract, not an ElevenLabs API payload or an SDK extension. Route parameters from your authenticated webhook or client-tool adapter to the handler, and serialize its result using the supported transport. Preserve tool-call IDs in the adapter. See the official [tools overview](https://elevenlabs.io/docs/eleven-agents/customization/tools) and [client-tool events](https://elevenlabs.io/docs/eleven-agents/customization/events/client-events).

For a real service add authenticated transport, tenant/resource scope, bounded I/O, idempotency for writes, rate limits and durable audit logging. A rejected promise in a fixture is not an HTTP deadline. A timed-out review request may already have reached the backend: inspect its status or use an idempotency key before retrying.

These deterministic tests complement provider evaluations. They do not establish model tool selection, conversational grounding, prompt-injection resistance, multilingual quality or voice performance. No fixture pass count should be presented as a provider reliability score. Nothing in this example provisions an agent or changes a live configuration.
