import crypto from 'node:crypto';
import { ElevenLabsError } from '../errors';

/**
 * A client to handle ElevenLabs webhook-related functionality
 */
export class WebhooksClient {
  /**
   * Constructs a webhook event object from a payload and signature.
   * Verifies the webhook signature to ensure the event came from ElevenLabs.
   *
   * @param payload - The webhook payload (request body)
   * @param sigHeader - The signature header from the request
   * @param secret - Your webhook secret
   * @returns The verified webhook event
   * @throws {ElevenLabsError} if the signature is invalid or missing
   */
  constructEvent(payload: unknown, sigHeader: string, secret: string) {
    const body = JSON.stringify(payload);

    if (!sigHeader) {
      throw new ElevenLabsError({
        message: 'Missing signature header',
        statusCode: 400,
      });
    }

    const headers = sigHeader.split(',');
    const timestamp = headers.find((e) => e.startsWith('t='))?.substring(2);
    const signature = headers.find((e) => e.startsWith('v0='));

    if (!timestamp || !signature) {
      throw new ElevenLabsError({
        message: 'No signature hash found with expected scheme v0',
        statusCode: 400,
      });
    }

    // Validate timestamp
    const reqTimestamp = Number(timestamp) * 1000;
    const tolerance = Date.now() - 30 * 60 * 1000;
    if (reqTimestamp < tolerance) {
      throw new ElevenLabsError({
        message: 'Timestamp outside the tolerance zone',
        statusCode: 400,
      });
    }

    // Validate hash
    const message = `${timestamp}.${body}`;

    if (!secret) {
      throw new ElevenLabsError({
        message: 'Webhook secret not configured',
        statusCode: 400,
      });
    }

    const digest = `v0=${crypto.createHmac('sha256', secret).update(message).digest('hex')}`;

    if (signature !== digest) {
      throw new ElevenLabsError({
        message: 'Signature hash does not match the expected signature hash for payload',
        statusCode: 400,
      });
    }

    return JSON.parse(body);
  }
}