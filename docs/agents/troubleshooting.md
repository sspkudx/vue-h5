# 故障排除指南

本文档提供了 vue-h5 项目开发过程中常见问题的解决方案和调试技巧。

## 常见问题

### 1. 依赖安装失败

#### 症状

- `pnpm install` 命令失败
- 依赖包下载超时
- 版本冲突错误

#### 解决方案

```bash
# 1. 清理并重新安装
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
rm -rf pnpm-lock.yaml
pnpm i

# 2. 使用淘宝镜像（中国用户）
pnpm config set registry https://registry.npmmirror.com/
pnpm i

# 3. 清理缓存
pnpm store prune
rm -rf ~/.pnpm-store

# 4. 检查网络连接
ping registry.npmjs.org

# 5. 使用离线模式（如果有缓存）
pnpm i --offline
```

#### 预防措施

- 定期更新依赖版本
- 使用锁定文件（pnpm-lock.yaml）
- 配置镜像源加速下载

### 2. 包引用问题

#### 症状

- `Cannot find module '@my-app/shared'`
- 类型引用错误
- 构建时找不到包

#### 解决方案

```bash
# 1. 确保所有包都已构建
pnpm build:packages

# 2. 重新链接依赖
pnpm i --force

# 3. 检查包的 exports 是否带 development 条件
# dev 环境 Vite 默认解析 "development" 条件 -> 包源码（热更新），无需 alias；
# 生产构建解析 "import" 条件 -> dist：
# packages/<pkg>/package.json:
#   "exports": {
#     ".": {
#       "types": "./dist/index.d.ts",
#       "development": "./src/index.ts",
#       "import": "./dist/index.js"
#     }
#   }

# 4. 检查 tsconfig.json 中的路径映射
# "paths": {
#   "@my-app/shared": ["../../packages/shared/src/index.ts"]
# }

# 5. 验证包是否存在
ls -la packages/shared/dist/
```

#### 预防措施

- 在修改包代码后重新构建
- 使用 workspace:* 引用本地包
- 保持包版本一致

### 3. 类型错误

#### 症状

- TypeScript 编译错误
- 类型不匹配
- 找不到类型定义

#### 解决方案

```bash
# 1. 检查 TypeScript 配置（构建内置 vue-tsc，也可单独运行）
pnpm -F {app-name} typecheck

# 2. 清理 TypeScript 缓存
rm -rf node_modules/.cache
rm -rf apps/{app-name}/node_modules/.cache

# 3. 检查类型定义文件
# 确保包生成了 .d.ts 文件
ls -la packages/{package-name}/dist/*.d.ts

# 4. 更新 TypeScript 版本
pnpm add -D typescript@latest

# 5. 重新生成类型定义
cd packages/{package-name}
pnpm build
```

#### 预防措施

- 启用严格类型检查
- 为所有公共 API 提供类型定义
- 定期更新 TypeScript 版本

### 4. 开发服务器启动失败

#### 症状

- 端口被占用
- 内存不足
- 依赖缺失

#### 解决方案

##### 端口被占用

```bash
# 1. 查找占用端口的进程
lsof -i :3000

# 2. 杀死占用进程
kill -9 <PID>

# 3. 或者修改端口号
# 在 vite.config.ts 中修改：
# server: {
#   port: 3001
# }
```

##### 内存不足

```bash
# 增加 Node.js 内存限制
NODE_OPTIONS=--max-old-space-size=4096 pnpm dev:{app-name}

# 或者永久设置环境变量
export NODE_OPTIONS=--max-old-space-size=4096
```

##### 依赖缺失

```bash
# 1. 检查依赖是否安装
ls -la node_modules/vue

# 2. 重新安装依赖
rm -rf node_modules
pnpm i

# 3. 检查 package.json 配置
cat apps/{app-name}/package.json | grep dependencies
```

### 5. 构建失败

#### 症状

- Vite 构建错误
- 内存溢出
- 语法错误

#### 解决方案

```bash
# 1. 查看详细错误信息
pnpm build:{app-name} --verbose

# 2. 清理构建缓存
rm -rf apps/{app-name}/dist
rm -rf packages/{package-name}/dist

# 3. 增加构建内存限制
NODE_OPTIONS=--max-old-space-size=8192 pnpm build:{app-name}

# 4. 检查 Vite 构建日志（debug 模式输出完整配置与依赖图）
pnpm -F {app-name} exec vite build --debug

# 5. 分析构建产物大小
pnpm -F {app-name} exec vite build --sourcemap && npx source-map-explorer dist/assets/*.js
```

#### 常见构建错误

##### 内存溢出

```bash
# 解决方案：增加内存限制
NODE_OPTIONS=--max-old-space-size=8192 pnpm build:{app-name}

# 或者在 package.json 中配置
"scripts": {
  "build": "NODE_OPTIONS=--max-old-space-size=8192 vite build"
}
```

##### 语法错误

```bash
# 1. 检查 TypeScript 错误
pnpm -F {app-name} tsc --noEmit

# 2. 检查 ESLint
pnpm lint:{app-name}

# 3. 检查代码格式
pnpm format:check
```

##### 依赖冲突

```bash
# 检查依赖版本
pnpm list | grep -E "(duplicate|multiple)"

# 更新冲突的依赖
pnpm update package-name

# 或者指定版本
pnpm add package-name@version
```

### 6. 热重载失效

#### 症状

- 文件修改后页面不更新
- 控制台没有重新编译信息
- 需要手动刷新页面

#### 解决方案

```bash
# 1. 检查文件变化监听
# Vite HMR 默认开启，检查 vite.config.ts：
# server: {
#   watch: {
#     ignored: [...]   # 确认没有误忽略 src 目录
#   }
# }

# 2. 检查文件系统事件限制（Mac/Linux）
# 增加文件系统监听限制
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# 3. 重启开发服务器
# 先停止，再启动
pnpm dev:{app-name}

# 4. 清理缓存
rm -rf node_modules/.vite
rm -rf apps/{app-name}/node_modules/.vite

# 5. 检查防火墙设置
# 确保端口没有被防火墙阻止
```

### 7. 样式加载问题

#### 症状

- 样式不生效
- CSS Modules 类名错误
- Less 编译错误

#### 解决方案

```bash
# 1. 检查 Less 配置
# 在 vite.config.ts 中检查：
# css: {
#   preprocessorOptions: {
#     less: {
#       additionalData: '@import "@/assets/styles/variables.less";'
#     }
#   }
# }

# 2. 检查 CSS Modules 配置
# css: {
#   modules: {
#     generateScopedName: '[local]__[hash:base64]',
#     localsConvention: 'camelCase'
#   }
# }

# 3. 检查样式文件导入
# 确保样式文件路径正确
import styles from './style.module.less';

# 4. 检查样式处理链路
pnpm -F {app-name} exec vite build --debug 2>&1 | grep -i less

# 5. 清理缓存并重新构建
rm -rf node_modules/.vite
pnpm build:{app-name}
```

### 8. 路由问题

#### 症状

- 路由跳转失败
- 404 页面
- 路由守卫不生效

#### 解决方案

```bash
# 1. 检查路由配置
# 在 src/router/index.ts 中检查路由定义

# 2. 检查路由模式
# 示例应用使用 hash 模式（createWebHashHistory），刷新/直链无需服务端回退配置；
# 若改用 history 模式（createWebHistory），生产部署需在网关/Nginx 配置 fallback 到 index.html
# （Vite dev server 默认已支持 history 回退；没有 historyApiFallback 这个 Vite 选项）

# 3. 检查路由守卫
# 确保路由守卫逻辑正确
router.beforeEach((to, from, next) => {
  // 守卫逻辑
});

# 4. 检查动态导入
# 确保路由组件正确导入（example-app 为路由级懒加载）
const HomeView = () => import('./views/HomeView/index');

# 5. 检查路由名称冲突
# 确保路由名称唯一
```

## 调试技巧

### 1. 检查依赖树

```bash
# 查看项目依赖树
pnpm list

# 查看特定包的依赖
pnpm list {package-name}

# 查看依赖层级
pnpm list --depth=3

# 查看全局安装的包
pnpm list --global
```

### 2. 检查版本冲突

```bash
# 检查重复的包
pnpm list | grep -E "(duplicate|multiple)"

# 查看包版本
pnpm list --json | jq '.[] | select(.name == "vue")'

# 更新冲突的包
pnpm update package-name
```

### 3. 使用调试模式

```bash
# 启动开发服务器时开启调试
NODE_OPTIONS=--inspect pnpm dev:{app-name}

# 或者指定端口
NODE_OPTIONS=--inspect=9229 pnpm dev:{app-name}

# 构建时显示详细日志
pnpm build:{app-name} --verbose

# 启用源映射调试
# 在 vite.config.ts 中：
# build: {
#   sourcemap: true
# }
```

### 4. 检查 Vite 构建配置

```bash
# 以 debug 模式运行构建，输出最终配置、插件与依赖图
pnpm -F {app-name} exec vite build --debug

# 查看 Vite 帮助
pnpm -F {app-name} exec vite --help
```

### 5. 性能分析

```bash
# 生成构建性能报告
pnpm build:{app-name} --profile

# 分析包大小
pnpm build:{app-name} --report

# 使用 Chrome DevTools 分析
# 1. 打开 Chrome DevTools
# 2. 进入 Performance 标签页
# 3. 点击 Record 开始录制
# 4. 操作页面
# 5. 停止录制并分析

# 使用 Lighthouse 分析
# 在 Chrome DevTools 的 Lighthouse 标签页中运行
```

### 6. 内存泄漏检测

```bash
# 使用 Node.js 内存分析
NODE_OPTIONS=--inspect --max-old-space-size=4096 pnpm dev:{app-name}

# 在 Chrome 中打开 chrome://inspect
# 连接到 Node.js 实例
# 使用 Memory 标签页分析内存使用

# 使用 heapdump 模块
npm install heapdump
# 在代码中添加：
const heapdump = require('heapdump');
heapdump.writeSnapshot('/tmp/' + Date.now() + '.heapsnapshot');
```

### 7. 网络请求调试

```bash
# 启用网络请求日志
# 在 vite.config.ts 中：
# server: {
#   proxy: {
#     '/api': {
#       target: 'http://localhost:3000',
#       changeOrigin: true
#     }
#   }
# }

# 使用浏览器 Network 面板
# 1. 打开 Chrome DevTools
# 2. 进入 Network 标签页
# 3. 勾选 Preserve log
# 4. 过滤 XHR/Fetch 请求
```

## 性能优化

### 1. 构建优化

#### 代码分割

```javascript
// 使用动态导入分割代码块
const HomeView = () => import('./views/HomeView.vue');
const AboutView = () => import('./views/AboutView.vue');

// 按需加载组件
const HeavyComponent = defineAsyncComponent(() => import('./components/HeavyComponent.vue'));
```

#### Tree Shaking

```json
// package.json
{
    "sideEffects": false,
    "module": "dist/index.esm.js",
    "exports": {
        ".": {
            "import": "./dist/index.esm.js",
            "require": "./dist/index.cjs.js"
        }
    }
}
```

#### 缓存策略

```typescript
// vite.config.ts
// Vite 构建缓存默认开启（node_modules/.vite）；依赖预构建缓存可在需要时清除
```

### 2. 开发体验优化

#### 热重载配置

```typescript
// vite.config.ts
// HMR 默认开启，无需配置；可设置 server.hmr.overlay 控制错误覆盖层
server: {
    hmr: {
        overlay: true;
    }
}
```

#### 错误覆盖

```typescript
// vite.config.ts
server: {
  hmr: {
    overlay: {
      errors: true,
      warnings: true
    }
  }
}
```

#### 类型检查

```bash
# 构建已内置类型检查（vue-tsc --noEmit），独立运行：
pnpm -F {app-name} typecheck

# 内存限制
NODE_OPTIONS=--max-old-space-size=4096 pnpm -F {app-name} typecheck
```

### 3. 包体积优化

#### 按需加载

```typescript
// 使用 lodash-es 替代 lodash
import { debounce } from 'lodash-es';

// 使用 dayjs 替代 moment.js
import dayjs from 'dayjs';

// 使用原生 API 替代第三方库
// 使用 fetch 替代 axios（简单场景）
```

#### 压缩优化

```typescript
// vite.config.ts
// 默认使用压缩器（esbuild/oxc），无需配置
build: {
  minify: true,
  terserOptions: {
    compress: {
      drop_console: true
    }
  }
}
```

#### 图片优化

```typescript
// Vite 默认将小图内联为 base64（assetsInlineLimit，默认 4KB），大图输出到 dist/assets
// 如需压缩，可引入 vite-plugin-imagemin 等插件
```

## 环境配置

### 开发环境

```bash
# .env.development
VITE_APP_API_URL=http://localhost:3000/api
VITE_APP_DEBUG=true
VITE_APP_VERSION=development
```

### 测试环境

```bash
# .env.test
VITE_APP_API_URL=https://test-api.example.com/api
VITE_APP_DEBUG=false
VITE_APP_VERSION=test
```

### 生产环境

```bash
# .env.production
VITE_APP_API_URL=https://api.example.com/api
VITE_APP_DEBUG=false
VITE_APP_VERSION=1.0.0
```

### 环境变量使用

```typescript
// 在代码中使用环境变量
const apiUrl = import.meta.env.VITE_APP_API_URL;
const isDebug = import.meta.env.VITE_APP_DEBUG === 'true';
const version = import.meta.env.VITE_APP_VERSION;
```

## 监控和日志

### 错误监控

```typescript
// 全局错误处理
app.config.errorHandler = (err, instance, info) => {
    console.error('Vue error:', err, info);
    // 发送到错误监控服务
    sendErrorToMonitoring(err);
};

// 未处理的 Promise 错误
window.addEventListener('unhandledrejection', event => {
    console.error('Unhandled promise rejection:', event.reason);
    // 发送到错误监控服务
    sendErrorToMonitoring(event.reason);
});
```

### 性能监控

```typescript
// 使用 Performance API
const measurePerformance = () => {
    const navigationTiming = performance.getEntriesByType('navigation')[0];
    console.log('页面加载时间:', navigationTiming.loadEventEnd - navigationTiming.startTime);

    const resources = performance.getEntriesByType('resource');
    resources.forEach(resource => {
        console.log(`${resource.name}: ${resource.duration}ms`);
    });
};

// 在页面加载完成后测量
window.addEventListener('load', measurePerformance);
```

### 日志配置

```typescript
// 开发环境详细日志，生产环境简化日志
const logger = {
    info: (...args: any[]) => {
        if (import.meta.env.VITE_APP_DEBUG === 'true') {
            console.log('[INFO]', ...args);
        }
    },
    error: (...args: any[]) => {
        console.error('[ERROR]', ...args);
    },
    warn: (...args: any[]) => {
        console.warn('[WARN]', ...args);
    },
};

export default logger;
```

## 紧急恢复

### 构建失败恢复

```bash
# 1. 回退到上一个可构建的版本
git checkout <last-working-commit>
pnpm i
pnpm build

# 2. 清理所有缓存
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
rm -rf node_modules/.cache
rm -rf **/dist

# 3. 重新安装和构建
pnpm i
pnpm build:packages
pnpm build
```

### 依赖冲突解决

```bash
# 1. 检查冲突的依赖
pnpm list | grep -E "(duplicate|multiple|conflict)"

# 2. 更新依赖版本
pnpm update --latest

# 3. 强制重新安装
pnpm i --force

# 4. 统一管理版本：修改 pnpm-workspace.yaml 的 catalogs.default 后执行 pnpm install
# 5. 临时覆盖单个依赖版本（pnpm 用 overrides，非 yarn 的 resolutions）：
"pnpm": {
  "overrides": {
    "vue": "3.5.41",
    "vue-router": "5.2.0"
  }
}
```

### 数据库/状态恢复

```bash
# 1. 清理本地存储
localStorage.clear()
sessionStorage.clear()

# 2. 清理 IndexedDB
indexedDB.databases().then((dbs) => {
  dbs.forEach((db) => {
    indexedDB.deleteDatabase(db.name);
  });
});

# 3. 重置应用状态
# 在应用启动时重置状态
if (import.meta.env.VITE_APP_RESET_STATE === 'true') {
  store.reset();
}
```

## 寻求帮助

### 1. 检查文档

- 查看 [项目概览](./overview.md)
- 查看 [技能使用规范](./usage-guidelines.md)
- 查看 [代码规范与最佳实践](./coding-standards.md)

### 2. 搜索问题

```bash
# 搜索项目中的错误信息
grep -r "错误信息" src/

# 搜索日志文件
find . -name "*.log" -type f | xargs grep -l "错误信息"
```

### 3. 创建 Issue

如果问题无法解决，请创建 Issue：

1. **描述问题**：详细描述问题和复现步骤
2. **提供环境信息**：
    ```bash
    node -v
    pnpm -v
    uname -a
    ```
3. **提供错误信息**：完整的错误堆栈
4. **提供相关代码**：相关的代码片段和配置

### 4. 社区支持

- 查看项目 GitHub Issues
- 搜索类似问题的解决方案
- 在技术社区提问

## 预防措施

### 1. 定期维护

```bash
# 每周执行
pnpm update
pnpm audit
pnpm lint
pnpm test

# 每月执行
pnpm outdated
rm -rf node_modules/.cache
```

### 2. 备份重要数据

```bash
# 备份配置文件
cp vite.config.ts vite.config.ts.backup
cp package.json package.json.backup

# 备份重要代码
git add .
git commit -m "备份: 当前工作状态"
```

### 3. 版本控制

```bash
# 使用语义化版本
npm version patch  # 修复 bug
npm version minor  # 添加功能
npm version major  # 不兼容的变更

# 创建发布分支
git checkout -b release/v1.0.0
git push origin release/v1.0.0
```

### 4. 监控和告警

```bash
# 设置构建监控
# 在 CI/CD 中配置构建失败通知

# 设置性能监控
# 使用 Google Analytics 或自建监控
```

## 下一步

- 查看 [项目开发工作流](./workflow.md)
- 学习 [代码规范与最佳实践](./coding-standards.md)
- 了解 [技能开发指南](./skill-development-guide.md)
- 参考 [可用技能列表](./available-skills.md)
