# CONTEXT.md - compat/node-14 分支

> 本分支面向 **Node 14 构建机**（部分流水线编译机无法升级）的兼容场景。
> 除文档修正与技能归档外，本分支保持评审前原状，**与 main 分支的差异即本文件所述**。

## 分支基线（相对 main 的差异）

- Node：**14.18+**（`.node-version = 14`，pnpm 7，lockfile v5.4）——构建机限制，非终端设备兼容性手段
- 依赖：保持升级前版本（ESLint 8 旧式 eslintrc、stylelint 15、prettier 2、rollup 3、jest 29、pinia 3、ress 5）
- 无 husky / lint-staged / commitlint / CI：提交前手动 `pnpm lint && pnpm lint:style && pnpm test`
- browserslist：维持原样（`not dead` 排除老设备——已知取舍，如有低端设备需求请在 main 分支跟进）
- 无业务基建（axios 封装 / env / proxy / 全局错误处理）：见 main 分支 `docs/agents/business-infrastructure.md`

## 与 main 一致的改动

- 技能归档：`.claude/skills/`（唯一事实来源，已入库）；`.catpaw/skills/` 本地镜像（`pnpm sync:skills`）
- 文档修正：README 构建工具实话（webpack）、workflow 幽灵命令、登记全部 7 个技能、example-app README、TESTING.md 失实引用

## 维护提示

- 本分支的技能/文档与 main 独立演进，互不自动合并
- 如 main 出现需要回溯到 Node 14 环境的修复，cherry-pick 时注意依赖版本差异
