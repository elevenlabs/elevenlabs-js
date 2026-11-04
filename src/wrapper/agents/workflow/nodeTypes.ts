import * as serializers from "../../../serialization/index";

const knownNodeTypes = new Map<string, boolean>();

/**
 * Whether this SDK version's generated serializer models a node type. Asked of the serializer rather than listed
 * here, so a regeneration that adds a node type is picked up without a change to the builder. An unknown type is
 * reported against the `type` key; a known one only fails on its other required fields.
 */
export function serializerKnowsNodeType(type: string): boolean {
    let known = knownNodeTypes.get(type);
    if (known === undefined) {
        const result = serializers.AgentWorkflowRequestModelNodesValue.parse({ type });
        known = result.ok || !result.errors.some((error) => error.path.join(".") === "type");
        knownNodeTypes.set(type, known);
    }
    return known;
}
