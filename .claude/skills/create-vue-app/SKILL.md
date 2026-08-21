---
name: create-vue-app
description: 在vue-h5项目的apps目录下创建新的Vue应用，直接生成完整的源码和配置文件。根据用户提供的应用名称自动创建对应的目录结构、配置文件，并支持自定义端口。使用当用户需要创建新的Vue H5应用，或者在apps目录下添加新应用时。
---

# 创建 Vue H5 应用

## 概述

此技能用于在 vue-h5 项目的`apps`目录下创建新的 Vue 应用。直接生成完整的应用源码和配置文件，不依赖任何现有模板，并支持自定义应用名称和端口。应用模板支持两种页面创建方式：TypeScript JSX (tsx) 和 Vue 单文件组件 (.vue)，开发者可以根据个人偏好选择。

## 使用场景

- 用户需要在`apps`目录下创建新的 Vue H5 应用
- 用户需要快速创建标准的 Vue H5 应用
- 用户需要自定义应用名称和端口
- 用户需要在 monorepo 中添加新的应用模块

## 创建流程

### 1. 获取应用信息

在创建应用前，需要从用户处获取以下信息：

- **应用名称** (必需): 将用于 package.json 的 name 字段和目录名称
- **端口号** (可选): 开发服务器的端口，默认为 3000

### 2. 验证输入

验证应用名称：

- 必须符合 npm 包名规范（小写字母、数字、连字符）
- 不能与现有应用重名
- 长度适中（建议 3-50 个字符）

验证端口号：

- 必须是有效的端口号（1024-65535）
- 不能与其他应用端口冲突

### 3. 创建应用目录结构

直接生成以下完整的应用目录结构：

```
apps/{app-name}/
├── src/
│   ├── App.vue
│   ├── main.ts
│   ├── plugins/
│   │   └── index.ts
│   ├── router/
│   │   └── index.ts
│   └── views/
│       ├── HomeView/
│       │   ├── index.tsx
│       │   └── style.module.less
│       └── AboutView/
│           └── AboutView.vue
├── index.html
├── favicon.ico
├── README.md
├── package.json
├── tsconfig.json
├── .postcssrc.js
└── vite.config.ts
```

### 4. 配置 package.json

创建`package.json`文件，内容如下（需要替换占位符）：

- `{app-name}`: 使用用户提供的应用名称
- `{port}`: 使用用户提供的端口号

**文件内容**：

```json
{
    "name": "{app-name}",
    "version": "1.0.0",
    "scripts": {
        "dev": "vite",
        "build": "vue-tsc --noEmit && vite build",
        "typecheck": "vue-tsc --noEmit",
        "lint": "eslint \"src/**/*.{js,jsx,ts,tsx,vue}\" --fix"
    },
    "dependencies": {
        "@my-app/shared": "workspace:*",
        "axios": "catalog:",
        "pinia": "catalog:",
        "ress": "catalog:",
        "vue": "catalog:",
        "vue-router": "catalog:"
    },
    "keywords": [],
    "author": "",
    "license": "MIT",
    "description": ""
}
```

### 5. 配置 vite.config.ts

创建`vite.config.ts`文件，需要替换以下占位符：

- `{port}`: 使用用户提供的端口号

**文件内容**（与 example-app 保持一致）：

```typescript
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
                // 可顺带验证 exports 配置的正确性；构建顺序由 scripts/build.sh 保证（先 packages 后 apps）
            },
        },
        server: {
            port: { port },
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
```

### 6. 配置 tsconfig.json

创建`tsconfig.json`文件，继承仓库根目录的公共配置`tsconfig.base.json`（含 `moduleResolution: "bundler"` 等统一编译选项），仅保留应用特有配置，内容如下：

```json
{
    "extends": "../../tsconfig.base.json",
    "compilerOptions": {
        "baseUrl": ".",
        "types": ["vite/client", "node"],
        "paths": {
            "@/*": ["src/*"],
            "@my-app/shared": ["../../packages/shared/src/index.ts"]
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
        "vite.config.ts"
    ],
    "exclude": ["node_modules"]
}
```

> **注意**：不要回退到 `moduleResolution: "node"`——Vite 8+ 的 package.json 仅提供 `exports` 字段（无顶层 `main`/`types`），旧解析算法会报 `Cannot find module 'vite'`。公共编译选项统一由根目录 `tsconfig.base.json` 维护。
>
> **paths 指向源码**：`@my-app/shared` 的 paths 指向 `src/index.ts` 而非 dist，与运行时 dev 解析（exports 的 `development` 条件）对齐——改 shared 源码后类型即时同步，且 `typecheck` 不依赖先构建 shared。

### 7. 创建源码文件

创建以下核心源码文件：

#### App.vue

```vue
<template>
    <router-view />
</template>
```

#### main.ts

```typescript
import { createApp, type App as VueApp } from 'vue';
import pluginsList from './plugins';
import App from './App.vue';
import 'ress/dist/ress.min.css';

/**
 * 合并全局配置到 Vue 应用实例
 * @description 通过 Object.assign 将 configs 注入 app.config，
 * 统一管理全局配置（如 errorHandler），避免在 getAppInstance 中散落配置逻辑
 * @param app - Vue 应用实例
 * @param configs - 待合并的全局配置项（如 errorHandler 等）
 */
const hookVueAppGlobalConfig = <VA extends VueApp = VueApp>(app: VA, configs: Partial<VA['config']>) => {
    Object.assign(app.config, configs);
};

/**
 * 创建 Vue 应用实例并注册全部插件
 * @description 以根组件 App 创建应用实例，
 * 通过 reduce 依次注册 pluginsList 中的插件（如 router、pinia），
 * 保证插件按声明顺序完成挂载
 * @returns 完成插件注册的 Vue 应用实例
 */
const getAppInstance = () => {
    const instance = pluginsList.reduce((current, plugin) => {
        return current.use(plugin);
    }, createApp(App));
    return instance;
};

/**
 * 将应用挂载到 DOM
 * @description 优先挂载到页面已有的 #app 元素；
 * 不存在时自动创建 id 为 vue-app 的 div 并追加到 body（body 未就绪时退化为 documentElement），
 * 保证任意加载时机下都能正常挂载
 * @param appInstance - 已完成配置与插件注册的 Vue 应用实例
 * @returns 挂载完成后的根组件实例
 */
const mountApp = <A extends VueApp>(appInstance: A) => {
    let mountElement = document.getElementById('app');
    if (!mountElement) {
        mountElement = document.createElement('div');
        mountElement.id = 'vue-app';
        if (!document.body) {
            document.documentElement.appendChild(mountElement);
        } else {
            document.body.appendChild(mountElement);
        }
    }
    return appInstance.mount(mountElement);
};

/**
 * 应用入口
 * @description 创建应用实例 → 注入全局配置（错误兜底等）→ 挂载到 DOM，
 * 返回挂载后的根组件实例，便于调试或后续扩展
 * @returns 挂载完成后的根组件实例
 */
const main = () => {
    const appInstance = getAppInstance();
    // 集中注入全局配置，统一兜底错误处理，后续可接入上报（如 sentry）与用户提示
    hookVueAppGlobalConfig(appInstance, {
        // 全局错误处理：统一兜底，后续可接入上报（如 sentry）与用户提示
        errorHandler(error, instance, info) {
            console.error('[app-error]', error, instance, info);
        },
    });
    return mountApp(appInstance);
};

main();
```

#### plugins/index.ts

```typescript
import { type Plugin } from 'vue';
import { createPinia } from 'pinia';
import router from '@/router';

/** Pinia 状态管理实例 */
const store = createPinia();

/** 应用插件列表（按声明顺序注册：先路由后状态管理） */
const pluginsList = Object.freeze<Plugin[]>([router, store]);
export default pluginsList;
```

#### router/index.ts

```typescript
import { createRouter, createWebHashHistory } from 'vue-router';

/**
 * 应用路由实例
 * @description 采用 hash 模式路由（H5 静态部署友好，无需服务端回退配置）；
 * 所有页面均为路由级懒加载，访问时再加载对应 chunk
 */
const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component() {
                return import('../views/HomeView/index');
            },
        },
        {
            path: '/about',
            name: 'about',
            // 路由级代码分割：该路由单独生成 chunk，首次访问时才懒加载
            component() {
                return import('../views/AboutView/AboutView.vue');
            },
        },
    ],
});

export default router;
```

#### views/HomeView/index.tsx

```tsx
import { defineComponent } from 'vue';
import { safeNum } from '@my-app/shared';
import styles from './style.module.less';

/**
 * 首页示例组件
 * @description 展示 workspace 包（@my-app/shared）的源码联调效果：
 * safeNum 将入参安全转换为数字，非法输入兜底为 0
 */
const HomeView = defineComponent({
    name: 'HomeView',
    setup() {
        const render = () => {
            // 示例数据：合法字符串与非法字符串，验证 safeNum 的转换与兜底
            const validInput = '123';
            const invalidInput = 'abc';
            const validNum = safeNum(validInput);
            const invalidNum = safeNum(invalidInput);

            return (
                <div class={styles.homeView}>
                    <p class={styles.homeView__text}>首页</p>
                    <p class={[styles.homeView__text, styles.homeView__text_gray]}>欢迎使用 vue-h5 模板</p>
                    <div>
                        <p>@my-app/shared 包导入示例：</p>
                        <p>safeNum('123') = {validNum}</p>
                        <p>safeNum('abc') = {invalidNum}</p>
                    </div>
                </div>
            );
        };
        return render;
    },
});

export default HomeView;
```

#### views/HomeView/style.module.less

```less
.homeView {
    &__text {
        color: #333;
        font-size: 20px;
        font-weight: bold;

        &_gray {
            color: #666;
        }
    }
}
```

#### views/AboutView/AboutView.vue

```vue
<script lang="ts" setup>
import { ref } from 'vue';

/**
 * 关于页面（SFC 写法示例）
 * @description 演示 Vue 单文件组件的基础用法：ref 状态 + 事件绑定
 */
const count = ref(0);

const increment = () => {
    count.value++;
};
</script>

<template>
    <div class="about-view">
        <h1>关于页面</h1>
        <p>当前计数：{{ count }}</p>
        <button @click="increment">增加</button>
    </div>
</template>

<style lang="less" scoped>
.about-view {
    padding: 20px;
    color: #333;

    h1 {
        color: #333;
        font-size: 24px;
        margin-bottom: 15px;
    }

    p {
        margin: 10px 0;
        font-size: 16px;
    }

    button {
        background-color: #42b983;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        margin: 10px 0;

        &:hover {
            background-color: #42a078;
        }
    }
}
</style>
```

### 8. 创建 HTML 文件

创建`index.html`文件（Vite 入口，标题直接写在 HTML 中，需要替换 `{app-name}`）：

```html
<!DOCTYPE html>
<html lang="zh-Hans">
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <title>{app-name}</title>
        <link rel="icon" href="/favicon.ico" />
    </head>
    <body>
        <div id="app"></div>
        <script type="module" src="/src/main.ts"></script>
    </body>
</html>
```

### 9. 创建其他文件

- `README.md`: 创建基本的应用说明文档，包含应用名称和描述
- `favicon.ico`: 创建默认的 favicon 文件（可以复制项目的默认 favicon 或创建空文件）
- `.postcssrc.js`: 创建 PostCSS 配置文件（移动端适配基线，mpx → vmin，内容如下）：

```javascript
module.exports = {
    plugins: [
        require('postcss-px-to-viewport')({
            viewportWidth: 390,
            unitToConvert: 'mpx',
            minPixelValue: 0,
            unitPrecision: 3,
            viewportUnit: 'vmin',
            fontViewportUnit: 'vmin',
        }),
        require('postcss-calc'),
    ],
};
```

> **说明**：Vite 通过 postcss-load-config 自动加载应用根目录的 `.postcssrc.js`，无需在 vite.config.ts 内联 `css.postcss`；`postcss-px-to-viewport` / `postcss-calc` 属构建工具链，统一位于根 devDependencies（经 `shamefullyHoist` 提升，与 vite/less 同理），应用**无需也不应**在自己的 package.json 重复声明；该文件是 CJS 工具配置，已被根 `eslint.config.js` 的 ignores（`**/.postcssrc.js`）放行，`require()` 写法不会触发 lint 报错。

### 10. 更新根目录的 package.json

在创建新应用后，需要更新根目录的`package.json`，添加新应用的运行脚本。遵循现有格式，脚本名称使用`{action}:{app-name}`的模式：

1. **读取根目录的 package.json**：首先读取并解析根目录的 package.json 文件
2. **检查 scripts 字段**：确保 scripts 对象存在
3. **添加新的脚本命令**：根据应用名称添加以下三个脚本：
    - `dev:{app-name}` - 开发服务器
    - `build:{app-name}` - 构建应用
    - `lint:{app-name}` - 代码检查
4. **保持格式一致**：使用与现有脚本相同的格式

**具体实现方法**：

```javascript
// 读取根目录package.json
const rootPackageJsonPath = path.resolve(__dirname, '../../package.json');
const rootPackageJson = JSON.parse(fs.readFileSync(rootPackageJsonPath, 'utf8'));

// 确保scripts字段存在
if (!rootPackageJson.scripts) {
    rootPackageJson.scripts = {};
}

// 添加新应用的脚本
const appName = 'your-app-name'; // 替换为实际应用名称
rootPackageJson.scripts[`dev:${appName}`] = `./scripts/build-packages.sh --skip-clean && pnpm -F ${appName} dev`;
rootPackageJson.scripts[`build:${appName}`] = `pnpm -F ${appName} build`;
rootPackageJson.scripts[`lint:${appName}`] = `pnpm -F ${appName} lint`;

// 保存回文件
fs.writeFileSync(rootPackageJsonPath, JSON.stringify(rootPackageJson, null, 2) + '\n');
```

**更新后的 scripts 部分示例**（假设原根目录 package.json 已经有其他应用的脚本）：

```json
"scripts": {
    "dev:example": "./scripts/build-packages.sh --skip-clean && pnpm -F example-app dev",
    "build:example": "pnpm -F example-app build",
    "build:shared": "pnpm -F @my-app/shared build",
    "lint:example": "pnpm -F example-app lint",
    "dev:{app-name}": "./scripts/build-packages.sh --skip-clean && pnpm -F {app-name} dev",
    "build:{app-name}": "pnpm -F {app-name} build",
    "lint:{app-name}": "pnpm -F {app-name} lint"
}
```

### 11. 验证创建结果

创建完成后，验证以下内容：

1. 目录结构是否正确
2. 所有文件是否创建成功
3. package.json 中的名称是否正确
4. vite.config.ts 中的端口配置是否正确
5. tsconfig.json 中的路径映射是否正确
6. **根目录 package.json 的 scripts 是否正确更新**：检查是否添加了 dev、build、lint 脚本
7. `.postcssrc.js` 是否已创建（移动端适配基线，缺失会导致 `mpx` 单位不被转换）

## 示例

### 示例 1：创建名为"my-app"的应用，使用默认端口 3000

**用户输入**: "创建名为 my-app 的应用"

**处理步骤**:

1. 验证"my-app"符合命名规范
2. 创建`apps/my-app/`目录及完整的应用结构
3. 创建所有源文件和配置文件
4. 设置 package.json 的 name 为"my-app"
5. 设置 vite.config.ts 的端口为 3000，index.html 的标题为"my-app"
6. **更新根目录 package.json 的 scripts**，添加：
    - `"dev:my-app": "./scripts/build-packages.sh --skip-clean && pnpm -F my-app dev"`
    - `"build:my-app": "pnpm -F my-app build"`
    - `"lint:my-app": "pnpm -F my-app lint"`

### 示例 2：创建名为"admin-panel"的应用，自定义端口 8080

**用户输入**: "创建名为 admin-panel 的应用，端口 8080"

**处理步骤**:

1. 验证"admin-panel"符合命名规范
2. 验证端口 8080 可用
3. 创建`apps/admin-panel/`目录及完整的应用结构
4. 创建所有源文件和配置文件
5. 设置 package.json 的 name 为"admin-panel"
6. 设置 vite.config.ts 的端口为 8080，index.html 的标题为"admin-panel"
7. **更新根目录 package.json 的 scripts**，添加：
    - `"dev:admin-panel": "./scripts/build-packages.sh --skip-clean && pnpm -F admin-panel dev"`
    - `"build:admin-panel": "pnpm -F admin-panel build"`
    - `"lint:admin-panel": "pnpm -F admin-panel lint"`

## 注意事项

1. **应用名称限制**: 应用名称必须符合 npm 包名规范，建议使用小写字母、数字和连字符
2. **端口冲突**: 需要检查端口是否已被其他应用使用
3. **路径映射**: workspace 包（`@my-app/*`）无需在 vite.config 中配置 alias——各包 `package.json` 的 `exports` 带 `"development"` 条件指向 `src`，Vite dev 默认解析该条件（源码热更新）；生产构建解析 `import` 条件（`exports` → `dist`），构建顺序由 `scripts/build.sh` 保证（先 packages 后 apps）。tsconfig 的 paths 指向 `src/index.ts` 与 dev 运行时对齐
4. **依赖管理**: 应用依赖通过 `catalog:` 引用 `pnpm-workspace.yaml` 的 `catalogs.default` 统一版本（axios/pinia/ress/vue/vue-router），新应用版本自动与 example-app 保持一致；`@my-app/shared` 使用 `workspace:*` 引用本地包。构建工具链（vite、less、postcss-px-to-viewport、postcss-calc 等）统一位于根 devDependencies，经 `shamefullyHoist` 提升后各应用直接可用，应用自身 package.json 只声明运行时依赖
5. **Monorepo 结构**: 需要确保应用在 monorepo 中的正确位置
6. **scripts 更新**: 务必更新根目录 package.json 的 scripts 字段，添加`dev:{app-name}`、`build:{app-name}`、`lint:{app-name}`脚本
7. **格式一致性**: 确保新增的 scripts 格式与现有 scripts 保持一致（`pnpm -F {app-name} {command}`）
8. **构建工具**: 应用使用 **Vite** 构建（`vite` 位于根 devDependencies，脚本直接用 `vite` / `vue-tsc` 即可），构建时自动做类型检查（`vue-tsc --noEmit`）
9. **兼容性基线**: 项目兼容性基线为 **Chrome 49**（桌面端 + 移动端统一，含 Android WebView），由根目录 `.browserslistrc` + `@vitejs/plugin-legacy` 保证。新建应用**无需**单独配置 browserslist，`legacy()` 插件自动读取根目录 `.browserslistrc` 并生成 legacy 产物（ES5 + core-js polyfill + SystemJS，`nomodule` 加载），现代浏览器加载 `type="module"` 产物。不要降低根目录 `.browserslistrc` 的基线：Vue 3 依赖 Proxy/Reflect（Chrome 49 起支持）
10. **移动端适配**: 必须创建 `.postcssrc.js`（见第 9 节），这是项目统一的移动端适配基线（`mpx` → `vmin`，viewportWidth 390，见 CONTEXT.md）；样式中的尺寸使用 `mpx` 单位编写，stylelint 已放行该单位（`unit-no-unknown` ignoreUnits）

## 错误处理

- **应用名称已存在**: 提示用户选择其他名称
- **端口被占用**: 建议使用其他端口或自动选择可用端口
- **目录创建失败**: 检查文件权限
- **文件创建失败**: 检查磁盘空间和文件权限
- **scripts 更新失败**: 检查根目录 package.json 是否存在，是否有写权限
- **scripts 格式错误**: 确保 scripts 字段是对象类型，不是数组或其他格式

## 完成后的操作建议

创建完成后，建议用户：

1. **运行`pnpm install`**安装依赖（如果需要）
2. **运行`pnpm run dev:{app-name}`**启动开发服务器（如`pnpm run dev:my-app`）
3. **访问`http://localhost:{port}`**验证应用运行正常
4. 根据需求修改页面内容和样式

**重要**：由于已经更新了根目录 package.json 的 scripts，用户可以直接使用简化的命令：

```bash
# 启动新应用的开发服务器
pnpm run dev:{app-name}

# 构建新应用
pnpm run build:{app-name}

# 代码检查
pnpm run lint:{app-name}
```

## 支持的页面创建方式

本模板支持两种页面创建方式，开发者可以根据个人偏好选择：

### 1. TypeScript JSX (tsx) 方式

**特点**：

- 使用 TypeScript 和 JSX 语法
- 适合习惯 React 风格的开发者
- 通过 `defineComponent` 定义组件
- 目录结构：`views/HomeView/index.tsx`

**适用场景**：

- 复杂的逻辑渲染
- 需要 TypeScript 类型推导的复杂组件
- 团队有 React 背景

### 2. Vue 单文件组件 (.vue) 方式

**特点**：

- 使用 Vue 3 `<script setup>` 语法
- 传统 Vue 开发体验
- 模板更加直观易读
- 目录结构：`views/AboutView/AboutView.vue`

**适用场景**：

- 快速原型开发
- 复杂的应用界面
- 团队有 Vue 背景
- 需要模板指令和过渡动画

### 创建新页面

创建新页面时，可以使用推荐的子技能 `create-a-vue-page`，该技能支持选择创建方式：

```bash
# 创建 tsx 页面
"创建名为 UserProfile 的页面，使用 tsx 方式"

# 创建 Vue 单文件组件页面
"创建名为 Settings 的页面，使用 vue 方式"

# 在指定应用中创建
"在 my-app 应用中创建名为 Dashboard 的页面"
```
