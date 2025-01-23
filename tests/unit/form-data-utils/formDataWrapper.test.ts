/* eslint-disable @typescript-eslint/ban-ts-comment */
import { WebFormData } from "../../../src/core/form-data-utils/FormDataWrapper";

describe("CrossPlatformFormData", () => {
    describe("WebFormData", () => {
        let formData: any;

        beforeEach(async () => {
            formData = new WebFormData();
            await formData.setup();
        });

        it("should append a Readable stream with a specified filename", async () => {
            const value = (await import("node:stream")).Readable.from(["file content"]);
            const filename = "testfile.txt";

            await formData.appendFile("file", value, filename);

            const request = formData.getRequest();
            expect(request.body.get("file").name).toBe(filename);
        });

        it("should append a Blob with a specified filename", async () => {
            const value = new Blob(["file content"], { type: "text/plain" });
            const filename = "testfile.txt";

            await formData.appendFile("file", value, filename);

            const request = formData.getRequest();

            expect(request.body.get("file").name).toBe(filename);
        });

        it("should append a File with a specified filename", async () => {
            const filename = "testfile.txt";
            // @ts-expect-error
            const value = new (await import("buffer")).File(["file content"], filename);

            await formData.appendFile("file", value);

            const request = formData.getRequest();
            expect(request.body.get("file").name).toBe(filename);
        });

        it("should append a File with an explicit filename", async () => {
            const filename = "testfile.txt";
            // @ts-expect-error
            const value = new (await import("buffer")).File(["file content"], filename);

            await formData.appendFile("file", value, "test.txt");

            const request = formData.getRequest();
            expect(request.body.get("file").name).toBe("test.txt");
        });
    });
});
