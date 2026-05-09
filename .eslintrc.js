module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
        'shared-node-browser': true,
        // This key must be true, or when using defineProps
        // without import at <script setup></script>,
        // the code will be taken as a mistake
        'vue/setup-compiler-macros': true,
    },
    extends: [
        'plugin:vue/vue3-essential',
        'eslint:recommended',
        '@vue/typescript/recommended',
        'plugin:prettier/recommended',
        'prettier',
    ],
    parser: 'vue-eslint-parser',
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        parser: '@typescript-eslint/parser',
        ecmaFeatures: {
            jsx: true,
            modules: true,
        },
    },
    plugins: ['prettier', '@typescript-eslint', 'vue'],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        semi: ['error', 'always'],
        quotes: ['error', 'single', { avoidEscape: true }],
        indent: ['error', 4, { SwitchCase: 1 }],
        'prettier/prettier': ['error', {}, { usePrettierrc: true }],
        'vue/multi-word-component-names': 'off',

        // Vue 3 specific rules
        'vue/script-setup-uses-vars': 'error',
        'vue/no-unused-vars': ['error', { ignorePattern: '^_' }],
        'vue/require-default-prop': 'off',
        'vue/require-prop-types': 'off',

        // TypeScript specific rules
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',

        // General best practices
        'no-unused-vars': 'off', // Use @typescript-eslint/no-unused-vars instead
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
    },
    overrides: [
        {
            // Test files specific rules
            files: ['**/__tests__/**/*.{js,ts}', '**/*.test.{js,ts}', '**/*.spec.{js,ts}'],
            env: {
                jest: true,
            },
            rules: {
                // Disable some rules for test files
                'no-empty-function': 'off',
                '@typescript-eslint/no-empty-function': 'off',
                '@typescript-eslint/no-explicit-any': 'off',
                '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
                'no-unused-expressions': 'off',
            },
        },
        {
            // Vue files specific rules
            files: ['*.vue'],
            parser: 'vue-eslint-parser',
            parserOptions: {
                parser: '@typescript-eslint/parser',
            },
        },
    ],
};
