import { AgentWorkflowRequestModel } from "../../../src/serialization";

describe("AgentWorkflowRequestModel", () => {
    it("serializes flat LLM AST nodes in expression edge conditions", () => {
        const workflow = {
            edges: {
                edge_01kqshbn29fagvdxghkpwgae5n: {
                    source: "start_node",
                    target: "booking_node",
                    forwardCondition: {
                        type: "expression",
                        expression: {
                            type: "and_operator",
                            children: [
                                {
                                    type: "neq_operator",
                                    left: { type: "dynamic_variable", name: "system__caller_id" },
                                    right: { type: "null_literal" },
                                },
                                {
                                    type: "llm",
                                    valueSchema: {
                                        type: "boolean",
                                        description: "customer expressed intention to book an appointment",
                                    },
                                    prompt: "customer expressed intention to book an appointment",
                                },
                            ],
                        },
                    },
                },
            },
        };

        const raw = AgentWorkflowRequestModel.jsonOrThrow(workflow, {
            unrecognizedObjectKeys: "strip",
        });

        expect(
            raw.edges?.edge_01kqshbn29fagvdxghkpwgae5n.forward_condition?.expression,
        ).toEqual({
            type: "and_operator",
            children: [
                {
                    type: "neq_operator",
                    left: { type: "dynamic_variable", name: "system__caller_id" },
                    right: { type: "null_literal" },
                },
                {
                    type: "llm",
                    value_schema: {
                        type: "boolean",
                        description: "customer expressed intention to book an appointment",
                    },
                },
            ],
        });
    });
});
