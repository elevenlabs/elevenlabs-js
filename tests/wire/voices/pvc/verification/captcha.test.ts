/**
 * This file was auto-generated by Fern from our API Definition.
 */

import { mockServerPool } from "../../../../mock-server/MockServerPool";
import { ElevenLabsClient } from "../../../../../src/Client";

describe("Captcha", () => {
    test("get", async () => {
        const server = mockServerPool.createServer();
        const client = new ElevenLabsClient({ apiKey: "test", environment: server.baseUrl });

        server.mockEndpoint().get("/v1/voices/pvc/21m00Tcm4TlvDq8ikWAM/captcha").respondWith().statusCode(200).build();

        const response = await client.voices.pvc.verification.captcha.get("21m00Tcm4TlvDq8ikWAM");
        expect(response).toEqual(undefined);
    });
});
