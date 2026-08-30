# vue-h5 - Vue 3 Monorepo 项目模板 🚀

> **简体中文** | [English](./README.md)

一个基于 Vue 3 + TypeScript + PNPM Workspaces 的现代化 H5 项目模板，支持 Monorepo 架构，内置 AI 智能开发技能。

> ⚡ **开箱即用** | 🏗️ **Monorepo 架构** | 🤖 **AI 辅助开发** | 📦 **PNPM Workspaces**

## ✨ 特性亮点

- **现代化技术栈**: Vue 3 + TypeScript + Vite + PNPM
- **Monorepo 架构**: 支持多应用、多包统一管理
- **AI 智能开发**: 内置 Skills 快速创建应用和包
- **完整工具链**: ESLint, Stylelint, Prettier, Vitest, Vite, Husky + commitlint, GitHub Actions CI

## ⚡ 快速开始（5 分钟上手）

### 1. 获取项目模板

```bash
# 获取项目模板
npx degit sspkudx/vue-h5#main my-vue-project
```

### 2. 安装依赖

```bash
cd my-vue-project
pnpm i  # 推荐使用 PNPM
```

### 3. 启动开发服务器

```bash
# 方式一：开发启动器（推荐）——Web 控制台勾选要启动的应用/包
pnpm dev
# 打开浏览器访问 http://localhost:8888，勾选后点「启动所选」

# 方式二：终端交互多选（同样自动发现 apps/* 与 packages/*）
pnpm dev --cli

# 方式三：直接启动示例应用
pnpm dev:example
```

打开浏览器访问 http://localhost:2000，查看示例应用！

> 💡 **三种启动方式的衔接说明**：
>
> - `pnpm dev` 只启动**开发启动器控制台**（http://localhost:8888），在控制台勾选 `example-app` 并点击「启动所选」后，示例应用才会运行在 http://localhost:2000；
> - `pnpm dev --cli` 在终端交互勾选，效果同上；
> - 想直接启动示例应用、跳过控制台，用 `pnpm dev:example`（访问 http://localhost:2000）。

## 📚 详细指南

### 📦 环境要求

| 工具         | 要求     | 说明                                   |
| ------------ | -------- | -------------------------------------- |
| **Node.js**  | 22 LTS   | 见根目录 `.node-version`               |
| **包管理器** | PNPM 11+ | 已锁定 `packageManager`，推荐 corepack |

```bash
# 首次使用启用 corepack，自动对齐 packageManager 中声明的 pnpm 版本
corepack enable
```

> 💡 **构建机还是 Node 14？** 主分支要求 Node 22 LTS。如果你的流水线/构建机暂时无法升级 Node，可以直接复用 `compat/node-14` 分支模板（保持 Node 14 基线 + 旧工具链，兼容性基线同为 Chrome 49）：
>
> ```bash
> npx degit sspkudx/vue-h5#compat/node-14 my-project
> ```

### 🔄 使用 degit 复用项目模板

#### 什么是 degit？

**degit**（de-git）是 Rich Harris（Svelte、Rollup 创作者）开发的工具，专为项目模板设计：

| 功能             | **degit**                | **git clone**           |
| ---------------- | ------------------------ | ----------------------- |
| **Git 历史**     | ❌ 不包含历史，下载更快  | ✅ 包含完整历史         |
| **初始化新项目** | ✅ 直接可用，无需删 .git | ❌ 需要删 .git 再初始化 |
| **空间占用**     | ⚡ 较小                  | 📦 较大                 |
| **速度**         | 🚀 快（只下载最新内容）  | 🐌 慢（下载所有历史）   |
| **用途**         | **项目模板创建**         | **协作开发/历史追踪**   |

#### 多种使用方式

**方法 1：使用 npx（推荐）**

```bash
# 使用 npx（推荐）
npx degit sspkudx/vue-h5#main my-project
```

**方法 2：使用 pnpm dlx**

```bash
pnpm dlx degit sspkudx/vue-h5#main my-project
```

**方法 3：使用 yarn dlx**

```bash
yarn dlx degit sspkudx/vue-h5#main my-project
```

#### 高级用法

```bash
# 使用特定版本
npx degit sspkudx/vue-h5#v1.0.0 my-project

# 使用特定提交
npx degit sspkudx/vue-h5#abcdef1 my-project

# 从本地模板创建
npx degit ./path/to/vue-h5#main my-project

# 强制覆盖现有目录
npx degit sspkudx/vue-h5#main my-project --force
```

#### 使用后的初始化步骤

1. **进入项目目录** `cd my-project`
2. **安装依赖** `pnpm i`
3. **初始化 Git（可选）**：
    ```bash
    git init
    git add .
    git commit -m "Initial commit from vue-h5 template"
    ```
4. **更新配置**：
    - 修改根目录 `package.json` 中的 `name` 字段
    - 根据需要调整子包配置
    - 更新 `README.md`
5. **启动开发服务器** `pnpm dev:example`

### 🏗️ 项目架构

```
vue-h5/
├── apps/                    # 应用目录
│   ├── example-app/         # 示例应用（开发起点）
│   └── [your-app]/         # 你的应用（通过 AI 技能创建）
├── packages/                # 共享包目录
│   └── shared/             # 共享工具包示例
├── .claude/skills/          # AI 辅助开发技能（8 个）
│   ├── create-vue-app/     # 创建 Vue 应用技能
│   ├── create-a-vue-page/  # 创建 Vue 页面技能
│   ├── create-component/   # 创建 Vue 组件技能
│   ├── create-a-package/   # 创建依赖包技能
│   ├── design-to-code/     # 设计稿转代码技能
│   ├── update-dependencies/# 依赖更新技能
│   ├── create-skill/       # 创建新技能技能
│   └── git-commit-push/    # Git 提交推送技能
├── scripts/                 # 构建脚本与开发启动器
├── types/                   # TypeScript 类型定义
└── public/                  # 静态资源
```

### 🤖 AI 智能开发技能

本项目内置了标准的 AI Skills 格式，可以在支持技能功能的 AI 编辑器（如 Cursor、Windsurf、Trae 等）中使用：

#### 创建新 Vue 应用

```bash
# 在 AI 编辑器中直接请求：
"创建新的 Vue 应用，名称为 my-app"
"创建新应用，名称为 admin-panel，端口号为 8080"
"在 apps 目录下添加新应用 user-portal"
```

**技能位置**: `./.claude/skills/create-vue-app/SKILL.md`

- ✅ 自动生成完整的 Vue 3 + TypeScript 应用结构
- ✅ 支持自定义应用名称和端口号
- ✅ 包含路由、状态管理、示例组件

#### 创建新依赖包

```bash
# 在 AI 编辑器中直接请求：
"创建新的依赖包，名称为 utils，类型为工具库"
"创建新的组件库，名称为 ui-components"
"在 packages 目录下添加新包 auth-helpers，类型为工具函数集，描述为 '用户认证相关工具函数'"
```

**技能位置**: `./.claude/skills/create-a-package/SKILL.md`

- ✅ 支持四种包类型：工具库、组件库、工具函数集、插件库
- ✅ 自动配置 TypeScript + Vite（lib 模式）+ Vitest 开发环境
- ✅ 生成测试框架配置和详细文档

### 🔧 Monorepo 开发指南

#### 工作区配置

项目根目录的 `pnpm-workspace.yaml` 定义了工作区：

```yaml
packages:
    - 'apps/*' # 所有应用
    - 'packages/*' # 所有共享包
```

#### 常用命令

**包管理**

```bash
# 安装所有依赖
pnpm i

# 为所有包添加依赖
pnpm -r add lodash

# 为特定包添加依赖
pnpm -F @my-app/shared add lodash

# 移除依赖
pnpm -F example-app remove lodash
```

**开发构建**

```bash
# 开发启动器：Web 控制台（默认）或终端多选（--cli），自动发现全部应用与包
pnpm dev
pnpm dev --cli

# 直接启动示例应用开发服务器
pnpm dev:example

# 代码检查（ESLint，只读；lint:fix 才自动修复）
pnpm lint:example

# 运行测试
pnpm test
pnpm test:shared

# 构建所有包
pnpm build:packages

# 构建示例应用
pnpm build:example

# 完整构建
pnpm build
```

**应用/包特定命令**

```bash
# 在特定应用上运行命令
pnpm -F example-app dev       # 启动开发服务器
pnpm -F example-app build     # 构建应用
pnpm -F example-app lint      # 代码检查

# 在特定包上运行命令
pnpm -F @my-app/shared build  # 构建包
pnpm -F @my-app/shared test   # 运行测试
```

### 🚨 常见问题

#### 1. 本地 Node 版本与项目要求不匹配

```bash
# 使用 fnm（推荐）
fnm install 22
fnm use 22

# 使用 nvm
nvm install 22
nvm use 22

# 验证版本（应显示 v22.x；.node-version 由 fnm/nvm 自动识别）
node --version
```

#### 2. 依赖安装失败

```bash
# 清理 node_modules 并重新安装
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
pnpm i
```

#### 3. 工作区包引用问题

```bash
# 确保所有包都已构建
pnpm build:packages

# 重新链接依赖
pnpm i --force
```

### 📋 命令速查表

| 命令                    | 功能                     | 说明                                                         |
| ----------------------- | ------------------------ | ------------------------------------------------------------ |
| `pnpm dev`              | 开发启动器（Web 控制台） | 勾选启动应用/包，访问 http://localhost:8888                  |
| `pnpm dev --cli`        | 开发启动器（终端多选）   | 空格勾选、回车确认，Ctrl+C 停止全部                          |
| `pnpm dev:example`      | 启动示例应用开发服务器   | 访问 http://localhost:2000                                   |
| `pnpm build:example`    | 构建示例应用             | 生产环境构建                                                 |
| `pnpm lint:example`     | 示例应用代码检查         | ESLint（只读；需自动修复用 `pnpm lint:fix`）                 |
| `pnpm test`             | 运行所有测试             | 单测（Vitest：packages + apps 组件测试）                     |
| `pnpm test:e2e`         | E2E 冒烟测试             | Playwright（首次需 `pnpm exec playwright install chromium`） |
| `pnpm build:packages`   | 构建所有共享包           | 用于包开发                                                   |
| `pnpm build`            | 完整构建                 | 构建所有应用和包                                             |
| `pnpm -F [包名] [命令]` | 在特定包上运行命令       | 例如：`pnpm -F example-app dev`                              |

### 📁 项目结构详解

#### Apps 目录 (`apps/`)

存放独立的 Vue 3 应用，每个应用包含：

```
apps/example-app/
├── src/
│   ├── App.vue           # 应用根组件（SFC）
│   ├── main.ts           # 应用入口文件
│   ├── plugins/          # Vue 插件（Pinia 等）
│   ├── router/           # 路由配置（hash 模式 + 懒加载）
│   ├── utils/            # 请求封装（axios 拦截器）
│   ├── api/              # 接口层
│   └── views/            # 页面组件（tsx / .vue 两种写法）
├── index.html           # Vite 入口模板
├── .postcssrc.js        # PostCSS 配置（mpx → vmin 移动端适配）
├── package.json         # 应用配置
├── tsconfig.json        # TypeScript 配置
└── vite.config.ts       # Vite 构建配置
```

#### Packages 目录 (`packages/`)

存放共享的依赖包，支持跨应用复用：

```
packages/shared/
├── src/
│   ├── index.ts         # 包入口文件（类型守卫 + 数字工具）
│   └── __tests__/       # Vitest 测试
├── dist/                # 构建输出（vite lib + tsc d.ts）
├── package.json         # 包配置（exports 带 development 条件）
├── vite.config.ts       # Vite lib 模式构建配置
└── tsconfig*.json       # TypeScript 配置
```

### 📄 许可证

本项目模板遵循仓库内的 `LICENSE` 协议。

### 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

### 📞 支持

- 📖 **查看示例**: 查看 `example-app` 目录获取示例代码
- 🤖 **使用技能**: 使用内置的 AI Skills 快速创建应用和包
- ⚙️ **参考配置**: 参考现有配置进行自定义开发
- 🐛 **报告问题**: 在 GitHub Issues 中报告问题

---

## 🎯 快速选择你的起点

**如果你是新手**：

1. 使用 `npx degit sspkudx/vue-h5#main my-project` 创建项目
2. 运行 `cd my-project && pnpm i` 安装依赖
3. 运行 `pnpm dev:example` 启动开发服务器
4. 查看 `example-app` 中的示例代码开始学习

**如果你想快速开始新项目**：

1. 使用 `npx degit sspkudx/vue-h5#main my-app`
2. 使用 AI 技能创建你的应用：`"创建新的 Vue 应用，名称为 my-app"`
3. 根据需要创建共享包：`"创建新的依赖包，名称为 utils，类型为工具库"`
4. 开始开发！

**开始您的 Vue H5 项目开发之旅！** 🚀🎉

> 💡 **提示**: 遇到问题时，请先查看 [🚨 常见问题](#常见问题) 部分，大多数问题都有解决方案。
