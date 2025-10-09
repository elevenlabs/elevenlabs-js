import { ClientToolResultEvent, ClientToOrchestratorEvent } from "./events";

/**
 * Handles registration and execution of client-side tools that can be called by the agent.
 *
 * Supports both synchronous and asynchronous tools running in a dedicated event loop,
 * ensuring non-blocking operation of the main conversation thread.
 */
export class ClientTools {
    private tools: Map<
        string,
        {
            handler: (parameters: Record<string, any>) => any | Promise<any>;
            isAsync: boolean;
        }
    > = new Map();

    /**
     * Register a new tool that can be called by the AI agent.
     *
     * @param toolName Unique identifier for the tool
     * @param handler Function that implements the tool's logic
     * @param isAsync Whether the handler is an async function (auto-detected if not specified)
     */
    public register(
        toolName: string,
        handler: (parameters: Record<string, any>) => any | Promise<any>,
        isAsync?: boolean,
    ): void {
        if (!handler || typeof handler !== "function") {
            throw new Error("Handler must be a function");
        }

        if (this.tools.has(toolName)) {
            throw new Error(`Tool '${toolName}' is already registered`);
        }

        // Auto-detect if the function is async if not specified
        const isAsyncHandler = isAsync !== undefined ? isAsync : handler.constructor.name === "AsyncFunction";

        this.tools.set(toolName, {
            handler,
            isAsync: isAsyncHandler,
        });
    }

    /**
     * Execute a registered tool with the given parameters.
     *
     * @param toolName Name of the tool to execute
     * @param parameters Parameters to pass to the tool
     * @returns The result of the tool execution
     */
    public async handle(toolName: string, parameters: Record<string, any>): Promise<any> {
        const tool = this.tools.get(toolName);
        if (!tool) {
            throw new Error(`Tool '${toolName}' is not registered`);
        }

        if (tool.isAsync) {
            return await tool.handler(parameters);
        } else {
            return tool.handler(parameters);
        }
    }

    /**
     * Execute a tool and send its result via the provided callback.
     *
     * This method is non-blocking and handles both sync and async tools.
     *
     * @param toolName Name of the tool to execute
     * @param parameters Parameters to pass to the tool (should include tool_call_id)
     * @param callback Function to call with the result
     */
    public executeToolAsync(
        toolName: string,
        parameters: Record<string, any>,
        callback: (response: ClientToolResultEvent) => void,
    ): void {
        // Run the tool execution in the next tick to avoid blocking
        setImmediate(async () => {
            try {
                const result = await this.handle(toolName, parameters);
                const response: ClientToolResultEvent = {
                    type: ClientToOrchestratorEvent.CLIENT_TOOL_RESULT,
                    tool_call_id: parameters.tool_call_id,
                    result: result ?? `Client tool: ${toolName} called successfully.`,
                    is_error: false,
                };
                callback(response);
            } catch (error: any) {
                const response: ClientToolResultEvent = {
                    type: ClientToOrchestratorEvent.CLIENT_TOOL_RESULT,
                    tool_call_id: parameters.tool_call_id,
                    result: error.message || String(error),
                    is_error: true,
                };
                callback(response);
            }
        });
    }

    /**
     * Get a list of all registered tool names.
     *
     * @returns Array of tool names
     */
    public getRegisteredTools(): string[] {
        return Array.from(this.tools.keys());
    }

    /**
     * Check if a tool is registered.
     *
     * @param toolName Name of the tool to check
     * @returns True if the tool is registered
     */
    public isToolRegistered(toolName: string): boolean {
        return this.tools.has(toolName);
    }

    /**
     * Unregister a tool.
     *
     * @param toolName Name of the tool to unregister
     * @returns True if the tool was found and removed
     */
    public unregister(toolName: string): boolean {
        return this.tools.delete(toolName);
    }

    /**
     * Clear all registered tools.
     */
    public clear(): void {
        this.tools.clear();
    }
}
