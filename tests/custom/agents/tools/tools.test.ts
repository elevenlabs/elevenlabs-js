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
    it("can be shared by tools, and editing one tool's copy leaves the others alone", () => {
        const orderId = Schema.string().describe("The order number");
        const lookup = Tool.webhook("lookup", "Look up").get("https://api.example.com/{id}").pathParam("id", orderId);
        const cancel = Tool.webhook("cancel", "Cancel")
            .post("https://api.example.com/cancel")
            .body(Schema.object().property("id", orderId));

        const body = cancel.bodySchema as ReturnType<typeof Schema.object>;
        cancel.body(body.property("id", orderId.optional()));

        const lookupParams = (lookup.toJSON().api_schema as Record<string, unknown>).path_params_schema;
        expect(lookupParams).toEqual({ id: { description: "The order number", type: "string" } });
        expect((cancel.toJSON().api_schema as { request_body_schema: object }).request_body_schema).toEqual({
            properties: { id: { description: "The order number", type: "string" } },
            type: "object",
        });
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

    it("needs a value source on every literal, in the response schema and under any container", () => {
        const issues = issuesOf(() =>
            Tool.webhook("save", "Save")
                .post("https://api.example.com/save")
                .queryParam("q", Schema.string())
                .body(
                    Schema.object().property(
                        "profile",
                        Schema.object().fromVariable("profile").property("name", Schema.string()),
                    ),
                )
                .response(Schema.object().property("status", Schema.string()))
                .build(),
        );
        expect(issues.map((issue) => [issue.code, issue.path])).toEqual([
            ["missing_value_source", "query.q"],
            ["missing_value_source", "body.profile.name"],
            ["missing_value_source", "response.status"],
        ]);
    });

    it("requires a body on POST, PUT and PATCH, allows one on DELETE, and forbids one on GET", () => {
        const body = Schema.object().property("note", Schema.string().describe("A note"));
        const url = "https://api.example.com/notes";
        const codes = (tool: ReturnType<typeof Tool.webhook>) => issuesOf(() => tool.build()).map((i) => i.code);
        for (const method of ["post", "put", "patch"] as const) {
            expect(codes(Tool.webhook("t", "T")[method](url))).toEqual(["missing_body"]);
            expect(() => Tool.webhook("t", "T")[method](url).body(body).build()).not.toThrow();
        }
        expect(() => Tool.webhook("t", "T").delete(url).build()).not.toThrow();
        expect(() => Tool.webhook("t", "T").delete(url).body(body).build()).not.toThrow();
        expect(codes(Tool.webhook("t", "T").get(url).body(body))).toEqual(["body_not_allowed"]);
        expect(() =>
            Tool.webhook("t", "T").get(url).options({ contentType: "application/json" }).build(),
        ).not.toThrow();
    });

    it("needs param names unique across path, query and body", () => {
        const issues = issuesOf(() =>
            Tool.webhook("t", "T")
                .post("https://api.example.com/orders")
                .queryParam("id", Schema.string().describe("Id"))
                .body(Schema.object().property("id", Schema.string().describe("Id")))
                .build(),
        );
        expect(issues.map((issue) => [issue.code, issue.path])).toEqual([["duplicate_param", "body.id"]]);
    });

    it("accepts response timeouts from 5 to 300 seconds", () => {
        const timeout = (secs: number) => () => getOrder().options({ responseTimeoutSecs: secs }).build();
        expect(timeout(5)).not.toThrow();
        expect(timeout(300)).not.toThrow();
        expect(issuesOf(timeout(4)).map((i) => i.code)).toEqual(["invalid_option"]);
        expect(issuesOf(timeout(301)).map((i) => i.code)).toEqual(["invalid_option"]);
    });

    it("follows redirects only to an allowed list of domains", () => {
        const redirects = (domains?: string[]) => () =>
            getOrder().options({ followRedirects: true, followRedirectsAllowedDomains: domains }).build();
        expect(redirects(["example.com"])).not.toThrow();
        expect(issuesOf(redirects()).map((i) => i.code)).toEqual(["invalid_option"]);
    });

    it("switches a loaded param's value source by replacing the property in place", () => {
        const loaded = Tool.fromJSON(
            Tool.webhook("refund", "Refund")
                .post("https://api.example.com/refunds")
                .body(
                    Schema.object()
                        .property("order_id", Schema.string().describe("The order number"))
                        .property("reason", Schema.string().describe("Why")),
                )
                .toJSON(),
        ).asWebhook() as NonNullable<ReturnType<Tool["asWebhook"]>>;
        const body = loaded.bodySchema as ReturnType<typeof Schema.object>;
        loaded.body(body.property("order_id", Schema.string().fromVariable("order_id")));
        expect((loaded.toJSON().api_schema as { request_body_schema: object }).request_body_schema).toEqual({
            properties: {
                order_id: { dynamic_variable: "order_id", type: "string" },
                reason: { description: "Why", type: "string" },
            },
            required: ["order_id", "reason"],
            type: "object",
        });
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

    it("accepts response timeouts from 1 to 120 seconds, or -1 to wait forever with expectsResponse", () => {
        const timeout = (options: object) => () => Tool.client("wait", "Wait").options(options).build();
        expect(timeout({ responseTimeoutSecs: 1 })).not.toThrow();
        expect(timeout({ responseTimeoutSecs: 120 })).not.toThrow();
        expect(timeout({ responseTimeoutSecs: -1, expectsResponse: true })).not.toThrow();
        for (const options of [{ responseTimeoutSecs: 0 }, { responseTimeoutSecs: 121 }, { responseTimeoutSecs: -1 }]) {
            expect(issuesOf(timeout(options)).map((issue) => issue.code)).toEqual(["invalid_option"]);
        }
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

    it("transfers to a SIP URI only with a SIP REFER", () => {
        const sip = Destination.sip("sip:sales@pbx.example.com");
        expect(() =>
            SystemTool.transferToNumber().transfer("Caller wants sales", sip, { transferType: "sip_refer" }).build(),
        ).not.toThrow();
        const issues = issuesOf(() => SystemTool.transferToNumber().transfer("Caller wants sales", sip).build());
        expect(issues.map((issue) => issue.code)).toEqual(["invalid_destination", "no_transfers"]);
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
