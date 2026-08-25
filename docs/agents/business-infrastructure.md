# 业务基础设施

本文档记录 vue-h5 模板中业务侧基础设施的**现状**与**待补清单**，是业务工程化的唯一事实来源。

## 现状（已落地，见 example-app）

### 1. 请求封装（`src/utils/request.ts`）

- axios 实例化，`baseURL` 取自 `VITE_APP_API_URL`（默认 `/api`），超时 10s
- 请求拦截器：预留 token 注入位（`TODO`）
- 响应拦截器：统一解包 `response.data`；统一错误出口 `handleError`（HTTP 状态 / 超时 / 网络异常）
- 业务侧使用方式：`src/api/user.ts` 中 `request.get('/user/:id')`

### 2. 环境变量（`.env.development` / `.env.production`）

| 变量                  | 用途                                                        |
| --------------------- | ----------------------------------------------------------- |
| `VITE_APP_API_URL`    | API 基础路径：开发默认 `/api`（走代理），生产为完整网关地址 |
| `VITE_APP_API_TARGET` | 仅开发：devServer 代理目标                                  |

Vite 约定：所有环境变量必须以 `VITE_` 前缀命名才会注入到客户端代码（`import.meta.env.VITE_APP_*`）。

### 3. 开发代理（`vite.config.ts` server.proxy）

- `/api` 前缀请求代理到 `VITE_APP_API_TARGET`（默认 `http://localhost:3000`），`changeOrigin: true`
- 代理目标在 `vite.config.ts` 中通过 `loadEnv` 读取

### 4. 全局错误处理（`main.ts`）

- `app.config.errorHandler`：统一兜底 Vue 组件渲染/生命周期内未捕获错误，当前仅 `console.error`

### 5. 应用级测试（Vitest + @vue/test-utils，2026-08 落地）

- 根 `vitest.config.mts` 已配 `vue()` + `vueJsx()` 插件，`include` 覆盖 `apps/**`；组件测试用文件级 `// @vitest-environment jsdom` 标注 DOM 环境
- 示例测试（example-app）：
    - `src/views/PlaygroundPage/PlaygroundPage.test.ts`：SFC 计数器渲染与交互
    - `src/views/HomeView/index.test.tsx`：TSX 组件 + vue-router mock + `@my-app/shared` 联调
    - `src/utils/request.test.ts`：axios 拦截器错误映射（注入自定义 adapter；`createRequest` 具名导出为测试而暴露）
- 覆盖率门槛仍仅限 `packages/**`（apps 组件测试为行为验证，不参与 100% 阈值）

### 5. 相关配置

- `browserslist`（根目录 `.browserslistrc`）：兼容性基线 **Chrome 49**（桌面端 + 移动端统一，含 Android WebView）
- 兼容性由 `@vitejs/plugin-legacy` 保证：自动读取 `.browserslistrc`，生成 legacy 产物（ES5 + core-js polyfill + SystemJS 加载）与 modern 产物（`type="module"`），无需手工配置

## 待补清单（按优先级）

| 优先级 | 事项             | 说明                                                                   |
| ------ | ---------------- | ---------------------------------------------------------------------- |
| P0     | 登录与权限       | 路由守卫、token 存取、401 处理与跳转；request 拦截器注入 Authorization |
| P0     | 业务错误提示     | 统一 toast 组件，替换 `handleError` 中裸 `throw`                       |
| P1     | Mock 方案        | 本地 mock server（如 vite-plugin-mock 或 json-server）接入代理         |
| P1     | 上报体系         | 错误上报（sentry/自建）+ 性能埋点 + 业务埋点                           |
| P1     | UI 组件库选型    | 商家端 H5 场景建议 vant；需配按需加载与主题定制                        |
| P2     | 请求层增强       | 竞态取消（AbortController）、幂等重试、接口级 loading 约定             |
| P2     | Pinia store 示例 | 目前仅创建空 pinia 实例，无业务 store 范式                             |
| P2     | 环境变量治理     | 按环境拆分配置（测试/灰度），密钥类变量禁止入客户端代码                |

## 新增应用的接入要求

用 `create-vue-app` 技能创建新应用后，按此清单补齐：

1. 复制 `.env.development` / `.env.production` 并修改 `VITE_*` 值
2. 复制 `src/utils/request.ts` 与 `src/api/` 示例
3. 在 `vite.config.ts` 配置 server.proxy
4. 在 `main.ts` 配置 `app.config.errorHandler`
5. 更新本文档的"现状"部分
