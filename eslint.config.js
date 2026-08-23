const { defineConfigWithVueTs, vueTsConfigs } = require('@vue/eslint-config-typescript');
const pluginVue = require('eslint-plugin-vue');
const eslintConfigPrettier = require('eslint-config-prettier');
const globals = require('globals');

const baseRules = {
    semi: ['error', 'always'],
    quotes: ['error', 'single', { avoidEscape: true }],
    'vue/multi-word-component-names': 'off',
    'vue/require-default-prop': 'off',
    'vue/require-prop-types': 'off',
    'vue/no-unused-vars': ['error', { ignorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': ['error', 'always'],
    'array-callback-return': 'error',
    'default-case': 'error',
    eqeqeq: ['error', 'always'],
    'no-empty-function': ['error', { allow: ['constructors', 'arrowFunctions'] }],
    'no-implicit-coercion': 'error',
    'no-implicit-globals': 'error',
    'no-lone-blocks': 'error',
    'no-loop-func': 'error',
    'no-new': 'error',
    'no-new-wrappers': 'error',
    'no-sequences': 'error',
    'no-throw-literal': 'error',
    'no-unmodified-loop-condition': 'error',
    'no-unused-expressions': ['error', { allowTernary: true, allowShortCircuit: true }],
    'no-useless-concat': 'error',
    'no-useless-return': 'error',
    'require-await': 'error',
    'wrap-iife': ['error', 'inside'],
    yoda: ['error', 'never'],
};

module.exports = defineConfigWithVueTs(
    pluginVue.configs['flat/essential'],
    vueTsConfigs.recommended,
    {
        name: 'vue-h5/base',
        files: ['**/*.{js,jsx,ts,tsx,vue}'],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: baseRules,
    },
    {
        name: 'vue-h5/test',
        files: ['**/__tests__/**/*.{js,ts}', '**/*.test.{js,ts}', '**/*.spec.{js,ts}'],
        languageOptions: {
            globals: {
                ...globals.jest,
            },
        },
        rules: {
            'no-empty-function': 'off',
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            'no-unused-expressions': 'off',
        },
    },
    {
        name: 'vue-h5/ignores',
        ignores: [
            'node_modules/**',
            'dist/**',
            'coverage/**',
            'public/**',
            '.github/**',
            // CJS 工具配置与脚本（require 用法合法，且不属于 src 代码）
            '**/*.config.js',
            '**/*.config.cjs',
            '**/.postcssrc.js',
            '**/.postcssrc.cjs',
            // 纯 shell/mjs 工具脚本（.mjs 不在 eslint files 模式内，本行兜底）与技能自带脚本
            'scripts/**/*.mjs',
            '.claude/skills/**/scripts/**',
            // 注意：scripts/dev-launcher/web/**（启动器控制台前端）是 Vue 子工程，
            // 必须纳入 lint/format（见根 package.json 的 lint/format globs），不要整体忽略 scripts/**
        ],
    },
    eslintConfigPrettier
);
