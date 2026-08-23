# CONTEXT.md - vue-h5 项目上下文

> 本文件是项目的持久上下文，供 AI 协作者快速进入状态。记录"是什么"和"为什么"，不记录任务清单。

## 项目定位

- **vue-h5**：Vue 3 H5 项目模板（monorepo），通过 `degit` 分发，内置 AI Skills 用于生成新应用/包。
- 仓库：`git@github.com:sspkudx/vue-h5.git`，MIT License，private。

## 业务背景与硬性约束

- 目标用户是**商家端**（参考美团外卖商家端场景）：商家不会用高配设备接单。
- 因此**浏览器兼容性是一等公民**：低端安卓机、老 iOS、Win 7（最高 Chrome 109）都要能跑。
- 关键认知：**兼容性由构建产物决定，不由 Node 版本决定**。Node 是构建机环境；终端设备兼容性靠 `browserslist` 显式下限 + babel/core-js 转译 + ES5 产物保证。
- Vue 3 是兼容性硬地板：依赖 `Proxy`（无法 polyfill），最低 Chrome 49+ / iOS 10+ / Android WebView 49+。2026 年商家设备均在此线之上。

## 技术栈（实际，非宣称）

| 层 | 实际选型 |
| --- | --- |
| 框架 | Vue 3.5 + TypeScript 6.0，TSX（@vitejs/plugin-vue-jsx）与 SFC 混用 |
| 构建 | **Vite 8**（apps：plugin-vue / plugin-vue-jsx / plugin-legacy；packages：Vite lib 模式） |
| 状态 | Pinia 4 |
| 样式 | Less + CSS Modules（`*.module.less`，kebab→camel 双导出），`ress` reset |
| 移动端适配 | postcss-px-to-viewport，自定义单位 `mpx` → `vmin`（viewportWidth 390；横竖屏切换尺寸会变，双刃剑，已知晓） |
| 包管理 | pnpm 11 workspace（`apps/*` + `packages/*`），registry 指华为云镜像 + `shamefully-hoist`（配置在 `pnpm-workspace.yaml`）；高频共享依赖由 `catalogs.default` 统一版本（`catalog:` 协议） |
| 测试 | Jest 30 + ts-jest，根配置只覆盖 `packages/**` |
| 规范 | ESLint 10（flat config）+ Prettier 3 + stylelint 17（BEM 类名约束 + 属性排序） |
| 构建编排 | `scripts/build.sh` / `build-packages.sh`（先 packages 后 apps，支持并行） |

## 结构

- `apps/example-app`：唯一应用，也是 create-vue-app 技能的参照实现。
- `packages/shared`（`@my-app/shared`）：纯工具库（类型守卫 + 数字工具），Vite lib 模式出 ESM + tsc 出 d.ts，测试质量是仓库标杆。
- `.claude/skills/`：8 个 AI 技能（唯一事实来源，已入库）。
- `docs/agents/`：模块化文档（AGENTS.md 是索引）。
- `scripts/`：构建编排（build.sh / build-packages.sh / watch-package.sh）与**开发启动器**（`dev-launcher/`，Web 控制台 + CLI 双形态，见架构决策 5）。
- `types/`：css/img/vue 的 d.ts shim，由各子项目 tsconfig 引用；根目录 `tsconfig.base.json` 是公共 TS 编译配置（`moduleResolution: "bundler"`），apps/packages 的 tsconfig 均 extends 它。

## 关键架构决策

1. **monorepo 源码联调**：各包 `package.json` 的 `exports` 带 `"development": "./src/index.ts"` 条件（置于 `import` 之前）。Vite dev 默认解析该条件 → 包源码热更新，应用无需为 `@my-app/*` 配置 alias；生产构建解析 `import` 条件 → dist。这是仓库核心工程价值，新增包必须保留该条件（create-a-package 模板已内置）。
2. **运行时依赖归各 app 自管**，根 package.json 只放工具链（原先把 vue/pinia 等装在根上 + hoist 兜底，已纠正）。
3. **catalog 统一版本**：高频共享依赖（vue/vue-router/pinia/axios/ress）在 `pnpm-workspace.yaml` 的 `catalogs.default` 定义版本，各 app/包用 `catalog:` 引用，升级只改一处、全仓一致（2026-08 起）。
4. **依赖解析**：根 `jest.config.js` 的 moduleNameMapper 用通配规则 `^@my-app/(.*)$` → `packages/$1/src`（新增包自动覆盖）；运行时解析见第 1 条（exports `development` 条件），两处互不依赖。
5. **开发启动器**：`pnpm dev` 启动本地 Web 控制台（`pnpm dev --cli` 走终端多选，共用 `scripts/dev-launcher/core.mjs` 的发现与进程管理）。Web 控制台前端为 Vue 3 + Vite 子工程（`scripts/dev-launcher/web/`，workspace 包 `dev-launcher-web`，版本走 catalog），`predev` 自动构建产物交 `server.mjs` 托管；后端保持零依赖原生 Node http。每次请求实时扫描 `apps/*`、`packages/*`——新应用/包零配置自动出现；应用端口解析自 `vite.config.ts`，实际端口从 vite 输出（`Local:` 行）校准；`.dev-launcher.json`（gitignore）记忆勾选 + `exclude`/`extra` 兜底；退出时清理整棵进程树（服务以 detached 进程组拉起，pnpm 可能再分进程组，需 pgrep 递归清理），避免残留 dev server。包统一提供 `dev` 脚本（`scripts/watch-package.sh`：先完整构建再并行 vite/tsc watch）。

## 整改基线决策（2026-08 评审后）

- Node 基线：**22 LTS**；pnpm：**11**（`packageManager` 字段锁定，corepack 启用）。pnpm 11 起配置全部写入 `pnpm-workspace.yaml`（`.npmrc` 仅 registry/auth）；`allowBuilds` 放行 core-js / unrs-resolver。
- 依赖策略：全部 latest，但更新不激进——采用 pnpm 11 `minimumReleaseAge=1440`（新版本发布满 24h 才被采纳），确需抢新/锁文件已存在的新发布包走 `minimumReleaseAgeExclude` 白名单（当前豁免：csstools 补丁包）。TypeScript 已升 **6.0**（`~6.0.3` 锁定次版本：ts-jest peer `<7`、typescript-eslint peer `<6.1`，7.0 原生版待工具链跟进后再评估）。TS 6 适配点：`baseUrl` 已废弃并移除（paths 相对 tsconfig 解析）；`types` 默认 `[]` 需显式声明（shared 为 `["jest", "node"]`，app 为 `["vite/client", "node"]`）；`rootDir` 不再自动推断（tsconfig.build.json 显式 `./src`）。
- browserslist：兼容性基线 **Chrome 49**（桌面端 + 移动端统一，含 Android WebView），不用 `not dead`；由 @vitejs/plugin-legacy 自动生成 legacy 产物（ES5 + core-js polyfill + SystemJS）。
- 提交规范：**约定式提交 v1.0.0**（https://www.conventionalcommits.org/zh-hans/v1.0.0/），由 husky `commit-msg` 钩子 + commitlint 强制校验（两个分支均启用）；main 另有 `pre-commit`（lint-staged：prettier + eslint）自动格式化。CI：GitHub Actions（lint + test + build）。
- 构建工具：已从 Vue CLI 5/webpack 迁移到 **Vite 8**（apps）+ Vite lib 模式（packages），迁移前后功能经浏览器冒烟测试验证一致。
- 技能归档：`.claude/skills/`（唯一事实来源，入库）；原 `.catpaw/skills/` 本地镜像与 `pnpm sync:skills` 同步脚本已移除。
- **`compat/node-14` 分支**：面向构建机仍为 Node 14 的流水线场景；该分支保持 Node 14 基线 + 旧依赖（vue-cli/rollup），兼容性基线同为 Chrome 49。钩子策略与 main 不同：**无 pre-commit 格式化**（lint-staged 仅手动可跑），**有 commit-msg 钩子**（commitlint v17 强制约定式提交规范）。注意：该分支上的文档只描述其分支自身的真实状态。

## 已知未竟事项（详见 docs/agents/business-infrastructure.md）

- 业务基建只做到最小闭环（请求封装/env/proxy/全局错误处理）；登录权限、埋点、mock、UI 组件库选型未做。
- apps 无测试覆盖；types 校验由各 app 的 vue-tsc 承担。
