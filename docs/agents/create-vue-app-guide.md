# 创建 Vue 应用技能指南

`create-vue-app` 技能用于在 `apps` 目录下创建新的 Vue 应用，基于现有 example-app 模板生成完整的应用结构。

## 功能特性

- ✅ 自动生成完整的 Vue 3 + TypeScript 应用结构
- ✅ 支持自定义应用名称和端口号
- ✅ 包含路由、状态管理、示例组件
- ✅ 自动配置 monorepo 依赖
- ✅ 更新根目录 package.json 脚本

## 创建的目录结构

```
apps/{app-name}/
├── src/
│   ├── App.tsx              # 应用入口组件
│   ├── main.ts              # 应用入口文件
│   ├── plugins/             # Vue 插件配置
│   │   └── index.ts
│   ├── router/              # 路由配置
│   │   └── index.ts
│   └── views/               # 页面组件
│       ├── HomeView/
│       │   ├── index.tsx
│       │   └── style.module.less
│       └── AboutView/
│           ├── index.tsx
│           └── style.module.less
├── index.htm                # HTML 模板
├── favicon.ico              # 网站图标
├── package.json             # 应用配置
├── tsconfig.json           # TypeScript 配置
└── vue.config.js           # Vue CLI 配置
```

## 核心配置文件

### package.json

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

### vue.config.js

关键配置：

- **开发服务器端口自定义**：通过 `devServer.port` 配置
- **支持 Less 模块化样式**：配置 CSS Modules
- **CSS Modules 自动转换**：自动处理样式类名
- **Babel 和 TypeScript 集成**：支持现代 JavaScript 语法
- **与 monorepo 包的路径别名映射**：配置 `@my-app/shared` 别名

### tsconfig.json

- **JSX 支持**（Vue JSX）：启用 JSX 语法支持
- **路径别名映射**：配置包引用路径
- **严格的类型检查**：启用 TypeScript 严格模式
- **monorepo 包引用支持**：配置项目引用

## 使用方式

### 基本用法

```bash
# 创建名为 my-app 的 Vue 应用
"创建名为 my-app 的 Vue 应用"

# 创建名为 admin-panel 的应用，端口号设为 8080
"创建名为 admin-panel 的应用，端口号设为 8080"

# 在 apps 目录下添加新的应用 user-portal
"在 apps 目录下添加新的应用 user-portal"
```

### 创建流程

1. **确认应用名称**：输入符合规范的名称
2. **选择端口号**（可选）：指定开发服务器端口，默认自动分配
3. **生成应用结构**：基于模板创建完整目录结构
4. **配置依赖和脚本**：更新根目录 package.json
5. **验证创建结果**：检查生成的文件和配置

## 创建后的操作

### 1. 安装依赖

```bash
# 如果还没有安装依赖
pnpm install

# 或者只安装特定应用的依赖
pnpm -F {app-name} install
```

### 2. 启动开发服务器

```bash
# 使用新创建的应用脚本
pnpm run dev:{app-name}

# 例如：创建了名为 my-app 的应用
pnpm run dev:my-app
```

### 3. 构建应用

```bash
# 构建特定应用
pnpm run build:{app-name}

# 例如：构建 my-app 应用
pnpm run build:my-app
```

### 4. 代码检查

```bash
# 运行 ESLint 检查
pnpm run lint:{app-name}

# 例如：检查 my-app 的代码规范
pnpm run lint:my-app
```

## 配置说明

### 端口配置

默认情况下，应用会使用自动分配的端口。如果需要指定端口，可以在创建时指定：

```bash
"创建名为 my-app 的 Vue 应用，端口号设为 3001"
```

端口配置存储在 `vue.config.js` 文件中：

```javascript
module.exports = {
  devServer: {
    port: 3001,  // 自定义端口
    // ... 其他配置
  }
}
```

### 应用名称规范

- 必须符合 npm 包名规范
- 只能包含小写字母、数字、连字符（-）
- 不能以下划线或点开头
- 不能包含大写字母
- 长度建议在 2-214 个字符之间

### 依赖配置

新创建的应用会自动配置以下依赖：

1. **项目共享包**：`@my-app/shared`
2. **Vue 3 相关依赖**：`vue`, `vue-router`, `pinia`
3. **开发工具**：`typescript`, `eslint`, `prettier`
4. **构建工具**：`@vue/cli-service`, `webpack`

## 示例

### 示例 1：创建名为 `user-portal` 的应用，端口 3001

```bash
# 请求
"创建名为 user-portal 的 Vue 应用，端口号设为 3001"
```

**创建的应用结构**：
```
apps/user-portal/
├── src/
├── package.json        # name: "user-portal"
└── vue.config.js      # devServer.port: 3001
```

**根目录 scripts 更新**：
```json
{
  "scripts": {
    "dev:user-portal": "./scripts/build-packages.sh --skip-clean && pnpm -F user-portal dev",
    "build:user-portal": "pnpm -F user-portal build",
    "lint:user-portal": "pnpm -F user-portal lint"
  }
}
```

### 示例 2：创建默认端口的应用

```bash
# 请求
"创建名为 admin-dashboard 的 Vue 应用"
```

**默认行为**：
- 应用名称：`admin-dashboard`
- 端口：自动分配（通常为 3000+）
- 使用标准模板结构

## 文件说明

### 主要文件

| 文件路径 | 说明 |
|----------|------|
| `src/App.tsx` | 应用根组件，使用 Vue JSX 语法 |
| `src/main.ts` | 应用入口文件，初始化 Vue 应用 |
| `src/plugins/index.ts` | Vue 插件配置，可添加全局插件 |
| `src/router/index.ts` | 路由配置，定义应用路由 |
| `src/views/HomeView/` | 首页组件，包含示例代码 |
| `src/views/AboutView/` | 关于页面组件，包含示例代码 |
| `index.htm` | HTML 模板文件 |
| `vue.config.js` | Vue CLI 配置文件 |
| `tsconfig.json` | TypeScript 配置文件 |
| `package.json` | 应用配置和依赖管理 |

### 样式文件

- 使用 `.module.less` 后缀支持 CSS Modules
- 样式自动局部作用域
- 支持 Less 预处理器语法
- 自动生成唯一的类名避免冲突

### 类型定义

- 使用 TypeScript 进行类型检查
- 配置了严格类型检查模式
- 支持 Vue 3 类型定义
- 自动配置路径别名

## 扩展应用

### 添加新页面

1. 在 `src/views/` 目录下创建新的页面组件
2. 在 `src/router/index.ts` 中添加路由配置
3. 更新导航菜单（如果需要）

### 添加插件

1. 在 `src/plugins/` 目录下创建插件文件
2. 在 `src/plugins/index.ts` 中注册插件
3. 在 `src/main.ts` 中应用插件

### 添加状态管理

1. 使用 Pinia 创建 store
2. 在组件中使用 `useStore()` 访问状态
3. 遵循 Vue 3 的组合式 API 模式

## 故障排除

### 常见问题

#### 1. 端口被占用
```bash
# 修改 vue.config.js 中的端口配置
devServer: {
  port: 3002,  # 改为其他端口
}
```

#### 2. 依赖安装失败
```bash
# 清理 node_modules 并重新安装
rm -rf node_modules
rm -rf apps/{app-name}/node_modules
pnpm install
```

#### 3. 类型错误
```bash
# 检查 TypeScript 配置
pnpm -F {app-name} tsc --noEmit

# 清理 TypeScript 缓存
rm -rf node_modules/.cache
```

#### 4. 构建失败
```bash
# 查看详细错误信息
pnpm build:{app-name} --verbose

# 清理构建缓存
rm -rf apps/{app-name}/dist
```

## 最佳实践

### 1. 应用命名
- 使用有意义的名称，反映应用功能
- 遵循 kebab-case 命名规范
- 避免使用通用词汇（如 "app"、"web"）

### 2. 端口管理
- 记录使用的端口号
- 避免端口冲突
- 使用端口范围 3000-3999

### 3. 代码组织
- 保持目录结构清晰
- 遵循 Vue 3 组合式 API 规范
- 使用 TypeScript 严格模式

### 4. 依赖管理
- 定期更新依赖版本
- 检查依赖安全漏洞
- 使用 workspace:* 引用本地包

## 下一步

- 查看 [创建依赖包指南](./create-package-guide.md)
- 学习 [项目开发工作流](./workflow.md)
- 参考 [代码规范与最佳实践](./coding-standards.md)
- 查看 [故障排除指南](./troubleshooting.md)