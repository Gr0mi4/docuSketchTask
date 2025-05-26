<template>
    <g class="dimension-line">
        <line
            :x1="displayStartPoint.x"
            :y1="displayStartPoint.y"
            :x2="displayEndPoint.x"
            :y2="displayEndPoint.y"
            :stroke="color"
            stroke-width="2"
        />

        <polygon
            :points="getStartArrowPoints()"
            :fill="color"
        />
        <polygon
            :points="getEndArrowPoints()"
            :fill="color"
        />

        <text
            :x="getLabelX()"
            :y="getLabelY()"
            :fill="color"
            font-size="20"
            text-anchor="middle"
            dy="-10"
            :transform="`rotate(${textAngle}, ${getLabelX()}, ${getLabelY()})`"
        >
            {{ label }}: {{ value.toFixed(2) }}
        </text>

        <line
            v-for="(line, index) in projectionLines"
            :key="`proj-${index}`"
            :x1="line.start.x"
            :y1="line.start.y"
            :x2="line.end.x"
            :y2="line.end.y"
            :stroke="color"
            stroke-width="1"
            stroke-dasharray="5,3"
        />
    </g>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Point } from "@/types/geometry";
import { createVector, normalizeVector, perpendicularVector } from "@/utils/vectorMath";

const props = defineProps({
    startPoint: {
        type: Object as () => Point,
        required: true
    },
    endPoint: {
        type: Object as () => Point,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    label: {
        type: String,
        default: "Distance"
    },
    color: {
        type: String,
        default: "red"
    },
    arrowSize: {
        type: Number,
        default: 10
    },
    projectionLines: {
        type: Array as () => { start: Point, end: Point }[],
        default: () => []
    },
    offset: {
        type: Number,
        default: 0
    }
});

const dimensionVector = computed(() => createVector(props.startPoint, props.endPoint));
const angle = computed(() => Math.atan2(dimensionVector.value.dy, dimensionVector.value.dx));

const offsetVector = computed(() => {
    const perpVector = perpendicularVector(dimensionVector.value);

    return normalizeVector(perpVector);
});

// Calculating the points with offset
const displayStartPoint = computed(() => ({
    x: props.startPoint.x + offsetVector.value.dx * props.offset,
    y: props.startPoint.y + offsetVector.value.dy * props.offset
}));

const displayEndPoint = computed(() => ({
    x: props.endPoint.x + offsetVector.value.dx * props.offset,
    y: props.endPoint.y + offsetVector.value.dy * props.offset
}));


function getArrowPoints(point: Point, angle: number, arrowSize: number): string {
    const x = point.x;
    const y = point.y;

    const point1X = x + arrowSize * Math.cos(angle - Math.PI / 6);
    const point1Y = y + arrowSize * Math.sin(angle - Math.PI / 6);

    const point2X = x + arrowSize * Math.cos(angle + Math.PI / 6);
    const point2Y = y + arrowSize * Math.sin(angle + Math.PI / 6);

    return `${x},${y} ${point1X},${point1Y} ${point2X},${point2Y}`;
}

const getStartArrowPoints = () => {
    return getArrowPoints(displayStartPoint.value, angle.value + Math.PI, props.arrowSize);
};

const getEndArrowPoints = () => {
    return getArrowPoints(displayEndPoint.value, angle.value, props.arrowSize);
};

const getLabelX = () => {
    return (displayStartPoint.value.x + displayEndPoint.value.x) / 2;
};

const getLabelY = () => {
    return (displayStartPoint.value.y + displayEndPoint.value.y) / 2;
};

const textAngle = computed(() => {
    let degrees = angle.value * (180 / Math.PI);

    if (degrees > 90 || degrees < -90) {
        degrees += 180;
    }

    return degrees;
});


</script>

<style scoped>
.dimension-line {
    pointer-events: none;
}
</style>
