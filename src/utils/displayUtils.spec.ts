import { describe, expect, it } from "@jest/globals";
import { computeBounds } from "@/utils/displayUtils";
import type { Point } from "@/types/geometry";

describe("computeBounds", () => {
    it("calculates correct bounding box for a set of points", () => {
        const points: Point[] = [
            { x: 1, y: 2 },
            { x: -3, y: 5 },
            { x: 4, y: -1 }
        ];

        const bounds = computeBounds(points);

        expect(bounds).toEqual({
            minX: -3,
            minY: -1,
            width: 7,  // 4 - (-3)
            height: 6  // 5 - (-1)
        });
    });

    it("throws if input is empty", () => {
        expect(() => computeBounds([])).toThrow("No points provided for bounds calculation");
    });

    it("throws if input is undefined", () => {
        expect(() => computeBounds(undefined as unknown as Point[])).toThrow("No points provided for bounds calculation");
    });
});
