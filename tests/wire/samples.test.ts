/**
 * This file was auto-generated by Fern from our API Definition.
 */

import { mockServerPool } from "../mock-server/MockServerPool";
import { ElevenLabsClient } from "../../src/Client";

describe("Samples", () => {
    test("delete", async () => {
        const server = mockServerPool.createServer();
        const client = new ElevenLabsClient({ apiKey: "test", environment: server.baseUrl });

        const rawResponseBody = { status: "ok" };
        server
            .mockEndpoint()
            .delete("/v1/voices/21m00Tcm4TlvDq8ikWAM/samples/VW7YKqPnjY4h39yTbx2L")
            .respondWith()
            .statusCode(200)
            .jsonBody(rawResponseBody)
            .build();

        const response = await client.samples.delete("21m00Tcm4TlvDq8ikWAM", "VW7YKqPnjY4h39yTbx2L");
        expect(response).toEqual({
            status: "ok",
        });
    });
});
