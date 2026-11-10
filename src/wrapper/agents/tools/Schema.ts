import type * as ElevenLabs from "../../../api/index";
import * as serializers from "../../../serialization/index";
import { defined, sortKeys } from "../workflow/util";

export type LiteralKind = "string" | "integer" | "number" | "boolean";
export type SchemaKind = LiteralKind | "object" | "array";

/** @internal The SDK model of any schema the API accepts for a tool param. */
export type SchemaModel =
    | ElevenLabs.LiteralJsonSchemaProperty
    | ElevenLabs.ObjectJsonSchemaPropertyInput
    | ElevenLabs.ArrayJsonSchemaPropertyInput;

/** @internal */
export interface SchemaState {
    readonly kind: SchemaKind;
    /** A loaded literal's `type`, kept as is (the API also allows a list of types). */
    readonly literalType?: ElevenLabs.LiteralJsonSchemaPropertyType;
    readonly description?: string;
    readonly dynamicVariable?: string;
    readonly hasConstant: boolean;
    readonly constantValue?: unknown;
    readonly systemProvided: boolean;
    readonly omitted: boolean;
    readonly optional: boolean;
    readonly choices?: readonly string[];
    readonly allowedFrom?: string;
    readonly items?: Schema;
    readonly properties: ReadonlyArray<readonly [string, Schema]>;
    /** A loaded object's `required`, so its order survives edits. */
    readonly loadedRequired?: readonly string[];
    readonly anyOf: ReadonlyArray<readonly string[]>;
    readonly allOf: ReadonlyArray<readonly string[]>;
    /** Loaded fields the builder doesn't model, written back unchanged. */
    readonly extra: Readonly<Record<string, unknown>>;
}

const SERIALIZER_OPTIONS = {
    unrecognizedObjectKeys: "strip",
    allowUnrecognizedUnionMembers: true,
    allowUnrecognizedEnumValues: true,
} as const;

const MODELED_KEYS = new Set([
    "type",
    "description",
    "dynamicVariable",
    "constantValue",
    "isSystemProvided",
    "isOmitted",
    "enum",
    "allowedValues",
    "items",
    "properties",
    "required",
    "requiredConstraints",
]);

/**
 * Whether `value` is what the API returns for an unset field. (It also returns `null` for some, which the SDK's
 * serializers already treat as absent.) A literal's unset constant is `""`, so `""` can't be a constant.
 */
function isUnsetValue(key: string, value: unknown, kind: SchemaKind): boolean {
    switch (key) {
        case "description":
        case "dynamicVariable":
            return value === "";
        case "constantValue":
            return kind !== "object" && kind !== "array" && value === "";
        case "isSystemProvided":
        case "isOmitted":
            return value === false;
        case "required":
            return Array.isArray(value) && value.length === 0;
        case "properties":
            return typeof value === "object" && Object.keys(value as object).length === 0;
        default:
            return false;
    }
}

/**
 * A tool param's JSON schema, and where its value comes from. Schemas are values: every method returns a new
 * schema, so one can be reused across tools and properties.
 *
 * @example
 * Schema.object()
 *     .property("order_id", Schema.string().fromVariable("order_id"))
 *     .property("reason", Schema.string().describe("Why the caller wants a refund").choices(["damaged", "late"]))
 *     .property("note", Schema.string().describe("Anything else the caller said").optional());
 */
export class Schema {
    /** @internal */
    protected readonly _state: SchemaState;

    /** @internal */
    protected constructor(state: SchemaState) {
        this._state = state;
    }

    /** A string. */
    static string(): LiteralSchema {
        return new LiteralSchema(initial("string"));
    }

    /** An integer. */
    static integer(): LiteralSchema {
        return new LiteralSchema(initial("integer"));
    }

    /** A number. */
    static number(): LiteralSchema {
        return new LiteralSchema(initial("number"));
    }

    /** A boolean. Named `bool` because `boolean` is reserved in Java. */
    static bool(): LiteralSchema {
        return new LiteralSchema(initial("boolean"));
    }

    /** An object. Add properties with `property()`. */
    static object(): ObjectSchema {
        return new ObjectSchema(initial("object"));
    }

    /** An array whose elements match `items`. */
    static array(items: Schema): ArraySchema {
        return new ArraySchema({ ...initial("array"), items });
    }

    /** Loads a schema in API format (snake_case), given as a JSON string or a parsed object. */
    static fromJSON(json: string | object): Schema {
        const raw = (typeof json === "string" ? JSON.parse(json) : json) as Record<string, unknown>;
        const kind = kindOf(raw);
        const model =
            kind === "object"
                ? serializers.ObjectJsonSchemaPropertyInput.parseOrThrow(raw, SERIALIZER_OPTIONS)
                : kind === "array"
                  ? serializers.ArrayJsonSchemaPropertyInput.parseOrThrow(raw, SERIALIZER_OPTIONS)
                  : serializers.LiteralJsonSchemaProperty.parseOrThrow(raw, SERIALIZER_OPTIONS);
        return Schema.fromModel(model);
    }

    /** @internal Loads an SDK model. `optional` is whether its parent leaves it out of `required`. */
    static fromModel(model: SchemaModel, optional = false): Schema {
        const m = model as Record<string, unknown>;
        const kind = kindOf(m);
        // The API fills unset fields with defaults ("", false, null). They aren't value sources, but are kept as
        // extra fields so a pulled config writes back unchanged.
        const isUnset = (key: string, value: unknown) => isUnsetValue(key, value, kind);
        const extra = Object.fromEntries(
            Object.entries(m).filter(([key, value]) => !MODELED_KEYS.has(key) || isUnset(key, value)),
        );
        const set = (key: string): unknown => (isUnset(key, m[key]) ? undefined : m[key]);
        const base: SchemaState = {
            ...initial(kind),
            description: set("description") as string | undefined,
            dynamicVariable: set("dynamicVariable") as string | undefined,
            hasConstant: m.constantValue !== undefined && !isUnset("constantValue", m.constantValue),
            constantValue: set("constantValue"),
            omitted: m.isOmitted === true,
            optional,
            extra,
        };
        if (kind === "object") {
            const required = Array.isArray(set("required")) ? (m.required as string[]) : undefined;
            const constraints = (m.requiredConstraints ?? {}) as ElevenLabs.RequiredConstraints;
            const properties = Object.entries((set("properties") ?? {}) as Record<string, SchemaModel>).map(
                ([name, child]) => [name, Schema.fromModel(child, !(required ?? []).includes(name))] as const,
            );
            return new ObjectSchema({
                ...base,
                properties,
                loadedRequired: required,
                anyOf: (constraints.anyOf ?? []).map((c) => c.required),
                allOf: (constraints.allOf ?? []).map((c) => c.required),
            });
        }
        if (kind === "array") {
            const items = set("items") === undefined ? undefined : Schema.fromModel(m.items as SchemaModel, true);
            return new ArraySchema({ ...base, items });
        }
        const allowed = set("allowedValues") as ElevenLabs.AllowedValues | undefined;
        return new LiteralSchema({
            ...base,
            literalType: m.type as ElevenLabs.LiteralJsonSchemaPropertyType,
            systemProvided: m.isSystemProvided === true,
            choices: set("enum") as string[] | undefined,
            allowedFrom: allowed?.dynamicVariable,
        });
    }

    /** `"string"`, `"integer"`, `"number"`, `"boolean"`, `"object"` or `"array"`. */
    get kind(): SchemaKind {
        return this._state.kind;
    }

    /** Whether the parent leaves this property out of `required`. */
    get isOptional(): boolean {
        return this._state.optional;
    }

    /** The LLM provides the value, guided by `text`. On an object or array, documents the container. */
    describe(text: string): this {
        return this._with({ description: text });
    }

    /** The value is read from the dynamic variable `name` when the tool runs. */
    fromVariable(name: string): this {
        return this._with({ dynamicVariable: name });
    }

    /** The value is always `value`, a JSON value matching the schema's type. */
    constant(value: unknown): this {
        return this._with({ hasConstant: true, constantValue: value });
    }

    /** The param is left out of the request. Only allowed on an optional property. */
    omit(): this {
        return this._with({ omitted: true });
    }

    /** Leaves this property out of its parent's `required`. Properties are required unless marked optional. */
    optional(): this {
        return this._with({ optional: true });
    }

    /** The schema in API format (snake_case keys, sorted). Doesn't validate. */
    toJSON(): Record<string, unknown> {
        const model = this.toModel();
        const kind = this._state.kind;
        const raw =
            kind === "object"
                ? serializers.ObjectJsonSchemaPropertyInput.jsonOrThrow(model, SERIALIZER_OPTIONS)
                : kind === "array"
                  ? serializers.ArrayJsonSchemaPropertyInput.jsonOrThrow(model, SERIALIZER_OPTIONS)
                  : serializers.LiteralJsonSchemaProperty.jsonOrThrow(model, SERIALIZER_OPTIONS);
        return sortKeys(raw) as Record<string, unknown>;
    }

    /** @internal */
    get state(): SchemaState {
        return this._state;
    }

    /** @internal The SDK model of this schema. */
    toModel(): SchemaModel {
        const s = this._state;
        // Modeled fields that are unset leave the matching extra field (an API default) in place.
        const common = {
            ...s.extra,
            ...defined({
                description: s.description,
                dynamicVariable: s.dynamicVariable,
                isOmitted: s.omitted ? true : undefined,
            }),
            ...(s.hasConstant && { constantValue: s.constantValue }),
        };
        if (s.kind === "object") {
            const required = requiredOf(s);
            const constraints = defined({
                anyOf: s.anyOf.length > 0 ? s.anyOf.map((names) => ({ required: [...names] })) : undefined,
                allOf: s.allOf.length > 0 ? s.allOf.map((names) => ({ required: [...names] })) : undefined,
            });
            return {
                ...common,
                ...defined({
                    type: "object",
                    properties:
                        s.properties.length > 0
                            ? Object.fromEntries(s.properties.map(([name, child]) => [name, child.toModel()]))
                            : undefined,
                    required: required.length > 0 ? required : undefined,
                    requiredConstraints: Object.keys(constraints).length > 0 ? constraints : undefined,
                }),
            } as ElevenLabs.ObjectJsonSchemaPropertyInput;
        }
        if (s.kind === "array") {
            return {
                ...common,
                ...defined({ type: "array", items: s.items?.toModel() }),
            } as ElevenLabs.ArrayJsonSchemaPropertyInput;
        }
        return {
            ...common,
            ...defined({
                type: s.literalType ?? s.kind,
                isSystemProvided: s.systemProvided ? true : undefined,
                enum: s.choices === undefined ? undefined : [...s.choices],
                allowedValues: s.allowedFrom === undefined ? undefined : { dynamicVariable: s.allowedFrom },
            }),
        } as ElevenLabs.LiteralJsonSchemaProperty;
    }

    /** @internal */
    protected _with(changes: Partial<SchemaState>): this {
        const copy = Object.create(Object.getPrototypeOf(this)) as this;
        Object.assign(copy, this, { _state: { ...this._state, ...changes } });
        return copy;
    }
}

/** A string, integer, number or boolean. */
export class LiteralSchema extends Schema {
    /** @internal */
    constructor(state: SchemaState) {
        super(state);
    }

    /** The values the LLM may choose from (`enum`). Strings only. Named `choices` because `enum` is reserved. */
    choices(values: string[]): this {
        return this._with({ choices: [...values] });
    }

    /** The value is filled in by the system at runtime. */
    systemProvided(): this {
        return this._with({ systemProvided: true });
    }

    /**
     * Rejects an LLM value that isn't in the list held by the dynamic variable `variable`. The list isn't shown to
     * the LLM. Needs `describe()`.
     */
    allowedFrom(variable: string): this {
        return this._with({ allowedFrom: variable });
    }
}

/** An object with named properties. */
export class ObjectSchema extends Schema {
    /** @internal */
    constructor(state: SchemaState) {
        super(state);
    }

    /** Adds the property `name`, or replaces it in place if it exists. */
    property(name: string, schema: Schema): this {
        const properties = [...this._state.properties];
        const index = properties.findIndex(([existing]) => existing === name);
        if (index === -1) {
            properties.push([name, schema]);
        } else {
            properties[index] = [name, schema];
        }
        return this._with({ properties });
    }

    /** Removes the property `name`. */
    without(name: string): this {
        return this._with({ properties: this._state.properties.filter(([existing]) => existing !== name) });
    }

    /** Requires at least one of these sets of properties: appends `names` to `required_constraints.any_of`. */
    requireAnyOf(names: string[]): this {
        return this._with({ anyOf: [...this._state.anyOf, [...names]] });
    }

    /** Requires all of these sets of properties: appends `names` to `required_constraints.all_of`. */
    requireAllOf(names: string[]): this {
        return this._with({ allOf: [...this._state.allOf, [...names]] });
    }

    /** Property names, in order. */
    get propertyNames(): string[] {
        return this._state.properties.map(([name]) => name);
    }

    /** The schema of property `name`, if there is one. */
    propertySchema(name: string): Schema | undefined {
        return this._state.properties.find(([existing]) => existing === name)?.[1];
    }
}

/** A list whose elements match one schema. */
export class ArraySchema extends Schema {
    /** @internal */
    constructor(state: SchemaState) {
        super(state);
    }

    /** The element schema. */
    get items(): Schema | undefined {
        return this._state.items;
    }
}

function initial(kind: SchemaKind): SchemaState {
    return {
        kind,
        hasConstant: false,
        systemProvided: false,
        omitted: false,
        optional: false,
        properties: [],
        anyOf: [],
        allOf: [],
        extra: {},
    };
}

function kindOf(model: Record<string, unknown>): SchemaKind {
    if (model.type === "object" || (model.type === undefined && "properties" in model)) {
        return "object";
    }
    if (model.type === "array" || (model.type === undefined && "items" in model)) {
        return "array";
    }
    return model.type === "integer" || model.type === "number" || model.type === "boolean" ? model.type : "string";
}

/** A loaded object's `required` order for the required properties it still has, then new ones in property order. */
function requiredOf(state: SchemaState): string[] {
    const required = state.properties.filter(([, child]) => !child.isOptional).map(([name]) => name);
    const kept = (state.loadedRequired ?? []).filter((name) => required.includes(name));
    return [...kept, ...required.filter((name) => !kept.includes(name))];
}
