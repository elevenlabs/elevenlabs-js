import type * as ElevenLabs from "../../../api/index";
import { Expr } from "./Expr";
import { defined } from "./util";

export type ConditionModel = ElevenLabs.WorkflowEdgeModelInputForwardCondition;

export interface ConditionOptions {
    /** Label shown on the edge in the workflow editor. */
    label?: string;
}

/**
 * When an edge may be followed. A plain string passed to `when()` is shorthand for `Condition.llm()`,
 * and an `Expr` is shorthand for `Condition.expr()`.
 */
export class Condition {
    private readonly _model: ConditionModel;

    private constructor(model: ConditionModel) {
        this._model = model;
    }

    /** Followed when the LLM judges `condition` to be true. */
    static llm(condition: string, options: ConditionOptions = {}): Condition {
        return new Condition({ type: "llm", condition, ...defined(options) });
    }

    /** Followed when `expression` evaluates to true. */
    static expr(expression: Expr, options: ConditionOptions = {}): Condition {
        return new Condition({ type: "expression", expression: expression.toModel(), ...defined(options) });
    }

    /** Always followed. */
    static always(options: ConditionOptions = {}): Condition {
        return new Condition({ type: "unconditional", ...defined(options) });
    }

    /** Followed when every tool in a tool node succeeded. */
    static success(options: ConditionOptions = {}): Condition {
        return new Condition({ type: "result", successful: true, ...defined(options) });
    }

    /** Followed when any tool in a tool node failed. */
    static failure(options: ConditionOptions = {}): Condition {
        return new Condition({ type: "result", successful: false, ...defined(options) });
    }

    toModel(): ConditionModel {
        return this._model;
    }
}

/** A value accepted wherever a condition is expected. */
export type ConditionInput = Condition | Expr | string;

export function toCondition(input: ConditionInput): Condition {
    if (input instanceof Condition) {
        return input;
    }
    if (input instanceof Expr) {
        return Condition.expr(input);
    }
    return Condition.llm(input);
}
