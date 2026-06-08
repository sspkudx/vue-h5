# 代码规范与最佳实践

本文档描述了 vue-h5 项目的代码规范、命名约定和最佳实践，确保代码质量和一致性。

## 文件命名规范

### 1. 组件文件
- **命名规则**: 使用 PascalCase（大驼峰）
- **示例**:
  - `HomeView.vue` 或 `HomeView.tsx`
  - `UserProfile.vue`
  - `ProductCard.tsx`
- **说明**: Vue 组件文件名应与组件名一致

### 2. 工具函数文件
- **命名规则**: 使用 kebab-case（短横线连接）
- **示例**:
  - `date-utils.ts`
  - `number-helpers.ts`
  - `auth-helpers.ts`
- **说明**: 描述文件功能的动词+名词形式

### 3. 样式文件
- **命名规则**: 使用 `.module.less` 后缀
- **示例**:
  - `style.module.less`
  - `button.module.less`
  - `layout.module.less`
- **说明**: 使用 CSS Modules 实现样式隔离

### 4. 配置文件
- **命名规则**: 使用 kebab-case
- **示例**:
  - `vue.config.js`
  - `jest.config.js`
  - `tsconfig.json`
- **说明**: 遵循工具的标准命名约定

### 5. 测试文件
- **命名规则**: 使用 `.test.ts` 或 `.spec.ts` 后缀
- **示例**:
  - `utils.test.ts`
  - `component.spec.ts`
  - `hook.test.ts`
- **说明**: 与源文件同名，放在 `__tests__` 目录下

## 目录结构规范

### 1. 应用结构

```
apps/{app-name}/
├── src/
│   ├── components/     # 通用组件（可复用）
│   │   ├── Button/
│   │   │   ├── index.tsx
│   │   │   └── style.module.less
│   │   └── Modal/
│   │       ├── index.tsx
│   │       └── style.module.less
│   ├── views/          # 页面组件
│   │   ├── HomeView/
│   │   │   ├── index.tsx
│   │   │   └── style.module.less
│   │   └── AboutView/
│   │       ├── index.tsx
│   │       └── style.module.less
│   ├── composables/    # 组合式函数
│   │   ├── useAuth.ts
│   │   ├── useFetch.ts
│   │   └── useLocalStorage.ts
│   ├── stores/         # Pinia 状态管理
│   │   ├── user.store.ts
│   │   ├── cart.store.ts
│   │   └── index.ts
│   ├── utils/          # 工具函数
│   │   ├── date-utils.ts
│   │   ├── number-utils.ts
│   │   └── validation.ts
│   ├── plugins/        # Vue 插件
│   │   └── index.ts
│   ├── router/         # 路由配置
│   │   └── index.ts
│   ├── types/          # 类型定义
│   │   ├── user.types.ts
│   │   ├── product.types.ts
│   │   └── index.ts
│   └── assets/         # 静态资源
│       ├── images/
│       ├── fonts/
│       └── styles/
│           └── global.less
```

### 2. 包结构

```
packages/{package-name}/
├── src/
│   ├── components/     # Vue 组件（如果是组件库）
│   │   ├── Button/
│   │   │   ├── index.tsx
│   │   │   └── style.module.less
│   │   └── Modal/
│   │       ├── index.tsx
│   │       └── style.module.less
│   ├── hooks/          # 自定义 Hooks
│   │   ├── useToggle.ts
│   │   ├── useDebounce.ts
│   │   └── useLocalStorage.ts
│   ├── utils/          # 工具函数
│   │   ├── date-utils.ts
│   │   ├── number-utils.ts
│   │   └── validation.ts
│   ├── types/          # 类型定义
│   │   ├── index.ts
│   │   └── interfaces.ts
│   └── index.ts        # 主入口文件
├── __tests__/         # 测试文件
│   ├── components/
│   │   ├── Button.test.tsx
│   │   └── Modal.test.tsx
│   ├── hooks/
│   │   ├── useToggle.test.ts
│   │   └── useDebounce.test.ts
│   ├── utils/
│   │   ├── date-utils.test.ts
│   │   └── validation.test.ts
│   └── index.test.ts
└── ...配置文件
```

## TypeScript 规范

### 1. 严格模式
始终使用严格类型检查配置：

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

### 2. 接口定义
为所有公共 API 提供接口定义：

```typescript
// 定义清晰的接口
export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

// 使用 Type 别名定义复杂类型
export type UserRole = 'admin' | 'user' | 'guest';

// 使用枚举定义常量
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending'
}
```

### 3. 类型导出
正确导出类型定义：

```typescript
// 正确：使用 export type
export type { User, UserRole };

// 正确：直接导出接口
export interface Product {
  id: number;
  name: string;
  price: number;
}

// 避免：混合导出值和类型
// 错误：export { User, getUser };
```

### 4. 泛型使用
在适当的地方使用泛型提高复用性：

```typescript
// 通用响应类型
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// 通用工具函数
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  // 实现...
}
```

### 5. 类型推断
充分利用 TypeScript 的类型推断：

```typescript
// 让 TypeScript 推断返回类型
const add = (a: number, b: number) => a + b;

// 明确指定复杂类型的返回类型
const getUser = (id: number): Promise<User> => {
  // 实现...
};

// 使用 const 断言
const COLORS = ['red', 'green', 'blue'] as const;
```

## Vue 组件规范

### 1. 组合式 API
优先使用 `<script setup>` 语法：

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';

// 响应式状态
const count = ref(0);

// 计算属性
const doubleCount = computed(() => count.value * 2);

// 方法
const increment = () => {
  count.value++;
};
</script>

<template>
  <button @click="increment">
    Count: {{ count }}, Double: {{ doubleCount }}
  </button>
</template>

<style module>
.button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
}
</style>
```

### 2. Props 和 Emits 类型定义
为组件 Props 和 Emits 提供完整类型定义：

```vue
<script setup lang="ts">
// 定义 Props 接口
interface Props {
  title: string;
  count?: number;
  disabled?: boolean;
}

// 定义 Emits 类型
interface Emits {
  (e: 'update:title', value: string): void;
  (e: 'click'): void;
}

// 使用 defineProps 和 defineEmits
const props = withDefaults(defineProps<Props>(), {
  count: 0,
  disabled: false
});

const emit = defineEmits<Emits>();

// 处理事件
const handleClick = () => {
  if (!props.disabled) {
    emit('click');
  }
};
</script>
```

### 3. 组件命名
使用多单词命名避免冲突：

```vue
<!-- 正确 -->
<script setup lang="ts">
// 组件名：UserProfile
</script>

<!-- 错误 -->
<script setup lang="ts">
// 组件名：User （与 HTML 元素冲突）
</script>
```

### 4. 样式隔离
使用 CSS Modules 或 Scoped CSS：

```vue
<!-- 使用 CSS Modules -->
<style module>
.container {
  padding: 20px;
}

.title {
  font-size: 24px;
  color: #333;
}
</style>

<!-- 或者使用 Scoped CSS -->
<style scoped>
.container {
  padding: 20px;
}

.title {
  font-size: 24px;
  color: #333;
}
</style>
```

### 5. 组件组织
按功能组织组件代码：

```vue
<script setup lang="ts">
// 1. 导入依赖
import { ref, computed } from 'vue';

// 2. 类型定义
interface Props {
  // ...
}
interface Emits {
  // ...
}

// 3. Props 和 Emits
const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// 4. 响应式状态
const count = ref(0);
const isLoading = ref(false);

// 5. 计算属性
const formattedCount = computed(() => `Count: ${count.value}`);

// 6. 方法
const increment = () => {
  count.value++;
};

// 7. 生命周期
onMounted(() => {
  // 初始化逻辑
});

// 8. 监听器
watch(count, (newValue, oldValue) => {
  // 处理变化
});
</script>
```

## 测试规范

### 1. 测试文件位置
在 `__tests__` 目录中，保持与源码相同的结构：

```
src/
├── components/
│   └── Button/
│       ├── index.tsx
│       └── style.module.less
└── __tests__/
    └── components/
        └── Button/
            └── index.test.tsx
```

### 2. 测试文件命名
使用 `.test.ts` 或 `.spec.ts` 后缀：

```typescript
// 正确
Button.test.tsx
utils.spec.ts
hook.test.ts

// 避免
Button.test.js
utils.test.jsx
```

### 3. 测试覆盖率目标
关键功能应达到 80% 以上覆盖率：

```bash
# 运行测试覆盖率
pnpm test:coverage

# 预期覆盖率
Statements   : 85% ( 100/118 )
Branches     : 80% ( 32/40 )
Functions    : 90% ( 27/30 )
Lines        : 85% ( 100/118 )
```

### 4. 测试类型
以单元测试为主，适当添加集成测试：

```typescript
// 单元测试示例
describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2023-01-01');
    expect(formatDate(date, 'YYYY-MM-DD')).toBe('2023-01-01');
  });

  it('should handle invalid date', () => {
    expect(() => formatDate(null as any, 'YYYY-MM-DD'))
      .toThrow('Invalid date');
  });
});

// 组件测试示例
describe('Button', () => {
  it('renders correctly', () => {
    const wrapper = mount(Button, {
      props: { label: 'Click me' }
    });
    expect(wrapper.text()).toContain('Click me');
  });

  it('emits click event', async () => {
    const wrapper = mount(Button);
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toHaveLength(1);
  });
});
```

## Git 提交规范

### 1. 提交信息格式
使用 Conventional Commits 规范：

```
feat: 添加新功能
fix: 修复问题
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建过程或辅助工具变动
```

### 2. 提交示例

```bash
# 添加新功能
git commit -m "feat: add user authentication"

# 修复 bug
git commit -m "fix: resolve login page layout issue"

# 文档更新
git commit -m "docs: update API documentation"

# 代码重构
git commit -m "refactor: improve error handling"

# 测试相关
git commit -m "test: add unit tests for utils"

# 构建配置
git commit -m "chore: update webpack configuration"
```

### 3. 提交信息规范
- **类型**：必填，使用上述类型之一
- **范围**：可选，说明影响范围
- **描述**：必填，简明扼要
- **正文**：可选，详细说明
- **脚注**：可选，引用 issue

```
feat(auth): add OAuth2 support

- Implement Google OAuth2 authentication
- Add social login buttons
- Update user model for OAuth2 data

Closes #123
```

### 4. 分支命名

```
feature/add-login           # 新功能
bugfix/fix-login-error      # bug 修复
hotfix/fix-production-bug   # 生产环境热修复
release/v1.0.0              # 版本发布
docs/update-readme          # 文档更新
refactor/improve-performance # 代码重构
```

## 代码质量检查

### 1. ESLint 规则
项目使用以下 ESLint 规则：

```javascript
// .eslintrc.js
module.exports = {
  rules: {
    // TypeScript 相关
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    
    // Vue 相关
    'vue/multi-word-component-names': 'error',
    'vue/no-unused-components': 'warn',
    
    // 代码风格
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-unused-vars': 'warn',
    
    // 最佳实践
    'prefer-const': 'error',
    'no-var': 'error',
    'eqeqeq': ['error', 'always']
  }
};
```

### 2. Prettier 配置
项目使用 Prettier 统一代码格式：

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

### 3. Stylelint 配置
项目使用 Stylelint 检查样式代码：

```json
{
  "extends": [
    "stylelint-config-standard",
    "stylelint-config-recommended-less"
  ],
  "rules": {
    "selector-class-pattern": "^[a-z][a-zA-Z0-9]+$",
    "no-duplicate-selectors": true,
    "no-empty-source": true
  }
}
```

## 性能优化

### 1. 代码分割
使用动态导入分割代码块：

```typescript
// 路由懒加载
const HomeView = () => import('./views/HomeView.vue');
const AboutView = () => import('./views/AboutView.vue');

// 组件懒加载
const HeavyComponent = defineAsyncComponent(() =>
  import('./components/HeavyComponent.vue')
);
```

### 2. Tree Shaking
确保包支持 ES 模块：

```javascript
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

### 3. 图片优化
使用合适的图片格式和压缩：

```vue
<template>
  <!-- 使用 WebP 格式 -->
  <img src="@/assets/images/logo.webp" alt="Logo">
  
  <!-- 懒加载图片 -->
  <img v-lazy="imageUrl" alt="Lazy loaded image">
  
  <!-- 响应式图片 -->
  <picture>
    <source srcset="image-large.webp" media="(min-width: 1024px)">
    <source srcset="image-medium.webp" media="(min-width: 768px)">
    <img src="image-small.webp" alt="Responsive image">
  </picture>
</template>
```

### 4. 状态管理优化
合理使用 Pinia store：

```typescript
// 使用 store 时注意性能
const store = useUserStore();

// 避免在模板中直接访问 store 状态
// 错误：{{ store.user.name }}
// 正确：{{ userName }}

const userName = computed(() => store.user.name);

// 使用 storeToRefs 解构响应式状态
const { user, isLoggedIn } = storeToRefs(store);
```

## 安全最佳实践

### 1. 输入验证
始终验证用户输入：

```typescript
// 使用 Zod 或其他验证库
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  age: z.number().min(0).max(150)
});

function createUser(data: unknown) {
  const validated = userSchema.parse(data);
  // 处理验证后的数据
}
```

### 2. XSS 防护
防止跨站脚本攻击：

```vue
<template>
  <!-- 避免直接渲染 HTML -->
  <!-- 错误：<div v-html="userInput"></div> -->
  
  <!-- 使用文本插值 -->
  <div>{{ userInput }}</div>
  
  <!-- 或者使用 sanitize-html 库 -->
  <div v-html="sanitizedHtml"></div>
</template>

<script setup lang="ts">
import DOMPurify from 'dompurify';

const userInput = ref('');
const sanitizedHtml = computed(() => DOMPurify.sanitize(userInput.value));
</script>
```

### 3. 敏感信息保护
保护敏感配置信息：

```typescript
// 使用环境变量
const apiKey = import.meta.env.VITE_API_KEY;

// 不要在代码中硬编码敏感信息
// 错误：const apiKey = 'sk_live_1234567890';
// 正确：const apiKey = import.meta.env.VITE_API_KEY;
```

## 文档注释规范

### 1. JSDoc 注释
为公共 API 添加 JSDoc 注释：

```typescript
/**
 * 格式化日期
 * @param date - 要格式化的日期对象
 * @param format - 格式字符串，支持 YYYY、MM、DD 等
 * @returns 格式化后的日期字符串
 * @example
 * formatDate(new Date(), 'YYYY-MM-DD') // '2023-01-01'
 */
export function formatDate(date: Date, format: string): string {
  // 实现...
}

/**
 * 用户信息接口
 * @interface
 */
export interface User {
  /** 用户ID */
  id: number;
  /** 用户名 */
  name: string;
  /** 邮箱地址 */
  email: string;
  /** 创建时间 */
  createdAt: Date;
}
```

### 2. Vue 组件文档
为组件添加文档注释：

```vue
<script setup lang="ts">
/**
 * 用户头像组件
 * @component
 * @description 显示用户头像，支持不同尺寸和形状
 * 
 * @example
 * <UserAvatar
 *   :src="user.avatar"
 *   :size="40"
 *   shape="circle"
 * />
 */
interface Props {
  /** 头像图片地址 */
  src: string;
  /** 头像尺寸，单位像素 */
  size?: number;
  /** 头像形状，circle 或 square */
  shape?: 'circle' | 'square';
}

const props = withDefaults(defineProps<Props>(), {
  size: 40,
  shape: 'circle'
});
</script>
```

## 下一步

- 查看 [项目开发工作流](./workflow.md)
- 学习 [故障排除指南](./troubleshooting.md)
- 了解 [技能开发指南](./skill-development-guide.md)
- 参考 [可用技能列表](./available-skills.md)