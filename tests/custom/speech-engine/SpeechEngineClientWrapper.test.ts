import { SpeechEngineClient } from "../../../src/api/resources/speechEngine/client/Client";
import { ElevenLabsClient } from "../../../src/wrapper/ElevenLabsClient";
import { SpeechEngineClientWrapper } from "../../../src/wrapper/speech-engine/SpeechEngineClientWrapper";
import { SpeechEngineResource } from "../../../src/wrapper/speech-engine/SpeechEngineResource";

const TEST_OPTIONS = { apiKey: "test-key" };

describe("SpeechEngineClientWrapper", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe("create", () => {
        it("returns a SpeechEngineResource with the ID from the API response", async () => {
            const wrapper = new SpeechEngineClientWrapper(TEST_OPTIONS);
            jest.spyOn(SpeechEngineClient.prototype, "create").mockResolvedValue({
                speechEngineId: "seng_abc",
            } as any);

            const result = await wrapper.create({ speechEngine: { wsUrl: "wss://test" } });

            expect(result).toBeInstanceOf(SpeechEngineResource);
            expect(result.engineId).toBe("seng_abc");
        });
    });

    describe("get", () => {
        it("returns a SpeechEngineResource with the requested ID", async () => {
            const wrapper = new SpeechEngineClientWrapper(TEST_OPTIONS);
            jest.spyOn(SpeechEngineClient.prototype, "get").mockResolvedValue({} as any);

            const result = await wrapper.get("seng_abc");

            expect(result).toBeInstanceOf(SpeechEngineResource);
            expect(result.engineId).toBe("seng_abc");
        });
    });

    describe("update", () => {
        it("returns a SpeechEngineResource with the requested ID", async () => {
            const wrapper = new SpeechEngineClientWrapper(TEST_OPTIONS);
            jest.spyOn(SpeechEngineClient.prototype, "update").mockResolvedValue({} as any);

            const result = await wrapper.update("seng_abc", { name: "Renamed" });

            expect(result).toBeInstanceOf(SpeechEngineResource);
            expect(result.engineId).toBe("seng_abc");
        });
    });

    describe("duplicate", () => {
        it("returns a SpeechEngineResource with the copy's ID from the API response", async () => {
            const wrapper = new SpeechEngineClientWrapper(TEST_OPTIONS);
            jest.spyOn(SpeechEngineClient.prototype, "duplicate").mockResolvedValue({
                speechEngineId: "seng_copy",
            } as any);

            const result = await wrapper.duplicate("seng_abc", { name: "Copy" });

            expect(result).toBeInstanceOf(SpeechEngineResource);
            expect(result.engineId).toBe("seng_copy");
        });
    });

    describe("list and delete", () => {
        it("returns the generated client promises without awaiting them", () => {
            const wrapper = new SpeechEngineClientWrapper(TEST_OPTIONS);
            const listPromise = Promise.resolve({ speechEngines: [] });
            const deletePromise = Promise.resolve(undefined);
            jest.spyOn(SpeechEngineClient.prototype, "list").mockReturnValue(
                listPromise as unknown as ReturnType<SpeechEngineClient["list"]>,
            );
            jest.spyOn(SpeechEngineClient.prototype, "delete").mockReturnValue(
                deletePromise as unknown as ReturnType<SpeechEngineClient["delete"]>,
            );

            expect(wrapper.list()).toBe(listPromise);
            expect(wrapper.delete("seng_abc")).toBe(deletePromise);
        });
    });
});

describe("ElevenLabsClient.speechEngine", () => {
    it("returns the wrapper and reuses the same instance", () => {
        const client = new ElevenLabsClient({ apiKey: "test-key" });
        const engine = client.speechEngine;

        expect(engine).toBeInstanceOf(SpeechEngineClientWrapper);
        expect(engine).not.toBeInstanceOf(SpeechEngineClient);
        expect(client.speechEngine).toBe(engine);
    });
});
