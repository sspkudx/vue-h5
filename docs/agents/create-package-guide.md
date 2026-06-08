# 创建依赖包技能指南

`create-a-package` 技能用于在 `packages` 目录下创建新的依赖包，支持四种类型的包创建：工具库、组件库、工具函数集和插件库。

## 支持的包类型

### 1. 工具库 (Utility Library)
- **用途**: 通用的工具函数集合
- **示例**: `formatDate`, `safeNum`, `debounce`, `cloneDeep`
- **依赖**: 纯 TypeScript/JavaScript，无框架依赖
- **典型场景**: 日期处理、数字格式化、深拷贝、防抖节流等通用工具

### 2. 组件库 (Component Library)
- **用途**: 可复用的 Vue 组件集合
- **示例**: `Button`, `Modal`, `Form`, `Table`
- **依赖**: Vue 3.x + @vue/babel-plugin-jsx
- **典型场景**: UI 组件库、业务组件库

### 3. 工具函数集 (Helper Functions)
- **用途**: 业务相关的工具函数集合
- **示例**: `auth`, `http`, `validation`, `storage`
- **依赖**: 根据具体功能而定，可能包含业务相关依赖
- **典型场景**: 认证相关工具、HTTP 请求封装、表单验证、本地存储

### 4. 插件库 (Plugin Library)
- **用途**: Vue 插件或通用插件
- **示例**: 路由守卫、状态管理插件、日志插件
- **依赖**: Vue 及相关框架依赖
- **典型场景**: Vue 插件、全局功能扩展

## 创建的目录结构

```
packages/{package-name}/
├── src/
│   ├── index.ts          # 包入口文件
│   └── (其他源码文件)    # 可选的源代码文件
├── __tests__/           # 测试目录
│   └── index.test.ts    # 测试文件
├── README.md            # 包的说明文档
├── package.json         # 包配置文件
├── jest.config.js       # Jest 测试配置
├── tsconfig.json        # TypeScript 配置文件
├── tsconfig.build.json  # TypeScript 构建配置
└── rollup.config.ts     # Rollup 构建配置
```

## 核心配置文件

### package.json (工具库示例)

```json
{
    "name": "@my-app/{package-name}",
    "version": "1.0.0",
    "description": "{package-description}",
    "main": "dist/index.js",
    "types": "dist/index.d.ts",
    "exports": {
        ".": {
            "import": "./dist/index.js",
            "require": "./dist/index.js"
        }
    },
    "scripts": {
        "clean": "rimraf dist",
        "prebuild": "pnpm run clean",
        "build": "rollup -c rollup.config.ts --configPlugin typescript",
        "dev": "rollup -c rollup.config.ts --configPlugin typescript --watch",
        "test": "jest",
        "test:watch": "jest --watch",
        "test:coverage": "jest --coverage"
    },
    "keywords": [],
    "author": "",
    "license": "MIT",
    "peerDependencies": {},
    "devDependencies": {
        "@types/jest": "^29.5.0",
        "jest": "^29.7.0",
        "rimraf": "^5.0.5",
        "rollup": "^4.12.0",
        "ts-jest": "^29.1.0",
        "typescript": "^5.3.0"
    },
    "engines": {
        "node": ">= 14"
    }
}
```

### package.json (组件库示例)

```json
{
    "name": "@my-app/{package-name}",
    "version": "1.0.0",
    "description": "{package-description}",
    "main": "dist/index.js",
    "types": "dist/index.d.ts",
    "exports": {
        ".": {
            "import": "./dist/index.js",
            "require": "./dist/index.js"
        }
    },
    "scripts": {
        "clean": "rimraf dist",
        "prebuild": "pnpm run clean",
        "build": "rollup -c rollup.config.ts --configPlugin typescript",
        "dev": "rollup -c rollup.config.ts --configPlugin typescript --watch",
        "test": "jest",
        "test:watch": "jest --watch",
        "test:coverage": "jest --coverage"
    },
    "keywords": [],
    "author": "",
    "license": "MIT",
    "peerDependencies": {
        "vue": "^3.5.33",
        "@vue/babel-plugin-jsx": "^1.5.0"
    },
    "devDependencies": {
        "@types/jest": "^29.5.0",
        "@vue/test-utils": "^2.4.0",
        "jest": "^29.7.0",
        "rimraf": "^5.0.5",
        "rollup": "^4.12.0",
        "ts-jest": "^29.1.0",
        "typescript": "^5.3.0"
    },
    "engines": {
        "node": ">= 14"
    }
}
```

### rollup.config.ts

- **ES 模块构建**: 支持 ES6+ 模块语法
- **类型声明生成**: 自动生成 `.d.ts` 类型文件
- **外部依赖处理**: 排除 peerDependencies
- **Source map 支持**: 生成 source map 便于调试

### tsconfig.json

- **继承项目根配置**: 继承根目录的 TypeScript 配置
- **JSX 支持**（针对组件库）: 支持 Vue JSX 语法
- **路径别名配置**: 配置包内部路径别名
- **严格类型检查**: 启用所有严格类型检查选项

## 使用方式

### 基本用法

```bash
# 创建工具库
"创建名为 utils 的工具库包"

# 创建组件库
"创建名为 ui-components 的组件库，类型为组件库"

# 创建工具函数集（带描述）
"创建名为 auth-helpers 的工具函数集，描述为 '用户认证相关工具函数'"

# 创建插件库
"创建名为 vue-plugins 的插件库，用于 Vue 插件开发"
```

### 创建流程

1. **确认包名称**: 输入符合规范的包名称
2. **选择包类型**: 选择工具库、组件库、工具函数集或插件库
3. **输入包描述**（可选）: 提供包的简要描述
4. **生成包结构**: 基于模板创建完整目录结构
5. **配置依赖和脚本**: 根据包类型配置相应依赖
6. **验证创建结果**: 检查生成的文件和配置

## 包开发流程

### 1. 创建包

```bash
# 请求创建工具库
"创建名为 utils 的工具库，用于工具函数"
```

### 2. 开发模式

```bash
# 进入包目录
cd packages/{package-name}

# 启动开发模式（监听文件变化）
pnpm run dev

# 或者从根目录运行
pnpm -F @my-app/{package-name} dev
```

### 3. 构建生产版本

```bash
# 构建单个包
cd packages/{package-name}
pnpm run build

# 或者在根目录构建所有包
pnpm build:packages
```

### 4. 运行测试

```bash
# 运行包测试
cd packages/{package-name}
pnpm test

# 运行测试并监听变化
pnpm test:watch

# 生成测试覆盖率报告
pnpm test:coverage

# 从根目录运行特定包的测试
pnpm -F @my-app/{package-name} test
```

## 在其他应用中使用创建的包

### 1. 在应用的 package.json 中添加依赖

```json
{
    "dependencies": {
        "@my-app/{package-name}": "workspace:*"
    }
}
```

### 2. 在代码中导入使用

```typescript
// 导入工具函数
import { safeNum, formatDate } from '@my-app/utils';

// 导入 Vue 组件
import { Button } from '@my-app/ui-components';

// 导入工具函数集
import { login, logout } from '@my-app/auth-helpers';

// 导入插件
import { logPlugin } from '@my-app/vue-plugins';
```

### 3. 确保路径映射正确

应用的 `vue.config.js` 和 `tsconfig.json` 会自动配置包别名映射，无需手动配置。

## 示例

### 示例 1：创建工具库 `utils`

```bash
# 请求
"创建名为 utils 的工具库，用于日期和数字处理"
```

**创建的包结构**：
```
packages/utils/
├── src/
│   ├── index.ts          # 包入口文件
│   ├── date-utils.ts     # 日期工具函数
│   └── number-utils.ts   # 数字工具函数
├── __tests__/
│   └── index.test.ts     # 测试文件
├── README.md             # 说明文档
├── package.json          # name: "@my-app/utils"
├── jest.config.js        # Jest 配置
├── tsconfig.json         # TypeScript 配置
├── tsconfig.build.json   # TypeScript 构建配置
└── rollup.config.ts      # Rollup 构建配置
```

### 示例 2：创建组件库 `ui-components`

```bash
# 请求
"创建名为 ui-components 的组件库，包含按钮和弹窗组件"
```

**包配置特点**：
```json
{
    "peerDependencies": {
        "vue": "^3.5.33",
        "@vue/babel-plugin-jsx": "^1.5.0"
    }
}
```

## 包类型详细说明

### 工具库 (Utility Library)

**适用场景**：
- 通用的工具函数
- 纯 TypeScript/JavaScript 代码
- 无框架依赖

**示例代码**：
```typescript
// src/date-utils.ts
export function formatDate(date: Date, format: string): string {
    // 日期格式化逻辑
}

export function daysBetween(start: Date, end: Date): number {
    // 计算日期差
}
```

### 组件库 (Component Library)

**适用场景**：
- 可复用的 Vue 组件
- UI 组件库
- 业务组件库

**示例代码**：
```typescript
// src/components/Button.tsx
import { defineComponent } from 'vue';

export const Button = defineComponent({
    name: 'MyButton',
    props: {
        type: {
            type: String,
            default: 'default'
        }
    },
    setup(props, { slots }) {
        return () => (
            <button class={`btn btn-${props.type}`}>
                {slots.default?.()}
            </button>
        );
    }
});
```

### 工具函数集 (Helper Functions)

**适用场景**：
- 业务相关的工具函数
- 特定领域的工具集合
- 可能需要特定依赖

**示例代码**：
```typescript
// src/auth.ts
export async function login(username: string, password: string): Promise<User> {
    // 登录逻辑
}

export function logout(): void {
    // 登出逻辑
}

export function getCurrentUser(): User | null {
    // 获取当前用户
}
```

### 插件库 (Plugin Library)

**适用场景**：
- Vue 插件
- 全局功能扩展
- 中间件、拦截器

**示例代码**：
```typescript
// src/log-plugin.ts
import type { App } from 'vue';

export const logPlugin = {
    install(app: App) {
        app.config.globalProperties.$log = {
            info(message: string) {
                console.log(`[INFO] ${message}`);
            },
            error(message: string) {
                console.error(`[ERROR] ${message}`);
            }
        };
    }
};
```

## 测试配置

### Jest 配置

每个包都包含完整的 Jest 测试配置：
- TypeScript 支持
- 覆盖率报告
- 测试文件匹配模式
- 模块映射配置

### 测试示例

```typescript
// __tests__/index.test.ts
import { formatDate } from '../src';

describe('formatDate', () => {
    it('should format date correctly', () => {
        const date = new Date('2023-01-01');
        expect(formatDate(date, 'YYYY-MM-DD')).toBe('2023-01-01');
    });
});
```

## 构建配置

### Rollup 配置

- **多格式输出**: 支持 ES 模块和 CommonJS
- **类型声明**: 自动生成类型定义文件
- **外部依赖**: 排除 peerDependencies
- **代码压缩**: 生产环境代码压缩
- **Source map**: 生成调试用的 source map

### TypeScript 构建配置

- **严格类型检查**: 启用所有严格选项
- **排除测试文件**: 构建时排除测试文件
- **目标版本**: 根据项目需求配置目标版本
- **路径映射**: 配置包内部路径别名

## 最佳实践

### 1. 包命名
- 使用有意义的名称，反映包功能
- 遵循 `@my-app/` 命名空间
- 使用 kebab-case 命名规范

### 2. 版本管理
- 初始版本使用 `1.0.0`
- 遵循语义化版本规范
- 及时更新版本号

### 3. 文档编写
- 提供清晰的 README.md
- 包含使用示例
- 说明 API 接口

### 4. 测试覆盖
- 编写单元测试
- 保持高测试覆盖率
- 测试边界条件

### 5. 依赖管理
- 合理使用 peerDependencies
- 避免不必要的依赖
- 定期更新依赖版本

## 故障排除

### 常见问题

#### 1. 包引用问题
```bash
# 确保所有包都已构建
pnpm build:packages

# 重新链接依赖
pnpm i --force
```

#### 2. 类型错误
```bash
# 检查 TypeScript 配置
cd packages/{package-name}
pnpm tsc --noEmit
```

#### 3. 构建失败
```bash
# 查看详细错误信息
pnpm build --verbose

# 清理构建缓存
rm -rf packages/{package-name}/dist
```

#### 4. 测试失败
```bash
# 查看测试详细输出
pnpm test --verbose

# 运行特定测试
pnpm test --testNamePattern="formatDate"
```

## 下一步

- 查看 [创建 Vue 应用指南](./create-vue-app-guide.md)
- 学习 [项目开发工作流](./workflow.md)
- 参考 [代码规范与最佳实践](./coding-standards.md)
- 查看 [故障排除指南](./troubleshooting.md)
- 了解 [技能开发指南](./skill-development-guide.md)