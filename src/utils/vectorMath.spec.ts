import { describe, expect, it } from "@jest/globals";
import {
    createVector,
    vectorLength,
    normalizeVector,
    perpendicularVector,
    dotProduct
} from "./vectorMath";
import type { Point, Vector } from "@/types/geometry";

describe("Geometry Utilities", () => {
    describe("createVector", () => {
        it("creates a vector from two defined points", () => {
            const from: Point = { x: 1, y: 2 };
            const to: Point = { x: 4, y: 6 };
            const v = createVector(from, to);
            expect(v).toEqual({ dx: 3, dy: 4 });
        });

        it("throws if either point is undefined or null", () => {
            const p: Point = { x: 0, y: 0 };
            expect(() => createVector(undefined as unknown as Point, p)).toThrow("Points must be defined to create a vector");
            expect(() => createVector(p, null as unknown as Point)).toThrow("Points must be defined to create a vector");
        });
    });

    describe("vectorLength", () => {
        it("calculates the correct length of a non-zero vector", () => {
            const v: Vector = { dx: 3, dy: 4 };
            expect(vectorLength(v)).toBe(5);
        });

        it("throws if vector is undefined or null", () => {
            expect(() => vectorLength(undefined as unknown as Vector)).toThrow("Vector must be defined to calculate its length");
        });
    });

    describe("normalizeVector", () => {
        it("normalizes a non-zero vector to length 1", () => {
            const v: Vector = { dx: 3, dy: 4 };
            const n = normalizeVector(v);
            expect(n.dx).toBeCloseTo(3 / 5);
            expect(n.dy).toBeCloseTo(4 / 5);
            expect(vectorLength(n)).toBeCloseTo(1);
        });

        it("throws when trying to normalize a zero vector", () => {
            const zero: Vector = { dx: 0, dy: 0 };
            expect(() => normalizeVector(zero)).toThrow("Cannot normalize zero vector");
        });
    });

    describe("perpendicularVector", () => {
        it("returns a perpendicular vector", () => {
            const v: Vector = { dx: 1, dy: 2 };
            const p = perpendicularVector(v);
            // A perpendicular vector to (1,2) is (-2,1)
            expect(p).toEqual({ dx: -2, dy: 1 });
            // Dot product of original and perpendicular should be zero
            expect(dotProduct(v, p)).toBeCloseTo(0);
        });

        it("throws if vector is undefined or null", () => {
            expect(() => perpendicularVector(null as unknown as Vector)).toThrow("Vector must be defined to create a perpendicular vector");
        });
    });

    describe("dotProduct", () => {
        it("computes the correct dot product of two vectors", () => {
            const a: Vector = { dx: 2, dy: 3 };
            const b: Vector = { dx: 4, dy: -1 };
            expect(dotProduct(a, b)).toBe(2 * 4 + 3 * -1);
        });

        it("throws if either vector is undefined or null", () => {
            const v: Vector = { dx: 0, dy: 0 };
            expect(() => dotProduct(undefined as unknown as Vector, v)).toThrow("Both vectors must be defined for dot product calculation");
            expect(() => dotProduct(v, undefined as unknown as Vector)).toThrow("Both vectors must be defined for dot product calculation");
        });
    });
});
