import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { defineConfig } from 'vitest/config';

/**
 * 单测配置（Vitest，2026-08 起替代 jest/ts-jest）
 *
 * - 覆盖范围：
 *   - `packages/**`：纯 TS 包，默认 `environment: 'node'`；
 *   - `apps/**`：应用级组件测试（P2，2026-08 落地），测试文件顶部用
 *     `// @vitest-environment jsdom` 标注 DOM 环境（见 example-app 的示例测试）。
 * - 插件：vue() + vueJsx() 与应用的 vite.config.ts 一致，支撑 .vue SFC 与
 *   .tsx（Vue JSX）组件的测试编译。
 * - workspace 包（@my-app/*）在测试中走 Vite dev 解析 → 包 exports 的
 *   development 条件 → src（与开发期一致，无需 moduleNameMapper）。
 * - 覆盖率阈值 100%：守护 shared 包"测试质量是仓库标杆"的宣称（见 TESTING.md）；
 *   coverage.include 仅限 packages/**（apps 组件测试为冒烟/行为验证，不参与覆盖率门槛）。
 */
export default defineConfig({
    plugins: [vue(), vueJsx()],
    test: {
        include: ['packages/**/src/**/*.test.ts', 'apps/**/src/**/*.test.{ts,tsx}'],
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
