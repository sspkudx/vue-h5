---
name: create-vue-app
description: 在vue-h5项目的apps目录下创建新的Vue应用，直接生成完整的源码和配置文件。根据用户提供的应用名称自动创建对应的目录结构、配置文件，并支持自定义端口。使用当用户需要创建新的Vue H5应用，或者在apps目录下添加新应用时。
---

# 创建 Vue H5 应用

## 概述

此技能用于在 vue-h5 项目的`apps`目录下创建新的 Vue 应用。直接生成完整的应用源码和配置文件，不依赖任何现有模板，并支持自定义应用名称和端口。

## 使用场景

-   用户需要在`apps`目录下创建新的 Vue H5 应用
-   用户需要快速创建标准的 Vue H5 应用
-   用户需要自定义应用名称和端口
-   用户需要在 monorepo 中添加新的应用模块

## 创建流程

### 1. 获取应用信息

在创建应用前，需要从用户处获取以下信息：

-   **应用名称** (必需): 将用于 package.json 的 name 字段和目录名称
-   **端口号** (可选): 开发服务器的端口，默认为 3000

### 2. 验证输入

验证应用名称：

-   必须符合 npm 包名规范（小写字母、数字、连字符）
-   不能与现有应用重名
-   长度适中（建议 3-50 个字符）

验证端口号：

-   必须是有效的端口号（1024-65535）
-   不能与其他应用端口冲突

### 3. 创建应用目录结构

直接生成以下完整的应用目录结构：

```
apps/{app-name}/
├── src/
│   ├── App.tsx
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
│           ├── index.tsx
│           └── style.module.less
├── index.htm
├── favicon.ico
├── README.md
├── package.json
├── tsconfig.json
└── vue.config.js
```

### 4. 配置 package.json

创建`package.json`文件，内容如下（需要替换占位符）：

-   `{app-name}`: 使用用户提供的应用名称
-   `{port}`: 使用用户提供的端口号

**文件内容**：

```json
{
    "name": "{app-name}",
    "version": "1.0.0",
    "main": "main.ts",
    "scripts": {
        "dev": "vue-cli-service serve",
        "build": "vue-cli-service build",
        "lint": "vue-cli-service lint --fix"
    },
    "dependencies": {
        "@my-app/shared": "workspace:*"
    },
    "keywords": [],
    "author": "",
    "license": "MIT",
    "description": ""
}
```

### 5. 配置 vue.config.js

创建`vue.config.js`文件，需要替换以下占位符：

-   `{port}`: 使用用户提供的端口号
-   `{app-name}`: 标题配置，使用应用名称

**文件内容**：

```javascript
const { defineConfig } = require('@vue/cli-service');
const path = require('path');

/** Navigate to root path */
const toRoot = (rootPath = '') => {
    return path.resolve(__dirname, `../../${rootPath}`);
};

/** 此处注册所有在monorepo项目中安装的packages下的依赖 */
const requiredPackages = Object.freeze(
    ['shared'].map(packageName => {
        return {
            alias: `@my-app/${packageName}`,
            srcPath: toRoot(`packages/${packageName}/src`),
            distPath: toRoot(`packages/${packageName}/dist`),
        };
    })
);

const setAllRequiredPackages = (config, isDev = false) => {
    return requiredPackages.reduce((conf, item) => {
        // 开发环境指向源码目录（支持热更新）
        // 生产环境指向构建后的dist目录
        const targetPath = isDev ? item.srcPath : item.distPath;
        return conf.resolve.alias.set(item.alias, targetPath).end().end();
    }, config);
};

/** Get a new configuration of HtmlWebpackPlugin */
const getHtmlPluginConfig = (defaultConfig = {}) => {
    const { templateParameters: oldTemplateParams = {} } = defaultConfig || {};
    return {
        ...defaultConfig,
        templateParameters: {
            ...oldTemplateParams,
            lang: 'zh-Hans',
        },
        template: path.resolve(__dirname, 'index.htm'),
        favicon: path.resolve(__dirname, 'favicon.ico'),
        title: '{app-name}',
    };
};

/** is production environment */
const isProduction = /prod/i.test(process.env?.NODE_ENV ?? '');
/** New Version babel loader */
const newBabelLoader = toRoot('node_modules/babel-loader/lib/index.js');

module.exports = defineConfig(() => {
    const isDev = process.env.NODE_ENV === 'development';

    return {
        transpileDependencies: isProduction,
        lintOnSave: 'error',
        devServer: {
            port: { port },
            client: {
                overlay: {
                    warnings: false,
                },
            },
        },
        chainWebpack(config) {
            setAllRequiredPackages(config, isDev)
                .entry('app')
                .clear()
                .add(path.resolve(__dirname, 'src', 'main.ts'))
                .end()
                // 配置 .ts & .tsx 文件使用 babel-loader
                .module.rule('ts')
                .test(/\.m?tsx?$/)
                .use('babel-loader')
                .loader(newBabelLoader)
                .options({
                    // 关键：显式指向根目录 babel 配置
                    configFile: toRoot('babel.config.js'),
                })
                .end()
                .use('ts-loader')
                .loader('ts-loader')
                .options({
                    appendTsSuffixTo: [/\.vue$/],
                })
                .end()
                .end()
                .end()
                .module.rule('js')
                .test(/\.m?jsx?$/)
                .use('babel-loader')
                .loader(newBabelLoader)
                .options({
                    // 关键：显式指向根目录 babel 配置
                    configFile: toRoot('babel.config.js'),
                })
                .end()
                .end()
                .end()
                .resolve.extensions.merge(['.ts', '.tsx', '.js', '.jsx', '.vue', '.json'])
                .end()
                .end()
                .plugin('html')
                .tap(args => {
                    const [defaultConf, ...rest] = args;
                    return [getHtmlPluginConfig(defaultConf), ...rest];
                })
                .end();
        },
        css: {
            loaderOptions: {
                css: {
                    modules: {
                        auto(resourcePath) {
                            return resourcePath.includes('.module.');
                        },
                        exportLocalsConvention(name) {
                            // home-view__text--red → homeView__text_red
                            const camel = name
                                .replace(/--/g, '_') // 先把 -- 换成 _
                                .replace(/-([a-z])/g, (_, char) => char.toUpperCase()); // 驼峰化 -
                            return [name, camel];
                        },
                    },
                },
            },
        },
    };
});
```

### 6. 配置 tsconfig.json

创建`tsconfig.json`文件，内容如下：

```json
{
    "compilerOptions": {
        "target": "esnext",
        "module": "esnext",
        "strict": true,
        "jsx": "preserve",
        "jsxImportSource": "vue",
        "moduleResolution": "node",
        "resolveJsonModule": true,
        "skipLibCheck": true,
        "esModuleInterop": true,
        "allowSyntheticDefaultImports": true,
        "forceConsistentCasingInFileNames": true,
        "useDefineForClassFields": true,
        "sourceMap": true,
        "baseUrl": ".",
        "types": ["webpack-env"],
        "paths": {
            "@/*": ["src/*"],
            "@my-app/shared": ["../../packages/shared/dist/index"]
        },
        "lib": ["esnext", "dom", "dom.iterable", "scripthost"]
    },
    "include": [
        "src/**/*.ts",
        "src/**/*.tsx",
        "src/**/*.vue",
        "tests/**/*.ts",
        "tests/**/*.tsx",
        "types/*.d.ts",
        "../../types/*.d.ts"
    ],
    "exclude": ["node_modules"]
}
```

### 7. 创建源码文件

创建以下核心源码文件：

#### App.tsx

```tsx
import type { FunctionalComponent as FC } from 'vue';
import { RouterView } from 'vue-router';

const App: FC = () => {
    return <RouterView />;
};

export default App;
```

#### main.ts

```typescript
import { createApp, type App as VueApp } from 'vue';
import pluginsList from './plugins';
import App from './App';
import 'ress/dist/ress.min.css';

const getAppInstance = () => {
    const instance = pluginsList.reduce((current, plugin) => {
        return current.use(plugin);
    }, createApp(App));
    return instance;
};

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

const main = () => {
    return mountApp(getAppInstance());
};

main();
```

#### plugins/index.ts

```typescript
import { type Plugin } from 'vue';
import { createPinia } from 'pinia';
import router from '@/router';

/** Pinia instance */
const store = createPinia();

const pluginsList = Object.freeze<Plugin[]>([router, store]);
export default pluginsList;
```

#### router/index.ts

```typescript
import { createRouter, createWebHashHistory } from 'vue-router';

/** router used by the app */
const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component() {
                return import(/* webpackChunkName: "HomeView" */ '../views/HomeView/index');
            },
        },
        {
            path: '/about',
            name: 'about',
            component() {
                return import(/* webpackChunkName: "AboutView" */ '../views/AboutView/index');
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

const HomeView = defineComponent({
    setup() {
        const render = () => {
            // 测试导入的shared包
            const testString = '123';
            const testInvalid = 'abc';
            const num1 = safeNum(testString);
            const num2 = safeNum(testInvalid);

            return (
                <div class={styles.homeView}>
                    <p class={styles.homeView__text}>Yeah</p>
                    <p class={[styles.homeView__text, styles.homeView__text_gray]}>hello world</p>
                    <div>
                        <p>测试@shared包导入:</p>
                        <p>safeNum('123') = {num1}</p>
                        <p>safeNum('abc') = {num2}</p>
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

#### views/AboutView/index.tsx

```tsx
import { defineComponent } from 'vue';

const AboutView = defineComponent({
    setup() {
        const render = () => {
            return (
                <div>
                    <h1>About Page</h1>
                    <p>This is the about page for {app - name} application.</p>
                </div>
            );
        };
        return render;
    },
});

export default AboutView;
```

#### views/AboutView/style.module.less

```less
h1 {
    color: #333;
    font-size: 24px;
}
```

### 8. 创建 HTML 文件

创建`index.htm`文件：

```html
<!DOCTYPE html>
<html lang="<%= lang %>">
    <head>
        <meta charset="utf-8" />
        <meta
            http-equiv="X-UA-Compatible"
            content="IE=edge"
        />
        <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <title><%= htmlWebpackPlugin.options.title %></title>
    </head>
    <body>
        <div id="app"></div>
        <!-- built files will be auto injected -->
    </body>
</html>
```

### 9. 创建其他文件

-   `README.md`: 创建基本的应用说明文档，包含应用名称和描述
-   `favicon.ico`: 创建默认的 favicon 文件（可以复制项目的默认 favicon 或创建空文件）

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
4. vue.config.js 中的端口配置是否正确
5. tsconfig.json 中的路径映射是否正确
6. **根目录 package.json 的 scripts 是否正确更新**：检查是否添加了 dev、build、lint 脚本

## 示例

### 示例 1：创建名为"my-app"的应用，使用默认端口 3000

**用户输入**: "创建名为 my-app 的应用"

**处理步骤**:

1. 验证"my-app"符合命名规范
2. 创建`apps/my-app/`目录及完整的应用结构
3. 创建所有源文件和配置文件
4. 设置 package.json 的 name 为"my-app"
5. 设置 vue.config.js 的端口为 3000，标题为"my-app"
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
6. 设置 vue.config.js 的端口为 8080，标题为"admin-panel"
7. **更新根目录 package.json 的 scripts**，添加：
    - `"dev:admin-panel": "./scripts/build-packages.sh --skip-clean && pnpm -F admin-panel dev"`
    - `"build:admin-panel": "pnpm -F admin-panel build"`
    - `"lint:admin-panel": "pnpm -F admin-panel lint"`

## 注意事项

1. **应用名称限制**: 应用名称必须符合 npm 包名规范，建议使用小写字母、数字和连字符
2. **端口冲突**: 需要检查端口是否已被其他应用使用
3. **路径映射**: tsconfig.json 中的路径映射需要正确指向共享包
4. **依赖管理**: 新应用会自动依赖`@my-app/shared`包
5. **Monorepo 结构**: 需要确保应用在 monorepo 中的正确位置
6. **scripts 更新**: 务必更新根目录 package.json 的 scripts 字段，添加`dev:{app-name}`、`build:{app-name}`、`lint:{app-name}`脚本
7. **格式一致性**: 确保新增的 scripts 格式与现有 scripts 保持一致（`pnpm -F {app-name} {command}`）

## 错误处理

-   **应用名称已存在**: 提示用户选择其他名称
-   **端口被占用**: 建议使用其他端口或自动选择可用端口
-   **目录创建失败**: 检查文件权限
-   **文件创建失败**: 检查磁盘空间和文件权限
-   **scripts 更新失败**: 检查根目录 package.json 是否存在，是否有写权限
-   **scripts 格式错误**: 确保 scripts 字段是对象类型，不是数组或其他格式

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
