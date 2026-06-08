# 可用技能列表

vue-h5 项目提供了以下 AI 智能开发技能，帮助开发者快速创建应用和包。

## 1. create-vue-app

**位置**: `/skills/create-vue-app/SKILL.md`

**描述**: 在 apps 目录下创建新的 Vue 应用，基于现有 example-app 模板生成完整的应用结构。

### 使用场景

- 需要创建新的 H5 应用
- 需要在 monorepo 中添加独立的应用模块
- 需要快速生成标准化的 Vue 3 项目结构

### 使用方式

在 AI 编辑器（如 CatPaw、Cursor、Windsurf、Trae）中直接请求：

```bash
"创建名为 my-app 的 Vue 应用"
"创建名为 admin-panel 的应用，端口号设为 8080"
"在 apps 目录下添加新的应用 user-portal"
```

### 主要功能

- ✅ 自动生成完整的 Vue 3 + TypeScript 应用结构
- ✅ 支持自定义应用名称和端口号
- ✅ 包含路由、状态管理、示例组件
- ✅ 自动配置 monorepo 依赖
- ✅ 更新根目录 package.json 脚本

## 2. create-a-package

**位置**: `/skills/create-a-package/SKILL.md`

**描述**: 在 packages 目录下创建新的依赖包，支持四种类型的包创建。

### 支持的包类型

#### 工具库 (Utility Library)
- **用途**: 通用的工具函数集合
- **示例**: `formatDate`, `safeNum`, `debounce`
- **依赖**: 纯 TypeScript/JavaScript

#### 组件库 (Component Library)
- **用途**: 可复用的 Vue 组件
- **示例**: `Button`, `Modal`, `Form`
- **依赖**: Vue 3.x + @vue/babel-plugin-jsx

#### 工具函数集 (Helper Functions)
- **用途**: 业务相关的工具函数集合
- **示例**: `auth`, `http`, `validation`
- **依赖**: 根据具体功能而定

#### 插件库 (Plugin Library)
- **用途**: Vue 插件或通用插件
- **示例**: 路由守卫、状态管理插件
- **依赖**: Vue 及相关框架依赖

### 使用方式

在 AI 编辑器中直接请求：

```bash
"创建名为 utils 的工具库包"
"创建名为 ui-components 的组件库，类型为组件库"
"创建名为 auth-helpers 的工具函数集，描述为 '用户认证相关工具函数'"
```

### 主要功能

- ✅ 创建完整的 TypeScript 包结构
- ✅ 支持四种包类型配置
- ✅ 自动生成构建配置（Rollup、TypeScript、Jest）
- ✅ 配置 monorepo 工作空间引用
- ✅ 生成测试文件和文档模板

## 技能位置

### 项目技能目录
- `skills/create-vue-app/SKILL.md` - 创建 Vue 应用技能
- `skills/create-a-package/SKILL.md` - 创建依赖包技能
- `skills/create-skill/SKILL.md` - 创建新技能技能
- `skills/git-commit-push/SKILL.md` - Git 提交推送技能

### AI 编辑器技能目录
对于不同的 AI 编辑器，技能文件需要放在对应的位置：
- **CatPaw**: `.catpaw/skills/` 目录
- **Cursor**: `.cursor/skills/` 目录
- **Windsurf**: `.windsurf/skills/` 目录
- **Trae**: `.trae/skills/` 目录

## 技能文件结构

每个技能包含一个 `SKILL.md` 文件，格式如下：

```yaml
---
name: skill-name
description: 技能简短描述
---

# 技能名称

技能详细描述和使用说明...
```

## 技能开发

如需创建新技能或修改现有技能，请参考 [技能开发指南](./skill-development-guide.md)。

## 技能使用流程

当使用技能时，系统会按以下流程进行交互：

1. **确认意图** - 确认用户要创建应用还是包
2. **收集信息** - 询问必要的参数（名称、类型、端口等）
3. **验证输入** - 检查名称规范、端口可用性等
4. **创建文件** - 生成完整的项目结构
5. **验证结果** - 检查创建的文件和配置
6. **后续建议** - 提供后续操作建议

## 下一步

- 学习 [技能使用规范](./usage-guidelines.md)
- 查看 [创建 Vue 应用详细指南](./create-vue-app-guide.md)
- 查看 [创建依赖包详细指南](./create-package-guide.md)
- 了解 [项目开发工作流](./workflow.md)