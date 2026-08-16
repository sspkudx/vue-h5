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
| 框架 | Vue 3.5 + TypeScript 5.9，TSX（@vue/babel-plugin-jsx）与 SFC 混用 |
| 构建 | **Vue CLI 5 / webpack 5**（不是 Vite；曾计划在 README 中声称 Vite，已纠正为实话） |
| 状态 | Pinia 3 |
| 样式 | Less + CSS Modules（`*.module.less`，kebab→camel 双导出），`ress` reset |
| 移动端适配 | postcss-px-to-viewport，自定义单位 `mpx` → `vmin`（viewportWidth 390；横竖屏切换尺寸会变，双刃剑，已知晓） |
| 包管理 | pnpm workspace（`apps/*` + `packages/*`），.npmrc 指华为云镜像 + `shamefully-hoist=true` |
| 测试 | Jest 29 + ts-jest，根配置只覆盖 `packages/**` |
| 规范 | ESLint（旧式 eslintrc）+ Prettier + stylelint（BEM 类名约束 + 属性排序） |
| 构建编排 | `scripts/build.sh` / `build-packages.sh`（先 packages 后 apps，支持并行） |

## 结构

- `apps/example-app`：唯一应用，也是 create-vue-app 技能的参照实现。
- `packages/shared`（`@my-app/shared`）：纯工具库（类型守卫 + 数字工具），Rollup 出 ESM + 聚合 d.ts，测试质量是仓库标杆。
- `.claude/skills/`：7 个 AI 技能；`.catpaw/skills/` 是其镜像（靠 `scripts/sync-skills.sh` 同步）。
- `docs/agents/`：模块化文档（AGENTS.md 是索引）。
- `types/`：css/img/vue 的 d.ts shim，由各子项目 tsconfig 引用（根目录无 tsconfig.json）。

## 关键架构决策

1. **monorepo 联调双 alias**：dev 环境把 `@my-app/*` alias 到源码（热更新），prod 指向 dist。这是仓库核心工程价值，改动 vue.config.js 时必须保留。
2. **运行时依赖归各 app 自管**，根 package.json 只放工具链（原先把 vue/pinia 等装在根上 + hoist 兜底，已纠正）。
3. **依赖解析**：jest moduleNameMapper 与 `@my-app/*` 别名对齐，新增包要同步两处。

## 整改基线决策（2026-08 评审后）

- Node 基线：**22 LTS**；pnpm：**10**（`packageManager` 字段锁定，corepack 启用）。
- 依赖策略：除 TypeScript（留 5.x，7.0 原生版工具链不兼容）、Babel（留 7.x，8 与 Vue CLI 5 不兼容）外，其余依赖已升到 latest（ESLint 10 flat config、stylelint 17 flat config、prettier 3、rollup 4、jest 30、pinia 4、ress 6）。
- browserslist：显式设备下限（Chrome>=61 / Android>=6 / iOS>=11，不含 IE11），不用 `not dead`。
- 提交规范：husky + lint-staged + commitlint；CI：GitHub Actions（lint + test + build）。
- 构建工具短期不迁 Vite，文档如实描述 webpack；Vite 迁移如要做，另立项。
- 技能归档：`.claude/skills/`（唯一事实来源，入库）；`.catpaw/skills/` 本地镜像（`pnpm sync:skills` 同步）。
- **`compat/node-14` 分支**：面向构建机仍为 Node 14 的流水线场景；该分支除文档修正与技能归档外，保持评审前原状（Node 14 基线、旧依赖、无 husky/CI）。注意：该分支上的文档只描述其分支自身的真实状态。

## 已知未竟事项（详见 docs/agents/business-infrastructure.md）

- 业务基建只做到最小闭环（请求封装/env/proxy/全局错误处理）；登录权限、埋点、mock、UI 组件库选型未做。
- apps 无测试覆盖；ESLint 8 旧栈待升 flat config；stylelint 15 待升。
