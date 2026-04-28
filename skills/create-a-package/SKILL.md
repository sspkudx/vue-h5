---
name: create-a-package
description: 在本项目的packages目录下创建新的依赖包。根据用户提供的包名称、类型和描述自动创建完整的TypeScript包结构，支持工具库、组件库、工具函数集和插件库四种类型。
---

# 创建一个依赖包

## 概述

此技能用于在本项目的`packages`目录下创建新的依赖包。支持创建多种类型的包（工具库、组件库、工具函数集、插件库），并自动配置完整的 TypeScript 开发环境、构建工具、测试框架和文档模板。

主要功能：

-   自动创建符合项目规范的包目录结构
-   支持四种包类型，自动配置对应的依赖
-   提供完整的构建配置（Rollup + TypeScript）
-   生成详细的 README 文档和 API 说明
-   支持测试框架配置（可选）
-   提供交互式创建流程和验证机制

## 使用场景

-   用户需要在`packages`目录下创建新的依赖包
-   用户需要在 monorepo 中添加新的共享包
-   用户需要创建工具库、组件库或工具函数集
-   用户需要快速搭建符合项目规范的 TypeScript 包结构
-   用户需要为 Vue H5 项目创建共享的组件或工具

## 包类型说明

支持创建以下类型的包：

1. **工具库 (Utility Library)**

    - 包含通用的工具函数
    - 示例: `formatDate`, `safeNum`, `debounce` 等
    - 依赖: 通常是纯 TypeScript/JavaScript 库

2. **组件库 (Component Library)**

    - 包含可复用的 Vue 组件
    - 示例: `Button`, `Modal`, `Form` 等
    - 依赖: Vue 3.x 及相关依赖

3. **工具函数集 (Helper Functions)**

    - 针对特定业务场景的工具函数集合
    - 示例: `auth`, `http`, `validation` 等
    - 依赖: 根据具体功能而定

4. **插件库 (Plugin Library)**
    - Vue 插件或通用插件
    - 示例: 路由守卫、状态管理插件等
    - 依赖: Vue 及相关框架依赖

## 创建流程

### 1. 获取包信息

在创建包前，需要从用户处获取以下信息：

-   **包名称** (必需): 将用于 package.json 的 name 字段和目录名称
-   **包描述** (可选): 包的简短描述，将用于 README.md 和 package.json
-   **包类型** (可选): 包的类型（工具库、组件库、工具函数等），影响依赖配置
-   **是否添加测试** (可选): 是否包含测试目录和基础测试配置

### 2. 验证输入

验证包名称：

-   **命名规范**: 必须符合 npm 包名规范（小写字母、数字、连字符、@作用域）
-   **唯一性**: 不能与现有包重名（检查 `packages/` 目录）
-   **长度限制**: 建议 3-50 个字符
-   **作用域**: 建议使用 `@my-app/` 作用域前缀（如 `@my-app/utils`）

验证包类型：

-   **工具库**: 纯 TypeScript/JavaScript 工具函数
-   **组件库**: 包含 Vue 3 组件
-   **工具函数集**: 业务相关工具函数
-   **插件库**: Vue 插件或通用插件

验证包描述：

-   可选，但建议提供简要描述
-   长度建议 10-200 个字符
-   描述应该简洁明了，说明包的用途

### 3. 创建包目录结构

创建以下目录结构：

```
packages/{package-name}/
├── src/
│   ├── index.ts          # 包的主要入口文件
│   └── (其他源码文件)    # 可选的源代码文件
├── __tests__/           # 测试目录（可选）
│   └── index.test.ts    # 测试文件
├── README.md            # 包的说明文档
├── package.json         # 包配置文件
├── jest.config.js       # Jest测试配置（如果添加测试）
├── tsconfig.json        # TypeScript配置文件
├── tsconfig.build.json  # TypeScript构建配置
└── rollup.config.ts     # Rollup构建配置
```

### 4. 根据包类型配置 package.json

根据用户选择的包类型，创建不同的 `package.json` 配置：

#### 4.1 通用配置（所有类型）

```json
{
    "name": "@my-app/{package-name}",
    "version": "1.0.0",
    "description": "{package-description}",
    "main": "dist/index.js",
    "types": "dist/index.d.ts",
    "exports": {
        ".": {
            "import": "./dist/index.js",
            "require": "./dist/index.js"
        }
    },
    "scripts": {
        "clean": "rimraf dist",
        "prebuild": "pnpm run clean",
        "build": "rollup -c rollup.config.ts --configPlugin typescript",
        "dev": "rollup -c rollup.config.ts --configPlugin typescript --watch"
    },
    "keywords": [],
    "author": "",
    "license": "MIT",
    "engines": {
        "node": ">= 14"
    }
}
```

#### 4.2 工具库配置（无额外依赖）

```json
{
    "peerDependencies": {},
    "devDependencies": {
        "jest": "^29.7.0",
        "@types/jest": "^29.5.11",
        "ts-jest": "^29.1.1"
    }
}
```

#### 4.3 组件库配置

```json
{
    "peerDependencies": {
        "vue": "^3.5.33",
        "@vue/babel-plugin-jsx": "^1.5.0"
    },
    "devDependencies": {
        "jest": "^29.7.0",
        "@types/jest": "^29.5.11",
        "ts-jest": "^29.1.1",
        "@vue/test-utils": "^2.4.5",
        "@vue/vue3-jest": "^29.2.6",
        "@testing-library/vue": "^6.6.1"
    }
}
```

#### 4.4 工具函数集配置（根据业务需求）

```json
{
    "peerDependencies": {
        "vue": "^3.5.33",
        "axios": "^0.29.0"
    },
    "devDependencies": {
        "jest": "^29.7.0",
        "@types/jest": "^29.5.11",
        "ts-jest": "^29.1.1"
    }
}
```

#### 4.5 插件库配置

```json
{
    "peerDependencies": {
        "vue": "^3.5.33",
        "pinia": "^3.0.4",
        "vue-router": "^4.5.1"
    },
    "devDependencies": {
        "jest": "^29.7.0",
        "@types/jest": "^29.5.11",
        "ts-jest": "^29.1.1",
        "@vue/test-utils": "^2.4.5",
        "@vue/vue3-jest": "^29.2.6",
        "@testing-library/vue": "^6.6.1"
    }
}
```

**说明**: 根据用户选择的包类型，自动添加相应的 `peerDependencies`。

**模板文件内容**：

```json
{
    "name": "@my-app/{package-name}",
    "version": "1.0.0",
    "description": "",
    "main": "dist/index.js",
    "types": "dist/index.d.ts",
    "exports": {
        ".": {
            "import": "./dist/index.js",
            "require": "./dist/index.js"
        }
    },
    "scripts": {
        "clean": "rimraf dist",
        "prebuild": "pnpm run clean",
        "build": "rollup -c rollup.config.ts --configPlugin typescript",
        "dev": "rollup -c rollup.config.ts --configPlugin typescript --watch"
    },
    "keywords": [],
    "author": "",
    "license": "MIT",
    "peerDependencies": {
        "vue": "^3.5.33"
    },
    "engines": {
        "node": ">= 14"
    }
}
```

### 5. 配置 rollup.config.ts

创建`rollup.config.ts`文件，直接使用如下内容（与 shared 包保持一致）：

```ts
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
```

### 6. 配置 tsconfig.json

创建`tsconfig.json`文件, 直接使用如下内容：

```json
{
    "compilerOptions": {
        "target": "esnext",
        "module": "esnext",
        "strict": true,
        "jsx": "preserve",
        "jsxImportSource": "vue",
        "jsxFactory": "h",
        "jsxFragmentFactory": "Fragment",
        "moduleResolution": "node",
        "resolveJsonModule": true,
        "skipLibCheck": true,
        "esModuleInterop": true,
        "allowSyntheticDefaultImports": true,
        "forceConsistentCasingInFileNames": true,
        "useDefineForClassFields": true,
        "sourceMap": true,
        "lib": ["esnext", "dom", "dom.iterable", "scripthost"],
        "baseUrl": "./",
        "paths": {
            "tiny-emitter": ["types/rewrite-tiny-emitter.d.ts"]
        }
    },
    "include": [
        "src/**/*.ts",
        "src/**/*.tsx",
        "src/**/*.vue",
        "tests/**/*.ts",
        "tests/**/*.tsx",
        "types/*.d.ts",
        "../../types/*.d.ts",
        "rollup.config.ts"
    ],
    "exclude": ["node_modules"]
}
```

### 7. 配置 tsconfig.build.json

创建`tsconfig.build.json`文件, 直接使用如下内容：

```json
{
    "extends": "./tsconfig.json", // 继续继承仓库顶层约束
    "compilerOptions": {
        "declaration": true, // 关键：输出 .d.ts
        "emitDeclarationOnly": true, // 只发类型，不生成 js
        "outDir": "dist/temp-dts", // 临时目录，rollup 后再删
        "skipLibCheck": true, // 避免三方包类型错误阻塞构建
        "isolatedModules": false // 与 emitDeclarationOnly 共存
    },
    "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue", "types/*.d.ts", "../../types/*.d.ts"],
    "exclude": [
        "node_modules",
        "tests", // 测试文件不要
        "**/*.test.ts",
        "**/*.spec.ts",
        "rollup.config.ts" // 构建脚本不要
    ]
}
```

### 8. 根据包类型创建源码文件

根据用户选择的包类型，创建不同的源码文件：

#### 8.1 通用 index.ts（所有类型）

```ts
// 导出示例工具函数
function safeNum(inputValue: unknown): number {
    let res = Number(inputValue);
    if (Number.isNaN(res)) {
        res = 0;
    }
    return res;
}

// 导出示例工具函数
function formatDate(date: Date, format = 'YYYY-MM-DD'): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    if (format === 'YYYY-MM-DD') {
        return `${year}-${month}-${day}`;
    }

    return `${year}年${month}月${day}日`;
}

export { safeNum, formatDate };
```

#### 8.2 组件库示例（如果包类型为组件库）

```typescript
// src/components/ExampleComponent/index.tsx
import { defineComponent } from 'vue';

export const ExampleComponent = defineComponent({
    name: 'ExampleComponent',
    props: {
        title: {
            type: String,
            default: 'Hello World',
        },
    },
    setup(props) {
        return () => (
            <div class="example-component">
                <h2>{props.title}</h2>
                <p>这是一个示例组件</p>
            </div>
        );
    },
});

// src/index.ts（需要修改）
import { ExampleComponent } from './components/ExampleComponent';
export { ExampleComponent };
```

#### 8.3 工具函数集示例

```typescript
// src/utils/validation.ts
/**
 * 验证手机号格式
 * @param phone 手机号
 * @returns 是否有效
 */
export function isValidPhone(phone: string): boolean {
    return /^1[3-9]\d{9}$/.test(phone);
}

/**
 * 验证邮箱格式
 * @param email 邮箱地址
 * @returns 是否有效
 */
export function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// src/index.ts（需要修改）
export { isValidPhone, isValidEmail };
```

#### 8.4 插件库示例

```typescript
// src/plugins/auth.ts
import type { App } from 'vue';

export interface AuthPluginOptions {
    tokenKey?: string;
}

export const authPlugin = {
    install(app: App, options: AuthPluginOptions = {}) {
        const { tokenKey = 'token' } = options;

        // 设置 token
        const setToken = (token: string) => {
            localStorage.setItem(tokenKey, token);
        };

        // 获取 token
        const getToken = () => {
            return localStorage.getItem(tokenKey);
        };

        // 清除 token
        const clearToken = () => {
            localStorage.removeItem(tokenKey);
        };

        // 提供给全局使用
        app.config.globalProperties.$auth = {
            setToken,
            getToken,
            clearToken,
        };
    },
};

// src/index.ts（需要修改）
export { authPlugin };
```

#### 8.5 测试文件模板（如果选择添加测试）

##### 通用工具库测试示例

```typescript
// __tests__/index.test.ts
import { safeNum, formatDate } from '../src';

describe('工具函数测试', () => {
    describe('safeNum', () => {
        test('应该将有效数字字符串转换为数字', () => {
            expect(safeNum('123')).toBe(123);
            expect(safeNum('123.45')).toBe(123.45);
            expect(safeNum('-123')).toBe(-123);
        });

        test('应该将数字转换为数字', () => {
            expect(safeNum(123)).toBe(123);
            expect(safeNum(123.45)).toBe(123.45);
            expect(safeNum(-123)).toBe(-123);
            expect(safeNum(0)).toBe(0);
        });

        test('对于NaN值应该返回0', () => {
            expect(safeNum('abc')).toBe(0);
            expect(safeNum('')).toBe(0);
            expect(safeNum('   ')).toBe(0);
            expect(safeNum(null)).toBe(0);
            expect(safeNum(undefined)).toBe(0);
            expect(safeNum({})).toBe(0);
            expect(safeNum([])).toBe(0);
            expect(safeNum(NaN)).toBe(0);
        });

        test('应该处理布尔值', () => {
            expect(safeNum(true)).toBe(1);
            expect(safeNum(false)).toBe(0);
        });
    });

    describe('formatDate', () => {
        test('应该格式化日期为YYYY-MM-DD格式', () => {
            const date = new Date('2024-01-01');
            expect(formatDate(date, 'YYYY-MM-DD')).toBe('2024-01-01');
        });

        test('应该使用默认格式YYYY-MM-DD', () => {
            const date = new Date('2024-12-31');
            expect(formatDate(date)).toBe('2024-12-31');
        });

        test('应该处理其他格式', () => {
            const date = new Date('2024-01-01');
            expect(formatDate(date, 'YYYY年MM月DD日')).toBe('2024年01月01日');
        });
    });
});
```

##### Vue 组件测试示例

```typescript
// __tests__/components/Button.test.tsx
import { mount } from '@vue/test-utils';
import { Button } from '../../src/components/Button';

describe('Button组件', () => {
    test('渲染默认按钮', () => {
        const wrapper = mount(Button, {
            slots: {
                default: '点击我',
            },
        });

        expect(wrapper.text()).toBe('点击我');
        expect(wrapper.classes()).toContain('btn');
        expect(wrapper.classes()).toContain('btn-primary');
    });

    test('渲染次级按钮', () => {
        const wrapper = mount(Button, {
            props: {
                type: 'secondary',
            },
            slots: {
                default: '次级按钮',
            },
        });

        expect(wrapper.classes()).toContain('btn-secondary');
    });

    test('点击事件', async () => {
        const handleClick = jest.fn();
        const wrapper = mount(Button, {
            props: {
                onClick: handleClick,
            },
            slots: {
                default: '点击测试',
            },
        });

        await wrapper.trigger('click');
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
```

##### 测试工具函数

```typescript
// __tests__/utils/test-utils.ts
/**
 * 创建测试用的Vue应用
 */
export function createTestApp(component: any, options = {}) {
    return {
        component,
        ...options,
    };
}

/**
 * 模拟延迟
 */
export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 创建模拟的LocalStorage
 */
export class MockLocalStorage {
    private store: Record<string, string> = {};

    getItem(key: string): string | null {
        return this.store[key] || null;
    }

    setItem(key: string, value: string): void {
        this.store[key] = value;
    }

    removeItem(key: string): void {
        delete this.store[key];
    }

    clear(): void {
        this.store = {};
    }
}
```

##### 测试配置文件

```javascript
// jest.setup.js
// 全局测试设置
import { config } from '@vue/test-utils';

// 配置Vue Test Utils
global.console = {
    ...console,
    // 可以在这里重写console方法以便测试
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
};

// 配置Vue Test Utils全局设置
config.global.stubs = {
    // 全局stub配置
    teleport: true,
};

// 清理所有mocks
afterEach(() => {
    jest.clearAllMocks();
});
```

### 9. 创建其他文件

#### README.md

创建`README.md`文件，包含包的基本说明、使用方法和开发指南：

````markdown
# @my-app/{package-name}

> {package-description}

## 安装

```bash
# 在 monorepo 内部使用
pnpm add @my-app/{package-name}

# 或外部安装
npm install @my-app/{package-name}
```

## 使用

### 工具函数

```typescript
import { safeNum, formatDate } from '@my-app/{package-name}';

// 安全转换数字
const num = safeNum('123'); // 123
const num2 = safeNum('abc'); // 0

// 格式化日期
const today = new Date();
const formatted = formatDate(today); // '2024-01-01'
const chineseDate = formatDate(today, 'YYYY年MM月DD日'); // '2024年01月01日'
```

### Vue 组件（如果是组件库）

```vue
<template>
    <ExampleComponent />
</template>

<script setup lang="ts">
import { ExampleComponent } from '@my-app/{package-name}';
</script>
```

## 开发

### 本地开发

```bash
# 进入包目录
cd packages/{package-name}

# 启动开发模式（监听文件变化）
pnpm run dev

# 构建生产版本
pnpm run build
```

### 运行测试

```bash
# 测试包
pnpm test

# 测试包并监听变化
pnpm test:watch
```

### 发布

该包为 monorepo 内部包，通常不单独发布到 npm。

## API 文档

### safeNum(inputValue: unknown): number

安全地将输入值转换为数字。

-   **参数**:
    -   `inputValue: unknown` - 要转换的值
-   **返回值**: `number` - 转换后的数字，如果转换失败则返回 0
-   **示例**:
    ```typescript
    safeNum('123'); // 123
    safeNum('abc'); // 0
    safeNum(null); // 0
    ```

### formatDate(date: Date, format?: string): string

格式化日期为指定格式。

-   **参数**:
    -   `date: Date` - 要格式化的日期对象
    -   `format?: string` - 格式字符串，默认为 'YYYY-MM-DD'
-   **返回值**: `string` - 格式化后的日期字符串
-   **支持格式**:
    -   'YYYY-MM-DD': 2024-01-01
    -   其他格式: 2024 年 01 月 01 日

## 许可证

MIT
````

注意：请将 `{package-name}` 替换为实际的包名，`{package-description}` 替换为包的描述。

### 10. 验证创建结果

创建完成后，验证以下内容：

1. 目录结构是否正确
2. 所有文件是否创建成功
3. package.json 中的名称是否正确
4. 新应用是否可以 build 成功

## 完整使用示例

### 示例 1: 创建工具库包

**用户输入**: "创建一个名为 utils 的工具库包，用于日期和数字处理"

**处理流程**:

1. **获取信息**:

    - 包名称: `utils`
    - 包描述: "日期和数字处理的工具函数库"
    - 包类型: 工具库
    - 添加测试: 是

2. **验证输入**:

    - 验证包名 `utils` 符合规范
    - 检查 `packages/utils` 目录不存在
    - 确认包描述有效

3. **创建目录结构**:

    ```bash
    packages/
    └── utils/
        ├── src/
        │   ├── index.ts
        │   ├── date-utils.ts
        │   └── number-utils.ts
        ├── __tests__/
        │   └── index.test.ts
        ├── README.md
        ├── package.json
        ├── tsconfig.json
        ├── tsconfig.build.json
        └── rollup.config.ts
    ```

4. **配置文件**:

    - `package.json`: 配置为工具库类型（无额外依赖）
    - `tsconfig.json`: 添加 Vue JSX 支持
    - `rollup.config.ts`: 使用标准构建配置
    - `README.md`: 包含安装和使用说明

5. **源码文件**:

    ```typescript
    // src/date-utils.ts
    export function formatDate(date: Date, format = 'YYYY-MM-DD'): string {
        // 实现日期格式化
    }

    // src/number-utils.ts
    export function safeNum(value: unknown): number {
        // 实现安全数字转换
    }

    // src/index.ts
    export * from './date-utils';
    export * from './number-utils';
    ```

6. **测试文件**:

    ```typescript
    // __tests__/index.test.ts
    import { describe, it, expect } from 'vitest';
    import { safeNum } from '../src';

    describe('utils', () => {
        it('should convert string to number', () => {
            expect(safeNum('123')).toBe(123);
        });
    });
    ```

### 示例 2: 创建 Vue 组件库

**用户输入**: "创建一个名为 ui-components 的 Vue 组件库，包含按钮和弹窗组件"

**处理流程**:

1. **获取信息**:

    - 包名称: `ui-components`
    - 包描述: "Vue 3 组件库，包含常用 UI 组件"
    - 包类型: 组件库
    - 添加测试: 是

2. **配置 peerDependencies**:

    ```json
    {
        "peerDependencies": {
            "vue": "^3.5.33",
            "@vue/babel-plugin-jsx": "^1.5.0"
        }
    }
    ```

3. **创建组件结构**:

    ```bash
    packages/ui-components/
    └── src/
        ├── components/
        │   ├── Button/
        │   │   ├── index.tsx
        │   │   └── Button.vue
        │   ├── Modal/
        │   │   ├── index.tsx
        │   │   └── Modal.vue
        │   └── index.ts
        └── index.ts
    ```

4. **组件实现**:

    ```typescript
    // src/components/Button/index.tsx
    import { defineComponent } from 'vue';

    export const Button = defineComponent({
        name: 'Button',
        props: {
            type: {
                type: String as () => 'primary' | 'secondary',
                default: 'primary',
            },
        },
        setup(props) {
            return () => (
                <button class={`btn btn-${props.type}`}>
                    <slot />
                </button>
            );
        },
    });
    ```

### 示例 3: 创建业务工具函数集

**用户输入**: "创建一个名为 auth 的认证工具包，包含登录状态管理和 token 处理"

**处理流程**:

1. **获取信息**:

    - 包名称: `auth`
    - 包描述: "Vue 3 认证管理工具包"
    - 包类型: 工具函数集
    - 添加测试: 是

2. **配置依赖**:

    ```json
    {
        "peerDependencies": {
            "vue": "^3.5.33",
            "axios": "^0.29.0",
            "pinia": "^3.0.4"
        }
    }
    ```

3. **源码结构**:

    ```typescript
    // src/stores/auth.ts
    import { defineStore } from 'pinia';

    export const useAuthStore = defineStore('auth', {
        state: () => ({
            token: '',
            user: null,
        }),
        actions: {
            setToken(token: string) {
                this.token = token;
            },
        },
    });

    // src/utils/token.ts
    export function getToken(): string {
        return localStorage.getItem('token') || '';
    }

    // src/index.ts
    export * from './stores/auth';
    export * from './utils/token';
    ```

### 交互式创建流程

当用户请求创建包时，建议按以下流程交互：

1. **询问包名**:

    ```
    请输入包名称（例如：utils、ui-components、auth）：
    ```

2. **确认作用域**:

    ```
    是否使用 @my-app/ 作用域前缀？(y/n):
    ```

3. **询问包描述**:

    ```
    请输入包的简要描述（可选）：
    ```

4. **选择包类型**:

    ```
    请选择包类型：
    1) 工具库（纯工具函数）
    2) 组件库（Vue 组件）
    3) 工具函数集（业务相关函数）
    4) 插件库（Vue 插件）
    请输入数字选择：
    ```

5. **询问是否添加测试**:

    ```
    是否添加测试支持？(y/n):
    ```

6. **确认创建**:

    ```
    即将创建包 '@my-app/utils'...
    确认创建？(y/n):
    ```

7. **创建并验证**:
    - 显示创建进度
    - 验证文件是否创建成功
    - 尝试构建测试
    - 显示创建结果

## 注意事项

### 1. 包命名规范

-   必须符合 npm 包名规范：小写字母、数字、连字符、点号、下划线
-   建议使用 `@my-app/` 作用域前缀，避免命名冲突
-   包名应简洁、有意义，反映包的功能
-   避免使用保留字和特殊字符

### 2. 目录结构规范

-   所有源码放在 `src/` 目录下
-   测试文件放在 `__tests__/` 目录下，遵循 Jest 约定
-   类型定义放在 `types/` 目录下（如果需要）
-   构建产物放在 `dist/` 目录下
-   配置文件放在包根目录，包括 `jest.config.js`（测试配置）

### 3. 导入导出规范

-   主入口文件必须是 `src/index.ts`
-   使用命名导出而不是默认导出
-   为每个导出项提供完整的 TypeScript 类型定义
-   避免循环依赖
-   使用相对路径导入内部模块

### 4. 依赖管理

-   使用 `peerDependencies` 声明运行时依赖
-   避免将开发依赖打包到最终产物中
-   保持与项目主版本依赖版本一致
-   确保依赖版本兼容性

### 5. TypeScript 配置

-   继承项目的 TypeScript 配置
-   确保 `jsx` 配置正确（如果需要支持 Vue JSX）
-   配置正确的路径映射
-   启用严格类型检查

### 6. 构建配置

-   使用 Rollup 进行构建
-   生成 ES 模块和类型声明
-   配置 source map 以支持调试
-   外部化依赖项，避免重复打包

### 7. 文档要求

-   每个包必须有完整的 README.md
-   提供清晰的安装和使用说明
-   包含完整的 API 文档
-   提供使用示例
-   说明兼容性和依赖要求

### 8. 测试要求

-   鼓励为包添加单元测试
-   使用 Vitest 进行测试
-   测试覆盖率建议达到 80% 以上
-   为每个导出项提供测试用例

### 9. 版本管理

-   遵循语义化版本控制（SemVer）
-   初始版本为 1.0.0
-   重大变更时更新主版本号
-   保持 CHANGELOG.md 更新

### 10. 代码质量

-   遵循项目的代码规范
-   使用 ESLint 和 Prettier 进行代码检查
-   添加必要的注释和文档
-   保持代码简洁和可维护性

## 最佳实践

### 包设计原则

1. **单一职责**: 每个包只负责一个明确的功能领域
2. **最小化依赖**: 只引入必要的依赖
3. **类型安全**: 提供完整的 TypeScript 类型定义
4. **向后兼容**: 保持 API 的稳定性
5. **文档完整**: 提供清晰的使用文档

### 开发流程

1. 在 `packages/` 目录下创建新包
2. 实现核心功能并添加测试
3. 编写文档和示例
4. 本地构建和测试
5. 在其他应用中集成测试
6. 发布或内部使用

### 包间依赖

-   避免包间的循环依赖
-   使用工作区协议（workspace:\*）引用其他包
-   优先使用函数式编程，减少状态共享
-   考虑包的独立性和可复用性

## 错误处理和验证

### 输入验证规则

1. **包名验证**:

    - 必须符合 npm 包名规范：只能包含小写字母、数字、连字符、下划线、点号
    - 不能以点号或下划线开头
    - 不能包含大写字母
    - 长度在 1-214 个字符之间
    - 建议使用作用域格式：`@my-app/包名`

2. **包描述验证**:

    - 可选，但建议提供
    - 长度不超过 200 个字符
    - 不能包含特殊字符或换行

3. **包类型验证**:

    - 必须从支持的包类型中选择：工具库、组件库、工具函数集、插件库
    - 如果选择组件库或插件库，需要确保 Vue 相关依赖已安装

4. **路径验证**:
    - 检查目标目录是否已存在
    - 检查是否有写入权限
    - 检查磁盘空间是否充足

### 常见错误处理

#### 1. 包名已存在

```
错误: 包名 '@my-app/utils' 已存在
建议: 请选择其他包名，或删除已存在的目录
```

#### 2. 包名格式错误

```
错误: 包名 'My-Package' 不符合命名规范
建议: 使用小写字母、数字和连字符，例如 'my-package'
```

#### 3. 目录创建失败

```
错误: 无法创建目录 '/packages/new-package'
原因: 权限不足或路径不存在
解决方案: 检查目录权限或使用其他路径
```

#### 4. 配置文件写入失败

```
错误: 无法写入 package.json
原因: 文件被锁定或无写入权限
解决方案: 检查文件权限或关闭其他正在使用的编辑器
```

#### 5. 依赖冲突

```
错误: 依赖包版本与项目不兼容
建议: 使用与项目相同的依赖版本
检查: 参考根目录 package.json 中的依赖版本
```

#### 6. 构建失败

```
错误: 构建过程失败
调试步骤:
1. 检查 TypeScript 配置是否正确
2. 确保所有依赖已安装 (pnpm install)
3. 检查 rollup 配置是否有语法错误
4. 查看详细的构建日志
```

### 验证流程

1. **前置检查**:

    - 确保项目是 monorepo 结构
    - 确保 packages 目录存在
    - 确保有足够的磁盘空间

2. **输入验证**:

    - 验证包名格式和唯一性
    - 验证包描述（如果提供）
    - 验证包类型是否支持

3. **依赖检查**:

    - 检查根目录 package.json 中的依赖版本
    - 确保 peerDependencies 版本兼容

4. **路径验证**:

    - 检查目标目录是否可写入
    - 确保目录路径符合项目规范

5. **后置验证**:
    - 验证创建的文件是否完整
    - 尝试运行 `pnpm build` 验证构建是否成功
    - 检查创建的文件是否有语法错误

## 创建后的操作

### 验证创建结果

创建完成后，进行以下验证：

1. **目录结构验证**:

    - 检查所有文件和目录是否创建成功
    - 验证目录结构是否符合预期

2. **文件内容验证**:

    - 检查 package.json 中的名称是否正确
    - 验证 tsconfig.json 和 rollup.config.ts 配置是否正确
    - 确保 README.md 中的占位符已被替换

3. **构建验证**:

    ```bash
    cd packages/{package-name}
    pnpm run build
    ```

    - 确认构建过程没有错误
    - 检查 dist 目录是否生成正确文件
    - 验证生成的声明文件是否正确

4. **导入验证**: 在项目中创建一个测试文件，验证包是否可以正确导入和使用。

### 下一步操作建议

1. **添加更多功能**:

    - 根据包类型添加更多实用的函数或组件
    - 完善测试用例
    - 添加文档注释

2. **配置根项目**:

    - 在根目录的 package.json 中添加构建脚本（如果需要）
    - 配置 monorepo 的工作区引用

3. **测试集成**:

    - 在其他应用中导入和使用新创建的包
    - 确保类型提示正常工作
    - 验证构建产物的兼容性

4. **发布准备**（如果需要）:
    - 更新版本号
    - 更新 CHANGELOG.md
    - 配置 npm 发布脚本

## 高级配置

### 自定义构建配置

如果需要自定义构建配置，可以修改以下文件：

1. **rollup.config.ts**:

    - 调整输出格式（ESM、CJS、UMD）
    - 添加额外的 Rollup 插件
    - 配置外部依赖

2. **tsconfig.json**:

    - 调整编译目标版本
    - 配置路径别名
    - 添加自定义类型定义

3. **package.json**:
    - 添加更多脚本命令
    - 配置 sideEffects 字段
    - 添加额外的导出入口

### 添加测试支持

项目使用 Jest 作为测试框架，支持 TypeScript 和 Vue 组件测试。如果需要添加测试支持，建议配置：

#### 1. **安装测试依赖**

根据包类型选择不同的测试依赖：

**所有类型包的基础依赖**:

```bash
pnpm add -D jest @types/jest ts-jest
```

**组件库额外依赖** (如果需要测试 Vue 组件):

```bash
pnpm add -D @vue/test-utils @testing-library/vue
```

**Vue 3 项目配置**:

```bash
pnpm add -D @vue/vue3-jest
```

#### 2. **Jest 配置文件**

创建 `jest.config.js` 文件：

**基础工具库配置**:

```javascript
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
    transform: {
        '^.+.ts$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.d.ts',
        '!**/node_modules/**',
        '!**/dist/**',
        '!**/__tests__/**',
        '!**/*.test.ts',
        '!**/*.spec.ts',
    ],
    coverageDirectory: '<rootDir>/coverage',
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
```

**Vue 组件库配置**:

```javascript
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    roots: ['<rootDir>/src'],
    testMatch: ['**/__tests__/**/*.ts', '**/__tests__/**/*.tsx', '**/?(*.)+(spec|test).ts', '**/?(*.)+(spec|test).tsx'],
    transform: {
        '^.+.ts$': 'ts-jest',
        '^.+.tsx$': 'ts-jest',
        '^.+.vue$': '@vue/vue3-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'vue', 'json', 'node'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    collectCoverageFrom: [
        'src/**/*.{ts,tsx,vue}',
        '!src/**/*.d.ts',
        '!**/node_modules/**',
        '!**/dist/**',
        '!**/__tests__/**',
        '!**/*.test.{ts,tsx}',
        '!**/*.spec.{ts,tsx}',
    ],
    coverageDirectory: '<rootDir>/coverage',
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    globals: {
        'ts-jest': {
            tsconfig: './tsconfig.json',
        },
        'vue-jest': {
            compilerOptions: {
                isCustomElement: tag => tag.includes('-'),
            },
        },
    },
};
```

#### 3. **TypeScript 测试配置**

在 `tsconfig.json` 中添加测试文件支持：

```json
{
    "compilerOptions": {
        "types": ["jest", "node"]
    },
    "include": [
        "src/**/*.ts",
        "src/**/*.tsx",
        "src/**/*.vue",
        "tests/**/*.ts",
        "tests/**/*.tsx",
        "__tests__/**/*.ts",
        "__tests__/**/*.tsx"
    ]
}
```

#### 4. **测试脚本**

在 `package.json` 中添加测试脚本：

```json
{
    "scripts": {
        "test": "jest --config jest.config.js",
        "test:watch": "jest --config jest.config.js --watch",
        "test:coverage": "jest --config jest.config.js --coverage"
    }
}
```

### 代码质量检查

建议添加以下代码质量工具：

1. **ESLint 配置**:

    - 继承项目的 ESLint 配置
    - 配置 Vue 和 TypeScript 规则

2. **Prettier 配置**:

    - 添加 .prettierrc 文件
    - 配置代码格式化规则

3. **Husky + lint-staged**:
    - 添加 Git hooks
    - 在提交前自动检查和修复代码

### 测试最佳实践

#### 1. **测试文件组织**

-   将测试文件放在 `__tests__` 目录下，与源代码保持相同结构
-   测试文件命名：`[filename].test.ts` 或 `[filename].spec.ts`
-   对于 Vue 组件测试，使用 `.test.tsx` 扩展名

**推荐结构**:

```
packages/{package-name}/
├── src/
│   ├── utils/
│   │   ├── date.ts
│   │   └── number.ts
│   └── components/
│       └── Button.tsx
└── __tests__/
    ├── utils/
    │   ├── date.test.ts
    │   └── number.test.ts
    └── components/
        └── Button.test.tsx
```

#### 2. **测试覆盖率目标**

建议设置以下覆盖率目标：

-   **语句覆盖率 (Statements)**: ≥ 80%
-   **分支覆盖率 (Branches)**: ≥ 70%
-   **函数覆盖率 (Functions)**: ≥ 80%
-   **行覆盖率 (Lines)**: ≥ 80%

在 `jest.config.js` 中配置覆盖率阈值：

```javascript
module.exports = {
    // ... 其他配置
    coverageThreshold: {
        global: {
            statements: 80,
            branches: 70,
            functions: 80,
            lines: 80,
        },
    },
};
```

#### 3. **测试编写原则**

##### 3.1 **AAA 模式（Arrange-Act-Assert）**

```typescript
test('应该正确格式化日期', () => {
    // Arrange: 准备测试数据
    const date = new Date('2024-01-01');

    // Act: 执行被测函数
    const result = formatDate(date, 'YYYY-MM-DD');

    // Assert: 验证结果
    expect(result).toBe('2024-01-01');
});
```

##### 3.2 **描述性测试名称**

-   使用 `describe` 组织相关测试
-   测试名称应该描述期望的行为
-   使用 `it` 或 `test` 编写具体的测试用例

```typescript
describe('formatDate 函数', () => {
    it('应该将日期格式化为 YYYY-MM-DD 格式', () => {
        // ...
    });

    it('应该处理空日期', () => {
        // ...
    });
});
```

##### 3.3 **测试边界条件**

-   测试正常路径
-   测试边界情况
-   测试错误情况
-   测试 null/undefined 值

#### 4. **Vue 组件测试指南**

##### 4.1 **组件渲染测试**

```typescript
import { mount } from '@vue/test-utils';
import Button from '../Button.vue';

describe('Button组件', () => {
    it('渲染默认按钮', () => {
        const wrapper = mount(Button, {
            slots: {
                default: '点击我',
            },
        });

        expect(wrapper.text()).toBe('点击我');
        expect(wrapper.classes()).toContain('btn');
    });
});
```

##### 4.2 **Props 测试**

```typescript
it('接收并渲染 props', () => {
    const wrapper = mount(Button, {
        props: {
            type: 'primary',
            disabled: true,
        },
    });

    expect(wrapper.classes()).toContain('btn-primary');
    expect(wrapper.element.disabled).toBe(true);
});
```

##### 4.3 **事件测试**

```typescript
it('触发点击事件', async () => {
    const handleClick = jest.fn();
    const wrapper = mount(Button, {
        props: {
            onClick: handleClick,
        },
    });

    await wrapper.trigger('click');
    expect(handleClick).toHaveBeenCalledTimes(1);
});
```

#### 5. **异步测试**

##### 5.1 **Promise 测试**

```typescript
test('异步函数返回正确结果', async () => {
    const result = await fetchData();
    expect(result).toEqual(expectedData);
});
```

##### 5.2 **定时器测试**

```typescript
test('延迟执行函数', () => {
    jest.useFakeTimers();
    const callback = jest.fn();

    setTimeout(callback, 1000);

    // 快进时间
    jest.advanceTimersByTime(1000);

    expect(callback).toHaveBeenCalled();

    // 恢复真实定时器
    jest.useRealTimers();
});
```

#### 6. **Mock 和 Stub**

##### 6.1 **函数 Mock**

```typescript
// Mock 外部依赖
jest.mock('../api', () => ({
    fetchUser: jest.fn().mockResolvedValue({ id: 1, name: '张三' }),
}));
```

##### 6.2 **模块 Mock**

```typescript
// 部分 Mock
jest.mock('axios', () => ({
    get: jest.fn(),
    post: jest.fn(),
}));
```

#### 7. **测试配置建议**

##### 7.1 **Jest 配置文件优化**

```javascript
module.exports = {
    // 测试前执行的脚本
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

    // 覆盖率报告格式
    coverageReporters: ['text', 'lcov', 'html'],

    // 收集覆盖率的目录
    collectCoverageFrom: [
        'src/**/*.{ts,tsx,vue}',
        '!src/**/*.d.ts',
        '!src/**/index.ts', // 排除索引文件
        '!src/**/*.stories.tsx', // 排除 Storybook 文件
    ],

    // 测试超时时间
    testTimeout: 10000,
};
```

##### 7.2 **全局测试设置**

创建 `jest.setup.js` 文件：

```javascript
import '@testing-library/jest-dom';
import { config } from '@vue/test-utils';

// 配置全局的 Vue Test Utils 设置
config.global.stubs = {
    Transition: true,
    TransitionGroup: true,
};

// 全局的 beforeEach/afterEach
beforeEach(() => {
    // 清理 localStorage
    localStorage.clear();

    // 重置所有 mock
    jest.clearAllMocks();
});

afterEach(() => {
    // 清理 DOM
    document.body.innerHTML = '';
});
```

#### 8. **持续集成中的测试**

##### 8.1 **GitHub Actions 配置示例**

```yaml
name: Test

on: [push, pull_request]

jobs:
    test:
        runs-on: ubuntu-latest

        steps:
            - uses: actions/checkout@v3

            - name: Setup Node.js
              uses: actions/setup-node@v3
              with:
                  node-version: '18'
                  cache: 'pnpm'

            - name: Install dependencies
              run: pnpm install

            - name: Run tests with coverage
              run: pnpm test:coverage

            - name: Upload coverage reports
              uses: codecov/codecov-action@v3
              with:
                  file: ./coverage/lcov.info
```

##### 8.2 **测试性能优化**

-   使用 `jest --maxWorkers=4` 并行运行测试
-   避免在测试中执行真实的 API 调用
-   使用内存数据库替代真实数据库
-   配置测试缓存提高重复运行速度

#### 9. **常见测试模式**

##### 9.1 **快照测试**

```typescript
it('渲染快照匹配', () => {
    const wrapper = mount(Component);
    expect(wrapper.html()).toMatchSnapshot();
});
```

##### 9.2 **参数化测试**

```typescript
describe.each([
    [1, 1, 2],
    [1, 2, 3],
    [2, 1, 3],
])('add(%i, %i)', (a, b, expected) => {
    test(`返回 ${expected}`, () => {
        expect(add(a, b)).toBe(expected);
    });
});
```

##### 9.3 **Hook 测试**

```typescript
import { renderHook } from '@testing-library/vue';
import { useCounter } from '../useCounter';

describe('useCounter', () => {
    it('初始值为0', () => {
        const { result } = renderHook(() => useCounter());
        expect(result.current.count.value).toBe(0);
    });
});
```
