# 项目概览

vue-h5 是一个基于 Vue 3 + TypeScript + PNPM Workspaces 的现代化 H5 项目模板，支持 Monorepo 架构。项目内置了 AI 智能开发技能（AGENTS），可帮助开发者快速创建应用和包，提高开发效率。

## 技术栈

- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Vue CLI + Webpack
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
├── skills/                  # AI 技能目录
│   ├── create-vue-app/     # 创建 Vue 应用技能
│   └── create-a-package/   # 创建依赖包技能
├── types/                   # TypeScript 类型定义
├── scripts/                 # 构建脚本
└── public/                  # 静态资源
```

## 技能目录

技能文件位于以下目录：
- `.catpaw/skills/` - CatPaw IDE 的技能目录
- `skills/` - 项目中的技能模板目录

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
# 启动示例应用
pnpm dev:example

# 启动新创建的应用
pnpm dev:{app-name}
```

## 技能概览

项目内置了以下 AI 开发技能：

### 创建 Vue 应用技能 (`create-vue-app`)
- 在 `apps` 目录下创建新的 Vue 应用
- 基于现有 example-app 模板生成完整结构
- 支持自定义应用名称和端口号

### 创建依赖包技能 (`create-a-package`)
- 在 `packages` 目录下创建新的依赖包
- 支持四种包类型：工具库、组件库、工具函数集、插件库
- 自动配置 TypeScript、Rollup、Jest 等

## 下一步

- 查看 [可用技能列表](./available-skills.md) 了解详细技能信息
- 学习 [技能使用规范](./usage-guidelines.md)
- 参考 [创建 Vue 应用指南](./create-vue-app-guide.md)
- 查看 [创建依赖包指南](./create-package-guide.md)