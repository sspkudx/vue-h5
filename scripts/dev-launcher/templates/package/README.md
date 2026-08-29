# @my-app/{{package-name}}

> {{description}}

## 安装

```bash
pnpm add @my-app/{{package-name}}
```

## 快速开始

```typescript
import { safeNum } from '@my-app/{{package-name}}';

safeNum('123'); // 123
safeNum('abc'); // 0
```

## 常用命令

```bash
pnpm -F @my-app/{{package-name}} build # 构建 dist
pnpm -F @my-app/{{package-name}} dev   # watch 构建（也可在开发启动器中勾选）
pnpm -F @my-app/{{package-name}} test  # 运行测试
```

## 类型/构建约定

- 源码位于 `src/index.ts`（按需补充 `src/**` 子模块），命名导出为主
- `exports` 带 `development` 条件（指向 src，自含 types+default）——Vite dev 与 TS 类型层（根 `tsconfig.base.json` 的 `customConditions: ["development"]`）命中源码，无需先构建
- 生产构建走 `types`/`import` → `dist`（`vite build` + `tsc -p tsconfig.build.json`）
- Vue 生态依赖（vue/pinia/vue-router）放 `peerDependencies`，由使用方应用提供

## 许可证

MIT
