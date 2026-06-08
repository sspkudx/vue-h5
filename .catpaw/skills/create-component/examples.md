# Create Component 技能使用示例

## 示例1：创建Vue单文件组件

**用户输入**: "创建名为UserCard的Vue组件，使用.vue格式"

**处理过程**：
1. 验证组件名称"UserCard"符合PascalCase规范
2. 识别组件类型为vue单文件组件
3. 确定组件路径为当前目录（或用户指定路径）
4. 创建以下文件：

**UserCard.vue**:
```vue
<template>
    <div class="user-card">
        <img :src="avatar" class="user-card__avatar" alt="Avatar" />
        <div class="user-card__content">
            <h3 class="user-card__name">{{ name }}</h3>
            <p class="user-card__email">{{ email }}</p>
        </div>
        <button @click="handleClick" class="user-card__button">
            View Profile
        </button>
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
}

interface Emits {
    (e: 'view-profile', id: number): void;
    (e: 'click'): void;
}

const props = withDefaults(defineProps<Props>(), {
    isActive: false,
});

const emit = defineEmits<Emits>();

const isExpanded = ref(false);

const statusText = computed(() => {
    return props.isActive ? 'Active' : 'Inactive';
});

const handleClick = () => {
    emit('view-profile', props.id);
    emit('click');
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

**生成的文件结构**:
```
src/components/UserCard/
├── UserCard.vue
└── UserCard.module.less
```

---

## 示例2：创建defineComponent组件

**用户输入**: "创建名为Modal的tsx组件，使用defineComponent，需要泛型支持"

**处理过程**：
1. 验证组件名称"Modal"符合PascalCase规范
2. 识别组件类型为defineComponent
3. 创建index.tsx、types.ts和样式文件

**index.tsx**:
```tsx
import { defineComponent, ref, computed, type PropType } from 'vue';
import type { SetupContext } from 'vue';
import styles from './style.module.less';

interface ModalProps {
    title: string;
    visible: boolean;
    onClose?: () => void;
    onConfirm?: () => void;
}

interface ModalEmits {
    close: () => void;
    confirm: () => void;
}

const Modal = defineComponent<ModalProps, ModalEmits>({
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
    emits: {
        close: () => true,
        confirm: () => true,
    },
    setup(props, { emit }: SetupContext<ModalEmits>) {
        const isAnimating = ref(false);

        const handleClose = () => {
            if (props.onClose) {
                props.onClose();
            }
            emit('close');
        };

        const handleConfirm = () => {
            if (props.onConfirm) {
                props.onConfirm();
            }
            emit('confirm');
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
                            <slot />
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

export interface ModalEmits {
    close: () => void;
    confirm: () => void;
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

**生成的文件结构**:
```
src/components/Modal/
├── index.tsx
├── types.ts
└── style.module.less
```

---

## 示例3：创建FunctionalComponent组件

**用户输入**: "创建名为Button的函数式组件，使用FC类型"

**处理过程**：
1. 验证组件名称"Button"符合PascalCase规范
2. 识别组件类型为functional
3. 创建index.tsx和样式文件

**index.tsx**:
```tsx
import { type FC } from 'vue';
import styles from './style.module.less';

interface ButtonProps {
    type?: 'primary' | 'secondary' | 'danger';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    onClick?: () => void;
    children?: string;
}

const Button: FC<ButtonProps> = (props) => {
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
            {loading ? (
                <span class={styles.button__loader}></span>
            ) : (
                <span class={styles.button__text}>{children}</span>
            )}
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
        type: Function,
        default: undefined,
    },
    children: {
        type: String,
        default: 'Button',
    },
};

Button.emits = {
    click: () => true,
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

**生成的文件结构**:
```
src/components/Button/
├── index.tsx
└── style.module.less
```

---

## 示例4：创建页面组件

**用户输入**: "在views目录下创建名为Dashboard的页面组件，使用vue格式"

**处理过程**：
1. 验证组件名称"Dashboard"符合PascalCase规范
2. 识别组件类型为vue单文件组件
3. 确定路径为src/views/Dashboard/
4. 创建页面级组件

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

**生成的文件结构**:
```
src/views/Dashboard/
├── Dashboard.vue
└── Dashboard.module.less
```

---

## 组件类型选择总结

| 组件类型 | 适用场景 | 优点 | 缺点 |
|---------|---------|------|------|
| **Vue单文件组件 (.vue)** | 复杂页面、业务组件 | 模板清晰、样式分离、易于维护 | 类型支持不如.tsx |
| **defineComponent (.tsx)** | 通用UI组件、需要类型安全 | 类型安全、泛型支持、代码组织好 | 学习成本稍高 |
| **FunctionalComponent (.tsx)** | 简单组件、无状态组件 | 简洁、易于测试、纯函数式 | 不支持复杂逻辑和生命周期 |

## 使用技巧

1. **按需选择组件类型**：
   - 页面组件：使用Vue单文件组件
   - UI组件库：使用defineComponent
   - 简单展示组件：使用FunctionalComponent

2. **样式组织**：
   - 使用CSS Modules避免冲突
   - 遵循BEM命名规范
   - 按组件功能组织样式

3. **类型定义**：
   - 为Props和Emits定义明确类型
   - 使用TypeScript泛型提高类型安全
   - 为复杂组件创建独立的types.ts文件

4. **代码组织**：
   - 保持组件单一职责
   - 合理拆分大型组件
   - 使用Composition API组织逻辑