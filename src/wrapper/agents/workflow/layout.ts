import type * as ElevenLabs from "../../../api/index";
import { depthsFrom } from "./validate";
import type { WorkflowGraph } from "./WorkflowGraph";

export const COLUMN_WIDTH = 300;
export const ROW_HEIGHT = 200;

/**
 * Positions for the workflow editor. Nodes that already have a position keep it. The rest go in
 * column = breadth-first depth from the start node, row = order of discovery within that column.
 * Unreachable nodes go in the column after the deepest one.
 */
export function layout(graph: WorkflowGraph): Map<string, ElevenLabs.PositionInput> {
    const depths = depthsFrom(graph);
    const lastColumn = Math.max(0, ...depths.values()) + 1;
    const order = [...depths.keys(), ...[...graph.nodes.keys()].filter((id) => !depths.has(id))];
    const rows = new Map<number, number>();
    const positions = new Map<string, ElevenLabs.PositionInput>();

    for (const id of order) {
        const existing = graph.nodes.get(id)?.position;
        if (existing !== undefined) {
            positions.set(id, existing);
            continue;
        }
        const column = depths.get(id) ?? lastColumn;
        const row = rows.get(column) ?? 0;
        rows.set(column, row + 1);
        positions.set(id, { x: column * COLUMN_WIDTH, y: row * ROW_HEIGHT });
    }
    return positions;
}
