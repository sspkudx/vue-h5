import { defineConfig } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import childProcess from 'child_process';
import fs from 'fs';

const input = 'src/index.ts';

export default defineConfig([
    /* 1. ESM JavaScript 构建（保持不动） */
    {
        input,
        output: {
            file: 'dist/index.js',
            format: 'esm',
            sourcemap: true, // Rollup 级别的 sourcemap
        },
        external: [/[/\\]__tests__[/\\]/, /\.test\.ts$/, /\.spec\.ts$/, 'react', 'react-dom', 'vue'],
        plugins: [
            resolve(),
            typescript({
                tsconfig: './tsconfig.json',
                exclude: ['**/*.test.ts', '**/*.spec.ts'],
                declaration: false, // 仍然不在这里生成声明
                sourceMap: true, // 启用 TypeScript 源映射
            }),
        ],
    },

    /* 2. 类型声明构建：先 tsc → 再 dts 合并 */
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/index.d.ts',
            format: 'es',
        },
        plugins: [
            {
                name: 'tsc-declare',
                buildStart() {
                    // 清理并重新生成 .d.ts
                    const tempDir = 'dist/temp-dts';
                    if (fs.existsSync(tempDir)) {
                        fs.rmSync(tempDir, { recursive: true, force: true });
                    }
                    childProcess.execSync('npx tsc -p tsconfig.build.json', { stdio: 'inherit' });
                },
            },
            dts(),
            {
                name: 'clean-temp',
                buildEnd() {
                    const tempDir = 'dist/temp-dts';
                    if (fs.existsSync(tempDir)) {
                        fs.rmSync(tempDir, { recursive: true, force: true });
                    }
                },
            },
        ],
    },
]);
