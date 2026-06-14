# Design-to-Code 使用示例

本文档提供 Design-to-Code 技能的具体使用示例和模板代码，帮助快速上手。

## 示例 1：按钮组件设计稿转代码

### 设计稿描述
Figma 设计稿中的按钮组件包含：
- 三种类型：主要按钮（蓝色）、次要按钮（灰色边框）、危险按钮（红色）
- 四种状态：正常、hover、active、disabled
- 三种尺寸：小号（24mpx 高）、中号（32mpx 高）、大号（40mpx 高）
- 加载状态：显示加载动画

### 生成的代码

#### 组件代码 (`Button/index.tsx`)
```tsx
import { defineComponent, computed } from 'vue';
import styles from './style.module.less';

interface ButtonProps {
    type?: 'primary' | 'secondary' | 'danger';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    block?: boolean;
}

const Button = defineComponent({
    name: 'Button',
    props: {
        type: {
            type: String as PropType<ButtonProps['type']>,
            default: 'primary',
        },
        size: {
            type: String as PropType<ButtonProps['size']>,
            default: 'medium',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        loading: {
            type: Boolean,
            default: false,
        },
        block: {
            type: Boolean,
            default: false,
        },
    },
    emits: {
        'click': (event: MouseEvent) => event instanceof MouseEvent,
    },
    setup(props, { emit, slots }) {
        const buttonClass = computed(() => {
            return [
                styles.button,
                styles[`button--${props.type}`],
                styles[`button--${props.size}`],
                props.disabled && styles['button--disabled'],
                props.loading && styles['button--loading'],
                props.block && styles['button--block'],
            ];
        });
        
        const handleClick = (event: MouseEvent) => {
            if (!props.disabled && !props.loading) {
                emit('click', event);
            }
        };
        
        const render = () => {
            return (
                <button
                    class={buttonClass.value}
                    onClick={handleClick}
                    disabled={props.disabled}
                    aria-disabled={props.disabled}
                >
                    {props.loading ? (
                        <>
                            <span class={styles.button__loading}></span>
                            <span class={styles.button__text}>{slots.default?.()}</span>
                        </>
                    ) : (
                        slots.default?.()
                    )}
                </button>
            );
        };
        
        return render;
    },
});

export default Button;
```

#### 样式代码 (`Button/style.module.less`)
```less
@import '../../styles/variables.less';

.button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid transparent;
    border-radius: @border-radius-base;
    font-family: @font-family;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
    vertical-align: middle;
    white-space: nowrap;
    user-select: none;
    outline: none;
    
    // 尺寸样式
    &--small {
        padding: 4mpx 12mpx;
        font-size: 12mpx;
        height: 24mpx;
        min-width: 60mpx;
    }
    
    &--medium {
        padding: 8mpx 16mpx;
        font-size: 14mpx;
        height: 32mpx;
        min-width: 80mpx;
    }
    
    &--large {
        padding: 12mpx 24mpx;
        font-size: 16mpx;
        height: 40mpx;
        min-width: 100mpx;
    }
    
    // 类型样式
    &--primary {
        background: @primary-color;
        border-color: @primary-color;
        color: white;
        
        &:hover:not(.button--disabled):not(.button--loading) {
            background: @primary-color-hover;
            border-color: @primary-color-hover;
        }
        
        &:active:not(.button--disabled):not(.button--loading) {
            background: @primary-color-active;
            border-color: @primary-color-active;
        }
        
        &:focus {
            box-shadow: 0 0 0 3mpx rgba(24, 144, 255, 0.1);
        }
    }
    
    &--secondary {
        background: white;
        border-color: @border-color;
        color: @text-color;
        
        &:hover:not(.button--disabled):not(.button--loading) {
            border-color: @primary-color;
            color: @primary-color;
        }
        
        &:active:not(.button--disabled):not(.button--loading) {
            border-color: @primary-color-active;
            color: @primary-color-active;
        }
        
        &:focus {
            box-shadow: 0 0 0 3mpx rgba(24, 144, 255, 0.1);
        }
    }
    
    &--danger {
        background: #ff4d4f;
        border-color: #ff4d4f;
        color: white;
        
        &:hover:not(.button--disabled):not(.button--loading) {
            background: #ff7875;
            border-color: #ff7875;
        }
        
        &:active:not(.button--disabled):not(.button--loading) {
            background: #d9363e;
            border-color: #d9363e;
        }
        
        &:focus {
            box-shadow: 0 0 0 3mpx rgba(255, 77, 79, 0.1);
        }
    }
    
    // 状态样式
    &--disabled {
        opacity: 0.6;
        cursor: not-allowed;
        pointer-events: none;
        
        &.button--primary {
            background: lighten(@primary-color, 30%);
            border-color: lighten(@primary-color, 30%);
        }
        
        &.button--secondary {
            background: #f5f5f5;
            border-color: @border-color;
            color: fade(@text-color, 30%);
        }
        
        &.button--danger {
            background: lighten(#ff4d4f, 30%);
            border-color: lighten(#ff4d4f, 30%);
        }
    }
    
    &--loading {
        opacity: 0.7;
        cursor: wait;
        pointer-events: none;
    }
    
    &--block {
        display: flex;
        width: 100%;
    }
    
    // 内部元素
    &__loading {
        display: inline-block;
        width: 12mpx;
        height: 12mpx;
        margin-right: 8mpx;
        border: 2px solid currentColor;
        border-top-color: transparent;
        border-radius: 50%;
        animation: button-spin 1s linear infinite;
    }
    
    &__text {
        display: inline-block;
    }
}

@keyframes button-spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

// 响应式设计
@media (max-width: 768px) {
    .button {
        &--small {
            padding: 3mpx 9mpx;
            font-size: 11mpx;
            height: 22mpx;
            min-width: 56mpx;
        }
        
        &--medium {
            padding: 6mpx 12mpx;
            font-size: 13mpx;
            height: 30mpx;
            min-width: 72mpx;
        }
        
        &--large {
            padding: 9mpx 18mpx;
            font-size: 15mpx;
            height: 36mpx;
            min-width: 90mpx;
        }
    }
}
```

## 示例 2：卡片组件设计稿转代码

### 设计稿描述
蓝湖设计稿中的卡片组件包含：
- 圆角设计：8mpx 圆角
- 阴影效果：0 2mpx 8mpx rgba(0, 0, 0, 0.08)
- 标题区：16mpx 内边距，底部边框
- 内容区：16mpx 内边距
- 操作区：按钮组，居右对齐
- 悬停效果：上浮 2mpx，阴影加深

### 生成的代码

#### 组件代码 (`Card/index.tsx`)
```tsx
import { defineComponent, computed } from 'vue';
import styles from './style.module.less';

interface CardProps {
    title?: string;
    hoverable?: boolean;
    bordered?: boolean;
    size?: 'small' | 'default' | 'large';
    cover?: string;
    actions?: Array<{ label: string; onClick: () => void }>;
}

const Card = defineComponent({
    name: 'Card',
    props: {
        title: {
            type: String,
            default: '',
        },
        hoverable: {
            type: Boolean,
            default: false,
        },
        bordered: {
            type: Boolean,
            default: true,
        },
        size: {
            type: String as PropType<CardProps['size']>,
            default: 'default',
        },
        cover: {
            type: String,
            default: '',
        },
        actions: {
            type: Array as PropType<CardProps['actions']>,
            default: () => [],
        },
    },
    setup(props, { slots }) {
        const cardClass = computed(() => {
            return [
                styles.card,
                props.hoverable && styles['card--hoverable'],
                props.bordered && styles['card--bordered'],
                styles[`card--${props.size}`],
            ];
        });
        
        const render = () => {
            return (
                <div class={cardClass.value}>
                    {/* 封面图片 */}
                    {props.cover && (
                        <div class={styles.card__cover}>
                            <img src={props.cover} alt={props.title || 'Card cover'} class={styles.card__image} />
                        </div>
                    )}
                    
                    {/* 标题区域 */}
                    {props.title && (
                        <div class={styles.card__header}>
                            <h3 class={styles.card__title}>{props.title}</h3>
                        </div>
                    )}
                    
                    {/* 内容区域 */}
                    <div class={styles.card__body}>
                        {slots.default?.()}
                    </div>
                    
                    {/* 操作区域 */}
                    {props.actions && props.actions.length > 0 && (
                        <div class={styles.card__footer}>
                            <div class={styles.card__actions}>
                                {props.actions.map((action, index) => (
                                    <button
                                        key={index}
                                        class={styles.card__action}
                                        onClick={action.onClick}
                                    >
                                        {action.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            );
        };
        
        return render;
    },
});

export default Card;
```

#### 样式代码 (`Card/style.module.less`)
```less
@import '../../styles/variables.less';

.card {
    background: white;
    border-radius: 8mpx;
    transition: all 0.3s ease;
    
    // 尺寸样式
    &--small {
        .card__header,
        .card__body,
        .card__footer {
            padding: 12mpx;
        }
        
        .card__title {
            font-size: 14mpx;
        }
    }
    
    &--default {
        .card__header,
        .card__body,
        .card__footer {
            padding: 16mpx;
        }
        
        .card__title {
            font-size: 16mpx;
        }
    }
    
    &--large {
        .card__header,
        .card__body,
        .card__footer {
            padding: 20mpx;
        }
        
        .card__title {
            font-size: 18mpx;
        }
    }
    
    // 边框样式
    &--bordered {
        border: 1px solid @border-color;
    }
    
    // 悬停效果
    &--hoverable {
        &:hover {
            transform: translateY(-2mpx);
            box-shadow: 0 8mpx 16mpx rgba(0, 0, 0, 0.12);
        }
    }
    
    // 基础阴影
    box-shadow: 0 2mpx 8mpx rgba(0, 0, 0, 0.08);
    
    // 封面
    &__cover {
        overflow: hidden;
        border-radius: 8mpx 8mpx 0 0;
    }
    
    &__image {
        width: 100%;
        height: auto;
        display: block;
    }
    
    // 标题区域
    &__header {
        border-bottom: 1px solid @border-color;
        
        .card--small & {
            border-bottom-width: 0.5px;
        }
    }
    
    &__title {
        margin: 0;
        color: @text-color;
        font-weight: 600;
        line-height: 1.5;
    }
    
    // 内容区域
    &__body {
        color: @text-color-secondary;
        line-height: 1.6;
    }
    
    // 操作区域
    &__footer {
        border-top: 1px solid @border-color;
        background: @background-color;
        
        .card--small & {
            border-top-width: 0.5px;
        }
    }
    
    &__actions {
        display: flex;
        justify-content: flex-end;
        gap: 8mpx;
    }
    
    &__action {
        padding: 4mpx 8mpx;
        border: 1px solid @border-color;
        background: white;
        color: @primary-color;
        border-radius: 4mpx;
        font-size: 12mpx;
        cursor: pointer;
        transition: all 0.2s ease;
        
        &:hover {
            border-color: @primary-color;
            background: fade(@primary-color, 10%);
        }
        
        &:active {
            border-color: @primary-color-active;
            background: fade(@primary-color-active, 10%);
        }
    }
}

// 响应式设计
@media (max-width: 768px) {
    .card {
        border-radius: 6mpx;
        box-shadow: 0 1mpx 4mpx rgba(0, 0, 0, 0.06);
        
        &--hoverable {
            &:hover {
                transform: translateY(-1mpx);
                box-shadow: 0 4mpx 8mpx rgba(0, 0, 0, 0.1);
            }
        }
        
        &__actions {
            gap: 6mpx;
        }
        
        &__action {
            padding: 3mpx 6mpx;
            font-size: 11mpx;
        }
    }
}
```

## 示例 3：视觉走查清单模板

### 设计稿转换验证清单

#### 布局和结构
- [ ] 整体布局结构与设计稿一致
- [ ] 容器尺寸和间距准确
- [ ] 元素排列顺序正确
- [ ] 响应式布局在各断点下正常

#### 颜色和字体
- [ ] 主色调与设计稿一致
- [ ] 辅助色使用正确
- [ ] 文字颜色符合设计规范
- [ ] 字体族、大小、字重准确
- [ ] 行高和字间距匹配

#### 尺寸和间距
- [ ] 所有尺寸使用 mpx 单位
- [ ] 间距系统与设计稿匹配
- [ ] 边框宽度和圆角准确
- [ ] 阴影效果参数正确

#### 交互和状态
- [ ] hover 状态样式完整
- [ ] active 状态样式正确
- [ ] disabled 状态样式清晰
- [ ] 焦点状态有视觉反馈
- [ ] 加载状态动画流畅

#### 可访问性
- [ ] 色对比度满足 WCAG 标准
- [ ] 键盘导航功能正常
- [ ] 屏幕阅读器友好
- [ ] ARIA 标签正确设置

### 代码质量检查清单

#### TypeScript 类型
- [ ] 所有组件都有完整的 Props 类型定义
- [ ] 事件发射器有明确的事件签名
- [ ] 避免使用 `any` 类型
- [ ] 正确使用 `PropType` 泛型
- [ ] 组件返回类型明确

#### Vue 3 规范
- [ ] 使用 `defineComponent` 定义组件
- [ ] 组件名使用 PascalCase
- [ ] 正确使用 Composition API
- [ ] 响应式数据使用 `ref` 或 `reactive`
- [ ] 计算属性使用 `computed`
- [ ] 生命周期钩子使用正确

#### 样式规范
- [ ] 使用 `.module.less` 文件
- [ ] 遵循 BEM 命名规范
- [ ] 使用 CSS 变量定义颜色
- [ ] 所有尺寸使用 mpx 单位
- [ ] 响应式设计完整
- [ ] 动画效果流畅

#### 项目规范
- [ ] 文件路径使用别名 (@/)
- [ ] 导入语句顺序正确
- [ ] 代码格式化符合 Prettier 规则
- [ ] ESLint 检查通过
- [ ] Stylelint 检查通过

### 性能优化检查

#### 渲染性能
- [ ] 避免不必要的重新渲染
- [ ] 使用 `computed` 缓存计算结果
- [ ] 列表渲染使用合适的 key
- [ ] 避免在模板中使用复杂表达式

#### 样式性能
- [ ] CSS 选择器嵌套不超过 3 层
- [ ] 避免使用通用选择器 (*)
- [ ] 减少昂贵属性（box-shadow, filter）
- [ ] 使用 transform 替代 top/left 动画

#### 资源优化
- [ ] 图片使用合适格式和尺寸
- [ ] 字体文件压缩
- [ ] 代码分割合理
- [ ] 懒加载非关键资源

## 示例 4：从 Figma 设计稿创建完整页面

### 设计稿分析

Figma 设计稿包含以下部分：
1. **顶部导航栏**: Logo + 菜单 + 用户头像
2. **侧边栏**: 导航菜单 + 折叠功能
3. **内容区域**: 数据表格 + 搜索 + 操作按钮
4. **底部页脚**: 版权信息 + 链接

### 页面结构代码 (`Dashboard/index.tsx`)
```tsx
import { defineComponent, ref, computed, onMounted } from 'vue';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import DataTable from '@/components/DataTable';
import SearchBar from '@/components/SearchBar';
import Footer from '@/components/Footer';
import styles from './style.module.less';

const Dashboard = defineComponent({
    name: 'Dashboard',
    setup() {
        const isSidebarCollapsed = ref(false);
        const searchQuery = ref('');
        const isLoading = ref(false);
        const tableData = ref([]);
        
        const toggleSidebar = () => {
            isSidebarCollapsed.value = !isSidebarCollapsed.value;
        };
        
        const handleSearch = (query: string) => {
            searchQuery.value = query;
            // 实际项目中这里会调用 API 搜索
            console.log('搜索:', query);
        };
        
        const handleExport = () => {
            // 导出数据逻辑
            console.log('导出数据');
        };
        
        const loadData = async () => {
            isLoading.value = true;
            try {
                // 模拟 API 调用
                await new Promise(resolve => setTimeout(resolve, 1000));
                tableData.value = [
                    { id: 1, name: '张三', age: 28, department: '研发部' },
                    { id: 2, name: '李四', age: 32, department: '产品部' },
                    { id: 3, name: '王五', age: 25, department: '设计部' },
                ];
            } finally {
                isLoading.value = false;
            }
        };
        
        onMounted(() => {
            loadData();
        });
        
        const render = () => {
            return (
                <div class={styles.dashboard}>
                    {/* 顶部导航栏 */}
                    <Navbar
                        logo="/logo.png"
                        logoText="管理后台"
                        menuItems={[
                            { label: '首页', path: '/' },
                            { label: '用户管理', path: '/users' },
                            { label: '订单管理', path: '/orders' },
                            { label: '系统设置', path: '/settings' },
                        ]}
                        userAvatar="/avatar.jpg"
                        userName="管理员"
                        fixed={true}
                    />
                    
                    <div class={styles.dashboard__content}>
                        {/* 侧边栏 */}
                        <Sidebar
                            collapsed={isSidebarCollapsed.value}
                            onToggle={toggleSidebar}
                            menuItems={[
                                { icon: '🏠', label: '首页', path: '/' },
                                { icon: '👥', label: '用户管理', path: '/users' },
                                { icon: '📦', label: '产品管理', path: '/products' },
                                { icon: '📊', label: '数据分析', path: '/analytics' },
                                { icon: '⚙️', label: '系统设置', path: '/settings' },
                            ]}
                        />
                        
                        {/* 主内容区域 */}
                        <main class={styles.dashboard__main}>
                            <div class={styles.dashboard__header}>
                                <h1 class={styles.dashboard__title}>数据概览</h1>
                                <div class={styles.dashboard__actions}>
                                    <button
                                        class={styles.dashboard__button}
                                        onClick={handleExport}
                                        disabled={isLoading.value}
                                    >
                                        导出数据
                                    </button>
                                </div>
                            </div>
                            
                            <SearchBar
                                placeholder="搜索用户或订单..."
                                onSearch={handleSearch}
                                class={styles.dashboard__search}
                            />
                            
                            <div class={styles.dashboard__tableWrapper}>
                                <DataTable
                                    data={tableData.value}
                                    loading={isLoading.value}
                                    columns={[
                                        { key: 'id', title: 'ID', width: '80mpx' },
                                        { key: 'name', title: '姓名', width: '120mpx' },
                                        { key: 'age', title: '年龄', width: '80mpx' },
                                        { key: 'department', title: '部门', width: '150mpx' },
                                    ]}
                                />
                            </div>
                        </main>
                    </div>
                    
                    {/* 底部页脚 */}
                    <Footer
                        copyright="© 2023 公司名称 版权所有"
                        links={[
                            { label: '隐私政策', url: '/privacy' },
                            { label: '服务条款', url: '/terms' },
                            { label: '联系我们', url: '/contact' },
                        ]}
                    />
                </div>
            );
        };
        
        return render;
    },
});

export default Dashboard;
```

### 页面样式代码 (`Dashboard/style.module.less`)
```less
@import '../../styles/variables.less';

.dashboard {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: @background-color;
    
    &__content {
        display: flex;
        flex: 1;
        margin-top: 64mpx; // 导航栏高度
    }
    
    &__main {
        flex: 1;
        padding: 24mpx;
        overflow-x: auto;
    }
    
    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24mpx;
    }
    
    &__title {
        font-size: 24mpx;
        font-weight: 600;
        color: @text-color;
        margin: 0;
    }
    
    &__actions {
        display: flex;
        gap: 12mpx;
    }
    
    &__button {
        padding: 8mpx 16mpx;
        background: @primary-color;
        color: white;
        border: none;
        border-radius: 4mpx;
        font-size: 14mpx;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover:not(:disabled) {
            background: @primary-color-hover;
        }
        
        &:active:not(:disabled) {
            background: @primary-color-active;
        }
        
        &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
    }
    
    &__search {
        margin-bottom: 24mpx;
    }
    
    &__tableWrapper {
        background: white;
        border-radius: 8mpx;
        box-shadow: 0 2mpx 8mpx rgba(0, 0, 0, 0.08);
        overflow: hidden;
    }
}

// 响应式设计
@media (max-width: 768px) {
    .dashboard {
        &__content {
            flex-direction: column;
            margin-top: 56mpx;
        }
        
        &__main {
            padding: 16mpx;
        }
        
        &__header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16mpx;
        }
        
        &__title {
            font-size: 20mpx;
        }
        
        &__actions {
            width: 100%;
            justify-content: flex-end;
        }
        
        &__button {
            padding: 6mpx 12mpx;
            font-size: 13mpx;
        }
    }
}
```

## 示例 5：设计规范提取和转换

### 从设计稿提取变量

#### 1. 颜色变量提取
```less
// 从 Figma 设计稿提取的颜色变量
@primary-color: #1890ff;
@primary-color-hover: #40a9ff;
@primary-color-active: #096dd9;
@success-color: #52c41a;
@warning-color: #faad14;
@error-color: #ff4d4f;
@text-color: #333333;
@text-color-secondary: #666666;
@text-color-disabled: #bfbfbf;
@border-color: #d9d9d9;
@background-color: #f5f5f5;
@background-color-light: #fafafa;
```

#### 2. 字体变量提取
```less
// 从设计稿提取的字体变量
@font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
@font-size-xs: 10mpx;
@font-size-sm: 12mpx;
@font-size-base: 14mpx;
@font-size-lg: 16mpx;
@font-size-xl: 18mpx;
@font-size-xxl: 20mpx;
@font-size-xxxl: 24mpx;

@font-weight-light: 300;
@font-weight-normal: 400;
@font-weight-medium: 500;
@font-weight-semibold: 600;
@font-weight-bold: 700;

@line-height-xs: 1.2;
@line-height-sm: 1.4;
@line-height-base: 1.5;
@line-height-lg: 1.6;
```

#### 3. 间距变量提取
```less
// 基于 4mpx 基准单位的间距系统
@spacing-base: 4mpx;
@spacing-xs: @spacing-base;      // 4mpx
@spacing-sm: @spacing-base * 2;  // 8mpx
@spacing-md: @spacing-base * 3;  // 12mpx
@spacing-lg: @spacing-base * 4;  // 16mpx
@spacing-xl: @spacing-base * 6;  // 24mpx
@spacing-xxl: @spacing-base * 8; // 32mpx
@spacing-xxxl: @spacing-base * 12; // 48mpx
```

#### 4. 圆角变量提取
```less
// 设计稿中的圆角变量
@border-radius-xs: 2mpx;
@border-radius-sm: 4mpx;
@border-radius-base: 6mpx;
@border-radius-lg: 8mpx;
@border-radius-xl: 12mpx;
@border-radius-xxl: 16mpx;
@border-radius-round: 50%;
```

#### 5. 阴影变量提取
```less
// 设计稿中的阴影变量
@box-shadow-sm: 0 1mpx 2mpx rgba(0, 0, 0, 0.05);
@box-shadow-base: 0 2mpx 8mpx rgba(0, 0, 0, 0.08);
@box-shadow-lg: 0 4mpx 16mpx rgba(0, 0, 0, 0.12);
@box-shadow-xl: 0 8mpx 24mpx rgba(0, 0, 0, 0.16);
```

## 示例 6：组件使用示例

### 使用按钮组件
```tsx
import { defineComponent } from 'vue';
import Button from '@/components/Button';
import styles from './style.module.less';

const ComponentExample = defineComponent({
    name: 'ComponentExample',
    setup() {
        const handleClick = (event: MouseEvent) => {
            console.log('按钮点击', event);
        };
        
        const handlePrimaryClick = () => {
            console.log('主要按钮点击');
        };
        
        const handleSecondaryClick = () => {
            console.log('次要按钮点击');
        };
        
        const handleDangerClick = () => {
            console.log('危险按钮点击');
        };
        
        const render = () => {
            return (
                <div class={styles.example}>
                    <h2>按钮组件示例</h2>
                    
                    <div class={styles.example__section}>
                        <h3>不同类型</h3>
                        <div class={styles.example__buttons}>
                            <Button type="primary" onClick={handlePrimaryClick}>
                                主要按钮
                            </Button>
                            <Button type="secondary" onClick={handleSecondaryClick}>
                                次要按钮
                            </Button>
                            <Button type="danger" onClick={handleDangerClick}>
                                危险按钮
                            </Button>
                        </div>
                    </div>
                    
                    <div class={styles.example__section}>
                        <h3>不同尺寸</h3>
                        <div class={styles.example__buttons}>
                            <Button size="small" onClick={handleClick}>
                                小按钮
                            </Button>
                            <Button size="medium" onClick={handleClick}>
                                中按钮
                            </Button>
                            <Button size="large" onClick={handleClick}>
                                大按钮
                            </Button>
                        </div>
                    </div>
                    
                    <div class={styles.example__section}>
                        <h3>不同状态</h3>
                        <div class={styles.example__buttons}>
                            <Button loading={true} onClick={handleClick}>
                                加载中
                            </Button>
                            <Button disabled={true} onClick={handleClick}>
                                已禁用
                            </Button>
                            <Button block={true} onClick={handleClick}>
                                块级按钮
                            </Button>
                        </div>
                    </div>
                </div>
            );
        };
        
        return render;
    },
});

export default ComponentExample;
```

### 使用卡片组件
```tsx
import { defineComponent } from 'vue';
import Card from '@/components/Card';
import styles from './style.module.less';

const CardExample = defineComponent({
    name: 'CardExample',
    setup() {
        const cardActions = [
            { label: '编辑', onClick: () => console.log('编辑') },
            { label: '删除', onClick: () => console.log('删除') },
        ];
        
        const render = () => {
            return (
                <div class={styles.example}>
                    <h2>卡片组件示例</h2>
                    
                    <div class={styles.example__cards}>
                        <Card
                            title="基本卡片"
                            hoverable={true}
                            bordered={true}
                        >
                            <p>这是卡片的基本内容区域。</p>
                            <p>可以放置任何内容，包括文本、图片、表格等。</p>
                        </Card>
                        
                        <Card
                            title="带封面的卡片"
                            cover="https://example.com/image.jpg"
                            hoverable={true}
                        >
                            <p>带有封面图片的卡片。</p>
                            <p>封面图片会显示在卡片顶部。</p>
                        </Card>
                        
                        <Card
                            title="带操作的卡片"
                            actions={cardActions}
                            hoverable={true}
                        >
                            <p>带有操作按钮的卡片。</p>
                            <p>操作按钮会显示在卡片底部。</p>
                        </Card>
                        
                        <Card
                            title="不同尺寸的卡片"
                            size="small"
                            hoverable={true}
                        >
                            <p>小尺寸卡片</p>
                        </Card>
                        
                        <Card
                            title="无边框卡片"
                            bordered={false}
                            hoverable={true}
                        >
                            <p>没有边框的卡片。</p>
                        </Card>
                    </div>
                </div>
            );
        };
        
        return render;
    },
});
```

## 总结

这些示例展示了如何将设计稿转换为符合项目规范的 Vue 3 代码：

1. **组件结构**: 使用 TypeScript + JSX 编写组件
2. **样式规范**: 使用 CSS Modules + BEM 命名 + mpx 单位
3. **响应式设计**: 使用媒体查询和移动端优先策略
4. **类型安全**: 完整的 TypeScript 类型定义
5. **代码质量**: 符合 ESLint、Prettier、Stylelint 规范

通过遵循这些示例，您可以确保生成的代码既符合设计稿的视觉效果，又符合项目的代码规范，保证代码的可维护性和一致性。