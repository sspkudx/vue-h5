# Changelog

本文件记录 vue-h5 仓库级别的显著变更（架构决策、工具链升级、约定变更）。遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 与语义化版本（SemVer）。

> 历史迭代记录见 `AGENTS.md` 的「文档更新历史」表；本文件自 v0.2.0 起维护。技能/模板/文档与真实代码的一致性由 `pnpm check:docs`（scripts/check-docs-drift.mjs）在 CI 中强制校验。

## [Unreleased]

### 新增

- **启动器页面创建应用/包**：`scripts/dev-launcher/scaffold.mjs` 将 create-vue-app / create-a-package 技能的程序化流程落地（名称/端口校验、模板复制 + 占位替换、可选写根 scripts、后台 `pnpm install`）；新增 `scripts/dev-launcher/templates/` 文件模板（`templates/app/` 单 HomeView（.vue）应用模板、`templates/package/` 四种类型变体）；`server.mjs` 增加 `POST /api/create-app`、`/api/create-package`、`/api/pkg-install` 与 `GET /api/pkg-install/status`；Web 控制台新增「＋ 新建应用 / ＋ 新建包」入口与 `CreateDialog.vue` 模态表单；新条目创建后经实时扫描自动出现在列表，不自动启动。

### 修复

- **技能模板基线对齐**：`create-a-package` 五个 package.json 模板对齐仓库基线（typescript/vite/vitest/@vitest/coverage-v8 走 `catalog:`、engines node >=22.0.0）；Vue 生态依赖移入 `peerDependencies`；移除 `@vue/babel-plugin-jsx` 与 `@vue/vue3-jest`；测试表述统一为 Vitest。
- **技能模板语法修复**：`create-a-vue-page` tsx 模板的 `defineComponent` 用法与默认导出写法修正（此前为语法错误）；`create-vue-app` tsconfig 模板移除 TS 6.0 已废弃的 `baseUrl`。
- **`create-skill` 技能去 CatPaw 化**：改写为仓库 `.claude/skills/` 唯一事实来源约定。
- **文档漂移清理**：重写 `packages/README.md`（对齐 exports `development` 联调方案）；清理 README / apps/README / docs/agents 中的 Rollup、Webpack、vue.config.js、historyApiFallback、幽灵包示例等过期内容；修正 README 快速开始终点衔接（8888 控制台 → 2000 示例应用）。

### 新增

- **`scripts/check-docs-drift.mjs` + `pnpm check:docs`**：文档/模板漂移机器校验（命令存在性、过期术语、技能模板基线、技能数量、browserslist 语义），已接入 CI。
- **根目录 `CHANGELOG.md`**：仓库级变更记录落点。

### 变更

- **`.browserslistrc`**：`chrome 49` → `chrome >= 49`（精确匹配改为范围下限语义，修正注释与实现不符的问题）。
- **测试质量守护**：`shared` 包 100% 覆盖率阈值强制（现由 `vitest.config.mts` 的 `coverage.thresholds` 承担，原 jest.config.js 已随 v3.9 迁移删除）。
- **构建编排收敛**：删除自研 `scripts/build-packages.sh`（约 300 行）；`scripts/build.sh` 改为薄壳委托 `pnpm -r run build`（拓扑排序、默认 4 并行、Vite emptyOutDir 清理 dist），保留旧 CLI 参数兼容（`--packages-only` / `--apps-only` / `--clean-only` 等）；`dev:example` 去掉冗余的包预构建（exports `development` 条件下 dev 无需 dist）。
- **质量门禁强化**：pre-commit 追加 example-app 类型检查与单元测试（lint-staged 只覆盖改动文件）；example-app `lint` 移除 `--fix`（lint 只读）；`scripts/dev-launcher/web` 控制台前端纳入 eslint/prettier 覆盖（此前完全逃过）；CI 的 setup-node 启用 pnpm store 缓存。
- **解析链路收敛（customConditions）**：包 `exports` 的 `development` 条件改为嵌套形态（自含 `types`+`default` 指向 src，置于 `types`/`import` 之前）；`tsconfig.base.json` 新增 `customConditions: ["development"]`，TS 类型层与 Vite dev 命中同一 `development` 条件 → 源码直读、typecheck 不再依赖先构建 dist；应用 tsconfig 移除硬编码 `@my-app/*` paths（保留 `@/*`）。生产构建仍解析 `types`/`import` → dist。技能模板与全部文档、漂移检查器同步。
- **测试框架迁移 Jest → Vitest 4**：新增根 `vitest.config.mts`（v8 覆盖率、阈值 100% 守护，include 覆盖 `packages/**`），删除 `jest.config.js`（根 + shared）；根与 shared 的 test 脚本改 `vitest run`；测试文件显式 `import ... from 'vitest'`（tsconfig `types` 简化为 `["node"]`）；依赖移除 jest/ts-jest/@types/jest/jest-environment-jsdom，vitest/@vitest/coverage-v8 进 `catalog:`；workspace 包在测试中走 Vite dev 解析（exports `development` 条件 → src，无需 moduleNameMapper）；eslint 测试块去掉 jest globals；技能模板（create-a-package 五个模板与测试章节）、全部文档、漂移检查器同步（jest 禁词化）。
- **P2 应用级测试落地**：`vitest.config.mts` 增加 `vue()` + `vueJsx()` 插件、`include` 覆盖 `apps/**`；新增 `@vue/test-utils` + `jsdom` 依赖（进 `catalog:`）；example-app 内置 3 个示例测试（PlaygroundPage SFC 交互、HomeView TSX + vue-router mock + workspace 包联调、request 拦截器错误映射）；`request.ts` 具名导出 `createRequest` 便于注入自定义 adapter；覆盖率门槛保持仅限 `packages/**`；eslint 测试块扩展 tsx；业务文档/工作流/README 同步。
- **E2E 测试落地（Playwright）**：新增 `@playwright/test`（进 `catalog:`）与 `playwright.config.ts`（testDir `e2e/`、webServer 自动拉起 example-app、移动端 viewport 390×844、CI 重试）；`e2e/example-app.spec.ts` 3 个冒烟用例（首页渲染 + shared 联调、hash 路由导航 ×2、计数器交互）；根脚本 `test:e2e`；CI 新增独立 `e2e` job（`--with-deps chromium` + 失败上传报告）；.gitignore 加 Playwright 产物。

## [0.1.0] - 2026-08

- 初版：Vue 3 + Vite 8 + pnpm 11 monorepo 模板，内置 dev-launcher 与 8 个 AI 技能。
