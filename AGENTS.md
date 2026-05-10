# AGENTS 使用指南

本文档提供了 vue-h5 项目中 AI 智能开发技能（AGENTS）的完整使用指南和规范。这些技能旨在帮助开发者快速创建应用和包，提高开发效率。

## 目录

1. [项目概览](#项目概览)
2. [可用技能列表](#可用技能列表)
3. [技能使用规范](#技能使用规范)
4. [创建 Vue 应用技能](#创建-vue-应用技能)
5. [创建依赖包技能](#创建依赖包技能)
6. [项目开发工作流](#项目开发工作流)
7. [代码规范与最佳实践](#代码规范与最佳实践)
8. [故障排除](#故障排除)
9. [技能开发指南](#技能开发指南)

## 项目概览

vue-h5 是一个基于 Vue 3 + TypeScript + PNPM Workspaces 的现代化 H5 项目模板，支持 Monorepo 架构。项目内置了 AI 智能开发技能，可帮助开发者快速创建应用和包。

### 技术栈

-   **前端框架**: Vue 3 + TypeScript
-   **构建工具**: Vue CLI + Webpack
-   **包管理器**: PNPM + Workspaces
-   **样式预处理器**: Less + CSS Modules
-   **状态管理**: Pinia
-   **路由**: Vue Router
-   **开发工具**: ESLint + Prettier + Stylelint
-   **测试框架**: Jest

### 项目结构

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

## 可用技能列表

### 1. create-vue-app

**位置**: `/skills/create-vue-app/SKILL.md` **描述**: 在 apps 目录下创建新的 Vue 应用，基于现有 example-app 模板生成完整的应用结构。

**使用场景**:

-   需要创建新的 H5 应用
-   需要在 monorepo 中添加独立的应用模块
-   需要快速生成标准化的 Vue 3 项目结构

**使用方式**:

```bash
# 在 AI 编辑器（如 CatPaw、Cursor、Windsurf、Trae）中先改成编辑器需要的格式（例如.cursor/skills/*），然后直接请求：
"创建名为 my-app 的 Vue 应用"
"创建名为 admin-panel 的应用，端口号设为 8080"
"在 apps 目录下添加新的应用 user-portal"
```

### 2. create-a-package

**位置**: `/skills/create-a-package/SKILL.md` **描述**: 在 packages 目录下创建新的依赖包，支持四种类型的包创建。

**包类型**:

-   **工具库 (Utility Library)**: 通用的工具函数集合
-   **组件库 (Component Library)**: 可复用的 Vue 组件
-   **工具函数集 (Helper Functions)**: 业务相关的工具函数集合
-   **插件库 (Plugin Library)**: Vue 插件或通用插件

**使用方式**:

```bash
# 在 AI 编辑器中直接请求：
"创建名为 utils 的工具库包"
"创建名为 ui-components 的组件库，类型为组件库"
"创建名为 auth-helpers 的工具函数集，描述为 '用户认证相关工具函数'"
```

## 技能使用规范

### 技能调用约定

1. **明确的应用/包名称**: 名称应符合 npm 包名规范（小写字母、数字、连字符）
2. **可选参数指定**: 端口号、包类型等可选参数应明确指定
3. **语义化描述**: 尽可能提供清晰的意图描述

### 交互式创建流程

当使用技能时，系统会按以下流程进行交互：

1. **确认意图**: 确认用户要创建应用还是包
2. **收集信息**: 询问必要的参数（名称、类型、端口等）
3. **验证输入**: 检查名称规范、端口可用性等
4. **创建文件**: 生成完整的项目结构
5. **验证结果**: 检查创建的文件和配置
6. **后续建议**: 提供后续操作建议

## 创建 Vue 应用技能

### 功能特性

-   ✅ 自动生成完整的 Vue 3 + TypeScript 应用结构
-   ✅ 支持自定义应用名称和端口号
-   ✅ 包含路由、状态管理、示例组件
-   ✅ 自动配置 monorepo 依赖
-   ✅ 更新根目录 package.json 脚本

### 创建的目录结构

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

### 核心配置文件

#### package.json

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

#### vue.config.js

关键配置：

-   开发服务器端口自定义
-   支持 Less 模块化样式
-   CSS Modules 自动转换
-   Babel 和 TypeScript 集成
-   与 monorepo 包的路径别名映射

#### tsconfig.json

-   JSX 支持（Vue JSX）
-   路径别名映射
-   严格的类型检查
-   monorepo 包引用支持

### 创建后的操作

1. **安装依赖**:

```bash
# 如果还没有安装依赖
pnpm install
```

2. **启动开发服务器**:

```bash
# 使用新创建的应用脚本
pnpm run dev:{app-name}
# 例如：pnpm run dev:my-app
```

3. **构建应用**:

```bash
pnpm run build:{app-name}
```

4. **代码检查**:

```bash
pnpm run lint:{app-name}
```

### 示例

**创建名为 `user-portal` 的应用，端口 3001**:

```bash
# 请求
"创建名为 user-portal 的 Vue 应用，端口号设为 3001"

# 创建的应用结构
apps/user-portal/
├── src/
├── package.json        # name: "user-portal"
└── vue.config.js      # devServer.port: 3001

# 根目录 scripts 更新
"dev:user-portal": "./scripts/build-packages.sh --skip-clean && pnpm -F user-portal dev"
"build:user-portal": "pnpm -F user-portal build"
"lint:user-portal": "pnpm -F user-portal lint"
```

## 创建依赖包技能

### 支持的包类型

#### 1. 工具库 (Utility Library)

-   **用途**: 通用的工具函数集合
-   **示例**: `formatDate`, `safeNum`, `debounce`
-   **依赖**: 纯 TypeScript/JavaScript

#### 2. 组件库 (Component Library)

-   **用途**: 可复用的 Vue 组件
-   **示例**: `Button`, `Modal`, `Form`
-   **依赖**: Vue 3.x + @vue/babel-plugin-jsx

#### 3. 工具函数集 (Helper Functions)

-   **用途**: 业务相关的工具函数集合
-   **示例**: `auth`, `http`, `validation`
-   **依赖**: 根据具体功能而定

#### 4. 插件库 (Plugin Library)

-   **用途**: Vue 插件或通用插件
-   **示例**: 路由守卫、状态管理插件
-   **依赖**: Vue 及相关框架依赖

### 创建的目录结构

```
packages/{package-name}/
├── src/
│   ├── index.ts          # 包入口文件
│   └── (其他源码文件)    # 可选的源代码文件
├── __tests__/           # 测试目录（可选）
│   └── index.test.ts    # 测试文件
├── README.md            # 包的说明文档
├── package.json         # 包配置文件
├── jest.config.js       # Jest 测试配置（如果添加测试）
├── tsconfig.json        # TypeScript 配置文件
├── tsconfig.build.json  # TypeScript 构建配置
└── rollup.config.ts     # Rollup 构建配置
```

### 核心配置文件

#### package.json (工具库示例)

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
    "peerDependencies": {},
    "engines": {
        "node": ">= 14"
    }
}
```

#### rollup.config.ts

-   支持 ES 模块构建
-   生成类型声明文件
-   外部依赖处理
-   Source map 支持

#### tsconfig.json

-   继承项目根配置
-   JSX 支持（针对组件库）
-   路径别名配置
-   严格类型检查

### 包开发流程

1. **创建包**:

```bash
# 请求创建工具库
"创建名为 utils 的工具库，用于工具函数"
```

2. **开发模式**:

```bash
# 进入包目录
cd packages/{package-name}

# 启动开发模式（监听文件变化）
pnpm run dev
```

3. **构建生产版本**:

```bash
# 构建包
pnpm run build

# 或者在根目录构建所有包
pnpm build:packages
```

4. **运行测试**:

```bash
# 运行包测试
pnpm test

# 运行测试并监听变化
pnpm test:watch

# 生成测试覆盖率报告
pnpm test:coverage
```

### 在其他应用中使用创建的包

1. **在应用的 package.json 中添加依赖**:

```json
{
    "dependencies": {
        "@my-app/{package-name}": "workspace:*"
    }
}
```

2. **在代码中导入使用**:

```typescript
// 导入工具函数
import { safeNum, formatDate } from '@my-app/utils';

// 导入 Vue 组件
import { Button } from '@my-app/ui-components';
```

3. **确保路径映射正确**: 应用的 `vue.config.js` 和 `tsconfig.json` 会自动配置包别名映射。

### 示例

**创建工具库 `utils`**:

```bash
# 请求
"创建名为 utils 的工具库，用于日期和数字处理"

# 创建的包结构
packages/utils/
├── src/
│   ├── index.ts
│   ├── date-utils.ts
│   └── number-utils.ts
├── __tests__/
│   └── index.test.ts
├── README.md
└── package.json          # name: "@my-app/utils"
```

**创建组件库 `ui-components`**:

```bash
# 请求
"创建名为 ui-components 的组件库，包含按钮和弹窗组件"

# 包配置会包含 Vue 相关依赖
"peerDependencies": {
    "vue": "^3.5.33",
    "@vue/babel-plugin-jsx": "^1.5.0"
}
```

## 项目开发工作流

### 1. 启动开发

```bash
# 安装所有依赖
pnpm install

# 构建共享包
pnpm build:packages

# 启动示例应用开发服务器
pnpm dev:example

# 启动新创建的应用
pnpm dev:{app-name}
```

### 2. 开发工作流

```bash
# 在开发过程中
# 修改应用代码 -> 自动热重载
# 修改包代码 -> 需要重新构建

# 重新构建所有包
pnpm build:packages

# 或者在包的目录下单独构建
cd packages/{package-name}
pnpm build
```

### 3. 代码质量检查

```bash
# 检查代码规范
pnpm lint

# 自动修复代码规范问题
pnpm lint:fix

# 检查样式规范
pnpm lint:style

# 自动修复样式规范问题
pnpm lint:style:fix

# 格式化代码
pnpm format

# 检查代码格式
pnpm format:check
```

### 4. 测试

```bash
# 运行所有测试
pnpm test

# 运行测试并监听变化
pnpm test:watch

# 生成测试覆盖率报告
pnpm test:coverage

# 运行特定包的测试
pnpm -F @my-app/shared test
```

### 5. 构建

```bash
# 构建特定应用
pnpm build:{app-name}

# 构建所有包
pnpm build:packages

# 完整构建（所有应用和包）
pnpm build
```

## 代码规范与最佳实践

### 文件命名规范

-   **组件文件**: 使用 PascalCase，如 `HomeView.vue` 或 `HomeView.tsx`
-   **工具函数文件**: 使用 kebab-case，如 `date-utils.ts`
-   **样式文件**: 使用 `.module.less` 后缀，如 `style.module.less`
-   **配置文件**: 使用 kebab-case，如 `vue.config.js`

### 目录结构规范

1. **应用结构**:

```
apps/{app-name}/
├── src/
│   ├── components/     # 通用组件
│   ├── views/          # 页面组件
│   ├── composables/    # 组合式函数
│   ├── stores/         # Pinia 状态管理
│   ├── utils/          # 工具函数
│   ├── plugins/        # Vue 插件
│   ├── router/         # 路由配置
│   └── types/          # 类型定义
```

2. **包结构**:

```
packages/{package-name}/
├── src/
│   ├── components/     # Vue 组件（如果是组件库）
│   ├── hooks/          # 自定义 Hooks
│   ├── utils/          # 工具函数
│   ├── types/          # 类型定义
│   └── index.ts        # 主入口文件
└── __tests__/         # 测试文件
```

### TypeScript 规范

1. **严格模式**: 始终使用严格类型检查
2. **接口定义**: 为所有公共 API 提供接口定义
3. **类型导出**: 导出必要的类型定义
4. **泛型使用**: 在适当的地方使用泛型提高复用性

### Vue 组件规范

1. **组合式 API**: 优先使用 `<script setup>` 语法
2. **类型定义**: 为组件 Props 和 Emits 提供完整类型定义
3. **样式隔离**: 使用 CSS Modules 或 Scoped CSS
4. **组件命名**: 使用多单词命名避免冲突

### 测试规范

1. **测试文件位置**: 在 `__tests__` 目录中，保持与源码相同的结构
2. **测试文件命名**: 使用 `.test.ts` 或 `.spec.ts` 后缀
3. **测试覆盖率**: 关键功能应达到 80% 以上覆盖率
4. **测试类型**: 单元测试为主，适当添加集成测试

### Git 提交规范

1. **提交信息格式**:

```
feat: 添加新功能
fix: 修复问题
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建过程或辅助工具变动
```

2. **分支命名**:

```
feature/add-login           # 新功能
bugfix/fix-login-error      # bug 修复
hotfix/fix-production-bug   # 生产环境热修复
release/v1.0.0              # 版本发布
```

## 故障排除

### 常见问题

#### 1. 依赖安装失败

```bash
# 清理并重新安装
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
pnpm i
```

#### 2. 包引用问题

```bash
# 确保所有包都已构建
pnpm build:packages

# 重新链接依赖
pnpm i --force
```

#### 3. 类型错误

```bash
# 检查 TypeScript 配置
pnpm -F {app-name} tsc --noEmit

# 清理 TypeScript 缓存
rm -rf node_modules/.cache
```

#### 4. 开发服务器启动失败

-   **端口被占用**: 修改 `vue.config.js` 中的 `devServer.port`
-   **内存不足**: 增加 Node.js 内存限制 `NODE_OPTIONS=--max-old-space-size=4096`
-   **依赖缺失**: 确保所有依赖已正确安装

#### 5. 构建失败

```bash
# 查看详细错误信息
pnpm build:{app-name} --verbose

# 清理构建缓存
rm -rf apps/{app-name}/dist
rm -rf packages/{package-name}/dist
```

### 调试技巧

#### 1. 检查依赖树

```bash
# 查看项目依赖树
pnpm list

# 查看特定包的依赖
pnpm list {package-name}
```

#### 2. 检查版本冲突

```bash
# 检查重复的包
pnpm list | grep -E "(duplicate|multiple)"
```

#### 3. 使用调试模式

```bash
# 启动开发服务器时开启调试
NODE_OPTIONS=--inspect pnpm dev:{app-name}

# 构建时显示详细日志
pnpm build:{app-name} --verbose
```

#### 4. 检查 Webpack 配置

```bash
# 查看最终的 Webpack 配置
vue inspect > webpack.config.js
```

### 性能优化

#### 1. 构建优化

-   **代码分割**: 使用动态导入分割代码块
-   **Tree Shaking**: 确保包支持 ES 模块
-   **缓存策略**: 配置合适的缓存策略

#### 2. 开发体验优化

-   **热重载**: 确保热重载正常工作
-   **错误覆盖**: 配置合适的错误处理
-   **类型检查**: 配置 TypeScript 快速检查

#### 3. 包体积优化

-   **按需加载**: 组件和工具函数按需导入
-   **压缩优化**: 配置合适的压缩选项
-   **图片优化**: 使用合适的图片格式和压缩

## 技能开发指南

### 技能文件结构

技能文件位于 `/.catpaw/skills/` 目录，每个技能一个文件夹，包含：

```
.catpaw/skills/
├── create-vue-app/
│   └── SKILL.md          # 技能文档
└── create-a-package/
    └── SKILL.md
```

### 技能文档格式

每个技能文档应包含以下部分：

#### 1. 元数据头

```yaml
---
name: skill-name
description: 技能简短描述
---
```

#### 2. 技能文档内容

-   **概述**: 技能的目的和功能
-   **使用场景**: 何时使用该技能
-   **创建流程**: 详细的步骤说明
-   **文件模板**: 生成的配置文件模板
-   **示例**: 使用示例
-   **注意事项**: 需要注意的事项
-   **错误处理**: 常见错误和解决方法
-   **完成后的操作**: 创建成功后的建议操作

### 创建新技能的步骤

1. **分析需求**: 确定技能要解决的问题
2. **设计流程**: 设计用户交互和创建流程
3. **创建模板**: 准备生成的文件模板
4. **编写文档**: 编写详细的技能文档
5. **测试验证**: 测试技能是否正常工作
6. **优化迭代**: 根据反馈优化技能

### 最佳实践

#### 1. 用户体验

-   **清晰的提示**: 提供明确的交互提示
-   **错误恢复**: 优雅地处理错误情况
-   **进度反馈**: 显示创建进度和结果

#### 2. 代码生成

-   **模板化**: 使用模板生成代码，避免硬编码
-   **可配置**: 提供适当的配置选项
-   **一致性**: 保持与现有代码风格一致

#### 3. 验证机制

-   **输入验证**: 验证用户输入的有效性
-   **文件检查**: 检查文件是否已存在
-   **环境检查**: 检查必要的环境条件

#### 4. 文档质量

-   **详细示例**: 提供多个使用示例
-   **故障排除**: 包含常见问题解决方法
-   **最佳实践**: 提供使用建议和最佳实践

### 技能扩展

#### 1. 添加新技能

1. 在 `.catpaw/skills/` 创建新文件夹
2. 创建 `SKILL.md` 文档
3. 按照格式编写技能说明
4. 测试技能功能
5. 更新项目文档

#### 2. 扩展现有技能

1. 分析现有技能的不足
2. 设计扩展功能
3. 修改技能文档
4. 测试扩展功能
5. 更新相关文档

#### 3. 技能集成

-   **相互引用**: 技能之间可以相互引用
-   **共享模板**: 提取公共模板代码
-   **统一接口**: 保持技能接口的一致性

### 技能维护

#### 1. 版本管理

-   记录技能的变更历史
-   保持向后兼容性
-   及时更新过时的内容

#### 2. 质量保证

-   定期测试技能功能
-   更新依赖版本
-   修复已知问题

#### 3. 社区贡献

-   鼓励社区贡献新技能
-   提供贡献指南
-   审核和合并贡献

---

## 总结

vue-h5 项目的 AI 智能开发技能提供了强大的自动化开发能力：

1. **create-vue-app**: 快速创建标准化的 Vue 3 应用
2. **create-a-package**: 快速创建各种类型的依赖包
3. **标准化工作流**: 确保项目的一致性和可维护性
4. **最佳实践集成**: 内置代码规范、测试配置等

通过使用这些技能，开发者可以：

-   快速启动新项目
-   保持代码一致性
-   减少重复工作
-   专注于业务逻辑开发

对于任何问题或建议，请参考项目文档或创建 GitHub Issue。
