import { createHmac } from "node:crypto";
import { describe, expect, it, jest } from "@jest/globals";
import { ElevenLabsClient } from "../../src";

const SECRET = "webhook_secret";
const PAYLOAD = { type: "post_call_transcription", data: { conversation_id: "conv_123" } };
const BODY = JSON.stringify(PAYLOAD);

function sign(timestamp: string, body: string, secret = SECRET): string {
    return `v0=${createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex")}`;
}

function nowSeconds(offsetSeconds = 0): string {
    return String(Math.floor(Date.now() / 1000) + offsetSeconds);
}

describe("webhooks.constructEvent", () => {
    const webhooks = new ElevenLabsClient({ apiKey: "test" }).webhooks;

    it("returns the parsed event for a valid signature", async () => {
        const t = nowSeconds();
        await expect(webhooks.constructEvent(BODY, `t=${t},${sign(t, BODY)}`, SECRET)).resolves.toEqual(PAYLOAD);
    });

    it("accepts the header parts in either order", async () => {
        const t = nowSeconds();
        await expect(webhooks.constructEvent(BODY, `${sign(t, BODY)},t=${t}`, SECRET)).resolves.toEqual(PAYLOAD);
    });

    it("rejects a missing signature header", async () => {
        await expect(webhooks.constructEvent(BODY, "", SECRET)).rejects.toThrow("Missing signature header");
    });

    it("rejects a missing secret", async () => {
        const t = nowSeconds();
        await expect(webhooks.constructEvent(BODY, `t=${t},${sign(t, BODY)}`, "")).rejects.toThrow(
            "Webhook secret not configured",
        );
    });

    it("rejects a header without a timestamp or a v0 signature", async () => {
        const t = nowSeconds();
        for (const header of ["invalid_format", `t=${t}`, sign(t, BODY), `t=${t},v1=${"0".repeat(64)}`]) {
            await expect(webhooks.constructEvent(BODY, header, SECRET)).rejects.toThrow(
                "No signature hash found with expected scheme v0",
            );
        }
    });

    it("rejects a timestamp older than 30 minutes, even when correctly signed", async () => {
        const t = nowSeconds(-31 * 60);
        await expect(webhooks.constructEvent(BODY, `t=${t},${sign(t, BODY)}`, SECRET)).rejects.toThrow(
            "Timestamp outside the tolerance zone",
        );
    });

    it("rejects a timestamp that is not a whole number of seconds, even when correctly signed", async () => {
        // Number("abc") is NaN and `NaN < tolerance` is false, so a non-numeric timestamp used to skip the
        // replay window entirely.
        for (const t of ["abc", "1e12", `${nowSeconds()}.5`]) {
            await expect(webhooks.constructEvent(BODY, `t=${t},${sign(t, BODY)}`, SECRET)).rejects.toThrow();
        }
    });

    it("rejects a signature made with another secret", async () => {
        const t = nowSeconds();
        await expect(webhooks.constructEvent(BODY, `t=${t},${sign(t, BODY, "other")}`, SECRET)).rejects.toThrow(
            "Signature hash does not match the expected signature hash for payload",
        );
    });

    it("rejects a body that differs from the signed one", async () => {
        const t = nowSeconds();
        const tampered = JSON.stringify({ ...PAYLOAD, data: { conversation_id: "conv_456" } });
        await expect(webhooks.constructEvent(tampered, `t=${t},${sign(t, BODY)}`, SECRET)).rejects.toThrow(
            "Signature hash does not match the expected signature hash for payload",
        );
    });

    it("rejects a signature that is not 64 lowercase hex characters", async () => {
        const t = nowSeconds();
        const valid = sign(t, BODY);
        for (const signature of [
            "v0=invalid_signature",
            valid.slice(0, -2),
            `${valid}00`,
            `v0=${valid.slice(3).toUpperCase()}`,
        ]) {
            await expect(webhooks.constructEvent(BODY, `t=${t},${signature}`, SECRET)).rejects.toThrow(
                "Signature hash does not match the expected signature hash for payload",
            );
        }
    });

    it("compares the signature in constant time instead of with string equality", async () => {
        // A `!==` comparison returns as soon as one character differs, which leaks through response timing how
        // many leading characters of a guessed signature are right. Web Crypto's `verify` compares in constant
        // time. This checks the mechanism, since a timing measurement would be flaky in CI.
        const verify = jest.spyOn(globalThis.crypto.subtle, "verify");
        try {
            const t = nowSeconds();
            await webhooks.constructEvent(BODY, `t=${t},${sign(t, BODY)}`, SECRET);
            expect(verify).toHaveBeenCalledTimes(1);
            expect(verify.mock.calls[0]?.[0]).toBe("HMAC");
        } finally {
            verify.mockRestore();
        }
    });
});
