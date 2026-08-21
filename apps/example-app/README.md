# example-app

vue-h5 模板仓库的示例应用，也是 `create-vue-app` 技能生成新应用的参照实现。

## 技术栈

- Vue 3 + TypeScript（TSX 与 SFC 混用）
- Vite 8（构建 + 开发服务器）
- Pinia + Vue Router（hash 模式）
- Less + CSS Modules（`*.module.less`）
- postcss-px-to-viewport（`mpx` → `vmin` 移动端适配）
- axios 请求封装

## 常用命令

```bash
pnpm dev:example   # 启动开发服务器（localhost:2000）
pnpm build:example # 生产构建
pnpm lint:example  # 代码检查
```

## 目录结构

```
src/
├── main.ts        # 入口：插件注册 + 全局错误处理
├── plugins/       # Vue 插件（Pinia、Router）
├── router/        # 路由（全部懒加载）
├── api/           # 接口层（示例：user.ts）
├── utils/         # 工具（示例：request.ts 请求封装）
└── views/         # 页面（HomeView / AboutView / PlaygroundPage）
```

## 环境变量

| 文件               | 变量                 | 说明                                                    |
| ------------------ | -------------------- | ------------------------------------------------------- |
| `.env.development` | `VUE_APP_API_URL`    | 开发环境 API 基础路径（默认 `/api`，走 devServer 代理） |
| `.env.development` | `VUE_APP_API_TARGET` | devServer 代理目标（本地 mock 或联调后端）              |
| `.env.production`  | `VUE_APP_API_URL`    | 生产环境 API 基础路径                                   |

详见根目录 `docs/agents/business-infrastructure.md`。
