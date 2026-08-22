# AGENTS 使用指南 - 索引

本文档是 vue-h5 项目中 AI 智能开发技能（AGENTS）的索引文件。完整的文档已拆分为多个独立的文档，便于维护和阅读。

## 文档结构

vue-h5 项目的 AI 智能开发技能文档采用模块化结构，包含以下文档：

### 核心文档

| 文档 | 描述 | 路径 |
| --- | --- | --- |
| [项目概览](./docs/agents/overview.md) | 项目技术栈、结构和设计理念 | `docs/agents/overview.md` |
| [可用技能列表](./docs/agents/available-skills.md) | 所有可用技能的详细说明 | `docs/agents/available-skills.md` |
| [技能使用规范](./docs/agents/usage-guidelines.md) | 技能使用的最佳实践和规范 | `docs/agents/usage-guidelines.md` |
| [创建 Vue 应用指南](./docs/agents/create-vue-app-guide.md) | 创建 Vue 应用的详细指南 | `docs/agents/create-vue-app-guide.md` |
| [创建依赖包指南](./docs/agents/create-package-guide.md) | 创建依赖包的详细指南 | `docs/agents/create-package-guide.md` |
| [项目开发工作流](./docs/agents/workflow.md) | 项目开发流程和操作指南 | `docs/agents/workflow.md` |
| [代码规范与最佳实践](./docs/agents/coding-standards.md) | 代码规范和开发最佳实践 | `docs/agents/coding-standards.md` |
| [故障排除指南](./docs/agents/troubleshooting.md) | 常见问题解决方案和调试技巧 | `docs/agents/troubleshooting.md` |
| [技能开发指南](./docs/agents/skill-development-guide.md) | 如何创建和维护 AI 技能 | `docs/agents/skill-development-guide.md` |

## 快速开始

### 1. 如果你是新手用户

如果你是第一次使用 vue-h5 项目的 AI 技能，建议按以下顺序阅读：

1. **[项目概览](./docs/agents/overview.md)** - 了解项目整体情况
2. **[可用技能列表](./docs/agents/available-skills.md)** - 查看有哪些可用技能
3. **[技能使用规范](./docs/agents/usage-guidelines.md)** - 学习如何使用技能
4. **[项目开发工作流](./docs/agents/workflow.md)** - 掌握开发流程

### 2. 如果你要创建应用

如果你需要创建新的 Vue 应用，请阅读：

1. **[创建 Vue 应用指南](./docs/agents/create-vue-app-guide.md)** - 详细创建步骤
2. **[代码规范与最佳实践](./docs/agents/coding-standards.md)** - 遵循代码规范
3. **[项目开发工作流](./docs/agents/workflow.md)** - 了解后续开发流程

### 3. 如果你要创建包

如果你需要创建新的依赖包，请阅读：

1. **[创建依赖包指南](./docs/agents/create-package-guide.md)** - 详细创建步骤
2. **[代码规范与最佳实践](./docs/agents/coding-standards.md)** - 遵循代码规范
3. **[项目开发工作流](./docs/agents/workflow.md)** - 了解包开发流程

### 4. 如果你遇到问题

如果你在使用过程中遇到问题，请查阅：

1. **[故障排除指南](./docs/agents/troubleshooting.md)** - 常见问题解决方案
2. **[技能使用规范](./docs/agents/usage-guidelines.md)** - 检查使用方式是否正确

### 5. 如果你要开发新技能

如果你要创建新的 AI 技能，请阅读：

1. **[技能开发指南](./docs/agents/skill-development-guide.md)** - 技能开发完整指南
2. **[代码规范与最佳实践](./docs/agents/coding-standards.md)** - 遵循代码规范
3. **[可用技能列表](./docs/agents/available-skills.md)** - 参考现有技能实现

## 技能快速参考

### 创建 Vue 应用

```bash
# 基础用法
"创建名为 my-app 的 Vue 应用"

# 指定端口号
"创建名为 admin-panel 的应用，端口号设为 8080"

# 完整描述
"在 apps 目录下添加新的应用 user-portal，端口使用 3000"
```

### 创建依赖包

```bash
# 创建工具库
"创建名为 utils 的工具库包"

# 创建组件库
"创建名为 ui-components 的组件库，类型为组件库"

# 创建工具函数集（带描述）
"创建名为 auth-helpers 的工具函数集，描述为 '用户认证相关工具函数'"

# 创建插件库
"创建名为 vue-plugins 的插件库，用于 Vue 插件开发"
```

## 技能位置

### 项目技能目录

```
.claude/skills/
├── create-vue-app/      # 创建 Vue 应用技能
├── create-a-vue-page/   # 创建 Vue 页面技能（tsx / .vue）
├── create-component/    # 创建 Vue 组件技能（SFC / defineComponent / FunctionalComponent）
├── create-a-package/    # 创建依赖包技能
├── design-to-code/      # 设计稿转代码 + 视觉走查
├── create-skill/        # 创建新技能技能
└── git-commit-push/     # Git 提交推送技能
```

### AI 编辑器技能目录

-   **Cursor**: `.cursor/skills/` 目录（如使用该编辑器，从 `.claude/skills/` 复制）
-   **Windsurf**: `.windsurf/skills/` 目录（同上）
-   **Trae**: `.trae/skills/` 目录（同上）

## 文档更新历史

| 版本 | 日期       | 更新内容                                                                                     |
| ---- | ---------- | -------------------------------------------------------------------------------------------- |
| v3.4 | 2026-08-22 | monorepo 联调改 exports `development` 条件方案（跟随 main v3.5）：包 exports 带 development 指向 src（webpack dev 自动解析、源码热更新），应用零 alias，tsconfig paths 指向包源码，dev 无前置构建；create-vue-app / create-a-package 模板与 troubleshooting、CONTEXT 同步；修正文档飘移（create-skill 嵌套目录、workflow 幽灵命令/过时描述、CI 基线、skill-development-guide 头部）；lint-staged 降至 12.x（Node 14 兼容）；stylelint 依赖链降级（recommended-vue 1.4.0 + overrides，Node 14/ESM 兼容）；应用补 @vue/cli-plugin-eslint 声明修复 vue-cli-service lint（勿声明 plugin-babel/typescript，babel/ts 由 vue.config.js 手动配置） |
| v3.3 | 2026-08-20 | create-vue-app 模板补 .postcssrc.js（mpx→vmin 移动端适配基线）并明确构建工具链归根 devDependencies 约定；coding-standards 代码质量检查章节对齐本分支实际配置（.eslintrc.js / .prettierrc.yml / .stylelintrc.cjs）；CONTEXT 补移动端适配说明（跟随 main v3.4，按本分支工具链改写） |
| v3.2 | 2026-08-17 | 移除 .catpaw/skills 镜像、sync:skills 脚本及全部相关引用（跟随 main）                        |
| v3.1 | 2026-08-16 | 提交信息强制约定式提交 v1.0.0（commit-msg + commitlint v17）；本分支无 pre-commit 格式化钩子 |
| v3.0 | 2026-08-16 | 登记全部 7 个技能；技能归档至 .claude/skills 并同步脚本化                                    |
| v2.0 | 2024-01-01 | 文档重构为模块化结构                                                                         |
| v1.0 | 2023-12-01 | 初始版本                                                                                     |

## 贡献指南

如果你发现文档错误或有改进建议，欢迎贡献：

1. Fork 项目仓库
2. 修改对应的文档文件
3. 提交 Pull Request
4. 确保文档链接正确

## 联系方式

如有问题或建议，请：

1. 查看 [故障排除指南](./docs/agents/troubleshooting.md)
2. 在 GitHub 创建 Issue
3. 联系项目维护者

---

## 技能文档导航

-   **开始使用**: [项目概览](./docs/agents/overview.md) → [可用技能列表](./docs/agents/available-skills.md) → [技能使用规范](./docs/agents/usage-guidelines.md)
-   **创建应用**: [创建 Vue 应用指南](./docs/agents/create-vue-app-guide.md) → [项目开发工作流](./docs/agents/workflow.md) → [代码规范与最佳实践](./docs/agents/coding-standards.md)
-   **创建包**: [创建依赖包指南](./docs/agents/create-package-guide.md) → [项目开发工作流](./docs/agents/workflow.md) → [代码规范与最佳实践](./docs/agents/coding-standards.md)
-   **解决问题**: [故障排除指南](./docs/agents/troubleshooting.md) → [技能使用规范](./docs/agents/usage-guidelines.md)
-   **开发技能**: [技能开发指南](./docs/agents/skill-development-guide.md) → [代码规范与最佳实践](./docs/agents/coding-standards.md)

**提示**: 所有文档都位于 `docs/agents/` 目录下，你可以直接访问对应的文件获取详细信息。
