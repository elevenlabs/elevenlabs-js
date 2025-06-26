/// <reference types="@cloudflare/workers-types" />

// import { ElevenLabsClient, play } from '@elevenlabs/elevenlabs-js';
import { ElevenLabsClient, play } from '../../../dist/index.js';

// We aren't using any bindings, so this can be a simple type.
type Env = Record<string, unknown>;

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        // This should work without issue.
        const client = new ElevenLabsClient({
            apiKey: 'mock-api-key',
        });

        console.log('ElevenLabsClient initialized successfully.');

        try {
            // We expect this to throw an error because we are not in a Node.js environment.
            // @ts-ignore - we are intentionally passing an invalid type to test the runtime check.
            await play(new ReadableStream());
            // If it does NOT throw, the test has failed.
            return new Response('Test FAILED: The play() function did not throw an error.', { status: 500 });
        } catch (error) {
            // If it throws, we check that it's the error we expect.
            const expectedErrorMessage = 'The play function is only available in a Node.js environment.';
            if (error instanceof Error && error.message === expectedErrorMessage) {
                return new Response(`Test PASSED: Caught expected error: "${error.message}"`, { status: 200 });
            }

            return new Response(`Test FAILED: Caught an unexpected error: "${String(error)}"`, { status: 500 });
        }
    },
};