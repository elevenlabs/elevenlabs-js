import type * as ElevenLabs from "../../../api/index";

/** A value accepted wherever an expression is expected. Plain values become literals. */
export type ExprInput = Expr | string | number | boolean | null;

/**
 * A workflow expression, compiled to the API's expression AST.
 *
 * @example
 * Expr.anyOf(Expr.variable("tier").eq("gold"), Expr.variable("orders").gte(10))
 */
export class Expr {
    private readonly _node: ElevenLabs.AstNodeInput;

    private constructor(node: ElevenLabs.AstNodeInput) {
        this._node = node;
    }

    /** The value of a dynamic variable. */
    static variable(name: string): Expr {
        return new Expr({ type: "dynamic_variable", name });
    }

    /** A string, number, boolean or null literal. */
    static literal(value: string | number | boolean | null): Expr {
        if (value === null) {
            return new Expr({ type: "null_literal" });
        }
        switch (typeof value) {
            case "string":
                return new Expr({ type: "string_literal", value });
            case "number":
                return new Expr({ type: "number_literal", value });
            default:
                return new Expr({ type: "boolean_literal", value });
        }
    }

    /** A value the LLM extracts from the conversation, described by `prompt`. */
    static llm(prompt: string): Expr {
        return new Expr({ type: "llm", prompt });
    }

    /** True when every expression is true. */
    static allOf(...exprs: ExprInput[]): Expr {
        return new Expr({ type: "and_operator", children: exprs.map(toAst) });
    }

    /** True when at least one expression is true. */
    static anyOf(...exprs: ExprInput[]): Expr {
        return new Expr({ type: "or_operator", children: exprs.map(toAst) });
    }

    /** `whenTrue` if `condition` is true, otherwise `whenFalse`. */
    static ifElse(condition: ExprInput, whenTrue: ExprInput, whenFalse: ExprInput): Expr {
        return new Expr({
            type: "conditional_operator",
            condition: toAst(condition),
            trueExpression: toAst(whenTrue),
            falseExpression: toAst(whenFalse),
        });
    }

    /** Wraps an existing AST node. */
    static fromModel(node: ElevenLabs.AstNodeInput): Expr {
        return new Expr(node);
    }

    eq(other: ExprInput): Expr {
        return this._binary("eq_operator", other);
    }

    neq(other: ExprInput): Expr {
        return this._binary("neq_operator", other);
    }

    gt(other: ExprInput): Expr {
        return this._binary("gt_operator", other);
    }

    gte(other: ExprInput): Expr {
        return this._binary("gte_operator", other);
    }

    lt(other: ExprInput): Expr {
        return this._binary("lt_operator", other);
    }

    lte(other: ExprInput): Expr {
        return this._binary("lte_operator", other);
    }

    add(other: ExprInput): Expr {
        return this._binary("add_operator", other);
    }

    sub(other: ExprInput): Expr {
        return this._binary("sub_operator", other);
    }

    mul(other: ExprInput): Expr {
        return this._binary("mul_operator", other);
    }

    div(other: ExprInput): Expr {
        return this._binary("div_operator", other);
    }

    toModel(): ElevenLabs.AstNodeInput {
        return this._node;
    }

    private _binary(
        type:
            | "eq_operator"
            | "neq_operator"
            | "gt_operator"
            | "gte_operator"
            | "lt_operator"
            | "lte_operator"
            | "add_operator"
            | "sub_operator"
            | "mul_operator"
            | "div_operator",
        other: ExprInput,
    ): Expr {
        return new Expr({ type, left: this._node, right: toAst(other) });
    }
}

function toAst(input: ExprInput): ElevenLabs.AstNodeInput {
    return input instanceof Expr ? input.toModel() : Expr.literal(input).toModel();
}
