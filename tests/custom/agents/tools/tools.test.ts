import type * as ElevenLabs from "../../../../src/api/index";
import {
    Header,
    Schema,
    SystemTool,
    Tool,
    type ToolIssue,
    ToolValidationError,
} from "../../../../src/wrapper/agents/tools";
import { Destination } from "../../../../src/wrapper/agents/workflow";

function getOrder(): ReturnType<typeof Tool.webhook> {
    return Tool.webhook("get_order", "Look up an order")
        .get("https://api.example.com/orders/{order_id}")
        .pathParam("order_id", Schema.string().describe("The order number"));
}

function issuesOf(fn: () => unknown): ToolIssue[] {
    try {
        fn();
    } catch (err) {
        if (err instanceof ToolValidationError) {
            return err.issues;
        }
        throw err;
    }
    throw new Error("expected a ToolValidationError");
}

describe("Schema", () => {
    it("returns a new schema from every method, so one can be reused", () => {
        const id = Schema.string().describe("An id");
        const optionalId = id.optional();
        expect(id.isOptional).toBe(false);
        expect(optionalId.isOptional).toBe(true);

        const base = Schema.object().property("a", id);
        const extended = base.property("b", id);
        expect(base.propertyNames).toEqual(["a"]);
        expect(extended.propertyNames).toEqual(["a", "b"]);
    });

    it("keeps its subclass through chaining", () => {
        const schema = Schema.string().describe("Pick one").choices(["a", "b"]).optional();
        expect(schema.kind).toBe("string");
        expect(schema.toJSON()).toEqual({ description: "Pick one", enum: ["a", "b"], type: "string" });
    });

    it("round-trips through fromJSON and toJSON", () => {
        const json = {
            properties: {
                items: { items: { description: "A sku", type: "string" }, type: "array" },
                total: { description: "Total", type: "number" },
            },
            required: ["total"],
            type: "object",
        };
        expect(Schema.fromJSON(json).toJSON()).toEqual(json);
        expect(Schema.fromJSON(JSON.stringify(json)).toJSON()).toEqual(json);
    });

    it("loads properties not in required as optional", () => {
        const schema = Schema.fromJSON({
            properties: { a: { type: "string" }, b: { type: "string" } },
            required: ["a"],
            type: "object",
        });
        expect(schema.kind).toBe("object");
        const object = schema as ReturnType<typeof Schema.object>;
        expect(object.propertySchema("a")?.isOptional).toBe(false);
        expect(object.propertySchema("b")?.isOptional).toBe(true);
    });
});

describe("WebhookTool", () => {
    it("builds the SDK request model", () => {
        const request = getOrder()
            .header("Authorization", Header.secret("sec_1"))
            .options({ responseTimeoutSecs: 10 })
            .build();
        expect(request).toEqual({
            toolConfig: {
                type: "webhook",
                name: "get_order",
                description: "Look up an order",
                responseTimeoutSecs: 10,
                apiSchema: {
                    method: "GET",
                    url: "https://api.example.com/orders/{order_id}",
                    pathParamsSchema: { order_id: { type: "string", description: "The order number" } },
                    requestHeaders: { Authorization: { secretId: "sec_1" } },
                },
            },
        });
    });

    it("replaces a param with the same name in place", () => {
        const tool = Tool.webhook("search", "Search")
            .get("https://api.example.com/search")
            .queryParam("q", Schema.string().describe("Query"))
            .queryParam("limit", Schema.integer().constant(10))
            .queryParam("q", Schema.string().describe("Search terms"));
        const query = (tool.toJSON().api_schema as Record<string, unknown>).query_params_schema;
        expect(query).toEqual({
            properties: {
                limit: { constant_value: 10, type: "integer" },
                q: { description: "Search terms", type: "string" },
            },
            required: ["q", "limit"],
        });
    });

    it("removes params, headers and assignments", () => {
        const tool = getOrder()
            .queryParam("q", Schema.string().describe("Query"))
            .header("X-A", Header.value("1"))
            .assign("a", "a")
            .assign("b", "b")
            .removeQueryParam("q")
            .removeHeader("X-A")
            .removeAssignment("a");
        const json = tool.toJSON();
        const api = json.api_schema as Record<string, unknown>;
        expect(api.query_params_schema).toBeUndefined();
        expect(api.request_headers).toBeUndefined();
        expect(json.assignments).toEqual([{ dynamic_variable: "b", source: "response", value_path: "b" }]);
    });

    it("exposes the body schema for editing", () => {
        const tool = Tool.webhook("refund", "Refund")
            .post("https://api.example.com/refunds")
            .body(Schema.object().property("a", Schema.string().describe("A")));
        const body = tool.bodySchema as ReturnType<typeof Schema.object>;
        tool.body(body.without("a").property("b", Schema.string().describe("B")));
        const api = tool.toJSON().api_schema as Record<string, unknown>;
        expect(api.request_body_schema).toEqual({
            properties: { b: { description: "B", type: "string" } },
            required: ["b"],
            type: "object",
        });
    });

    it("reports every problem at once, with paths", () => {
        const issues = issuesOf(() =>
            Tool.webhook("broken", "Broken")
                .get("https://api.example.com/{a}")
                .pathParam("b", Schema.string().describe("B").fromVariable("b"))
                .build(),
        );
        expect(issues.map((issue) => [issue.code, issue.path])).toEqual([
            ["missing_path_param", "pathParams.a"],
            ["unknown_path_param", "pathParams.b"],
            ["conflicting_value_source", "pathParams.b"],
        ]);
    });

    it("names the tool and lists the problems in the error message", () => {
        expect(() => Tool.webhook("broken", "Broken").build()).toThrow(
            'Invalid tool "broken":\n  - Set the method and URL with get(), post(), put(), patch() or delete()',
        );
    });

    it("warns about literals with no description, but not in the response schema", () => {
        const warnings: ToolIssue[] = [];
        getOrder()
            .queryParam("q", Schema.string())
            .response(Schema.object().property("status", Schema.string()))
            .build({ onWarning: (issue) => warnings.push(issue) });
        expect(warnings.map((w) => [w.code, w.path])).toEqual([["missing_description", "query.q"]]);
    });

    it("doesn't look inside a container whose value comes from a variable", () => {
        const warnings: ToolIssue[] = [];
        Tool.webhook("save", "Save")
            .post("https://api.example.com/save")
            .body(
                Schema.object().property(
                    "profile",
                    Schema.object().fromVariable("profile").property("name", Schema.string()),
                ),
            )
            .build({ onWarning: (issue) => warnings.push(issue) });
        expect(warnings).toEqual([]);
    });

    it("is what JSON.stringify writes", () => {
        const tool = getOrder();
        expect(JSON.parse(JSON.stringify(tool))).toEqual(tool.toJSON());
        expect(tool.toJSONString()).toBe(`${JSON.stringify(tool.toJSON(), null, 2)}\n`);
    });
});

describe("ClientTool", () => {
    it("removes params", () => {
        const tool = Tool.client("show", "Show something")
            .param("a", Schema.string().describe("A"))
            .param("b", Schema.string().describe("B"))
            .removeParam("a");
        expect(tool.parametersSchema?.propertyNames).toEqual(["b"]);
    });

    it("leaves parameters out when there are none", () => {
        expect(Tool.client("ping", "Ping the client").toJSON()).toEqual({
            description: "Ping the client",
            name: "ping",
            type: "client",
        });
    });

    it("needs expectsResponse to wait forever", () => {
        const issues = issuesOf(() => Tool.client("wait", "Wait").options({ responseTimeoutSecs: -1 }).build());
        expect(issues.map((issue) => issue.code)).toEqual(["invalid_option"]);
    });
});

describe("SystemTool", () => {
    it("builds an entry for prompt.builtInTools", () => {
        const config = SystemTool.endCall().buildConfig();
        expect(config).toEqual({ type: "system", name: "end_call", params: { systemToolType: "end_call" } });
    });

    it("rejects transfer() on a tool that doesn't transfer", () => {
        const issues = issuesOf(() =>
            SystemTool.endCall().transfer("Caller asks", Destination.phone("+15551234567")).build(),
        );
        expect(issues.map((issue) => issue.code)).toEqual(["invalid_option"]);
    });

    it("rejects options of the other transfer kind", () => {
        const issues = issuesOf(() =>
            SystemTool.transferToAgent()
                .transfer("Caller wants sales", Destination.agent("agent_sales"), { transferType: "conference" })
                .build(),
        );
        expect(issues.map((issue) => [issue.code, issue.path])).toEqual([["invalid_option", "transferType"]]);
    });
});

describe("loading", () => {
    it("loads a request or a response wrapper with a tool_config key", () => {
        const config = getOrder().toJSON();
        expect(Tool.fromJSON({ tool_config: config }).toJSON()).toEqual(config);
        expect(Tool.fromJSON(JSON.stringify(config)).toJSON()).toEqual(config);
    });

    it("loads the result of tools.get()", () => {
        const response = {
            id: "tool_1",
            toolConfig: getOrder().buildConfig(),
        } as unknown as ElevenLabs.ToolResponseModel;
        const tool = Tool.fromResponse(response);
        expect(tool.kind).toBe("webhook");
        expect(tool.toJSON()).toEqual(getOrder().toJSON());
    });

    it("types a loaded tool with asWebhook(), asClient() and asSystem()", () => {
        const tool = Tool.fromJSON(getOrder().toJSON());
        expect(tool.asWebhook()).toBe(tool);
        expect(tool.asClient()).toBeUndefined();
        expect(Tool.fromJSON(SystemTool.endCall().toJSON()).asSystem()?.systemToolType).toBe("end_call");
    });

    it("keeps a tool of an unknown type, and warns when it's built", () => {
        const raw = { name: "search", type: "mcp", mcp_server_id: "mcp_1" };
        const tool = Tool.fromJSON(raw);
        expect(tool.kind).toBe("other");
        expect(tool.asWebhook()).toBeUndefined();
        const warnings: ToolIssue[] = [];
        tool.build({ onWarning: (issue) => warnings.push(issue) });
        expect(warnings.map((w) => w.code)).toEqual(["unknown_tool_type"]);
        expect(tool.toJSON()).toEqual({ mcp_server_id: "mcp_1", name: "search", type: "mcp" });
    });

    it("keeps a loaded system tool type the builder has no constructor for", () => {
        const raw = {
            name: "start_procedure",
            params: { procedures: { refund: { procedure_id: "proc_1" } }, system_tool_type: "start_procedure" },
            type: "system",
        };
        const tool = Tool.fromJSON(raw);
        expect(tool.asSystem()?.systemToolType).toBe("start_procedure");
        expect(tool.toJSON()).toEqual(raw);
    });
});
