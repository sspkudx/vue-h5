module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.d.ts',
        '!**/node_modules/**',
        '!**/dist/**',
        '!**/__tests__/**',
        '!**/*.test.ts',
        '!**/*.spec.ts',
    ],
    coverageDirectory: '<rootDir>/coverage',
    // 守护"测试质量是仓库标杆"：shared 当前 100% 覆盖（见 TESTING.md），
    // 新增导出必须补测试，否则 CI 失败
    coverageThreshold: {
        global: {
            statements: 100,
            branches: 100,
            functions: 100,
            lines: 100,
        },
    },
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
