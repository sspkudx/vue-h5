# vue-h5

## 分支与 Node 版本

- main 分支：适配低版本 Node（14 / 16 / 18）
- node-high-version 分支：适配高版本 Node（>= 20）

请根据你当前的 Node 版本选择对应分支使用本模板。

## 快速开始

### 1) 选择分支并创建项目

使用 degit（推荐）从对应分支拉取模板：

```sh
# 使用 pnpm（推荐）
pnpm dlx degit sspkudx/vue-h5#main               your-app-low    # Node 14/16/18
pnpm dlx degit sspkudx/vue-h5#node-high-version  your-app-high   # Node >= 20

# 或使用 npx / yarn
npx  degit sspkudx/vue-h5#main               your-app-low
npx  degit sspkudx/vue-h5#node-high-version  your-app-high

yarn dlx degit sspkudx/vue-h5#main               your-app-low
yarn dlx degit sspkudx/vue-h5#node-high-version  your-app-high
```

### 2) 切换 Node 版本（可选但推荐）

建议使用 fnm 或 nvm 管理 Node 版本：

```sh
# fnm（推荐）
fnm use 14   # 对应 main 分支
fnm use 20   # 对应 node-high-version 分支

# nvm
nvm use 18
nvm use 20
```

### 3) 安装依赖与运行

```sh
pnpm i
pnpm dev    # 启动开发服务器（端口见控制台输出）
pnpm build  # 生产构建
pnpm lint   # 代码检查与自动修复
```

## 分支差异说明（重要）

- Node 与模块系统
  - main：面向 Node 14/16/18 的默认设置
  - node-high-version：`package.json` 中启用 `"type": "module"`（ESM），与 Node >= 20 更兼容

- 配置文件格式（node-high-version）
  - 采用 CJS 扩展名以适配 ESM 环境：`vue.config.cjs`、`babel.config.cjs`、`.postcssrc.cjs`
  - 避免 `require is not defined in ES module scope` 等报错

- Lint 配置
  - node-high-version：使用 ESLint 9 flat config（`eslint.config.js`），支持 `.vue` / `.ts`

- 依赖版本
  - node-high-version：依赖更为新（如 `axios`、`pinia`、`typescript`、`less-loader`、`postcss-calc` 等），对 Node >= 20 友好

## 常见问题

- 报错 `require is not defined in ES module scope`
  - 确认使用的是 `node-high-version` 分支，并在根 `package.json` 中包含 `"type": "module"`
  - 确认相关配置文件使用 `.cjs` 后缀（`vue.config.cjs`、`babel.config.cjs`、`.postcssrc.cjs`）

- 本地 Node 版本与分支不匹配
  - 使用 `fnm use <version>` 或 `nvm use <version>` 切换到对应版本

- 常用命令
  - `pnpm i && pnpm dev && pnpm build && pnpm lint`

## 许可证

本项目模板遵循仓库内的 `LICENSE`，欢迎在不同分支下按运行时需求进行二次开发。
