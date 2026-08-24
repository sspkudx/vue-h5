# Packages 目录

`packages/` 存放可被 `apps/` 下所有应用复用的依赖包（workspace 包）。当前只有一个包：

- [`shared/`](./shared/)（`@my-app/shared`）：纯工具库（类型守卫 + 数字工具），也是 `create-a-package` 技能的参照实现，测试质量是仓库标杆。

## 包的标准结构

以 `shared` 为例：

```
packages/{package-name}/
├── src/
│   ├── index.ts          # 包入口，导出全部公共 API
│   └── __tests__/        # Jest 测试（与 src 平级，见 jest.config.js 的 roots）
├── package.json          # exports 必须带 development 条件（见下）
├── vite.config.ts        # Vite lib 模式：ESM 产物 → dist/index.js
├── tsconfig.json         # 继承 ../../tsconfig.base.json，types 显式声明 ["jest", "node"]
├── tsconfig.build.json   # tsc 只发 .d.ts → dist/index.d.ts
└── jest.config.js        # ts-jest + node 环境（纯 TS 包）
```

## 核心机制：exports `development` 条件联调

`package.json` 的 `exports` 必须保留 `development` 条件（置于 `types`/`import` 之前，自含 `types`+`default` 指向 src）：

```json
"exports": {
    ".": {
        "development": {
            "types": "./src/index.ts",
            "default": "./src/index.ts"
        },
        "types": "./dist/index.d.ts",
        "import": "./dist/index.js"
    }
}
```

- **开发（dev + 类型层）**：Vite dev 默认解析 `development` 条件 → 源码直读、热更新；TS 类型层由 `tsconfig.base.json` 的 `customConditions: ["development"]` 命中同一条件 → 类型同步且 `typecheck` 不依赖先构建 dist。应用**无需**为 `@my-app/*` 配置 alias 或 tsconfig paths（见 `apps/example-app/tsconfig.json` 注释）。
- **生产**：构建解析 `types` → dist 声明、`import` → dist 产物，顺带校验 exports 配置正确性。
- 构建顺序由 `pnpm -r run build` 保证（拓扑排序，先 packages 后 apps）。

## 快速开始

```bash
# 构建所有包（vite lib 产物 + d.ts 声明）
pnpm build:packages

# 构建单个包
pnpm -F @my-app/shared build

# 运行测试
pnpm test              # 根 jest 配置，只覆盖 packages/**
pnpm -F @my-app/shared test
pnpm -F @my-app/shared test:coverage

# 包开发模式（watch 构建：先完整构建一次，再并行 vite/tsc watch）
cd packages/shared && pnpm dev
```

新包无需手工登记：根目录开发启动器（`pnpm dev`）每次请求实时扫描 `packages/*`，自动出现在 Web 控制台/CLI 列表中。

## 在应用中引用

```bash
# 添加依赖（workspace 协议）
pnpm -F my-app add @my-app/shared
```

```json
{
    "dependencies": {
        "@my-app/shared": "workspace:*"
    }
}
```

```ts
import { safeNum, formatNumber } from '@my-app/shared';
```

## 创建新包

1. **推荐**：使用 AI 技能 `create-a-package`（`/.claude/skills/create-a-package/SKILL.md`），支持工具库 / 组件库 / 工具函数集 / 插件库四种类型，自动生成符合本仓库规范的完整结构。
2. **手动**：参考 `shared` 包的 `package.json` / `vite.config.ts` / `tsconfig*.json` / `jest.config.js` 复制改造。

创建后验证：`pnpm build` 通过、`pnpm test` 通过、`pnpm lint` 通过。

## 测试

- 框架：Jest 30 + ts-jest，`testEnvironment: 'node'`，jest globals 由 `types: ["jest"]` 注入（无需显式 import）。
- 范围：根 `jest.config.js` 的 `roots` 仅覆盖 `packages/**`；**apps 暂无测试**（见 `docs/agents/business-infrastructure.md` 待补清单 P2）。
- 现状：`shared` 包 2 个测试文件覆盖全部导出函数（含边界用例），`TESTING.md` 声明 100% 覆盖率。
- 注意：仓库**未内置 Vue 组件测试能力**（无 @vue/test-utils 依赖、jest 未配置 .vue transform）；组件库包如需组件测试需自行补充。

## 文档规范

每个包必须有 `README.md`，包含：安装/引用方式、使用示例、API 说明（导出项）、开发说明、许可证。

## 依赖放置规范

- **Vue 生态依赖**（vue / pinia / vue-router）一律放 `peerDependencies`，用 `catalog:` 引用——运行时依赖由使用方应用提供，避免重复打包（见 CONTEXT.md 架构决策 2）。
- **业务工具依赖**（如 lodash-es、axios）按需放 `dependencies`。
- **构建/测试工具**（vite / typescript / jest / ts-jest）放 `devDependencies`；`vite`、`typescript` 用 `catalog:` 统一版本。
- 版本基线：Node 22 LTS（`engines.node >=22.0.0`），与根 `package.json` / `.node-version` 一致。

## 常见问题

**1. 应用报 `Cannot find module '@my-app/shared'`**

```bash
# 确认已添加依赖
pnpm -F my-app add @my-app/shared
# 生产构建前确认包已构建（dev 模式走 development 条件无需构建）
pnpm build:packages
```

**2. `TS2307: Cannot find module '@my-app/shared'`（类型层）**

- 确认 `package.json` 的 `exports.types` 指向存在的 `dist/index.d.ts`（或 development 条件的 `src/index.ts`）。
- 类型层走 `src`（Vite dev + tsconfig），若类型报错但运行时正常，多半是 `dist` 过期——重新 `pnpm build:packages`。

**3. 改包源码后应用无热更新**

- dev 模式确认走的是 `development` 条件（看 import 是否指向 `packages/*/src`）；不要用 vite alias 指到 dist。
- 若走的是 dist（如 `pnpm -F my-app dev` 前执行过构建），需要 `pnpm dev`（开发启动器）或包 watch 模式。
