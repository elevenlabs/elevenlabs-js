/**
 * This file was auto-generated by Fern from our API Definition.
 */

import { mockServerPool } from "../../../mock-server/MockServerPool";
import { ElevenLabsClient } from "../../../../src/Client";

describe("Segment", () => {
    test("update", async () => {
        const server = mockServerPool.createServer();
        const client = new ElevenLabsClient({ apiKey: "test", environment: server.baseUrl });
        const rawRequestBody = {};
        const rawResponseBody = { version: 1 };
        server
            .mockEndpoint()
            .patch("/v1/dubbing/resource/dubbing_id/segment/segment_id/language")
            .jsonBody(rawRequestBody)
            .respondWith()
            .statusCode(200)
            .jsonBody(rawResponseBody)
            .build();

        const response = await client.dubbing.resource.segment.update("dubbing_id", "segment_id", "language");
        expect(response).toEqual({
            version: 1,
        });
    });

    test("delete", async () => {
        const server = mockServerPool.createServer();
        const client = new ElevenLabsClient({ apiKey: "test", environment: server.baseUrl });

        const rawResponseBody = { version: 1 };
        server
            .mockEndpoint()
            .delete("/v1/dubbing/resource/dubbing_id/segment/segment_id")
            .respondWith()
            .statusCode(200)
            .jsonBody(rawResponseBody)
            .build();

        const response = await client.dubbing.resource.segment.delete("dubbing_id", "segment_id");
        expect(response).toEqual({
            version: 1,
        });
    });
});
