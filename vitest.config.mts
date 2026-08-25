import { defineConfig } from 'vitest/config';

/**
 * 单测配置（Vitest，2026-08 起替代 jest/ts-jest）
 *
 * - 覆盖范围：packages/**（纯 TS 包）。apps 的组件测试待补（见
 *   docs/agents/business-infrastructure.md 待补清单 P2），届时用
 *   文件级 `// @vitest-environment jsdom` 标注 DOM 环境即可。
 * - workspace 包（@my-app/*）在测试中走 Vite dev 解析 → 包 exports 的
 *   development 条件 → src（与开发期一致，无需 moduleNameMapper）。
 * - 覆盖率阈值 100%：守护 shared 包"测试质量是仓库标杆"的宣称（见 TESTING.md）；
 *   apps 加入测试后若稀释覆盖率，再按项目拆分阈值。
 */
export default defineConfig({
    test: {
        include: ['packages/**/src/**/*.test.ts'],
        environment: 'node',
        coverage: {
            provider: 'v8',
            include: ['packages/**/src/**/*.ts'],
            exclude: ['packages/**/src/**/*.d.ts', 'packages/**/src/**/__tests__/**', 'packages/**/src/**/*.test.ts'],
            reporter: ['text', 'html'],
            thresholds: {
                statements: 100,
                branches: 100,
                functions: 100,
                lines: 100,
            },
        },
    },
});
