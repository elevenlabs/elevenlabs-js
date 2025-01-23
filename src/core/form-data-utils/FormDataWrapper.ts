import { RUNTIME } from "../runtime";

export type MaybePromise<T> = Promise<T> | T;

interface FormDataRequest<Body> {
    body: Body;
    headers: Record<string, string>;
    duplex?: "half";
}

function isNamedValue(value: unknown): value is { name: string } {
    return typeof value === "object" && value != null && "name" in value;
}

export interface CrossPlatformFormData {
    setup(): Promise<void>;

    append(key: string, value: unknown): void;

    appendFile(key: string, value: unknown, fileName?: string): Promise<void>;

    getRequest(): MaybePromise<FormDataRequest<unknown>>;
}

export async function newFormData(): Promise<CrossPlatformFormData> {
    let formdata = new WebFormData();
    await formdata.setup();
    return formdata;
}

export type WebFormDataFd = { append(name: string, value: string | Blob, fileName?: string): void } | undefined;

/**
 * Form Data Implementation for Web
 */
export class WebFormData implements CrossPlatformFormData {
    protected fd: WebFormDataFd;

    public async setup(): Promise<void> {
        this.fd = new FormData();
    }

    public append(key: string, value: any): void {
        this.fd?.append(key, value);
    }

    public async appendFile(key: string, value: any, fileName?: string): Promise<void> {
        if (fileName == null && isNamedValue(value)) {
            fileName = value.name;
        }
        this.fd?.append(key, new Blob([value]), fileName);
    }

    public getRequest(): FormDataRequest<WebFormDataFd> {
        return {
            body: this.fd,
            headers: {},
        };
    }
}
