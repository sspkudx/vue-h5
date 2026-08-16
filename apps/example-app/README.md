# example-app

vue-h5 模板仓库的示例应用，也是 `create-vue-app` 技能生成新应用的参照实现。

## 技术栈

- Vue 3 + TypeScript（TSX 与 SFC 混用）
- Vue CLI 5 / webpack 5
- Pinia + Vue Router（hash 模式）
- Less + CSS Modules（`*.module.less`）
- postcss-px-to-viewport（`mpx` → `vmin` 移动端适配）

## 常用命令

```bash
pnpm dev:example   # 启动开发服务器（localhost:2000）
pnpm build:example # 生产构建
pnpm lint:example  # 代码检查
```

## 目录结构

```
src/
├── main.ts        # 入口：插件注册 + 防御性挂载
├── plugins/       # Vue 插件（Pinia、Router）
├── router/        # 路由（全部懒加载）
└── views/         # 页面（HomeView / AboutView / PlaygroundPage）
```
