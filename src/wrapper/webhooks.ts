import { webcrypto as nodeWebcrypto } from "crypto";
import { ElevenLabsError } from "../errors";
import { WebhooksClient as Webhooks } from "../api/resources/webhooks/client/Client";

const crypto = globalThis.crypto ?? nodeWebcrypto;

const encoder = new TextEncoder();

/** How old a signed timestamp may be before the event is treated as a replay. */
const TIMESTAMP_TOLERANCE_MS = 30 * 60 * 1000;

/** A `v0` signature is a lowercase hex HMAC-SHA256 digest: 32 bytes, 64 characters. */
const V0_SIGNATURE = /^v0=([0-9a-f]{64})$/;

/** A timestamp is a whole number of Unix seconds. */
const UNIX_SECONDS = /^\d+$/;

function hexToBytes(hex: string): Uint8Array<ArrayBuffer> {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    }
    return bytes;
}

/**
 * Checks an HMAC-SHA256 signature with Web Crypto's `verify`, which compares in constant time. A string
 * comparison returns at the first differing character, so its timing would tell a caller how much of a
 * guessed signature is right.
 */
async function verifyHmacSHA256(key: string, message: string, signatureHex: string): Promise<boolean> {
    const cryptoKey = await crypto.subtle.importKey(
        "raw",
        encoder.encode(key),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["verify"],
    );
    return crypto.subtle.verify("HMAC", cryptoKey, hexToBytes(signatureHex), encoder.encode(message));
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

        // Validate timestamp. The format check comes first: `Number("abc")` is NaN, and `NaN < tolerance` is false.
        if (!UNIX_SECONDS.test(timestamp) || Number(timestamp) * 1000 < Date.now() - TIMESTAMP_TOLERANCE_MS) {
            throw new ElevenLabsError({
                message: "Timestamp outside the tolerance zone",
                statusCode: 400,
            });
        }

        // Validate hash
        const signatureHex = V0_SIGNATURE.exec(signature)?.[1];
        const message = `${timestamp}.${rawBody}`;
        if (signatureHex === undefined || !(await verifyHmacSHA256(secret, message, signatureHex))) {
            throw new ElevenLabsError({
                message: "Signature hash does not match the expected signature hash for payload",
                statusCode: 400,
            });
        }

        return JSON.parse(rawBody);
    }
}
