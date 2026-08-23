# Changelog

本文件记录 vue-h5 仓库级别的显著变更（架构决策、工具链升级、约定变更）。遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 与语义化版本（SemVer）。

> 历史迭代记录见 `AGENTS.md` 的「文档更新历史」表；本文件自 v0.2.0 起维护。技能/模板/文档与真实代码的一致性由 `pnpm check:docs`（scripts/check-docs-drift.mjs）在 CI 中强制校验。

## [Unreleased]

### 修复

- **技能模板基线对齐**：`create-a-package` 五个 package.json 模板对齐仓库基线（typescript/vite 走 `catalog:`、@types/jest ^30、engines node >=22.0.0）；Vue 生态依赖移入 `peerDependencies`；移除 `@vue/babel-plugin-jsx` 与 `@vue/vue3-jest`；Vitest 表述统一为 Jest。
- **技能模板语法修复**：`create-a-vue-page` tsx 模板的 `defineComponent` 用法与默认导出写法修正（此前为语法错误）；`create-vue-app` tsconfig 模板移除 TS 6.0 已废弃的 `baseUrl`。
- **`create-skill` 技能去 CatPaw 化**：改写为仓库 `.claude/skills/` 唯一事实来源约定。
- **文档漂移清理**：重写 `packages/README.md`（对齐 exports `development` 联调方案）；清理 README / apps/README / docs/agents 中的 Rollup、Webpack、vue.config.js、historyApiFallback、幽灵包示例等过期内容；修正 README 快速开始终点衔接（8888 控制台 → 2000 示例应用）。

### 新增

- **`scripts/check-docs-drift.mjs` + `pnpm check:docs`**：文档/模板漂移机器校验（命令存在性、过期术语、技能模板基线、技能数量、browserslist 语义），已接入 CI。
- **根目录 `CHANGELOG.md`**：仓库级变更记录落点。

### 变更

- **`.browserslistrc`**：`chrome 49` → `chrome >= 49`（精确匹配改为范围下限语义，修正注释与实现不符的问题）。
- **`packages/shared/jest.config.js`**：新增 `coverageThreshold`（100%），强制守护测试质量宣称。

## [0.1.0] - 2026-08

- 初版：Vue 3 + Vite 8 + pnpm 11 monorepo 模板，内置 dev-launcher 与 8 个 AI 技能。
