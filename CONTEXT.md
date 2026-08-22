# CONTEXT.md - compat/node-14 分支

> 本分支面向 **Node 14 构建机**（部分流水线编译机无法升级）的兼容场景。
> 除文档修正与技能归档外，本分支保持评审前原状，**与 main 分支的差异即本文件所述**。

## 分支基线（相对 main 的差异）

- Node：**14.18+**（`.node-version = 14`，pnpm 7，lockfile v5.4）——构建机限制，非终端设备兼容性手段
- 依赖：保持升级前版本（ESLint 8 旧式 eslintrc、stylelint 15、prettier 2、rollup 3、jest 29、pinia 3、ress 5）
- 钩子策略：**无 pre-commit 格式化钩子**（lint-staged 12 仅可手动 `pnpm lint-staged`，Node 14 兼容版本；13.x 要求 Node 16+ 勿升级）；**有 commit-msg 钩子**（commitlint v17 强制约定式提交规范，见下）。提交前手动 `pnpm lint && pnpm lint:style && pnpm test`；CI 见 `.github/workflows/ci.yml`（Node 14 + pnpm 7，跑 lint / lint:style / format:check / test / build）
- 无业务基建（axios 封装 / env / proxy / 全局错误处理）：见 main 分支 `docs/agents/business-infrastructure.md`
- browserslist：**Chrome 49 兼容性基线**（桌面端 + 移动端统一，含 Android WebView），由 babel 转译 + core-js polyfill 保证；Vue 3 依赖 Proxy/Reflect（Chrome 49 起支持），故下限不得低于 49
- 移动端适配：postcss-px-to-viewport，自定义单位 `mpx` → `vmin`（viewportWidth 390），配置在各应用根目录 `.postcssrc.js`，由 Vue CLI 的 postcss-loader 自动加载；postcss 插件属构建工具链，统一位于根 devDependencies，应用不重复声明（例外：**`@vue/cli-plugin-eslint` 需在应用 package.json 声明**——vue-cli-service 插件发现机制扫描应用自身依赖，缺失则 `vue-cli-service lint` 命令不存在；**勿声明** plugin-babel/typescript，babel/ts 由 vue.config.js 手动配置，插件默认规则冲突且 Node 14 生产构建会触发 thread-loader 崩溃）
- monorepo 联调：**exports `development` 条件方案**（跟随 main v3.5）——包 package.json exports 带 `development` 指向 `src/index.ts`（webpack dev 默认解析该条件，源码热更新）、`import` 指向 `dist/index.js`（生产构建）；应用**零 alias 配置**；应用 tsconfig paths 指向包源码（类型检查不依赖 dist）；`dev:*` 脚本无前置构建

## 与 main 一致的改动

- 技能归档：`.claude/skills/`（唯一事实来源，已入库）；原 `.catpaw/skills/` 本地镜像与 `pnpm sync:skills` 同步脚本已移除
- 提交规范强制：**约定式提交 v1.0.0**（https://www.conventionalcommits.org/zh-hans/v1.0.0/），commit-msg 钩子 + commitlint v17（main 为 v21）强制校验；本分支不引入 pre-commit 格式化（Node 14 基线考虑）
- 文档修正：README 构建工具实话（webpack）、workflow 幽灵命令、登记全部 7 个技能、example-app README、TESTING.md 失实引用
- monorepo 联调：exports `development` 条件方案（包自描述 exports、应用零 alias、tsconfig paths 指向源码、dev 无前置构建）——与技能模板、troubleshooting 排查步骤同步

## 维护提示

- 本分支的技能/文档与 main 独立演进，互不自动合并
- 如 main 出现需要回溯到 Node 14 环境的修复，cherry-pick 时注意依赖版本差异
