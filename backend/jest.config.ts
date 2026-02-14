import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest/presets/default-esm",
    testEnvironment: "node",
    setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
    verbose: true,
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
    },
    transform: {
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                useESM: true,
            },
        ],
    },
    extensionsToTreatAsEsm: [".ts"],
};

export default config;
