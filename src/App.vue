<template>
    <div class="room-visualizer">
        <h1>Room Visualizer</h1>
        <div class="controls">
            <button @click="loadRandomRoom">Load Random Room</button>
            <button @click="changeSelectedAxisSystem">Change Axis System</button>
            <div class="scale-controls">
                <label style="margin-right: 4px">Padding:</label>
                <input
                    v-model.number="scalePadding"
                    :step="0.2"
                    class="number-input"
                    type="number"
                />
            </div>
        </div>

        <svg
            ref="svg"
            :viewBox="viewBox"
            height="600"
            width="700"
        >
            <g id="walls">
                <line
                    v-for="wall in walls"
                    :key="wall.id"
                    :x1="wall.start.x" :x2="wall.end.x"
                    :y1="wall.start.y" :y2="wall.end.y"
                    stroke="#333" stroke-width="3"
                />
            </g>

            <g id="corners">
                <circle
                    v-for="corner in corners"
                    :key="corner.id"
                    :cx="corner.x" :cy="corner.y"
                    class="corner"
                    r="5"
                />
            </g>

            <dimension-line
                v-if="lengthProps.measurement"
                :endPoint="lengthProps.end"
                :offset="LENGTH_OFFSET"
                :projectionLines="lengthProps.projectionLines"
                :startPoint="lengthProps.start"
                :value="lengthProps.measurement"
                color="red"
                label="Length"
            />

            <dimension-line
                v-if="widthProps.measurement"
                :endPoint="widthProps.end"
                :offset="WIDTH_OFFSET"
                :projectionLines="widthProps.projectionLines"
                :startPoint="widthProps.start"
                :value="widthProps.measurement"
                color="blue"
                label="Width"
            />

        </svg>

        <div class="info">
            <p><strong>Room Type:</strong> {{ roomType }}</p>
            <p v-if="lengthProps.measurement">Length: {{ lengthProps.measurement.toFixed(2) }} units</p>
            <p v-if="widthProps.measurement">Width: {{ widthProps.measurement.toFixed(2) }} units</p>
            <p v-if="axisSystems.length">Axsis Systems Available : {{ axisSystems.length }}</p>
        </div>
        <error-display v-if="isErrorVisible"/>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import roomData from "@/data/roomExamples";
import type { Corner, Wall } from "@/types/room";
import type { AxisSystem, DimensionProps } from "@/types/geometry";
import {
    buildDimensionProps,
    calculateRoomDimensionsForAxis,
    filterUniqueDirectionWalls,
    getMeasurementAxes,
} from "@/utils/calculateDimensions.ts";

import DimensionLine from "@/components/DimensionLine.vue";
import ErrorDisplay from "@/components/ErrorDisplay.vue";

import { getRandomRoomType, processRoom } from "@/utils/roomUtils";
import { computeBounds } from "@/utils/displayUtils";
import { useErrorHandler } from "@/composables/useErrorHandler";

const { safeExecute, isErrorVisible } = useErrorHandler();

// Adding padding around the room
const scalePadding = ref(0.4);
const bounds = computed(() => {
    const { safeExecute } = useErrorHandler();

    return safeExecute(() => computeBounds(corners.value.map(c => ({ x: c.x, y: c.y }))),
        'bounds computation'
    ) || { minX: 0, minY: 0, width: 0, height: 0 };
});

// Compute SVG viewBox with padding
const viewBox = computed(() => {
    const paddingWidth = bounds.value.width * scalePadding.value;
    const paddingHeight = bounds.value.height * scalePadding.value;

    return [
        bounds.value.minX - paddingWidth / 2,
        bounds.value.minY - paddingHeight / 2,
        bounds.value.width + paddingWidth,
        bounds.value.height + paddingHeight
    ].join(" ");
});

const selectedSystem = ref<AxisSystem | null>(null);
const axisSystems = ref<AxisSystem[]>([]);

function changeSelectedAxisSystem() {
    if (axisSystems.value.length > 1) {
        const currentIndex = axisSystems.value.findIndex(system => system === selectedSystem.value);
        const nextIndex = (currentIndex + 1) % axisSystems.value.length;
        selectedSystem.value = axisSystems.value[nextIndex];

        calculateDimensions(corners.value);
    }
}

const widthProps = ref<DimensionProps | object>({
    measurement: 0,
    start: null,
    end: null,
});
const WIDTH_OFFSET = 40;
const lengthProps = ref<DimensionProps | object>({
    measurement: 0,
    start: null,
    end: null,
});
const LENGTH_OFFSET = 40;

function calculateDimensions(corners: Corner[]): void {
    safeExecute(() => {
        if (!selectedSystem.value) return;

        const {
            width,
            length,
            extremePoints
        } = calculateRoomDimensionsForAxis(corners, selectedSystem.value)
        const { minX, minY, maxX, maxY } = extremePoints;
        const { xDirection, yDirection, zeroPoint } = selectedSystem.value;

        lengthProps.value = buildDimensionProps(minX, maxX, xDirection, zeroPoint, length, LENGTH_OFFSET)
        widthProps.value = buildDimensionProps(minY, maxY, yDirection, zeroPoint, width, WIDTH_OFFSET)
    }, 'Error calculating dimensions');
}

const walls = ref<Wall[]>([]);
const corners = ref<Corner[]>([]);
const roomType = ref<string>("");

function loadRandomRoom() {
    safeExecute(() => {
        let randomType = getRandomRoomType();
        while (roomType.value === randomType) {
            // Ensure a different room type is selected
            randomType = getRandomRoomType();
        }

        roomType.value = randomType;

        const processedRoom = processRoom(roomData[randomType]);
        corners.value = processedRoom.corners;
        walls.value = processedRoom.walls;

        const uniqueWalls = filterUniqueDirectionWalls(walls.value);
        axisSystems.value = uniqueWalls.map((wall) => getMeasurementAxes(wall));
        selectedSystem.value = axisSystems.value[0];

        calculateDimensions(corners.value);
    }, "Error loading random room");
};

loadRandomRoom();
</script>

<style>
.corner {
    fill: #666;
}

.room-visualizer {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
}

svg {
    border: 1px solid #ccc;
    margin-bottom: 20px;
}

.controls {
    margin-bottom: 24px;
}

.scale-controls {
    display: flex;
    justify-content: center;
}

button {
    padding: 8px 16px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    margin: 10px 5px;
}

button:hover {
    background-color: #45a049;
}

.info {
    background-color: #f5f5f5;
    padding: 12px;
    border-radius: 4px;
}
</style>
