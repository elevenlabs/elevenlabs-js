import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { ElevenLabsClient, FlowsWaitTimeoutError } from "../../src";
import { pollDelayMs, pollTimer } from "../../src/wrapper/flows";

type Reply = { body: Record<string, unknown>; headers?: Record<string, string> };

function makeClient(replies: Reply[]) {
    const seen: Array<{ method: string; path: string }> = [];
    const fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = new URL(typeof input === "string" ? input : input instanceof URL ? input.href : input.url);
        seen.push({ method: init?.method ?? "GET", path: url.pathname });
        const reply = replies.shift();
        if (reply == null) {
            throw new Error(`unexpected request ${url.pathname}`);
        }
        return new Response(JSON.stringify(reply.body), {
            status: 200,
            headers: { "Content-Type": "application/json", ...reply.headers },
        });
    };
    const client = new ElevenLabsClient({
        apiKey: "test",
        baseUrl: "https://api.test",
        fetch: fetch as typeof globalThis.fetch,
    });
    return { client, seen };
}

function run(status: string) {
    return { id: "run_1", template_id: "tpl_1", version_id: "ver_1", status, outputs: {} };
}

const COMPLETED_IMAGE = {
    id: "gen_1",
    status: "completed",
    content_url: "https://cdn.test/out.png",
    content_mime_type: "image/png",
};

describe("flows createAndWait", () => {
    let sleeps: number[];

    beforeEach(() => {
        sleeps = [];
        jest.spyOn(Math, "random").mockReturnValue(0);
        jest.spyOn(pollTimer, "sleep").mockImplementation(async (ms: number) => {
            sleeps.push(ms);
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("pollDelayMs uses Retry-After, never below the minimum, with jitter", () => {
        expect(pollDelayMs(new Headers({ "Retry-After": "5" }), 1)).toBe(5000);
        expect(pollDelayMs(new Headers(), 2)).toBe(2000);
        expect(pollDelayMs(new Headers({ "Retry-After": "0" }), 2)).toBe(2000);
        expect(pollDelayMs(new Headers({ "Retry-After": "garbage" }), 2)).toBe(2000);
        jest.spyOn(Math, "random").mockReturnValue(0.5);
        expect(pollDelayMs(new Headers({ "Retry-After": "10" }), 1)).toBe(11000);
    });

    it("polls an image generation until completed, honouring Retry-After", async () => {
        const { client, seen } = makeClient([
            { body: { id: "gen_1", status: "pending" }, headers: { "Retry-After": "3" } },
            { body: { id: "gen_1", status: "generating" }, headers: { "Retry-After": "7" } },
            { body: COMPLETED_IMAGE },
        ]);

        const result = await client.flows.image.createAndWait({
            modelId: "bytedance-seedream-5-lite",
            prompt: "a corgi",
        });

        expect(result.status).toBe("completed");
        expect(sleeps).toEqual([3000, 7000]);
        expect(seen).toEqual([
            { method: "POST", path: "/v1/flows/image" },
            { method: "GET", path: "/v1/flows/image/gen_1" },
            { method: "GET", path: "/v1/flows/image/gen_1" },
        ]);
    });

    it("returns a failed generation instead of throwing", async () => {
        const { client, seen } = makeClient([
            { body: { id: "gen_1", status: "pending" } },
            { body: { id: "gen_1", status: "failed", failure_reason: "content_moderation", error_message: "nope" } },
        ]);

        const result = await client.flows.video.createAndWait({ modelId: "bytedance-seedance-v2", prompt: "a corgi" });

        expect(result.status).toBe("failed");
        expect(sleeps).toEqual([1000]);
        expect(seen[1]).toEqual({ method: "GET", path: "/v1/flows/video/gen_1" });
    });

    it("throws FlowsWaitTimeoutError carrying the generation id", async () => {
        const { client, seen } = makeClient([
            { body: { id: "gen_1", status: "pending" }, headers: { "Retry-After": "30" } },
            { body: { id: "gen_1", status: "generating" }, headers: { "Retry-After": "30" } },
        ]);
        const now = jest.spyOn(Date, "now");
        now.mockReturnValueOnce(0).mockReturnValueOnce(0).mockReturnValue(10_000);

        const error = await client.flows.textToSpeech
            .createAndWait(
                { modelId: "eleven_flash_v2_5", text: "hi", voice: "JBFqnCBsd6RMkjVDRZzb" },
                { waitTimeoutInSeconds: 10 },
            )
            .catch((e: unknown) => e);

        expect(error).toBeInstanceOf(FlowsWaitTimeoutError);
        const timeoutError = error as FlowsWaitTimeoutError;
        expect(timeoutError.id).toBe("gen_1");
        expect(timeoutError.templateId).toBeUndefined();
        expect(timeoutError.lastResponse.status).toBe("generating");
        // The last sleep is cut short to land on the deadline, then one final GET runs.
        expect(sleeps).toEqual([10_000]);
        expect(seen).toHaveLength(2);
    });

    it("waits for a template run", async () => {
        const { client, seen } = makeClient([
            { body: run("pending"), headers: { "Retry-After": "2" } },
            { body: run("completed") },
        ]);

        const result = await client.flows.templates.runs.createAndWait("tpl_1", { inputs: {} });

        expect(result.status).toBe("completed");
        expect(sleeps).toEqual([2000]);
        expect(seen).toEqual([
            { method: "POST", path: "/v1/flows/templates/tpl_1/runs" },
            { method: "GET", path: "/v1/flows/templates/tpl_1/runs/run_1" },
        ]);
    });

    it("skips polling when the run is already terminal", async () => {
        const { client, seen } = makeClient([{ body: run("completed") }]);

        const result = await client.flows.templates.runs.createAndWait("tpl_1", { inputs: {} });

        expect(result.status).toBe("completed");
        expect(sleeps).toEqual([]);
        expect(seen).toHaveLength(1);
    });

    it("carries templateId on a template run timeout", async () => {
        const { client } = makeClient([{ body: run("pending") }]);

        const error = await client.flows.templates.runs
            .createAndWait("tpl_1", { inputs: {} }, { waitTimeoutInSeconds: 0 })
            .catch((e: unknown) => e);

        expect(error).toBeInstanceOf(FlowsWaitTimeoutError);
        expect((error as FlowsWaitTimeoutError).id).toBe("run_1");
        expect((error as FlowsWaitTimeoutError).templateId).toBe("tpl_1");
    });
});
