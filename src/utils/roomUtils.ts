import type { Corner, ProcessedRoom, Room, WallReference } from "@/types/room";
import roomData from "@/data/roomExamples";

/**
 * Converts a Room object to a ProcessedRoom by resolving wall references
 * and connecting them to corners
 */
export function processRoom(room: Room): ProcessedRoom {
    validateRoomData(room);

    const resolvedWalls = room.walls.map((wallRef: WallReference) => {
        const startCorner = room.corners.find((corner: Corner) =>
            corner.wallStarts.some(wall => wall.id === wallRef.id)
        );

        const endCorner = room.corners.find((corner: Corner) =>
            corner.wallEnds.some(wall => wall.id === wallRef.id)
        );

        if (!startCorner || !endCorner) {
            throw new Error(`Corners for wall WallId: ${wallRef.id}, not found`);
        }

        return {
            id: wallRef.id,
            start: { x: startCorner.x, y: startCorner.y },
            end: { x: endCorner.x, y: endCorner.y }
        };
    });

    return {
        corners: room.corners,
        walls: resolvedWalls
    };
}

/**
 * Returns a random room type from the available options
 */
export function getRandomRoomType() {
    if (!roomData || typeof roomData !== 'object') {
        throw new Error('Room data is not available or invalid');
    }
    const possibleRoomTypes = Object.keys(roomData);
    if (possibleRoomTypes.length === 0) {
        throw new Error('No room types available');
    }
    return possibleRoomTypes[Math.floor(Math.random() * possibleRoomTypes.length)];
}

/**
 * Validates the room data structure
 */
function validateRoomData(room: Room) {
    if (!room) {
        throw new Error('Room data is missing');
    }

    if (!Array.isArray(room.corners)) {
        throw new Error('Room corners data is invalid or missing');
    }

    room.corners.forEach((corner, index) => {
        if (!corner.id) {
            throw new Error(`Corner at index ${index} is missing ID`);
        }
        if (typeof corner.x !== 'number' || typeof corner.y !== 'number') {
            throw new Error(`Corner ${corner.id} has invalid coordinates`);
        }
        if (!Array.isArray(corner.wallStarts)) {
            throw new Error(`Corner ${corner.id} is missing wall starts`);
        }
        if (!Array.isArray(corner.wallEnds)) {
            throw new Error(`Corner ${corner.id} is missing wall ends`);
        }
        if (corner.wallStarts.length === 0 && corner.wallEnds.length === 0) {
            throw new Error(`Corner ${corner.id} has no connected walls`);
        }
    });
}