import type { Point } from "./geometry";

/**
 * Reference to a wall by ID
 */
export interface WallReference {
    id: string;
}

/**
 * Reference to a wall that starts at a corner
 */
export interface WallStart {
    id: string;
}

/**
 * Reference to a wall that ends at a corner
 */
export interface WallEnd {
    id: string;
}

/**
 * Represents a corner point in a room
 */
export interface Corner {
    id: string;
    x: number;
    y: number;
    wallStarts: WallStart[];
    wallEnds: WallEnd[];
}

/**
 * Represents a wall with start and end points
 */
export interface Wall extends WallReference {
    start: Point;
    end: Point;
}

/**
 * Data structure for a room with corners and wall references
 */
export interface Room {
    corners: Corner[];
    walls: WallReference[];
}

/**
 * Processed room with resolved wall references
 */
export interface ProcessedRoom {
    corners: Corner[];
    walls: Wall[];
}

/**
 * Collection of room data by room type
 */
export interface RoomData {
    [key: string]: Room;
}
