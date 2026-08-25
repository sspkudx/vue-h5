import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import legacy from '@vitejs/plugin-legacy';

/** 应用根目录（vite.config 以 ESM 执行，无 __dirname） */
const appRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig(({ mode }) => {
    // loadEnv 第三个参数传 '' 以读取全部前缀的变量（含 VITE_APP_API_TARGET）
    const env = loadEnv(mode, appRoot, '');

    return {
        plugins: [
            vue(),
            vueJsx(),
            // 兼容性基线由根目录 .browserslistrc（chrome 49）驱动：
            // 自动生成 legacy 产物（ES5 + core-js polyfill + SystemJS 加载）与 modern 产物
            legacy(),
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
                // workspace 包（@my-app/*）无需手工 alias：
                // 各包 package.json 的 exports 带 "development" 条件指向 src，
                // Vite dev 默认解析 development 条件（源码热更新），
                // 生产构建解析 import 条件（exports -> dist），
                // 可顺带验证 exports 配置的正确性；构建顺序由 `pnpm -r run build` 保证（拓扑排序，先 packages 后 apps）
            },
        },
        server: {
            port: 2000,
            proxy: {
                '/api': {
                    // 开发环境 API 代理目标，可通过 .env.development 的 VITE_APP_API_TARGET 覆盖
                    target: env.VITE_APP_API_TARGET || 'http://localhost:3000',
                    changeOrigin: true,
                },
            },
        },
        css: {
            preprocessorOptions: {
                less: {},
            },
            modules: {
                // 同时导出原类名与驼峰类名（about-view → aboutView），对齐 css-loader 的 exportLocalsConvention
                localsConvention: 'camelCase',
                // 对齐 css-loader 的 localIdentName
                generateScopedName: '[local]__[hash:base64]',
            },
        },
    };
});
