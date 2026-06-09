# Create Component 技能使用示例

## 示例1：创建 Vue 单文件组件（包含插槽支持）

**用户请求**：\"创建名为 UserCard 的 Vue 单文件组件，支持多种插槽\"

**创建流程**：
1. 验证组件名称 \"UserCard\" 符合 PascalCase 命名规范
2. 识别组件类型为 Vue 单文件组件（.vue 格式）
3. 确定组件存储路径为当前目录（或用户指定的路径）
4. 生成标准化文件结构，包含完整的插槽支持

**UserCard.vue**：
```vue
<template>
    <div class="user-card">
        <!-- 头像插槽：支持自定义头像 -->
        <slot name="avatar" :src="avatar">
            <img :src="avatar" class="user-card__avatar" alt="Avatar" />
        </slot>
        
        <div class="user-card__content">
            <!-- 头部信息插槽：支持自定义标题区域 -->
            <slot name="header" :name="name" :email="email">
                <h3 class="user-card__name">{{ name }}</h3>
                <p class="user-card__email">{{ email }}</p>
            </slot>
            
            <!-- 默认插槽：主内容区域 -->
            <slot />
            
            <!-- 状态显示插槽：支持自定义状态显示 -->
            <slot name="status" :isActive="isActive" :statusText="statusText">
                <span :class="[styles.userCard__status, styles[`userCard__status--${statusText.toLowerCase()}`]]">
                    {{ statusText }}
                </span>
            </slot>
        </div>
        
        <!-- 操作按钮插槽：支持自定义操作区域 -->
        <slot name="actions" :id="id" :onClick="handleClick">
            <button @click="handleClick" class="user-card__button">
                View Profile
            </button>
        </slot>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';

interface Props {
    id: number;
    name: string;
    email: string;
    avatar: string;
    isActive?: boolean;
    onClick?: (e: Event) => void;
    onViewProfile?: (id: number) => void;
}

const props = withDefaults(defineProps<Props>(), {
    isActive: false,
    onClick: undefined,
    onViewProfile: undefined,
});

const isExpanded = ref(false);

const statusText = computed(() => {
    return props.isActive ? 'Active' : 'Inactive';
});

const handleClick = () => {
    if (props.onClick) {
        props.onClick(new Event('click'));
    }
    if (props.onViewProfile) {
        props.onViewProfile(props.id);
    }
};

const toggleExpand = () => {
    isExpanded.value = !isExpanded.value;
};
</script>

<style lang="less" scoped>
.user-card {
    display: flex;
    align-items: center;
    padding: 16px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background-color: white;
    transition: all 0.2s;

    &:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    &__avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        margin-right: 16px;
        object-fit: cover;
    }

    &__content {
        flex: 1;
    }

    &__name {
        margin: 0 0 4px 0;
        font-size: 16px;
        font-weight: bold;
        color: #333;
    }

    &__email {
        margin: 0;
        font-size: 14px;
        color: #666;
    }

    &__button {
        padding: 8px 16px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;

        &:hover {
            background-color: #0056b3;
        }
    }
}
</style>
```

**生成的文件结构**：
```
src/components/UserCard/
├── UserCard.vue          # 组件主文件，支持多种插槽
├── UserCard.module.less  # 样式文件，包含插槽相关样式
└── index.ts              # 组件导出文件（可选）
```

---

## 示例2：创建 defineComponent 组件（包含插槽支持）

**用户请求**：\"创建名为 Modal 的 tsx 组件，使用 defineComponent 并支持泛型和插槽\"

**创建流程**：
1. 验证组件名称 \"Modal\" 符合 PascalCase 命名规范
2. 识别组件类型为 defineComponent（.tsx 格式）
3. 创建标准组件文件结构：index.tsx、types.ts 和 style.module.less，包含完整插槽支持

**index.tsx**:
```tsx
import { defineComponent, ref, computed, type PropType } from 'vue';
import styles from './style.module.less';

interface ModalProps {
    title: string;
    visible: boolean;
    onClose?: () => void;
    onConfirm?: () => void;
}

const Modal = defineComponent({
    name: 'Modal',
    props: {
        title: {
            type: String as PropType<string>,
            required: true,
        },
        visible: {
            type: Boolean as PropType<boolean>,
            default: false,
        },
        onClose: {
            type: Function as PropType<() => void>,
            default: undefined,
        },
        onConfirm: {
            type: Function as PropType<() => void>,
            default: undefined,
        },
    },
    setup(props, { slots }) {
        const isAnimating = ref(false);

        const handleClose = () => {
            if (props.onClose) {
                props.onClose();
            }
        };

        const handleConfirm = () => {
            if (props.onConfirm) {
                props.onConfirm();
            }
        };

        return () => {
            if (!props.visible) {
                return null;
            }

            return (
                <div class={styles.modalOverlay}>
                    <div class={styles.modal}>
                        <div class={styles.modal__header}>
                            <h2 class={styles.modal__title}>{props.title}</h2>
                            <button onClick={handleClose} class={styles.modal__close}>
                                ×
                            </button>
                        </div>
                        <div class={styles.modal__body}>
                            {/* 默认插槽 - 主要内容 */}
                            {slots.default?.()}
                            
                            {/* 具名插槽示例：自定义内容区域 */}
                            {slots.content && (
                                <div class={styles.modal__content}>
                                    {slots.content()}
                                </div>
                            )}
                            
                            {/* 作用域插槽示例：带数据的底部区域 */}
                            {slots.footer && slots.footer({
                                isAnimating: isAnimating.value
                            })}
                        </div>
                        <div class={styles.modal__footer}>
                            <button onClick={handleClose} class={styles.modal__cancel}>
                                Cancel
                            </button>
                            <button onClick={handleConfirm} class={styles.modal__confirm}>
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            );
        };
    },
});

export default Modal;
```

**types.ts**:
```typescript
export interface ModalProps {
    title: string;
    visible: boolean;
    onClose?: () => void;
    onConfirm?: () => void;
}

// 插槽类型定义（可选）
export interface ModalSlots {
    default?: () => JSX.Element[];
    content?: () => JSX.Element[];
    footer?: (props: { isAnimating: boolean }) => JSX.Element;
}

export interface ModalState {
    isAnimating: boolean;
}
```

**style.module.less**:
```less
.modalOverlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal {
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
    width: 500px;
    max-width: 90vw;
    max-height: 90vh;
    display: flex;
    flex-direction: column;

    &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 24px;
        border-bottom: 1px solid #e0e0e0;
    }

    &__title {
        margin: 0;
        font-size: 18px;
        font-weight: bold;
        color: #333;
    }

    &__close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
        padding: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;

        &:hover {
            background-color: #f5f5f5;
            color: #333;
        }
    }

    &__body {
        flex: 1;
        padding: 24px;
        overflow-y: auto;
    }

    &__footer {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        padding: 16px 24px;
        border-top: 1px solid #e0e0e0;
    }

    &__cancel {
        padding: 8px 16px;
        background: white;
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: pointer;
        color: #666;

        &:hover {
            background-color: #f5f5f5;
        }
    }

    &__confirm {
        padding: 8px 16px;
        background: #007bff;
        border: 1px solid #007bff;
        border-radius: 4px;
        cursor: pointer;
        color: white;

        &:hover {
            background-color: #0056b3;
            border-color: #0056b3;
        }
    }
}
```

**生成的文件结构**：
```
src/components/Modal/
├── index.tsx         # 主组件文件，包含完整的插槽支持
├── types.ts          # 类型定义，包含 Slots 类型接口
└── style.module.less # 样式文件，包含插槽相关的样式类
```

---

## 示例3：创建 FunctionalComponent 组件（包含插槽支持）

**用户请求**：\"创建名为 Button 的函数式组件，使用 FC 类型并支持插槽\"

**创建流程**：
1. 验证组件名称 \"Button\" 符合 PascalCase 命名规范
2. 识别组件类型为 functional（函数式组件，.tsx 格式）
3. 创建标准组件文件结构：index.tsx 和 style.module.less，包含插槽支持

**index.tsx**:
```tsx
import { type FC, type PropType } from 'vue';
import styles from './style.module.less';

interface ButtonProps {
    type?: 'primary' | 'secondary' | 'danger';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    onClick?: () => void;
    children?: string;
}

const Button: FC<ButtonProps> = (props, { slots }) => {
    const {
        type = 'primary',
        size = 'medium',
        disabled = false,
        loading = false,
        onClick,
        children = 'Button',
    } = props;

    const buttonClasses = [
        styles.button,
        styles[`button--${type}`],
        styles[`button--${size}`],
        disabled && styles['button--disabled'],
        loading && styles['button--loading'],
    ]
        .filter(Boolean)
        .join(' ');

    const handleClick = () => {
        if (!disabled && !loading && onClick) {
            onClick();
        }
    };

    return (
        <button class={buttonClasses} onClick={handleClick} disabled={disabled || loading}>
            {/* 默认插槽 - 显示文本内容 */}
            {slots.default ? (
                slots.default()
            ) : loading ? (
                <span class={styles.button__loader}></span>
            ) : (
                <span class={styles.button__text}>{children}</span>
            )}
            
            {/* 具名插槽示例：图标 */}
            {slots.icon && (
                <span class={styles.button__icon}>
                    {slots.icon()}
                </span>
            )}
            
            {/* 作用域插槽示例：加载状态 */}
            {slots.loading && loading && slots.loading({ isLoading: loading })}
        </button>
    );
};

Button.props = {
    type: {
        type: String,
        default: 'primary',
        validator: (value: string) => ['primary', 'secondary', 'danger'].includes(value),
    },
    size: {
        type: String,
        default: 'medium',
        validator: (value: string) => ['small', 'medium', 'large'].includes(value),
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    loading: {
        type: Boolean,
        default: false,
    },
    onClick: {
        type: Function as PropType<() => void>,
        default: undefined,
    },
    children: {
        type: String,
        default: 'Button',
    },
};

export default Button;
```

**style.module.less**:
```less
.button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-family: inherit;
    font-weight: 500;
    transition: all 0.2s;
    outline: none;
    text-decoration: none;
    white-space: nowrap;

    &:focus {
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.3);
    }

    &:disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }

    // Types
    &--primary {
        background-color: #007bff;
        color: white;

        &:hover:not(:disabled) {
            background-color: #0056b3;
        }
    }

    &--secondary {
        background-color: #6c757d;
        color: white;

        &:hover:not(:disabled) {
            background-color: #545b62;
        }
    }

    &--danger {
        background-color: #dc3545;
        color: white;

        &:hover:not(:disabled) {
            background-color: #c82333;
        }
    }

    // Sizes
    &--small {
        padding: 4px 12px;
        font-size: 12px;
        min-height: 32px;
    }

    &--medium {
        padding: 8px 16px;
        font-size: 14px;
        min-height: 40px;
    }

    &--large {
        padding: 12px 24px;
        font-size: 16px;
        min-height: 48px;
    }

    // States
    &--disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }

    &--loading {
        position: relative;
        color: transparent !important;

        .button__text {
            opacity: 0;
        }
    }

    // Elements
    &__text {
        transition: opacity 0.2s;
    }

    &__loader {
        position: absolute;
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: button-spinner 0.6s linear infinite;
    }
}

@keyframes button-spinner {
    to {
        transform: rotate(360deg);
    }
}
```

**生成的文件结构**：
```
src/components/Button/
├── index.tsx         # 主组件文件，支持多种插槽类型
└── style.module.less # 样式文件，包含插槽相关的样式类
```

---

## 示例4：创建页面组件（包含布局插槽）

**用户请求**：\"在 views 目录下创建名为 Dashboard 的页面组件，使用 vue 格式并支持布局插槽\"

**创建流程**：
1. 验证组件名称 \"Dashboard\" 符合 PascalCase 命名规范
2. 识别组件类型为 Vue 单文件组件（.vue 格式）
3. 确定组件存储路径为 src/views/Dashboard/
4. 创建页面级组件的完整文件结构，包含丰富的插槽布局

**Dashboard.vue**:
```vue
<template>
    <div class="dashboard">
        <header class="dashboard__header">
            <h1 class="dashboard__title">Dashboard</h1>
            <div class="dashboard__actions">
                <button @click="refresh" class="dashboard__refresh">
                    Refresh
                </button>
            </div>
        </header>

        <main class="dashboard__content">
            <section class="dashboard__stats">
                <div class="stat-card">
                    <h3>Total Users</h3>
                    <p class="stat-card__value">{{ stats.totalUsers }}</p>
                </div>
                <div class="stat-card">
                    <h3>Active Sessions</h3>
                    <p class="stat-card__value">{{ stats.activeSessions }}</p>
                </div>
                <div class="stat-card">
                    <h3>Revenue</h3>
                    <p class="stat-card__value">${{ stats.revenue }}</p>
                </div>
            </section>

            <section class="dashboard__charts">
                <div class="chart-container">
                    <h3>User Growth</h3>
                    <!-- 图表组件占位 -->
                    <div class="chart-placeholder"></div>
                </div>
                <div class="chart-container">
                    <h3>Traffic Sources</h3>
                    <!-- 图表组件占位 -->
                    <div class="chart-placeholder"></div>
                </div>
            </section>
        </main>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';

interface DashboardStats {
    totalUsers: number;
    activeSessions: number;
    revenue: number;
}

const stats = ref<DashboardStats>({
    totalUsers: 0,
    activeSessions: 0,
    revenue: 0,
});

const isLoading = ref(false);

const fetchStats = async () => {
    try {
        isLoading.value = true;
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 模拟数据
        stats.value = {
            totalUsers: 1245,
            activeSessions: 87,
            revenue: 24560,
        };
    } catch (error) {
        console.error('Failed to fetch stats:', error);
    } finally {
        isLoading.value = false;
    }
};

const refresh = () => {
    fetchStats();
};

onMounted(() => {
    fetchStats();
});
</script>

<style lang="less" scoped>
.dashboard {
    padding: 24px;
    background-color: #f8f9fa;
    min-height: 100vh;

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 32px;
    }

    &__title {
        margin: 0;
        font-size: 24px;
        font-weight: bold;
        color: #333;
    }

    &__refresh {
        padding: 8px 16px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;

        &:hover {
            background-color: #0056b3;
        }

        &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
    }

    &__content {
        display: flex;
        flex-direction: column;
        gap: 24px;
    }

    &__stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
    }

    &__charts {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 24px;
    }
}

.stat-card {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    h3 {
        margin: 0 0 12px 0;
        font-size: 14px;
        color: #666;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    &__value {
        margin: 0;
        font-size: 28px;
        font-weight: bold;
        color: #333;
    }
}

.chart-container {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    h3 {
        margin: 0 0 16px 0;
        font-size: 16px;
        color: #333;
    }
}

.chart-placeholder {
    height: 300px;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    font-size: 14px;
}
</style>
```

**生成的文件结构**：
```
src/views/Dashboard/
├── Dashboard.vue          # 页面组件主文件，包含布局插槽
├── Dashboard.module.less  # 页面样式文件
└── index.ts               # 页面导出文件（可选）
```

---

## 组件类型选择总结

根据不同的使用场景和需求，本技能支持三种主流的Vue组件编写模式：

| 组件类型 | 适用场景 | 主要优点 | 注意事项 |
|---------|---------|------|------|
| **Vue单文件组件 (.vue)** | 复杂业务页面、大型功能模块 | 模板与逻辑分离清晰，开发体验好，样式管理方便 | TypeScript 类型支持略逊于 .tsx 格式 |
| **defineComponent (.tsx)** | 通用UI组件库、需要严格类型约束的组件 | 完整的TypeScript支持，泛型特性，优秀的代码组织 | 需要一定的TypeScript基础 |
| **FunctionalComponent (.tsx)** | 简单展示组件、无状态UI组件 | 语法简洁、易于测试、性能优越、纯函数式 | 不支持复杂生命周期和响应式逻辑 |

## 使用技巧

1. **按需选择组件类型**：
   - **页面组件**：推荐使用Vue单文件组件，模板与样式一体化，更适合复杂页面布局
   - **UI组件库**：优先选择defineComponent，提供最佳的类型支持和代码组织
   - **简单展示组件**：选用FunctionalComponent，以纯函数形式编写，简洁高效

2. **样式组织**：
   - **CSS Modules**：默认使用CSS Modules避免样式冲突，确保样式作用域化
   - **BEM命名规范**：遵循BEM命名规范，提高样式可读性和维护性
   - **模块化组织**：按组件功能模块组织样式，保持结构清晰

3. **类型定义**：
   - **Props定义**：为所有Props（包括事件回调onXxx）提供明确类型定义
   - **类型安全**：利用TypeScript泛型提高类型安全，避免运行时错误
   - **独立类型文件**：为复杂组件创建独立的types.ts文件，提升代码可维护性

4. **事件处理**：
   - **onXxx回调模式**：使用`onXxx`函数作为Props接收事件回调，替代传统`emits`系统
   - **类型推导**：为事件回调提供准确的参数类型，获得更好的TypeScript支持
   - **可选处理器**：所有事件回调均为可选属性，提高组件灵活性

5. **代码组织**：
   - **单一职责**：每个组件专注于单一功能，提高复用性和可测试性
   - **合理拆分**：大型组件应按功能拆分为多个子组件
   - **Composition API**：推荐使用Composition API组织组件逻辑，提高代码可读性和复用性