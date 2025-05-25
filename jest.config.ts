import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    moduleFileExtensions: ["js", "ts", "json", "vue"],
    transform: {
        "^.+\\.ts$": "ts-jest",
        "^.+\\.vue$": "@vue/vue3-jest"
    },
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1"
    },
    moduleDirectories: ["node_modules", "src"],
    testMatch: ["**/*.spec.[jt]s?(x)", "**/*.test.[jt]s?(x)"],
    collectCoverageFrom: [
        "src/**/*.{js,ts,vue}",
        "!src/main.ts",
    ],
};

export default config;