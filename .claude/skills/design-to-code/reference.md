# Design-to-Code 参考文档

## 项目代码规范

### TypeScript 规范

#### 类型定义
- 所有函数、组件必须有明确的类型定义
- 避免使用 `any` 类型，使用 `unknown` 或具体类型
- 使用 `interface` 定义对象类型
- 使用 `type` 定义联合类型、交叉类型

#### 组件 Props 类型定义
```typescript
import { defineComponent, PropType } from 'vue';

// 正确的 Props 定义
interface ButtonProps {
    type: 'primary' | 'secondary' | 'danger';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
}

const Button = defineComponent({
    props: {
        type: {
            type: String as PropType<ButtonProps['type']>,
            required: true,
        },
        size: {
            type: String as PropType<ButtonProps['size']>,
            default: 'medium',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
});
```

#### 组合式函数类型
```typescript
import { ref, Ref, computed, ComputedRef } from 'vue';

// 正确使用 ref 和 computed 的类型
interface UserData {
    id: number;
    name: string;
    email: string;
}

function useUser(userId: number) {
    const user: Ref<UserData | null> = ref(null);
    const isLoading = ref(false);
    
    const userName: ComputedRef<string> = computed(() => {
        return user.value?.name ?? 'Unknown';
    });
    
    return {
        user,
        isLoading,
        userName,
    };
}
```

### Vue 3 规范

#### 组件定义
- 使用 `defineComponent` 定义组件
- 组件名使用 PascalCase
- 使用 Composition API 而非 Options API
- 使用 JSX 语法编写模板

```tsx
// 正确的组件定义
const MyComponent = defineComponent({
    name: 'MyComponent',
    props: {
        title: {
            type: String,
            required: true,
        },
    },
    emits: {
        submit: (value: string) => typeof value === 'string',
    },
    setup(props, { emit }) {
        const handleClick = () => {
            emit('submit', props.title);
        };
        
        const render = () => {
            return (
                <div>
                    <h1>{props.title}</h1>
                    <button onClick={handleClick}>提交</button>
                </div>
            );
        };
        
        return render;
    },
});
```

#### Props 和 Emits 规范
```typescript
// 明确声明 props 类型
props: {
    // 必填属性
    requiredProp: {
        type: String,
        required: true,
    },
    // 可选属性
    optionalProp: {
        type: Number,
        default: 0,
    },
    // 复杂类型
    complexProp: {
        type: Object as PropType<ComplexType>,
        default: () => ({}),
    },
}

// 明确声明 emits 类型
emits: {
    // 无参数事件
    'click': () => true,
    // 有参数事件
    'submit': (value: string) => typeof value === 'string',
    // 可选参数事件
    'update': (value: string, index?: number) => true,
}
```

### CSS Modules 规范

#### BEM 命名规范
- Block: `.block`
- Element: `.block__element`
- Modifier: `.block--modifier` 或 `.block__element--modifier`

#### CSS Modules 使用示例
```less
// style.module.less
.button {
    // Block 样式
    display: inline-block;
    padding: 8mpx 16mpx;
    
    // Element 样式
    &__icon {
        margin-right: 8mpx;
    }
    
    // Modifier 样式
    &--primary {
        background: @primary-color;
        color: white;
    }
    
    &--large {
        padding: 12mpx 24mpx;
        font-size: 16mpx;
    }
}
```

```tsx
// 组件中使用
import styles from './style.module.less';

const Button = defineComponent({
    setup() {
        const render = () => {
            return (
                <button class={[styles.button, styles['button--primary'], styles['button--large']]}>
                    <span class={styles.button__icon}>✓</span>
                    Click Me
                </button>
            );
        };
        return render;
    },
});
```

#### 状态管理样式
```less
// 状态类名
.button {
    &--loading {
        opacity: 0.7;
        cursor: wait;
    }
    
    &--disabled {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
    }
    
    // 状态组合
    &--loading#{&}--disabled {
        // 同时具备 loading 和 disabled 状态的样式
    }
}
```

### 样式单位规范

#### mpx 单位使用
- 所有尺寸必须使用 `mpx` 单位
- postcss-px-to-viewport 会自动转换为 `vmin`
- 设计稿上的 px 值直接写为 mpx
- 使用 CSS 变量定义间距系统

```less
// 正确：使用 mpx 单位
.component {
    padding: 12mpx;
    margin: 24mpx;
    font-size: 16mpx;
    border-radius: 4mpx;
    
    // 响应式设计也使用 mpx
    @media (min-width: 768px) {
        padding: 24mpx;
        font-size: 18mpx;
    }
}

// 错误：使用 px 或其他单位
.component {
    padding: 12px; // 错误！应该使用 mpx
    margin: 1rem;  // 错误！应该使用 mpx
}
```

#### 间距系统变量
```less
// 在 variables.less 中定义间距变量
@spacing-base: 4mpx;
@spacing-xs: @spacing-base;      // 4mpx
@spacing-sm: @spacing-base * 2;  // 8mpx
@spacing-md: @spacing-base * 3;  // 12mpx
@spacing-lg: @spacing-base * 4;  // 16mpx
@spacing-xl: @spacing-base * 6;  // 24mpx
@spacing-xxl: @spacing-base * 8; // 32mpx

// 组件中使用
.component {
    padding: @spacing-md;
    margin: @spacing-xl;
    
    &__item {
        margin-bottom: @spacing-sm;
    }
}
```

### 响应式设计规范

#### 移动端优先策略
```less
// 移动端优先：默认是移动端样式
.component {
    // 移动端样式
    display: flex;
    flex-direction: column;
    padding: @spacing-md;
    
    // 平板端样式
    @media (min-width: 768px) {
        flex-direction: row;
        padding: @spacing-lg;
    }
    
    // 桌面端样式
    @media (min-width: 1024px) {
        padding: @spacing-xl;
        max-width: 1200mpx;
        margin: 0 auto;
    }
}
```

#### 响应式断点
```less
// 响应式断点定义
@breakpoint-xs: 320px;
@breakpoint-sm: 576px;
@breakpoint-md: 768px;
@breakpoint-lg: 992px;
@breakpoint-xl: 1200px;

// 使用方式
.component {
    // 移动端（默认）
    width: 100%;
    
    // 平板端
    @media (min-width: @breakpoint-md) {
        width: 50%;
    }
    
    // 桌面端
    @media (min-width: @breakpoint-lg) {
        width: 33.333%;
    }
}
```

## PostCSS 配置

### postcss-px-to-viewport 配置
本项目使用 postcss-px-to-viewport 插件自动将 `mpx` 单位转换为视口单位：

```javascript
// .postcssrc.js
module.exports = {
    plugins: [
        require('postcss-px-to-viewport')({
            viewportWidth: 390,           // 设计稿宽度（iPhone 12/13/14 等现代手机）
            unitToConvert: 'mpx',         // 要转换的单位
            minPixelValue: 0,             // 最小的转换值
            unitPrecision: 3,             // 转换精度，保留小数位数
            viewportUnit: 'vmin',         // 转换后的视口单位
            fontViewportUnit: 'vmin',     // 字体使用的视口单位
        }),
        require('postcss-calc'),          // 支持 calc() 表达式
    ],
};
```

### 单位转换规则
```
设计稿 390px 宽度下：
- 100mpx = 100/390*100 ≈ 25.641vmin
- 200mpx = 200/390*100 ≈ 51.282vmin
- 375mpx = 375/390*100 ≈ 96.154vmin

在 390px 宽度的设备上：
- 100mpx = 100px
- 200mpx = 200px

在 780px 宽度的设备上：
- 100mpx = 100/390*100 ≈ 25.641vmin = 200px
- 200mpx = 200/390*100 ≈ 51.282vmin = 400px
```

### 字体单位处理
- 字体大小使用 `mpx` 单位
- 行高使用无单位值（如 `line-height: 1.5`）
- 字重使用数字（如 `font-weight: 400, 500, 600, 700`）

## 设计稿转换指南

### Figma 设计稿转换

#### 提取设计规范
1. **颜色变量**: 提取 Figma 的 Color Styles
2. **字体变量**: 提取 Figma 的 Text Styles
3. **间距系统**: 提取 Auto Layout 间距和网格系统
4. **组件库**: 识别 Components 和 Variants

#### Figma 样式到 CSS 映射
```
Figma 属性            -> CSS 属性
Font family          -> font-family
Font size            -> font-size: [value]mpx
Font weight          -> font-weight: [value]
Line height          -> line-height: [value]
Letter spacing       -> letter-spacing: [value]em
Text case            -> text-transform
Text decoration      -> text-decoration
Color                -> color / background-color
Corner radius        -> border-radius: [value]mpx
Stroke               -> border
Effects              -> box-shadow / text-shadow
Auto layout spacing  -> gap / margin / padding
```

#### 布局转换示例
```
Figma Frame 属性         -> CSS 实现
Frame width: 390        -> width: 390mpx
Frame height: 844       -> height: 844mpx
Auto layout: Vertical   -> display: flex; flex-direction: column
Gap: 12                -> gap: 12mpx
Padding: 16            -> padding: 16mpx
Background: #FFFFFF    -> background: #FFFFFF
Corner radius: 8       -> border-radius: 8mpx
Shadow: x0 y2 blur8    -> box-shadow: 0 2mpx 8mpx rgba(0,0,0,0.1)
```

### 蓝湖设计稿转换

#### 标注信息提取
1. **尺寸标注**: 获取元素的 width、height、padding、margin
2. **颜色标注**: 获取色值（RGB、HEX、RGBA）
3. **字体标注**: 获取字体、字号、行高、字重
4. **间距标注**: 获取元素之间的间距

#### 蓝湖设计规范
```less
// 从蓝湖设计稿提取的变量
@blue-1: #e6f7ff;
@blue-6: #1890ff;
@blue-9: #003a8c;

@gray-1: #ffffff;
@gray-6: #bfbfbf;
@gray-9: #262626;

@font-size-base: 14mpx;
@line-height-base: 1.5715;
@border-radius-base: 6mpx;
@border-radius-sm: 4mpx;
```

### Dribbble 设计稿转换

#### 视觉分析步骤
1. **截图分析**: 分析设计稿截图的结构
2. **颜色提取**: 使用颜色提取工具获取主色系
3. **布局识别**: 识别常见的布局模式（卡片、列表、网格等）
4. **样式重建**: 根据视觉特征重建 CSS 样式

#### Dribbble 设计模式
```less
// Dribbble 常见设计模式
.card-design {
    // 圆角卡片
    border-radius: 16mpx;
    box-shadow: 0 4mpx 24mpx rgba(0, 0, 0, 0.08);
    
    // 渐变背景
    background: linear-gradient(135deg, @primary-color 0%, @primary-color-dark 100%);
    
    // 微交互效果
    transition: all 0.3s ease;
    
    &:hover {
        transform: translateY(-2mpx);
        box-shadow: 0 8mpx 32mpx rgba(0, 0, 0, 0.12);
    }
}
```

## 代码质量检查

### ESLint 规则
确保代码符合项目 ESLint 配置：
- 使用分号结尾
- 使用单引号
- 4个空格缩进
- 组件名使用 PascalCase
- 函数名使用 camelCase
- TypeScript 严格类型

### Prettier 格式化
- 自动格式化代码
- 统一代码风格
- 处理换行符
- 处理引号格式

### Stylelint 检查
```less
// 正确的样式编写
.component {
    display: flex;        // 属性值后有空格
    padding: 12mpx 16mpx; // mpx 单位
    color: @primary-color; // 使用 CSS 变量
    
    &__element {          // BEM 命名
        margin-bottom: 8mpx;
        
        &--modifier {     // 修饰符
            font-weight: 600;
        }
    }
}
```

## 文件组织规范

### 组件文件结构
```
src/
├── components/           # 通用组件
│   ├── Button/
│   │   ├── index.tsx    # 组件入口
│   │   └── style.module.less
│   ├── Card/
│   │   ├── index.tsx
│   │   └── style.module.less
│   └── index.ts         # 组件导出
├── views/               # 页面组件
│   ├── HomeView/
│   │   ├── index.tsx
│   │   └── style.module.less
│   └── AboutView/
│       ├── index.tsx
│       └── style.module.less
├── composables/         # 组合式函数
│   ├── useFetch.ts
│   └── useAuth.ts
├── stores/             # 状态管理
│   └── user.store.ts
├── styles/             # 全局样式
│   ├── variables.less
│   └── global.less
└── utils/              # 工具函数
    └── date-utils.ts
```

### 导入路径规范
```typescript
// 正确：使用路径别名
import Button from '@/components/Button';
import styles from './style.module.less';
import { formatDate } from '@/utils/date-utils';

// 错误：使用相对路径
import Button from '../../components/Button'; // 避免
```

## 性能优化指南

### CSS 性能优化
1. **避免深度嵌套**: 选择器嵌套不超过 3 层
2. **减少使用通用选择器**: 避免 `*` 选择器
3. **使用 BEM 命名**: 提高选择器性能
4. **避免昂贵的属性**: 减少使用 `box-shadow`、`filter`、`blur`

### 组件性能优化
1. **使用 `computed`**: 缓存计算结果
2. **使用 `memo`**: 避免不必要的重新渲染
3. **懒加载组件**: 使用 `defineAsyncComponent`
4. **代码分割**: 路由级别的代码分割

### 图片优化
1. **使用 WebP 格式**: 现代浏览器支持
2. **图片压缩**: 压缩到合适大小
3. **懒加载**: 图片滚动到视口再加载
4. **响应式图片**: 根据设备加载合适尺寸

## 调试技巧

### 浏览器开发者工具
1. **检查 mpx 转换**: 在 Elements 面板查看计算样式
2. **CSS Modules 调试**: 查看生成的类名
3. **响应式测试**: 使用 Device Mode 测试不同尺寸
4. **性能分析**: 使用 Performance 面板

### Vue DevTools
1. **组件层次**: 查看组件树结构
2. **Props 和 State**: 检查组件状态
3. **事件监听**: 查看事件监听器
4. **性能监控**: 查看组件渲染性能

### 样式调试技巧
```less
// 临时调试样式
.component {
    border: 1px solid red; // 可视化元素边界
    background: rgba(255, 0, 0, 0.1); // 半透明背景
    outline: 2px dashed blue; // 可视化元素轮廓
}
```

## 常见问题解答

### Q: mpx 单位如何转换为实际像素？
A: postcss-px-to-viewport 根据设计稿宽度（390px）自动计算转换比例：
- 390mpx = 100vmin = 100% 设计稿宽度
- 在 390px 设备上：1mpx = 1px
- 在 780px 设备上：1mpx = 2px

### Q: 为什么使用 CSS Modules？
A: CSS Modules 提供局部作用域样式，避免样式冲突：
- 自动生成唯一的类名
- 支持 BEM 命名规范
- 类型安全的样式导入
- 更好的代码组织

### Q: 如何确保视觉还原度？
A: 使用以下工具和方法：
1. **像素检查**: 使用浏览器开发者工具测量
2. **颜色对比**: 使用颜色对比工具
3. **字体对比**: 确保字体族、大小、行高一致
4. **间距测量**: 确保边距、内边距准确

### Q: 如何处理响应式设计？
A: 采用移动端优先策略：
1. 先编写移动端样式
2. 使用 `@media (min-width: ...)` 添加大屏幕样式
3. 使用 CSS 变量定义断点
4. 测试常见设备尺寸

### Q: 如何提取设计稿中的颜色变量？
A: 根据设计平台：
- **Figma**: 导出 Color Styles
- **蓝湖**: 获取颜色标注
- **Dribbble**: 使用颜色提取工具
- 统一转换为 CSS 变量在 `variables.less` 中定义