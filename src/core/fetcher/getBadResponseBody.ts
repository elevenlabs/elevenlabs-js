import { fromJson } from "../json";
import { getResponseBody } from "./getResponseBody";

export async function getBadResponseBody(response: Response): Promise<unknown> {
    let contentType = response.headers.get("Content-Type")?.toLowerCase();
    if (contentType == null || contentType.length === 0) {
        return getResponseBody(response);
    }

    if (contentType.indexOf(";") !== -1) {
        contentType = contentType.split(";")[0].trim();
    }
    switch (contentType) {
        case "application/hal+json":
        case "application/json":
        case "application/ld+json":
        case "application/problem+json":
        case "application/vnd.api+json":
        case "text/json":
            const text = await response.text();
            return text.length > 0 ? fromJson(text) : undefined;
        case "application/problem+xml":
        case "application/xml":
        case "text/html":
        case "text/plain":
        case "text/xml":
            return await response.text();
        default:
            if (contentType.startsWith("application/vnd.") && contentType.endsWith("+json")) {
                const text = await response.text();
                return text.length > 0 ? fromJson(text) : undefined;
            }

            return response.body;
    }
}
