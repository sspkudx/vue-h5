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
| [业务基础设施](./docs/agents/business-infrastructure.md) | 请求封装、环境变量、代理、错误处理及待补清单 | `docs/agents/business-infrastructure.md` |
| [代码规范与最佳实践](./docs/agents/coding-standards.md) | 代码规范和开发最佳实践 | `docs/agents/coding-standards.md` |
| [故障排除指南](./docs/agents/troubleshooting.md) | 常见问题解决方案和调试技巧 | `docs/agents/troubleshooting.md` |
| [技能开发指南](./docs/agents/skill-development-guide.md) | 如何创建和维护 AI 技能 | `docs/agents/skill-development-guide.md` |

> 💡 另有根目录 `CONTEXT.md`：项目持久上下文（业务约束、架构决策、整改基线），供 AI 协作者快速进入状态。

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
├── create-vue-app/          # 创建 Vue 应用技能
├── create-a-vue-page/       # 创建 Vue 页面技能（tsx / .vue）
├── create-component/        # 创建 Vue 组件技能（SFC / defineComponent / FunctionalComponent）
├── create-a-package/        # 创建依赖包技能
├── design-to-code/          # 设计稿转代码 + 视觉走查
├── update-dependencies/     # 依赖更新技能（pnpm 11 供应链策略 + catalog）
├── create-skill/            # 创建新技能技能
└── git-commit-push/         # Git 提交推送技能
```

### AI 编辑器技能目录

- **Cursor**: `.cursor/skills/` 目录（如使用该编辑器，从 `.claude/skills/` 复制）
- **Windsurf**: `.windsurf/skills/` 目录（同上）
- **Trae**: `.trae/skills/` 目录（同上）

## 文档更新历史

| 版本 | 日期 | 更新内容 |
| --- | --- | --- |
| v3.7 | 2026-08-23 | 构建编排收敛：删除自研 build-packages.sh（~300 行），build.sh 改薄壳委托 `pnpm -r run build`（拓扑排序/并行/emptyOutDir 清理）；dev:example 去掉冗余预构建；质量门禁强化（pre-commit 补类型检查与测试、launcher-web 纳入 lint/format、CI 加 pnpm 缓存） |
| v3.6 | 2026-08-23 | 文档漂移大修缮 + 机器校验兜底：新增 `pnpm check:docs`（scripts/check-docs-drift.mjs，比对 README/docs/技能模板与真实 scripts/版本基线，接入 CI）；重写 packages/README.md；create-a-package 模板基线对齐（catalog/TS6/Jest30/Node22/peerDeps）；create-a-vue-page 模板语法修复；create-skill 去 CatPaw 化；清理 Rollup/Webpack/vue.config.js 残留；.browserslistrc 改 `chrome >= 49`；新增根 CHANGELOG.md |
| v3.5 | 2026-08-21 | monorepo 联调改为 exports `development` 条件方案：包 exports 指向 src，Vite dev 自动解析（热更新），应用不再配置 `@my-app/*` alias；create-a-package / create-vue-app 模板与 CONTEXT.md、troubleshooting 同步 |
| v3.3 | 2026-08-16 | 新增 update-dependencies 依赖更新技能（pnpm 11 minimumReleaseAge/allowBuilds + catalog 统一版本）；登记技能数 7 → 8 |
| v3.2 | 2026-08-16 | 提交信息强制约定式提交 v1.0.0（commitlint）；compat/node-14 分支仅保留 commit-msg 校验（无 pre-commit 格式化） |
| v3.1 | 2026-08-16 | 新增根 tsconfig.base.json 公共 TS 配置；移除 .catpaw/skills 镜像与 sync 脚本；README 增加 Node 14 分支指引 |
| v3.0 | 2026-08-16 | 登记全部 7 个技能；新增 CONTEXT.md、业务基础设施文档；同步脚本化 |
| v2.0 | 2024-01-01 | 文档重构为模块化结构 |
| v1.0 | 2023-12-01 | 初始版本 |

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

- **开始使用**: [项目概览](./docs/agents/overview.md) → [可用技能列表](./docs/agents/available-skills.md) → [技能使用规范](./docs/agents/usage-guidelines.md)
- **创建应用**: [创建 Vue 应用指南](./docs/agents/create-vue-app-guide.md) → [项目开发工作流](./docs/agents/workflow.md) → [代码规范与最佳实践](./docs/agents/coding-standards.md)
- **创建包**: [创建依赖包指南](./docs/agents/create-package-guide.md) → [项目开发工作流](./docs/agents/workflow.md) → [代码规范与最佳实践](./docs/agents/coding-standards.md)
- **解决问题**: [故障排除指南](./docs/agents/troubleshooting.md) → [技能使用规范](./docs/agents/usage-guidelines.md)
- **开发技能**: [技能开发指南](./docs/agents/skill-development-guide.md) → [代码规范与最佳实践](./docs/agents/coding-standards.md)

**提示**: 所有文档都位于 `docs/agents/` 目录下，你可以直接访问对应的文件获取详细信息。
