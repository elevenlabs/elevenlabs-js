import {
    AuthConnection,
    Header,
    Schema,
    SystemTool,
    Tool,
    ToolValidationError,
} from "../../../../src/wrapper/agents/tools";
import { Destination } from "../../../../src/wrapper/agents/workflow";

// Interprets the language-neutral fixtures in docs/agents-as-code/fixtures/tools. See tool-spec.md, "Fixtures".

type RawDestination =
    | { phone: string }
    | { phoneVariable: string }
    | { sip: string }
    | { sipVariable: string }
    | { agent: string; nodeId?: string };
type RawHeader = { value: string } | { secret: string } | { variable: string } | { envVar: string };
type RawAuth = { id: string } | { envVar: string };

export interface FixtureOp {
    op: string;
    args?: unknown[];
}

export interface ToolFixture {
    name: string;
    description: string;
    tool?: { webhook?: [string, string]; client?: [string, string]; system?: string; systemOptions?: object };
    from?: unknown;
    schema?: FixtureOp[];
    ops?: FixtureOp[];
    expected?: unknown;
    errors?: string[];
}

export interface FixtureResult {
    json?: string;
    errors?: string[];
}

const SYSTEM_CONSTRUCTORS: Record<string, (options: object) => SystemTool> = {
    end_call: () => SystemTool.endCall(),
    skip_turn: (o) => SystemTool.skipTurn(o),
    language_detection: (o) => SystemTool.languageDetection(o),
    play_keypad_touch_tone: (o) => SystemTool.playKeypadTouchTone(o),
    voicemail_detection: (o) => SystemTool.voicemailDetection(o),
    knowledge_base: (o) => SystemTool.knowledgeBase(o),
    transfer_to_number: (o) => SystemTool.transferToNumber(o),
    transfer_to_agent: () => SystemTool.transferToAgent(),
};

// Arguments that are builder values are given in wire format (schemas) or as small tagged objects.
const SCHEMA_ARG: Record<string, number> = { pathParam: 1, queryParam: 1, body: 0, response: 0, param: 1, property: 1 };

function destination(raw: RawDestination): Destination {
    if ("phone" in raw) return Destination.phone(raw.phone);
    if ("phoneVariable" in raw) return Destination.phoneVariable(raw.phoneVariable);
    if ("sip" in raw) return Destination.sip(raw.sip);
    if ("sipVariable" in raw) return Destination.sipVariable(raw.sipVariable);
    return Destination.agent(raw.agent, { nodeId: raw.nodeId });
}

function header(raw: RawHeader): Header {
    if ("value" in raw) return Header.value(raw.value);
    if ("secret" in raw) return Header.secret(raw.secret);
    if ("variable" in raw) return Header.variable(raw.variable);
    return Header.envVar(raw.envVar);
}

function args(op: FixtureOp): unknown[] {
    const list = [...(op.args ?? [])];
    const schemaIndex = SCHEMA_ARG[op.op];
    if (schemaIndex !== undefined) {
        list[schemaIndex] = schemaArg(list[schemaIndex] as object);
    }
    if (op.op === "header") {
        list[1] = header(list[1] as RawHeader);
    }
    if (op.op === "auth") {
        const raw = list[0] as RawAuth;
        list[0] = "id" in raw ? AuthConnection.id(raw.id) : AuthConnection.envVar(raw.envVar);
    }
    if (op.op === "transfer") {
        list[1] = destination(list[1] as RawDestination);
    }
    return list;
}

// A schema argument is wire-format JSON, or `{"build": [ops]}` for one built with Schema methods (e.g. `optional()`).
function schemaArg(raw: object): Schema {
    return "build" in raw ? buildSchema((raw as { build: FixtureOp[] }).build) : Schema.fromJSON(raw);
}

function call(target: object, op: FixtureOp): unknown {
    const method = (target as Record<string, unknown>)[op.op];
    if (typeof method !== "function") {
        throw new Error(`Unknown fixture op "${op.op}"`);
    }
    return method.apply(target, args(op));
}

function buildSchema(ops: FixtureOp[]): Schema {
    const [first, ...rest] = ops;
    let schema: unknown =
        first.op === "array"
            ? Schema.array(schemaArg(first.args?.[0] as object))
            : first.op === "fromJSON"
              ? Schema.fromJSON(first.args?.[0] as object)
              : call(Schema, { op: first.op });
    for (const op of rest) {
        schema = call(schema as object, op);
    }
    return schema as Schema;
}

export function runFixture(fixture: ToolFixture): FixtureResult {
    if (fixture.schema !== undefined) {
        return { json: `${JSON.stringify(buildSchema(fixture.schema).toJSON(), null, 2)}\n` };
    }
    let tool: Tool;
    if (fixture.from !== undefined) {
        tool = Tool.fromJSON(fixture.from as object);
    } else if (fixture.tool?.webhook !== undefined) {
        tool = Tool.webhook(...fixture.tool.webhook);
    } else if (fixture.tool?.client !== undefined) {
        tool = Tool.client(...fixture.tool.client);
    } else {
        tool = SYSTEM_CONSTRUCTORS[fixture.tool?.system as string](fixture.tool?.systemOptions ?? {});
    }
    for (const op of fixture.ops ?? []) {
        call(tool, op);
    }
    try {
        return { json: tool.toJSONString() };
    } catch (err) {
        if (err instanceof ToolValidationError) {
            return { errors: err.issues.map((issue) => issue.code) };
        }
        throw err;
    }
}
