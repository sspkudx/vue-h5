module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/packages'],
    testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
    transform: {
        // TS 6.0 起 types 默认为 []，根目录无 tsconfig.json，需内联提供 jest/node 全局类型
        '^.+\\.ts$': [
            'ts-jest',
            {
                tsconfig: {
                    types: ['jest', 'node'],
                    esModuleInterop: true,
                },
            },
        ],
    },
    transformIgnorePatterns: ['node_modules/(?!(.*))'],
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    collectCoverageFrom: [
        'packages/**/*.ts',
        '!packages/**/*.d.ts',
        '!packages/**/node_modules/**',
        '!packages/**/dist/**',
        '!packages/**/__tests__/**',
        '!packages/**/*.test.ts',
        '!packages/**/*.spec.ts',
    ],
    coverageDirectory: '<rootDir>/coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    moduleNameMapper: {
        '^@my-app/(.*)$': '<rootDir>/packages/$1/src',
    },
    testEnvironmentOptions: {
        url: 'http://localhost/',
    },
};
