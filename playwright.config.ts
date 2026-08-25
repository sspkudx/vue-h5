import { defineConfig, devices } from '@playwright/test';

/**
 * E2E 配置（Playwright，2026-08 落地）
 *
 * - 目标：example-app（唯一应用），webServer 自动拉起 Vite dev（端口 2000，复用 vite.config.ts 的 server.port）。
 * - H5 定位：默认用移动端 viewport（390×844，对齐 postcss-px-to-viewport 的 viewportWidth 390）+ 触摸，
 *   契合商家端/低端安卓 WebView 场景；如需桌面/其它设备可加 project。
 * - 运行：`pnpm test:e2e`（本地需先 `pnpm exec playwright install chromium`）。
 */
export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    forbidOnly: Boolean(process.env.CI),
    retries: process.env.CI ? 2 : 0,
    reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
    use: {
        baseURL: 'http://localhost:2000',
        trace: 'on-first-retry',
    },
    projects: [
        {
            name: 'mobile-chrome',
            use: {
                ...devices['Pixel 5'],
                // 覆盖 Pixel 5 视口为项目统一基线（viewportWidth 390）
                viewport: { width: 390, height: 844 },
            },
        },
    ],
    webServer: {
        command: 'pnpm -F example-app dev --host 127.0.0.1',
        url: 'http://localhost:2000',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
    },
});
