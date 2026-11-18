import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { dispatchTool, type ToolBackend, type ToolContext } from "../../../docs/agents-as-code/examples/tool-contracts";

describe("offline application tool contracts", () => {
    let backend: jest.Mocked<ToolBackend>;
    const context: ToolContext = { allowedReference: "ORD-0001", canRequestReview: false };
    const args = { reference: "ORD-0001" };
    beforeEach(() => {
        backend = {
            lookup: jest.fn<ToolBackend["lookup"]>().mockResolvedValue({ reference: "ORD-0001", status: "held" }),
            requestReview: jest.fn<ToolBackend["requestReview"]>().mockResolvedValue({
                reference: "ORD-0001",
                review_id: "REV-0001",
                status: "pending_review",
            }),
        };
    });

    it("returns only exact validated facts", async () => {
        expect(await dispatchTool("lookup_order", args, context, backend)).toEqual({
            outcome: "known",
            facts: { reference: "ORD-0001", status: "held" },
        });
        expect(backend.lookup).toHaveBeenCalledWith("ORD-0001");
    });
    it.each([
        null,
        {},
        [],
        "ORD-0001",
        { reference: 1 },
        { reference: true },
        { reference: "ORD-0001\n" },
        { reference: "ORD-0001", authorized: true },
        { reference: "ORD-١٢٣٤" },
    ])("rejects malformed arguments before calling the backend: %j", async (input) => {
        expect(await dispatchTool("lookup_order", input, context, backend)).toEqual({ outcome: "invalid_arguments" });
        expect(backend.lookup).not.toHaveBeenCalled();
        expect(backend.requestReview).not.toHaveBeenCalled();
    });
    it.each(["lookup_order", "request_review"])("checks resource scope before %s", async (name) => {
        expect(
            await dispatchTool(name, { reference: "ORD-0002" }, { ...context, canRequestReview: true }, backend),
        ).toEqual({ outcome: "forbidden" });
        expect(backend.lookup).not.toHaveBeenCalled();
        expect(backend.requestReview).not.toHaveBeenCalled();
    });
    it("rejects unknown tools without backend effects", async () => {
        expect(await dispatchTool("delete_order", args, context, backend)).toEqual({ outcome: "invalid_tool" });
        expect(backend.lookup).not.toHaveBeenCalled();
        expect(backend.requestReview).not.toHaveBeenCalled();
    });
    it("requires a trusted capability for review", async () => {
        expect(await dispatchTool("request_review", args, context, backend)).toEqual({ outcome: "forbidden" });
        expect(backend.requestReview).not.toHaveBeenCalled();
    });
    it.each([
        {},
        undefined,
        [],
        { reference: "ORD-0002", status: "held" },
        { reference: "ORD-0001", status: null },
        { reference: "ORD-0001", status: "released" },
        { reference: "ORD-0001", status: "held", private: "hidden" },
    ])("rejects malformed backend facts: %j", async (result) => {
        backend.lookup.mockResolvedValue(result);
        expect(await dispatchTool("lookup_order", args, context, backend)).toEqual({ outcome: "invalid_response" });
    });
    it("keeps unknown records separate from failures and never reuses stale facts", async () => {
        backend.lookup
            .mockResolvedValueOnce({ reference: "ORD-0001", status: "held" })
            .mockRejectedValueOnce(new Error("private backend details"))
            .mockResolvedValueOnce(null);
        expect((await dispatchTool("lookup_order", args, context, backend)).outcome).toBe("known");
        expect(await dispatchTool("lookup_order", args, context, backend)).toEqual({ outcome: "unavailable" });
        expect(await dispatchTool("lookup_order", args, context, backend)).toEqual({
            outcome: "unknown",
            reference: "ORD-0001",
        });
    });
    it("reports a valid review as pending, not approved", async () => {
        expect(await dispatchTool("request_review", args, { ...context, canRequestReview: true }, backend)).toEqual({
            outcome: "pending_review",
            facts: { reference: "ORD-0001", review_id: "REV-0001", status: "pending_review" },
        });
    });
    it.each([
        null,
        {},
        { reference: "ORD-0002", review_id: "REV-0001", status: "pending_review" },
        { reference: "ORD-0001", review_id: "REV-0001", status: "approved" },
        { reference: "ORD-0001", review_id: "REV-0001\n", status: "pending_review" },
    ])("rejects invalid review confirmations: %j", async (result) => {
        backend.requestReview.mockResolvedValue(result);
        expect(await dispatchTool("request_review", args, { ...context, canRequestReview: true }, backend)).toEqual({
            outcome: "invalid_response",
        });
    });
    it("does not retry a failed write or leak its exception", async () => {
        backend.requestReview.mockRejectedValue(new Error("private token or backend detail"));
        expect(await dispatchTool("request_review", args, { ...context, canRequestReview: true }, backend)).toEqual({
            outcome: "unavailable",
        });
        expect(backend.requestReview).toHaveBeenCalledTimes(1);
    });
});
