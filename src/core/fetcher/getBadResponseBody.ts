import { fromJson } from "../json";
import { getResponseBody } from "./getResponseBody";

export async function getBadResponseBody(response: Response): Promise<unknown> {
    const contentType = response.headers.get("Content-Type");
    if (contentType == null) {
        return getResponseBody(response);
    }

    const responseType = contentType.split(";")[0].trim();
    switch (responseType) {
        case "application/json":
        case "application/vnd.api+json":
        case "text/json":
            const text = await response.text();
            return text.length > 0 ? fromJson(text) : undefined;
        case "text/plain":
        case "text/html":
            return await response.text();
        default:
            return response.body;
    }
}
