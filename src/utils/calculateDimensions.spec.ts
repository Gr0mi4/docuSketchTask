import { describe, expect, it } from "@jest/globals";
import type { Point, Vector, AxisSystem, DimensionProps } from "@/types/geometry"
import type { Corner, Wall } from "@/types/room"
import {
    getWallAngle,
    areWallsParallel,
    filterUniqueDirectionWalls,
    getMeasurementAxes,
    calculateRoomDimensionsForAxis,
    projectPointOnAxis,
    createProjectionLines,
    buildDimensionProps
} from "@/utils/calculateDimensions"

describe("Geometry Utilities", () => {
    describe("getWallAngle", () => {
        it("returns 0 for a horizontal rightward wall", () => {
            const wall: Wall = { id: "test-wall-1", start: { x: 0, y: 0 }, end: { x: 1, y: 0 } }
            expect(getWallAngle(wall)).toBeCloseTo(0)
        })

        it("returns π/2 for a vertical upward wall", () => {
            const wall: Wall = { id: "test-wall-1", start: { x: 0, y: 0 }, end: { x: 0, y: 1 } }
            expect(getWallAngle(wall)).toBeCloseTo(Math.PI / 2)
        })

        it("normalizes negative angles by adding π", () => {
            // vector (1, -1) has atan2 = -π/4, so final = 3π/4
            const wall: Wall = { id: "test-wall-1", start: { x: 0, y: 0 }, end: { x: 1, y: -1 } }
            expect(getWallAngle(wall)).toBeCloseTo((3 * Math.PI) / 4)
        })

        it("throws if start or end is missing", () => {
            expect(() => getWallAngle({} as unknown as Wall)).toThrow("Invalid wall data for angle calculation")
        })
    })

    describe("areWallsParallel", () => {
        it("returns true for two identical horizontal walls", () => {
            const w1: Wall = { id: "test-wall-1", start: { x: 0, y: 0 }, end: { x: 2, y: 0 } }
            const w2: Wall = { id: "test-wall-2", start: { x: 1, y: 1 }, end: { x: 3, y: 1 } }
            expect(areWallsParallel(w1, w2)).toBe(true)
        })

        it("returns false for perpendicular walls", () => {
            const w1: Wall = { id: "test-wall-1", start: { x: 0, y: 0 }, end: { x: 2, y: 0 } }
            const w2: Wall = { id: "test-wall-2", start: { x: 0, y: 0 }, end: { x: 0, y: 2 } }
            expect(areWallsParallel(w1, w2)).toBe(false)
        })

        it("throws if either wall is undefined", () => {
            expect(() => areWallsParallel(undefined as unknown as Wall, {} as unknown as Wall))
                .toThrow("Both walls must be defined for parallel check")
        })
    })

    describe("filterUniqueDirectionWalls", () => {
        it("filters out walls with duplicate directions", () => {
            const horizontal1: Wall = { id: "test-wall-1", start: { x: 0, y: 0 }, end: { x: 2, y: 0 } }
            const horizontal2: Wall = { id: "test-wall-2", start: { x: 1, y: 1 }, end: { x: 3, y: 1 } }
            const vertical: Wall = { id: "test-wall-3", start: { x: 0, y: 0 }, end: { x: 0, y: 2 } }
            const result = filterUniqueDirectionWalls([horizontal1, horizontal2, vertical])
            // should keep the first horizontal and the vertical
            expect(result).toEqual([horizontal1, vertical])
        })

        it("returns empty array for empty input", () => {
            expect(filterUniqueDirectionWalls([])).toEqual([])
        })

        it("throws if input is not an array", () => {
            expect(() => filterUniqueDirectionWalls(null as unknown as Wall[])).toThrow("Walls must be an array of Wall objects")
        })
    })

    describe("getMeasurementAxes", () => {
        it("computes orthonormal axis system for a horizontal wall", () => {
            const wall: Wall = { id: "test-wall-1", start: { x: 5, y: 5 }, end: { x: 6, y: 5 } }
            const axes: AxisSystem = getMeasurementAxes(wall)

            expect(axes.yDirection.dx).toBeCloseTo(0)
            expect(axes.yDirection.dy).toBeCloseTo(1)
            expect(axes.xDirection.dx).toBeCloseTo(1)
            expect(axes.xDirection.dy).toBeCloseTo(0)
            expect(axes.zeroPoint).toEqual({ x: 5, y: 5 })
        })

        it("throws if wall is missing start or end", () => {
            expect(() => getMeasurementAxes({} as unknown as Wall)).toThrow("Wall must have valid start and end points for axis calculation")
        })
    })

    describe("calculateRoomDimensionsForAxis", () => {
        it("calculates correct length, width, and extreme corners for a rectangle", () => {
            const corners: Corner[] = [
                {
                    id: "test-corner-1",
                    x: 0,
                    y: 0,
                    wallStarts: [{ id: "test-wall-1" }],
                    wallEnds: [{ id: "test-wall-4" }]
                },
                {
                    id: "test-corner-2",
                    x: 4,
                    y: 0,
                    wallStarts: [{ id: "test-wall-2" }],
                    wallEnds: [{ id: "test-wall-1" }]
                },
                {
                    id: "test-corner-3",
                    x: 4,
                    y: 2,
                    wallStarts: [{ id: "test-wall-3" }],
                    wallEnds: [{ id: "test-wall-2" }]
                },
                {
                    id: "test-corner-4",
                    x: 0,
                    y: 2,
                    wallStarts: [{ id: "test-wall-4" }],
                    wallEnds: [{ id: "test-wall-3" }]
                }
            ]
            const axis: AxisSystem = {
                zeroPoint: { x: 0, y: 0 },
                xDirection: { dx: 1, dy: 0 },
                yDirection: { dx: 0, dy: 1 }
            }
            const { length, width, extremePoints } = calculateRoomDimensionsForAxis(corners, axis)

            expect(length).toBeCloseTo(4)
            expect(width).toBeCloseTo(2)
            
            expect(extremePoints.minX).toMatchObject({ x: 0, y: 0 })
            expect(extremePoints.maxX).toMatchObject({ x: 4, y: 0 })
            expect(extremePoints.minY).toMatchObject({ x: 0, y: 0 })
            expect(extremePoints.maxY).toMatchObject({ x: 0, y: 2 })
        })

        it("throws if no corners provided", () => {
            expect(() => calculateRoomDimensionsForAxis([], {} as unknown as AxisSystem)).toThrow("No points provided for dimension calculation")
        })

        it("throws if no axis provided", () => {
            const corners: Corner[] = [{
                id: "test-corner-1",
                x: 0,
                y: 0,
                wallStarts: [{ id: "test-wall-1" }],
                wallEnds: [{ id: "test-wall-4" }]
            }]
            expect(() => calculateRoomDimensionsForAxis(corners, null as unknown as AxisSystem)).toThrow("No axis system provided")
        })
    })

    describe("projectPointOnAxis", () => {
        it("projects a point onto the x-axis correctly", () => {
            const p: Point = { x: 2, y: 3 }
            const origin: Point = { x: 0, y: 0 }
            const axis: Vector = { dx: 1, dy: 0 }
            const proj = projectPointOnAxis(p, axis, origin)
            expect(proj).toEqual({ x: 2, y: 0 })
        })

        it("throws if any argument is missing", () => {
            expect(() => projectPointOnAxis(null as unknown as Point, { dx: 1, dy: 0 }, { x: 0, y: 0 }))
                .toThrow("Point, axis vector, and origin must be defined for projection")
        })
    })

    describe("createProjectionLines", () => {
        const p1: Point = { x: 2, y: 3 }
        const p2: Point = { x: 4, y: 5 }
        const proj1: Point = { x: 2, y: 0 }
        const proj2: Point = { x: 4, y: 0 }
        const axis: Vector = { dx: 1, dy: 0 }

        it("returns direct lines when offset or axisVector is missing", () => {
            const lines = createProjectionLines(p1, proj1, p2, proj2)
            expect(lines).toEqual([
                { start: p1, end: proj1 },
                { start: p2, end: proj2 }
            ])
        })

        it("returns offset projection lines when axisVector and offset provided", () => {
            const offset = 1
            const lines = createProjectionLines(p1, proj1, p2, proj2, axis, offset)
            // dimensionVector = (4-2,0) => (2,0)
            // perpVector = (0,2), normalized => (0,1)
            // offsetProjected = (2, 0+1)
            // offsetSecond = (4, 0+1)
            expect(lines).toEqual([
                { start: p1, end: { x: 2, y: 1 } },
                { start: p2, end: { x: 4, y: 1 } }
            ])
        })
    })

    describe("buildDimensionProps", () => {
        it("builds complete DimensionProps object with projection lines", () => {
            const min: Corner = {
                id: "test-corner-1",
                x: 0,
                y: 0,
                wallStarts: [{ id: "test-wall-1" }],
                wallEnds: [{ id: "test-wall-4" }]
            }
            const max: Corner = {
                id: "test-corner-2",
                x: 1,
                y: 0,
                wallStarts: [{ id: "test-wall-1" }],
                wallEnds: [{ id: "test-wall-4" }]
            }
            const axisDir: Vector = { dx: 1, dy: 0 }
            const zeroPoint: Point = { x: 0, y: 0 }
            const measurement = 1
            const offset = 1

            const result: DimensionProps = buildDimensionProps(
                min, max, axisDir, zeroPoint, measurement, offset
            )

            expect(result.measurement).toBe(measurement)
            expect(result.start).toEqual({ x: 0, y: 0 })
            expect(result.end).toEqual({ x: 1, y: 0 })
            // projectionLines should match createProjectionLines logic
            expect(result.projectionLines).toEqual([
                { start: min, end: { x: 0, y: 1 } },
                { start: max, end: { x: 1, y: 1 } }
            ])
        })

        it("throws if any required argument is missing", () => {
            expect(() => buildDimensionProps(
                null as unknown as Corner,
                null as unknown as Corner,
                null as unknown as Vector,
                null as unknown as Point,
                0,
                0))
                .toThrow("Min, max, axis direction, and zero point must be defined for dimension props")
        })
    })
})
