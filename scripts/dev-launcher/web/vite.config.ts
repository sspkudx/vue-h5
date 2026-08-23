import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

/** 启动器后端端口（与 server.mjs 的默认端口一致，可用 DEV_LAUNCHER_PORT 覆盖） */
const launcherPort = Number(process.env.DEV_LAUNCHER_PORT) || 8888;

export default defineConfig({
    plugins: [vue(), vueJsx()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    // 产物由 server.mjs 以静态目录托管，使用相对路径以适配任意端口
    base: './',
    build: {
        outDir: 'dist',
        emptyOutDir: true,
    },
    server: {
        // 页面自身迭代开发时：先启动启动器（pnpm dev），再运行 pnpm -F dev-launcher-web dev
        port: 8890,
        proxy: {
            '/api': {
                target: `http://127.0.0.1:${launcherPort}`,
                changeOrigin: true,
            },
        },
    },
});
