# vue-h5 - Vue 3 Monorepo 项目模板

一个基于 Vue 3 + TypeScript + PNPM Workspaces 的现代化 H5 项目模板，支持 Monorepo 架构，内置智能技能（Skills）辅助开发。

## ⚙️ 环境要求

-   **Node.js**: 最低支持 Node 14（如 package.json 中 engines 字段指定），推荐使用最新的 Node LTS 版本
-   **包管理器**: 推荐使用 PNPM（支持 Workspaces）
-   **操作系统**: macOS, Linux, Windows (WSL2 推荐)

## 📦 项目架构

```
vue-h5/
├── apps/                    # 应用目录
│   ├── example-app/         # 示例应用
│   └── [your-app]/         # 您的应用（通过技能创建）
├── packages/                # 共享包目录
│   └── shared/             # 共享工具包示例
├── skills/                  # AI 辅助开发技能
│   ├── create-vue-app/     # 创建 Vue 应用技能
│   └── create-a-package/   # 创建依赖包技能
├── scripts/                 # 构建脚本
├── types/                   # 类型定义
└── public/                  # 静态资源
```

## 🚀 快速开始

### 1. 使用 degit 克隆模板

根据您的 Node.js 版本选择合适的模板分支：

```bash
# 使用 pnpm（推荐）
pnpm dlx degit sspkudx/vue-h5#main               your-app-name    # Node 14/16
pnpm dlx degit sspkudx/vue-h5#node-high-version  your-app-name    # Node >= 18

# 或使用 npx
npx degit sspkudx/vue-h5#main               your-app-name
npx degit sspkudx/vue-h5#node-high-version  your-app-name

# 或使用 yarn
yarn dlx degit sspkudx/vue-h5#main               your-app-name
yarn dlx degit sspkudx/vue-h5#node-high-version  your-app-name
```

### 2. 切换 Node 版本（推荐）

建议使用 fnm 或 nvm 管理 Node 版本：

```bash
# fnm（推荐）
fnm use 14   # 对应 main 分支
fnm use 18   # 对应 node-high-version 分支

# nvm
nvm use 14   # 对应 main 分支
nvm use 18   # 对应 node-high-version 分支
```

### 3. 安装依赖

```bash
# 进入项目目录
cd your-app-name

# 安装依赖
pnpm i

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

### 4. 启动开发服务器

```bash
# 启动示例应用
pnpm dev:example

# 构建示例应用
pnpm build:example
```

开发服务器启动后，访问 http://localhost:2000 查看示例应用。

## 🏗️ Monorepo 架构开发指南

本项目采用 PNPM Workspaces 实现 Monorepo 架构，支持在单个仓库中管理多个应用和共享包。

### 工作区配置

项目根目录的 `pnpm-workspace.yaml` 定义了工作区：

```yaml
packages:
    - 'apps/*' # 所有应用
    - 'packages/*' # 所有共享包
```

### 应用开发

应用位于 `apps/` 目录下，每个应用都是一个独立的 Vue 3 项目：

-   **创建新应用**：使用 `create-vue-app` 技能
-   **应用间依赖**：可以通过工作区引用共享包
-   **独立开发**：每个应用有自己的依赖和配置

### 共享包开发

共享包位于 `packages/` 目录下：

-   **创建新包**：使用 `create-a-package` 技能
-   **类型支持**：支持 TypeScript 和完整类型导出
-   **构建工具**：使用 Rollup 进行打包

### 常用命令

```bash
# 安装所有工作区依赖
pnpm i

# 在特定应用上运行命令
pnpm -F example-app dev       # 启动 example-app 开发服务器
pnpm -F example-app build     # 构建 example-app
pnpm -F example-app lint      # 检查 example-app 代码

# 在特定包上运行命令
pnpm -F @my-app/shared build  # 构建 shared 包
pnpm -F @my-app/shared test   # 运行 shared 包测试

# 全局构建所有包
pnpm build:packages

# 全局构建所有应用
pnpm build
```

## 🤖 使用 Skills 智能开发

本项目包含了标准的 AI Skills 文件格式，提供了智能的开发辅助功能，帮助开发者快速创建和管理项目结构。

这些 Skills 遵循通用的 AI Agent 技能格式，可以集成到支持技能功能的 AI 编辑器中，例如 Cursor、Windsurf、Trae、CatPaw 等，实现智能化的项目创建和管理。

### 创建新 Vue 应用

使用 `create-vue-app` 技能在 `apps/` 目录下快速创建新的 Vue H5 应用：

1. **技能位置**: `./skills/create-vue-app/SKILL.md`
2. **功能**: 自动生成完整的 Vue 3 + TypeScript 应用结构
3. **支持配置**:
    - 应用名称（符合 npm 包名规范）
    - 端口号（默认 3000）
4. **生成内容**:
    - 完整的目录结构
    - Vue 3 + TypeScript 配置
    - 路由和状态管理配置
    - 示例组件和页面

**使用方式**：在 AI 编辑器中直接请求时，需要提供应用名称和可选端口号：

-   "创建新的 Vue 应用，应用名称为 `my-app`"
-   "创建新的 Vue 应用，名称为 `admin-panel`，端口号为 8080"
-   "在 apps 目录下添加新应用，名称为 `user-portal`"

### 创建新依赖包

使用 `create-a-package` 技能在 `packages/` 目录下创建新的共享包：

1. **技能位置**: `./skills/create-a-package/SKILL.md`
2. **支持的包类型**:
    - 工具库 (Utility Library)
    - 组件库 (Component Library)
    - 工具函数集 (Helper Functions)
    - 插件库 (Plugin Library)
3. **功能**:
    - 自动配置 TypeScript 开发环境
    - 配置 Rollup 构建工具
    - 生成测试框架配置
    - 创建详细的 README 文档

**使用方式**：在 AI 编辑器中直接请求时，需要提供包名称、类型和可选描述：

-   "创建新的依赖包，名称为 `utils`，类型为工具库"
-   "创建新的组件库，名称为 `ui-components`"
-   "在 packages 目录下添加新包，名称为 `auth-helpers`，类型为工具函数集，描述为 '用户认证相关工具函数'"
-   "创建插件库，名称为 `analytics-plugin`"

## 📁 项目结构详解

### Apps 目录 (`apps/`)

存放独立的 Vue 3 应用，每个应用包含：

```
apps/example-app/
├── src/
│   ├── App.tsx           # 应用入口组件
│   ├── main.ts          # 应用入口文件
│   ├── plugins/         # Vue 插件
│   ├── router/          # 路由配置
│   └── views/           # 页面组件
├── public/              # 静态资源
├── package.json         # 应用配置
├── tsconfig.json       # TypeScript 配置
└── vue.config.js       # Vue CLI 配置
```

### Packages 目录 (`packages/`)

存放共享的依赖包，支持跨应用复用：

```
packages/shared/
├── src/
│   ├── index.ts        # 包入口文件
│   ├── __tests__/      # 测试文件
│   └── utils/          # 工具函数
├── dist/               # 构建输出
├── package.json        # 包配置
├── rollup.config.ts    # Rollup 配置
└── tsconfig*.json     # TypeScript 配置
```

### Skills 目录 (`skills/`)

包含 AI 辅助开发技能：

-   `create-vue-app/`: 创建 Vue 应用的技能
-   `create-a-package/`: 创建依赖包的技能

## 🔧 分支说明

| 分支                | Node 版本  | 特点                   |
| ------------------- | ---------- | ---------------------- |
| `main`              | Node 14/16 | 传统配置，兼容性最好   |
| `node-high-version` | Node ≥ 18  | ESM 配置，现代特性支持 |

### 主要差异

1. **模块系统**:

    - `main`: CommonJS 配置
    - `node-high-version`: ESM 配置 (`"type": "module"`)

2. **配置文件**:

    - `main`: `.js` 扩展名
    - `node-high-version`: `.cjs` 扩展名 (避免 ESM 作用域错误)

3. **依赖版本**:
    - `node-high-version`: 更新版本的依赖

## 🚨 常见问题

### 1. `require is not defined in ES module scope` 错误

**解决方案**：

1. 确认您使用的是 `node-high-version` 分支
2. 检查根目录 `package.json` 是否包含 `"type": "module"`
3. 确认配置文件使用 `.cjs` 后缀：
    - `vue.config.cjs`
    - `babel.config.cjs`
    - `.postcssrc.cjs`

### 2. 本地 Node 版本与分支不匹配

**解决方案**：

```bash
# 使用 fnm
fnm use 14   # 对应 main 分支
fnm use 18   # 对应 node-high-version 分支

# 使用 nvm
nvm use 14   # 对应 main 分支
nvm use 18   # 对应 node-high-version 分支
```

### 3. 依赖安装失败

**解决方案**：

```bash
# 清理 node_modules 并重新安装
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
pnpm i
```

### 4. 工作区包引用问题

**解决方案**：

```bash
# 确保所有包都已构建
pnpm build:packages

# 重新链接依赖
pnpm i --force
```

## 📋 常用命令速查

### 开发相关

```bash
# 启动开发服务器
pnpm dev:example

# 代码检查与修复
pnpm lint:example

# 运行测试
pnpm test
pnpm test:shared
```

### 构建相关

```bash
# 构建所有包
pnpm build:packages

# 构建示例应用
pnpm build:example

# 完整构建
pnpm build
```

### 包管理

```bash
# 为特定包添加依赖
pnpm -F @my-app/shared add lodash

# 为所有包添加依赖
pnpm -r add lodash

# 移除依赖
pnpm -F example-app remove lodash
```

## 📄 许可证

本项目模板遵循仓库内的 `LICENSE`，欢迎在不同分支下按运行时需求进行二次开发。

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

## 📞 支持

-   查看 `example-app` 获取示例代码
-   使用 Skills 快速创建应用和包
-   参考现有配置进行自定义

---

**开始您的 Vue H5 项目开发之旅！** 🎉
