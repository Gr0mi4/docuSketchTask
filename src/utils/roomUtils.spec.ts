import { describe, expect, it, jest, afterEach } from "@jest/globals";
import { processRoom, getRandomRoomType } from "@/utils/roomUtils";
import type { Room } from "@/types/room";

describe("processRoom", () => {
    const validRoom: Room = {
        corners: [
            {
                id: "c1",
                x: 0,
                y: 0,
                wallStarts: [{ id: "w1" }],
                wallEnds: []
            },
            {
                id: "c2",
                x: 2,
                y: 0,
                wallStarts: [],
                wallEnds: [{ id: "w1" }]
            }
        ],
        walls: [{ id: "w1" }]
    };

    it("resolves wall references into full wall objects with start and end coordinates", () => {
        const result = processRoom(validRoom);
        expect(result.corners).toHaveLength(2);
        expect(result.walls).toEqual([
            {
                id: "w1",
                start: { x: 0, y: 0 },
                end: { x: 2, y: 0 }
            }
        ]);
    });

    it("throws if corner for wall start is missing", () => {
        const roomMissingStart: Room = {
            corners: [
                {
                    id: "c2",
                    x: 2,
                    y: 0,
                    wallStarts: [],
                    wallEnds: [{ id: "w1" }]
                }
            ],
            walls: [{ id: "w1" }]
        };

        expect(() => processRoom(roomMissingStart)).toThrow(
            "Corners for wall WallId: w1, not found"
        );
    });

    it("throws if corner for wall end is missing", () => {
        const roomMissingEnd: Room = {
            corners: [
                {
                    id: "c1",
                    x: 0,
                    y: 0,
                    wallStarts: [{ id: "w1" }],
                    wallEnds: []
                }
            ],
            walls: [{ id: "w1" }]
        };

        expect(() => processRoom(roomMissingEnd)).toThrow(
            "Corners for wall WallId: w1, not found"
        );
    });

    it("throws if room is missing", () => {
        expect(() => processRoom(undefined as unknown as Room)).toThrow("Room data is missing");
    });
});

jest.mock("@/data/roomExamples", () => ({
    default: {
        simpleRoom: {
            walls: [{ id: "wall1" }, { id: "wall2" }],
            corners: [{ id: "corner1", x: 0, y: 0 }]
        },
        tShapeRoom: {
            walls: [{ id: "wall3" }, { id: "wall4" }],
            corners: [{ id: "corner2", x: 10, y: 10 }]
        },
        triangleRoom: {
            walls: [{ id: "wall5" }],
            corners: [{ id: "corner3", x: 20, y: 20 }]
        }
    }
}));

describe("getRandomRoomType", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    const expectedTypes = ["simpleRoom", "tShapeRoom", "triangleRoom"];

    it("returns a valid room type from room data", () => {
        const type = getRandomRoomType();
        expect(typeof type).toBe("string");
        expect(expectedTypes).toContain(type);
    });

    it("throws if room data is not available", async () => {
        jest.resetModules();
        jest.doMock("@/data/roomExamples", () => ({ default: null }), { virtual: true });

        const { getRandomRoomType } = await import("@/utils/roomUtils");
        expect(() => getRandomRoomType()).toThrow("Room data is not available or invalid");
    });

    it("throws if room data is invalid", async () => {
        jest.resetModules();
        jest.doMock("@/data/roomExamples", () => ({ default: "invalid data" }), { virtual: true });

        const { getRandomRoomType } = await import("@/utils/roomUtils");
        expect(() => getRandomRoomType()).toThrow("Room data is not available or invalid");
    });

    it("throws if no room types are available", async () => {
        jest.resetModules();
        jest.doMock("@/data/roomExamples", () => ({ default: {} }), { virtual: true });

        const { getRandomRoomType } = await import("@/utils/roomUtils");
        expect(() => getRandomRoomType()).toThrow("No room types available");
    });
});