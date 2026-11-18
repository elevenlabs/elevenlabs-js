import { mkdirSync, mkdtempSync, readdirSync, readFileSync, statSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { describe, expect, it } from "@jest/globals";
import { Agent, AgentProject, AgentProjectError, Tool } from "../../../../src";
import { formatConfig, formatIndex, sanitizeFilename, uniquePath } from "../../../../src/wrapper/agents/project/format";
import { FakeServer } from "../agent/fakeServer";

const CLI_PROJECT = join(__dirname, "../../../../docs/agents-as-code/fixtures/project/cli-graph");
const readJson = (path: string): Record<string, unknown> => JSON.parse(readFileSync(join(CLI_PROJECT, path), "utf8"));

function readTree(dir: string): Record<string, string> {
    const files: Record<string, string> = {};
    const walk = (current: string): void => {
        for (const name of readdirSync(current)) {
            const path = join(current, name);
            if (statSync(path).isDirectory()) {
                walk(path);
            } else {
                files[relative(dir, path)] = readFileSync(path, "utf8");
            }
        }
    };
    walk(dir);
    return files;
}

describe("AgentProject", () => {
    it("loads a CLI project: tools by id, agents with Tool objects, unknown ids kept", () => {
        const project = AgentProject.fromFiles(readTree(CLI_PROJECT));
        expect(project.agents().map((a) => a.name)).toEqual(["Support", "Billing"]);
        expect(project.tools().map((t) => t.name)).toEqual(["lookup_order", "issue_refund"]);

        const support = project.agent("Support");
        expect(support.tools().map((t) => t.name)).toEqual(["lookup_order"]);
        expect(support.toolIds).toEqual(["tool_from_dashboard"]);
        expect(project.agentId(support)).toBe("agent_support");
        expect(project.toolId(support.tools()[0])).toBe("tool_lookup");
    });

    it("gives back every file unchanged when nothing was pushed or pulled, branch configs included", () => {
        const files = readTree(CLI_PROJECT);
        expect(AgentProject.fromFiles(files).toFiles()).toEqual(files);
    });

    it("reports missing, malformed and not-yet-supported files clearly", () => {
        const index = (config: string) => JSON.stringify({ agents: [{ config }] });
        expect(() => AgentProject.fromFiles({ "agents.json": index("agent_configs/a.yaml") })).toThrow(
            /only JSON config files are supported yet/,
        );
        expect(() => AgentProject.fromFiles({ "agents.json": index("agent_configs/a.json") })).toThrow(
            /points at agent_configs\/a.json, which doesn't exist/,
        );
        expect(() => AgentProject.fromFiles({ "agents.json": "{" })).toThrow(AgentProjectError);
        expect(() => AgentProject.fromFiles({}).agent("Nope")).toThrow(/No agent named "Nope"/);
    });

    it("names new files like the CLI", () => {
        expect(sanitizeFilename("  Support line / EU ")).toBe("Support-line-EU");
        expect(sanitizeFilename(".hidden")).toBe("_hidden");
        expect(sanitizeFilename("...")).toBe("unnamed");
        expect(uniquePath("agent_configs", "A", new Set(["agent_configs/A.json", "agent_configs/A-1.json"]))).toBe(
            "agent_configs/A-2.json",
        );
    });
});

describe("AgentProject on disk", () => {
    it("opens an empty directory, and push writes the CLI layout owner-only", async () => {
        const dir = mkdtempSync(join(tmpdir(), "agents-"));
        mkdirSync(join(dir, "agent_configs"));
        writeFileSync(join(dir, "agent_configs", "A.json"), "not ours"); // a file the project doesn't list
        const project = await AgentProject.open(dir);
        const server = new FakeServer();
        const agent = new Agent("A", { prompt: "p", tools: [Tool.client("ping", "Ping the app")] });

        await server.client().conversationalAi.agents.push(agent, { project });

        const files = readTree(dir);
        expect(Object.keys(files).sort()).toEqual([
            "agent_configs/A-1.json",
            "agent_configs/A.json",
            "agents.json",
            "tool_configs/ping.json",
            "tools.json",
        ]);
        expect(files["agent_configs/A.json"]).toBe("not ours");
        expect(files["tool_configs/ping.json"]).toBe(
            '{\n    "description": "Ping the app",\n    "name": "ping",\n    "type": "client"\n}',
        );
        expect(statSync(join(dir, "agents.json")).mode & 0o777).toBe(0o600);

        const reopened = await AgentProject.open(dir);
        expect(reopened.agentId(reopened.agent("A"))).toBe(project.agentId(agent));
    });

    it("refuses config paths outside the project, directly or through a symlink", async () => {
        const outside = mkdtempSync(join(tmpdir(), "outside-"));
        writeFileSync(join(outside, "a.json"), "{}");

        const escaping = mkdtempSync(join(tmpdir(), "agents-"));
        writeFileSync(join(escaping, "agents.json"), JSON.stringify({ agents: [{ config: "../a.json" }] }));
        await expect(AgentProject.open(escaping)).rejects.toThrow(/outside the project/);

        const linked = mkdtempSync(join(tmpdir(), "agents-"));
        symlinkSync(outside, join(linked, "agent_configs"));
        writeFileSync(join(linked, "agents.json"), JSON.stringify({ agents: [{ config: "agent_configs/a.json" }] }));
        await expect(AgentProject.open(linked)).rejects.toThrow(/through a symlink/);
    });
});

describe("AgentProject review fixes", () => {
    it("rejects a branch the project has no file for, before any request", async () => {
        const project = AgentProject.fromFiles(readTree(CLI_PROJECT));
        const server = new FakeServer();
        await expect(
            server.client().conversationalAi.agents.push(project.agent("Billing"), { project, branchId: "agtbrch_x" }),
        ).rejects.toThrow(/has no config file/);
        await expect(
            server.client().conversationalAi.agents.pull("agent_support", { project, branchId: "agtbrch_x" }),
        ).rejects.toThrow(/has no config file/);
        expect(server.calls).toEqual([]);
    });

    it("keeps the main agent when a branch is recorded, and the tool type in step with its config", () => {
        const project = AgentProject.fromFiles(readTree(CLI_PROJECT));
        const main = project.agent("Support");
        const beta = Agent.fromJSON(readJson("agent_configs/support.beta.json"));
        project._recordAgent(beta, "agent_support", beta.toJSON(), { branchId: "agtbrch_beta", matchBy: "id" });
        expect(project.agent("Support")).toBe(main);
        expect(project.changedFiles).toContain("agent_configs/support.beta.json");
        expect(project.changedFiles).not.toContain("agent_configs/support.json");

        const lookup = project.tools()[0];
        const client = Tool.client("lookup_order", "Now a client tool");
        project._recordTool(client, project.toolId(lookup) as string, client.toJSON(), "id");
        expect(JSON.parse(project.toFiles()["tools.json"]).tools[0].type).toBe("client");
    });

    it("drops a pending write once a file is back to what was loaded", () => {
        const loaded = { name: "A", conversation_config: {}, platform_settings: {}, tags: [] };
        const files = {
            "agents.json": formatIndex({ agents: [{ config: "agent_configs/a.json", id: "agent_1" }] }),
            "agent_configs/a.json": formatConfig(loaded),
        };
        const project = AgentProject.fromFiles(files);
        const agent = project.agent("A");
        project._recordAgent(agent, "agent_1", { ...loaded, tags: ["x"] });
        expect(project.changedFiles).toEqual(["agent_configs/a.json"]);
        project._recordAgent(agent, "agent_1", loaded);
        expect(project.changedFiles).toEqual([]);
        expect(project.toFiles()).toEqual({ ...files, "tools.json": '{\n    "tools": []\n}' });
    });
});
