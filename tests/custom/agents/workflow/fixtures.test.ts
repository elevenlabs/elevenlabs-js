import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { type Fixture, runFixture } from "./fixtureRunner";

// Shared golden fixtures. Every SDK runs the same files; see docs/agents-as-code/workflow-spec.md.
// Run with UPDATE_FIXTURES=1 to rewrite the `expected` output after an intentional change.
const FIXTURE_DIR = join(__dirname, "../../../../docs/agents-as-code/fixtures");
const files = readdirSync(FIXTURE_DIR).filter((file) => file.endsWith(".json"));

describe("workflow fixtures", () => {
    it.each(files)("%s", (file) => {
        const path = join(FIXTURE_DIR, file);
        const fixture: Fixture = JSON.parse(readFileSync(path, "utf8"));
        const result = runFixture(fixture);

        if (fixture.errors !== undefined) {
            expect(result.errors?.slice().sort()).toEqual(fixture.errors.slice().sort());
            return;
        }
        if (process.env.UPDATE_FIXTURES === "1") {
            fixture.expected = JSON.parse(result.json as string);
            writeFileSync(path, `${JSON.stringify(fixture, null, 2)}\n`);
        }
        expect(result.errors).toBeUndefined();
        expect(result.json).toEqual(`${JSON.stringify(fixture.expected, null, 2)}\n`);
    });
});
