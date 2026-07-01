import { SpeechEngineClient } from "../../../src/api/resources/speechEngine/client/Client";
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
});
