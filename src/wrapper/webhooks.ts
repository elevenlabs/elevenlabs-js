import { webcrypto as nodeWebcrypto } from "crypto";
import { ElevenLabsError } from "../errors";
import { WebhooksClient as Webhooks } from "../api/resources/webhooks/client/Client";

const crypto = globalThis.crypto ?? nodeWebcrypto;

// Async HMAC-SHA256 using Web Crypto API
async function hmacSHA256(key: string, message: string): Promise<string> {
    const enc = new TextEncoder();
    const keyData = enc.encode(key);
    const msgData = enc.encode(message);
    const cryptoKey = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const sig = await crypto.subtle.sign("HMAC", cryptoKey, msgData);
    return (
        "v0=" +
        Array.from(new Uint8Array(sig))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("")
    );
}

/**
 * Extended webhook client that includes both auto-generated API methods and custom functionality
 */
export class WebhooksClient extends Webhooks {
    /**
     * Constructs a webhook event object from a payload and signature.
     * Verifies the webhook signature to ensure the event came from ElevenLabs.
     *
     * @param rawBody - The webhook request body. Must be the raw body, not a JSON object
     * @param sigHeader - The signature header from the request
     * @param secret - Your webhook secret
     * @returns The verified webhook event
     * @throws {ElevenLabsError} if the signature is invalid or missing
     */
    async constructEvent(rawBody: string, sigHeader: string, secret: string): Promise<any> {
        if (!sigHeader) {
            throw new ElevenLabsError({
                message: "Missing signature header",
                statusCode: 400,
            });
        }

        if (!secret) {
            throw new ElevenLabsError({
                message: "Webhook secret not configured",
                statusCode: 400,
            });
        }

        const headers = sigHeader.split(",");
        const timestamp = headers.find((e) => e.startsWith("t="))?.substring(2);
        const signature = headers.find((e) => e.startsWith("v0="));

        if (!timestamp || !signature) {
            throw new ElevenLabsError({
                message: "No signature hash found with expected scheme v0",
                statusCode: 400,
            });
        }

        // Validate timestamp
        const reqTimestamp = Number(timestamp) * 1000;
        const tolerance = Date.now() - 30 * 60 * 1000;
        if (reqTimestamp < tolerance) {
            throw new ElevenLabsError({
                message: "Timestamp outside the tolerance zone",
                statusCode: 400,
            });
        }

        // Validate hash
        const message = `${timestamp}.${rawBody}`;
        const digest = await hmacSHA256(secret, message);

        if (signature !== digest) {
            throw new ElevenLabsError({
                message: "Signature hash does not match the expected signature hash for payload",
                statusCode: 400,
            });
        }

        return JSON.parse(rawBody);
    }
}
