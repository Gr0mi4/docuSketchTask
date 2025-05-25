import type { Point, Vector } from "@/types/geometry";

/**
 * Creates a vector from two points
 */
export function createVector(from: Point, to: Point): Vector {
    if (!from || !to) {
        throw new Error('Points must be defined to create a vector');
    }
    return {
        dx: to.x - from.x,
        dy: to.y - from.y
    };
}

/**
 * Calculates the length of a vector
 */
export function vectorLength(vector: Vector): number {
    if (!vector) {
        throw new Error('Vector must be defined to calculate its length');
    }
    return Math.sqrt(vector.dx * vector.dx + vector.dy * vector.dy);
}

/**
 * Normalizes a vector to have a length of 1
 */
export function normalizeVector(vector: Vector): Vector {
    const length = vectorLength(vector);
    if (length === 0) {
        throw new Error('Cannot normalize zero vector');
    }
    return {
        dx: vector.dx / length,
        dy: vector.dy / length
    };
}

/**
 * Creates a perpendicular vector to the given vector
 */
export function perpendicularVector(vector: Vector): Vector {
    if (!vector) {
        throw new Error('Vector must be defined to create a perpendicular vector');
    }
    return {
        dx: -vector.dy,
        dy: vector.dx
    };
}

/**
 * Calculates the dot product of two vectors
 */
export function dotProduct(v1: Vector, v2: Vector): number {
    if (!v1 || !v2) {
        throw new Error('Both vectors must be defined for dot product calculation');
    }
    return v1.dx * v2.dx + v1.dy * v2.dy;
}



