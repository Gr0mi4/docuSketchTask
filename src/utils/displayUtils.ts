import type { Point } from "@/types/geometry";

/**
 * Calculates the bounds for a view box of a set of points
 */
export function computeBounds(points: Point[]) {
    if (!points?.length) {
        throw new Error('No points provided for bounds calculation');
    }
    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;

    points.forEach(({ x, y }) => {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
    });

    return {
        minX,
        minY,
        width: maxX - minX,
        height: maxY - minY
    };
}
