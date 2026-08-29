# {{app-name}}

由 vue-h5 开发启动器自动创建的新应用。

## 技术栈

- Vue 3 + TypeScript（Vue 单文件组件）
- Vite 8（构建 + 开发服务器）
- Pinia + Vue Router（hash 模式）
- Less + postcss-px-to-viewport（`mpx` → `vmin` 移动端适配）

## 常用命令

```bash
pnpm dev:{{app-name}}   # 启动开发服务器（默认 http://localhost:{{port}}）
pnpm dev                # 或在开发启动器（Web 控制台）中勾选启动
pnpm build:{{app-name}} # 生产构建
pnpm lint:{{app-name}}  # 代码检查
```

## 目录结构

```
src/
├── main.ts        # 入口：插件注册 + 全局错误处理
├── plugins/       # Vue 插件（Pinia、Router）
├── router/        # 路由（懒加载）
└── views/         # 页面（HomeView）
```
