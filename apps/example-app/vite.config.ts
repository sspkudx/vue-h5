import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import legacy from '@vitejs/plugin-legacy';

/** 应用根目录（vite.config 以 ESM 执行，无 __dirname） */
const appRoot = fileURLToPath(new URL('.', import.meta.url));

/**
 * 导航到仓库根目录路径
 * @param {string} [rootPath=''] - 相对根目录的子路径，默认为空字符串
 * @returns {string} 解析后的绝对路径
 */
const toRoot = (rootPath = '') => {
    return resolve(appRoot, `../../${rootPath}`);
};

export default defineConfig(({ mode }) => {
    // loadEnv 第三个参数传 '' 以读取全部前缀的变量（含 VITE_APP_API_TARGET）
    const env = loadEnv(mode, appRoot, '');
    const isDev = mode === 'development';

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
                '@': resolve(appRoot, 'src'),
                // 开发环境指向源码目录（支持热更新）
                // 生产环境不设 alias，走 workspace 标准解析（package.json exports -> dist），
                // 可顺带验证 exports 配置的正确性；构建顺序由 scripts/build.sh 保证（先 packages 后 apps）
                ...(isDev ? { '@my-app/shared': toRoot('packages/shared/src') } : {}),
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
                // 同时导出原类名与驼峰类名（about-view → aboutView），对齐 vue-cli 的 exportLocalsConvention
                localsConvention: 'camelCase',
                // 对齐 css-loader 的 localIdentName
                generateScopedName: '[local]__[hash:base64]',
            },
        },
    };
});
