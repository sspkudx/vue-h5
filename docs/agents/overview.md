# 项目概览

vue-h5 是一个基于 Vue 3 + TypeScript + PNPM Workspaces 的现代化 H5 项目模板，支持 Monorepo 架构。项目内置了 AI 智能开发技能（AGENTS），可帮助开发者快速创建应用和包，提高开发效率。

## 技术栈

- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Vite（apps：plugin-vue / plugin-vue-jsx / plugin-legacy；packages：lib 模式）
- **兼容性基线**: Chrome 49（桌面端 + 移动端统一，由根目录 .browserslistrc + plugin-legacy 保证）
- **包管理器**: PNPM + Workspaces
- **样式预处理器**: Less + CSS Modules
- **状态管理**: Pinia
- **路由**: Vue Router
- **开发工具**: ESLint + Prettier + Stylelint
- **测试框架**: Jest

## 项目结构

```
vue-h5/
├── apps/                    # 应用目录
│   ├── example-app/         # 示例应用
│   └── [your-app]/         # 用户创建的应用
├── packages/                # 共享包目录
│   └── shared/             # 共享工具包示例
├── .claude/skills/          # AI 技能目录（8 个技能，唯一事实来源）
│   ├── create-vue-app/     # 创建 Vue 应用技能
│   ├── create-a-vue-page/  # 创建 Vue 页面技能
│   ├── create-component/   # 创建 Vue 组件技能
│   ├── create-a-package/   # 创建依赖包技能
│   ├── design-to-code/     # 设计稿转代码技能
│   ├── git-commit-push/    # Git 提交推送技能
│   ├── update-dependencies/# 依赖更新技能
│   └── create-skill/       # 创建新技能技能
├── types/                   # TypeScript 类型定义
├── scripts/                 # 构建脚本
└── public/                  # 静态资源
```

## 技能目录

技能文件统一归档于以下目录（已提交到仓库）：

- `.claude/skills/` - 技能唯一事实来源（Claude Code / Cursor / Windsurf / opencode 通用）

## 设计理念

### 1. 自动化开发

- 通过 AI 技能快速生成标准化代码
- 减少重复性工作，专注于业务逻辑
- 统一的代码规范和项目结构

### 2. Monorepo 架构

- 多个应用共享依赖包
- 统一的构建和开发流程
- 便捷的包管理和版本控制

### 3. 现代化技术栈

- Vue 3 组合式 API
- TypeScript 静态类型检查
- CSS Modules 样式隔离
- 组件化开发模式

## 快速开始

1. **安装依赖**:

```bash
pnpm install
```

2. **构建共享包**:

```bash
pnpm build:packages
```

3. **启动开发服务器**:

```bash
# 开发启动器（推荐）：Web 控制台勾选要启动的应用/包，自动发现 apps/* 与 packages/*
pnpm dev

# 终端交互多选
pnpm dev --cli

# 直接启动示例应用
pnpm dev:example
```

## 技能概览

项目内置了 8 个 AI 开发技能：

### 创建 Vue 应用技能 (`create-vue-app`)

- 在 `apps` 目录下创建新的 Vue 应用
- 直接生成完整的源码和配置文件（支持 tsx / .vue 两种页面方式）
- 支持自定义应用名称和端口号

### 页面与组件技能 (`create-a-vue-page` / `create-component`)

- 在应用的 `views` 目录下创建页面（tsx / .vue 两种方式）
- 创建三种形式的组件：SFC、defineComponent、FunctionalComponent

### 创建依赖包技能 (`create-a-package`)

- 在 `packages` 目录下创建新的依赖包
- 支持四种包类型：工具库、组件库、工具函数集、插件库
- 自动配置 TypeScript、Vite、Jest 等

### 工程效率技能

- `design-to-code`：设计稿转代码 + 视觉走查，附带校验脚本
- `git-commit-push`：按项目规范（语义化提交）提交与推送
- `update-dependencies`：按 pnpm 11 供应链策略（minimumReleaseAge/allowBuilds）检查与更新依赖
- `create-skill`：创建新的 AI 技能

## 下一步

- 查看 [可用技能列表](./available-skills.md) 了解详细技能信息
- 学习 [技能使用规范](./usage-guidelines.md)
- 参考 [创建 Vue 应用指南](./create-vue-app-guide.md)
- 查看 [创建依赖包指南](./create-package-guide.md)
