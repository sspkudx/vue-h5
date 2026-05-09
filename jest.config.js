module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/packages'],
    testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
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
    // Node 14兼容性设置
    testEnvironmentOptions: {
        url: 'http://localhost/',
    },
};
