// Minimal stub for child_process to allow bundlers/non-Node environments

export type ChildProcess = {
    stdin: NodeJS.WritableStream;
    stdout: NodeJS.ReadableStream;
    stderr: NodeJS.ReadableStream;
    kill: (signal?: string | number) => boolean;
    on: (event: string, listener: (...args: any[]) => void) => void;
};

function createNoopWritable(): NodeJS.WritableStream {
    // Provide minimal methods used by Node streams' pipe implementation
    const writable: any = {
        write: (_chunk: any, _encoding?: any, _cb?: any) => true,
        end: (_chunk?: any, _encoding?: any, _cb?: any) => {},
        cork: () => {},
        uncork: () => {},
        setDefaultEncoding: (_enc: any) => writable,
        on: (_event: string, _listener: (...args: any[]) => void) => writable,
        once: (_event: string, _listener: (...args: any[]) => void) => writable,
        removeListener: (_event: string, _listener: (...args: any[]) => void) => writable,
        emit: (_event: string, ..._args: any[]) => false,
    };
    return writable as unknown as NodeJS.WritableStream;
}

function createNoopReadable(): NodeJS.ReadableStream {
    const readable: any = {
        read: (_size?: number) => null,
        resume: () => readable,
        pause: () => readable,
        pipe: (_dest: any, _options?: any) => _dest,
        unpipe: (_dest?: any) => {},
        on: (_event: string, _listener: (...args: any[]) => void) => readable,
        once: (_event: string, _listener: (...args: any[]) => void) => readable,
        removeListener: (_event: string, _listener: (...args: any[]) => void) => readable,
        emit: (_event: string, ..._args: any[]) => false,
    };
    return readable as unknown as NodeJS.ReadableStream;
}

export function spawn(..._args: any[]): ChildProcess {
    const stdin = createNoopWritable();
    const stdout = createNoopReadable();
    const stderr = createNoopReadable();

    const listeners: Record<string, Array<(...args: any[]) => void>> = {};

    const on = (event: string, listener: (...args: any[]) => void) => {
        listeners[event] ??= [];
        listeners[event].push(listener);
    };

    const kill = (_signal?: string | number) => true;

    return { stdin, stdout, stderr, on, kill };
}

export function execSync(..._args: any[]): Buffer {
    // Simulate success (e.g., command exists) without doing anything
    return Buffer.alloc(0);
}

const childProcessStub: { spawn: typeof spawn; execSync: typeof execSync } = {
    spawn: spawn,
    execSync: execSync,
};

export default childProcessStub;


