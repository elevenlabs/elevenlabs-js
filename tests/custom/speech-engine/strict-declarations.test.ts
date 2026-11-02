import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const repoRoot = path.resolve(__dirname, "../../..");
const tscPath = path.join(repoRoot, "node_modules", "typescript", "bin", "tsc");

type TscResult = {
    status: number;
    output: string;
};

function runTsc(cwd: string, args: string[]): TscResult {
    try {
        const stdout = execFileSync(process.execPath, [tscPath, ...args], {
            cwd,
            encoding: "utf8",
            maxBuffer: 20 * 1024 * 1024,
            stdio: ["ignore", "pipe", "pipe"],
        });
        return { status: 0, output: stdout ?? "" };
    } catch (error) {
        const err = error as { status?: number; stdout?: string; stderr?: string };
        const output = [err.stdout, err.stderr].filter((part) => part != null && part.length > 0).join("\n");
        return { status: typeof err.status === "number" ? err.status : 1, output };
    }
}

describe("published speech engine declarations", () => {
    jest.setTimeout(300000);

    it("typechecks for a strict consumer with skipLibCheck disabled", () => {
        const build = runTsc(repoRoot, ["-p", path.join(repoRoot, "tsconfig.json")]);
        if (build.status !== 0) {
            expect({ status: build.status, output: build.output }).toEqual({ status: 0, output: "" });
        }

        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "elevenlabs-strict-dts-"));
        try {
            const indexPath = path.join(repoRoot, "dist", "index");
            const consumerPath = path.join(tempDir, "consumer.ts");
            const consumerSource = `
import type { ElevenLabsClient } from ${JSON.stringify(indexPath)};
import { ElevenLabsClient as ElevenLabsClientValue } from ${JSON.stringify(indexPath)};

export type Client = ElevenLabsClient;

export const options: ElevenLabsClient.Options = { apiKey: "test" };
export const constructed: ElevenLabsClient = new ElevenLabsClientValue(options);

export function checkAttach(client: ElevenLabsClient) {
    return client.speechEngine.create({
        speechEngine: { wsUrl: "wss://example.com/ws" },
    }).then((engine) => engine.attach);
}

export function checkList(client: ElevenLabsClient) {
    return client.speechEngine.list().withRawResponse();
}

export function checkDelete(client: ElevenLabsClient) {
    return client.speechEngine.delete("seng_123").withRawResponse();
}
`;
            fs.writeFileSync(consumerPath, consumerSource);
            fs.writeFileSync(
                path.join(tempDir, "tsconfig.json"),
                JSON.stringify(
                    {
                        compilerOptions: {
                            strict: true,
                            skipLibCheck: false,
                            noEmit: true,
                            module: "CommonJS",
                            moduleResolution: "Node",
                            target: "ES2022",
                            esModuleInterop: true,
                            typeRoots: [path.join(repoRoot, "node_modules", "@types")],
                        },
                        files: ["consumer.ts"],
                    },
                    null,
                    2,
                ),
            );

            const consumer = runTsc(tempDir, ["-p", path.join(tempDir, "tsconfig.json"), "--pretty", "false"]);
            expect({
                status: consumer.status,
                output: consumer.status === 0 ? "" : consumer.output,
            }).toEqual({ status: 0, output: "" });
        } finally {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    });
});
