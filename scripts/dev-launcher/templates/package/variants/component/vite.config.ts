import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

/** 包根目录（vite.config 以 ESM 执行，无 __dirname） */
const pkgRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
    plugins: [vue(), vueJsx()],
    build: {
        lib: {
            entry: resolve(pkgRoot, 'src/index.ts'),
            formats: ['es'],
            fileName() {
                return 'index.js';
            },
        },
        sourcemap: true,
        emptyOutDir: true,
        minify: false,
    },
});
