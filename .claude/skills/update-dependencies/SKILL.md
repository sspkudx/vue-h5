---
name: update-dependencies
description: 按 vue-h5 项目规范检查和更新依赖。覆盖 pnpm 11 供应链策略（minimumReleaseAge 24h 发布延迟、allowBuilds 构建脚本放行）、catalog 协议依赖（pnpm-workspace.yaml 统一版本）与普通依赖的更新，自动处理锁文件校验拦截并跑完整验证（lint/test/build）。使用当用户说"更新依赖"、"升级依赖"、"检查依赖版本"、"依赖过期"或提及 pnpm outdated / pnpm update 时。
---

# 依赖更新技能

## 概述

按项目规范执行依赖更新。本技能把 pnpm 11 的规则、catalog 版本管理方式与验证/提交流程封装为固定步骤，用户无需记忆命令。

**项目依赖结构（务必先确认再动手）**：

- 根 `package.json` 的 `devDependencies`：工具链（eslint/vite/ts/vitest 等），普通版本区间，直接改
- `apps/*` 的 `dependencies`：运行时依赖（vue/vue-router/pinia/axios/ress）走 **`catalog:` 协议**，版本统一在 `pnpm-workspace.yaml` 的 `catalogs.default` 定义；`@my-app/shared` 是 `workspace:*`
- `packages/*`：peerDependencies 中 catalog 内依赖同样用 `catalog:`

## 核心规则（pnpm 11 供应链策略）

1. **`minimumReleaseAge: 1440`**：依赖必须发布满 24h 才可安装。`pnpm install` 会对锁文件做策略校验，任何条目发布不满 24h 会报 `ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION`。项目策略是**不抢新**：跳过该版本并告知用户发布时间，而非直接升级。
2. 个别已进入锁文件或用户明确要求抢新的版本，才在 `pnpm-workspace.yaml` 的 `minimumReleaseAgeExclude` 按**版本**加入白名单（格式 `包名@版本`，如 `@csstools/css-syntax-patches-for-csstree@1.1.8`），需在注释里说明原因。
3. **`allowBuilds`**（map 格式 `包名: true`）：pnpm 11 默认不执行依赖构建脚本，新依赖若有 postinstall 会报 `ERR_PNPM_IGNORED_BUILDS`，评估必要性后追加放行（当前白名单：core-js、unrs-resolver）。
4. 每次 `pnpm install` 都会重新校验锁文件（华为云镜像下约 1 分钟，属正常）；统一加 `CI=true` 避免 TTY 交互中断。

## 更新流程

### 1. 前置检查

```bash
git status --short   # 确认工作区干净；有未提交改动先处理
```

### 2. 盘点可更新依赖

```bash
CI=true pnpm outdated --long
```

- 输出中 `Current` / `Latest` / `Wanted` 三列，`Wanted ≠ Latest` 表示有新版可升
- 从列表挑选用户想升级的依赖（或全部），确认每个新版本的发布时间是否已满 24h：

```bash
pnpm view <包名> time --json | jq -r '."<目标版本>"'
```

- 发布不满 24h 的：**跳过**，向用户说明"该版本刚发布，按项目策略等满 24h 再升"

### 3. 执行更新

**catalog 内依赖（vue/vue-router/pinia/axios/ress）**——改一处即可全局生效：

1. 编辑 `pnpm-workspace.yaml` 的 `catalogs.default`，更新对应版本区间
2. 执行 `CI=true pnpm install` 重新生成锁文件（不改任何 package.json）

**根 devDependencies（工具链）**：

```bash
# 单个依赖
pnpm -w update --latest <包名>
# 批量更新
pnpm -w update --latest
```

> 不要对 `apps/*` 里的 catalog: 依赖执行 `pnpm up --latest`——版本由 catalog 管，直接改 `pnpm-workspace.yaml`。

### 4. 处理拦截

- `ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION`：见"核心规则"第 1、2 条——默认跳过等 24h；仅当用户明确同意抢新时加 `minimumReleaseAgeExclude`
- `ERR_PNPM_IGNORED_BUILDS`：确认该依赖的 postinstall 是否必要（如 core-js 的 polyfill 版本信息），必要则在 `allowBuilds` 追加 `包名: true`
- 其他安装错误：修复后重试 `CI=true pnpm install`

### 5. 完整验证（CI 同款）

```bash
pnpm lint && pnpm test && pnpm build
```

全部通过才算完成；失败需排查修复（版本回退或升级相关依赖）。

### 6. 提交

按 [git-commit-push](../git-commit-push/SKILL.md) 技能规范提交，commitlint 强制约定式提交：

```bash
chore: 更新依赖
```

提交信息列出主要依赖变化，例如：

```bash
git commit -m "chore: 更新依赖" -m "- 升级 vue 3.5.41 → 3.5.42（catalog 统一）" -m "- 升级 vite 8.2.1 → 8.2.2"
```

## 常见场景速查

| 用户诉求 | 做法 |
| --- | --- |
| "更新下 vue" | 改 `pnpm-workspace.yaml` catalog 中 vue 版本 → `CI=true pnpm install` → 验证 → 提交 |
| "看看有没有依赖过期" | `CI=true pnpm outdated --long`，汇报结果，不擅自升级 |
| "全部升级到最新" | 逐依赖核对发布时间（不满 24h 跳过）→ catalog 改 `pnpm-workspace.yaml`、工具链用 `pnpm -w update --latest` → 验证 → 提交 |
| 安装报 minimumReleaseAge 错误 | 说明该包发布不满 24h；用户同意抢新才加 `minimumReleaseAgeExclude` |
