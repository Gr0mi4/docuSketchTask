import type { AxisSystem, Point, Vector, ProjectionLine, DimensionProps } from "@/types/geometry";
import type { Corner, Wall } from "@/types/room"
import { createVector, perpendicularVector, normalizeVector, dotProduct } from "@/utils/vectorMath";

export function getWallAngle(wall: Wall): number {
    if (!wall?.start || !wall?.end) {
        throw new Error("Invalid wall data for angle calculation");
    }
    const wallVector = createVector(wall.start, wall.end);

    const angle = Math.atan2(wallVector.dy, wallVector.dx);
    return angle < 0 ? angle + Math.PI : angle;
}

/**
 * Checks if two walls are parallel
 */
export function areWallsParallel(wall1: Wall, wall2: Wall): boolean {
    if (!wall1 || !wall2) {
        throw new Error("Both walls must be defined for parallel check");
    }
    // Tolerance for floating point comparison
    const epsilon = 0.001;

    const angle1 = getWallAngle(wall1);
    const angle2 = getWallAngle(wall2);

    return Math.abs(angle1 - angle2) < epsilon ||
        Math.abs(Math.abs(angle1 - angle2) - Math.PI) < epsilon;
}

/**
 * Filters out walls that are parallel to each other
 */
export function filterUniqueDirectionWalls(walls: Wall[]): Wall[] {
    if (!walls || !Array.isArray(walls)) {
        throw new Error("Walls must be an array of Wall objects");
    }
    if (walls.length === 0) return [];

    const possibleDirections: Wall[] = [walls[0]];

    for (let i = 1; i < walls.length; i++) {
        const currentWall = walls[i];
        let isUnique = true;

        for (const uniqueWall of possibleDirections) {
            if (areWallsParallel(currentWall, uniqueWall)) {
                isUnique = false;
                break;
            }
        }

        if (isUnique) {
            possibleDirections.push(currentWall);
        }
    }
    return possibleDirections;
}

export function getMeasurementAxes(wall: Wall): AxisSystem {
    if (!wall || !wall.start || !wall.end) {
        throw new Error("Wall must have valid start and end points for axis calculation");
    }
    const xDirection: Vector = createVector(wall.start, wall.end);

    const normalizedXVector: Vector = normalizeVector(xDirection);
    const normalizedYVector: Vector = perpendicularVector(normalizedXVector);

    return { xDirection: normalizedXVector, yDirection: normalizedYVector, zeroPoint: wall.start };
}

/**
 * Calculates the width and length of a room based on its corners and axis system
 */
export function calculateRoomDimensionsForAxis(
    corners: Corner[],
    axisSystem: AxisSystem
): {
    length: number;
    width: number;
    extremePoints: {
        minX: Corner;
        maxX: Corner;
        minY: Corner;
        maxY: Corner;
    };
} {
    if (!corners?.length) {
        throw new Error("No points provided for dimension calculation");
    }
    if (!axisSystem) {
        throw new Error("No axis system provided");
    }

    const projections = corners.map(corner => {
        const v = createVector(axisSystem.zeroPoint, corner);
        return {
            corner,
            xProj: dotProduct(v, axisSystem.xDirection),
            yProj: dotProduct(v, axisSystem.yDirection),
        };
    });

    // Sort projections based on both projections to eliminate unstable sorting
    const xAsc = [...projections].sort((a, b) =>
        a.xProj - b.xProj || a.yProj - b.yProj
    );
    const xDesc = [...projections].sort((a, b) =>
        b.xProj - a.xProj || a.yProj - b.yProj
    );

    const yAsc = [...projections].sort((a, b) =>
        a.yProj - b.yProj || a.xProj - b.xProj
    );
    const yDesc = [...projections].sort((a, b) =>
        b.yProj - a.yProj || a.xProj - b.xProj
    );

    const minXCorner = xAsc[0].corner;
    const maxXCorner = xDesc[0].corner;
    const minYCorner = yAsc[0].corner;
    const maxYCorner = yDesc[0].corner;

    const length =
        xAsc[xAsc.length - 1].xProj - xAsc[0].xProj;
    const width =
        yAsc[yAsc.length - 1].yProj - yAsc[0].yProj;

    return {
        length,
        width,
        extremePoints: {
            minX: minXCorner,
            maxX: maxXCorner,
            minY: minYCorner,
            maxY: maxYCorner,
        },
    };
}

/**
 * Projects a point onto an axis
 */
export function projectPointOnAxis(point: Point, axisVector: Vector, origin: Point): Point {
    if (!point || !axisVector || !origin) {
        throw new Error("Point, axis vector, and origin must be defined for projection");
    }
    const pointVector: Vector = createVector(origin, point);

    const scalarProjection = dotProduct(pointVector, axisVector);

    return {
        x: origin.x + scalarProjection * axisVector.dx,
        y: origin.y + scalarProjection * axisVector.dy
    };
}

/**
 * Creates projection lines between points and their projections
 */
export function createProjectionLines(
    point: Point,
    projectedPoint: Point,
    secondPoint: Point,
    secondProjectedPoint: Point,
    axisVector?: Vector,
    offset?: number
): ProjectionLine[] {
    if (!offset || !axisVector) {
        return [
            { start: point, end: projectedPoint },
            { start: secondPoint, end: secondProjectedPoint }
        ];
    }

    const dimensionVector = createVector(projectedPoint, secondProjectedPoint);
    const perpVector = perpendicularVector(dimensionVector);
    const offsetVector = normalizeVector(perpVector);

    const offsetProjectedPoint = {
        x: projectedPoint.x + offsetVector.dx * offset,
        y: projectedPoint.y + offsetVector.dy * offset
    };

    const offsetSecondProjectedPoint = {
        x: secondProjectedPoint.x + offsetVector.dx * offset,
        y: secondProjectedPoint.y + offsetVector.dy * offset
    };

    return [
        { start: point, end: offsetProjectedPoint },
        { start: secondPoint, end: offsetSecondProjectedPoint }
    ];
}

/**
 * Builds start and end points, measurement, and projection lines for a given axis.
 */
export function buildDimensionProps(
    min: Corner,
    max: Corner,
    axisDir: Vector,
    zeroPoint: Point,
    measurement: number,
    offset: number,
): DimensionProps {
    if (!min || !max || !axisDir || !zeroPoint) {
        throw new Error("Min, max, axis direction, and zero point must be defined for dimension props");
    }
    const start = projectPointOnAxis(min, axisDir, zeroPoint)
    const end = projectPointOnAxis(max, axisDir, zeroPoint)

    return {
        measurement,
        start,
        end,
        projectionLines: createProjectionLines(min, start, max, end, axisDir, offset),
    }
}
