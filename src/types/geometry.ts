/**
 * Represents a 2D point with x and y coordinates
 */
export interface Point {
    x: number;
    y: number;
}

/**
 * Represents a 2D vector with dx and dy components
 */
export interface Vector {
    dx: number;
    dy: number;
}

/**
 * Defines a 2D coordinate system with x and y axes and an origin point
 */
export interface AxisSystem {
    xDirection: Vector;
    yDirection: Vector;
    zeroPoint: Point;
}

/**
 * Properties for a dimension line visualization
 */
export interface DimensionProps {
    measurement: number;
    start: Point;
    end: Point;
    projectionLines?: ProjectionLine[];
}

/**
 * Represents a projection line between two points
 */
export interface ProjectionLine {
    start: Point;
    end: Point;
}
