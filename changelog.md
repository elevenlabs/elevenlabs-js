## 3.0.0 - 2026-04-09
* The `getContent` method on `DocumentsClient` and the `registerCall` method on `TwilioClient` now return `HttpResponsePromise<string>` instead of `HttpResponsePromise<void>`, allowing callers to access the text response body. If your code previously ignored the return value or typed it as `void`, update any type annotations or result handling accordingly.

