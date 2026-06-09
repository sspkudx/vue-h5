---
name: create-component
description: 在vue-h5项目中创建Vue组件，支持三种组件形式：.vue文件（script -> template -> style三段式）、tsx defineComponent形式、tsx FunctionalComponent形式。根据组件类型自动创建相应的文件结构和代码模板。使用当用户需要创建新的Vue组件、页面或视图时。
---

# 创建 Vue 组件

## 概述

本技能专为 vue-h5 项目设计，旨在快速高效地创建 Vue 组件。它支持三种主流组件编写模式，覆盖从简单展示组件到复杂业务组件的各种开发场景：

1. **Vue 单文件组件**（.vue 文件）：采用业界标准的 script -> template -> style 三段式结构，模板与逻辑分离清晰，适合构建复杂业务组件和页面
2. **TypeScript 组件**（.tsx 文件）：基于 defineComponent API 构建，提供完整的 TypeScript 类型支持，适用于需要严格类型约束和泛型参数的通用 UI 组件
3. **函数式组件**（.tsx 文件）：采用 FunctionalComponent 类型（简写为 FC），以纯函数形式编写，语法简洁、性能高效，特别适合无状态的纯展示组件

## 使用场景

本技能适用于多种 Vue 组件开发场景：

-   **快速创建新组件**：简化组件创建流程，自动生成标准化的文件结构和基础代码模板
-   **页面或视图开发**：快速搭建页面级组件，适用于路由视图或功能模块页面
-   **可复用 UI 组件开发**：构建高品质、可复用的 UI 组件库，提升开发效率
-   **规范统一**：确保团队所有组件遵循统一的代码规范和文件结构，降低维护成本
-   **类型安全开发**：生成具备完整 TypeScript 类型定义的组件，提升代码健壮性和可维护性
-   **CSS Modules 集成**：自动生成支持 CSS Modules 的样式文件，有效避免样式命名冲突

## 组件类型选择指南

### 1. Vue 单文件组件 (.vue 文件)

-   **适用场景**：复杂组件、带有模板逻辑的组件、需要分离样式和逻辑的组件
-   **特点**：script -> template -> style 三段式结构，易于维护，支持 Vue 模板语法
-   **推荐使用**：页面组件、包含复杂模板逻辑的组件

### 2. defineComponent 组件 (.tsx 文件)

-   **适用场景**：TypeScript 项目、需要类型安全的组件、需要泛型支持的组件
-   **特点**：使用 defineComponent 创建，支持泛型参数，类型安全
-   **推荐使用**：通用 UI 组件、需要复杂类型定义的组件

### 3. FunctionalComponent 组件 (.tsx 文件)

-   **适用场景**：简单组件、无状态组件、纯展示组件
-   **特点**：使用 FunctionalComponent 类型，简写为 FC，简洁明了
-   **推荐使用**：纯展示组件、无副作用的简单组件

## 创建流程

### 1. 获取组件信息

在创建组件前，需要从用户处获取以下信息：

-   **组件名称**（必需）：组件名称，遵循 PascalCase 命名规范（如：MyComponent）
-   **组件类型**（必需）：组件形式，可选值：vue、defineComponent、functional
-   **组件路径**（可选）：组件文件存储路径，默认为当前目录
-   **样式类型**（可选）：样式文件类型，可选值：less、css、scss，默认为 less
-   **是否创建样式文件**（可选）：是否创建配套的样式文件，默认为 true
-   **是否需要 CSS Modules**（可选）：是否使用 CSS Modules，默认为 true

### 2. 验证输入

验证组件名称：

-   必须符合 PascalCase 命名规范（首字母大写）
-   不能与现有组件重名
-   不能包含特殊字符

验证组件类型：

-   必须是有效的类型：vue、defineComponent、functional

验证组件路径：

-   路径必须存在
-   必须是有效的目录路径

### 3. 创建组件文件结构

根据选择的组件类型，创建相应的文件结构：

#### Vue 单文件组件 (.vue)

```
组件目录/
├── 组件名.vue
└── 组件名.module.less (如需要样式文件)
```

#### defineComponent 组件 (.tsx)

```
组件目录/
├── index.tsx
├── types.ts (可选，类型定义)
└── style.module.less (如需要样式文件)
```

#### FunctionalComponent 组件 (.tsx)

```
组件目录/
├── index.tsx
└── style.module.less (如需要样式文件)
```

### 4. 组件模板

#### Vue 单文件组件模板 (.vue 文件)

**模板结构**：

```vue
<script lang="ts" setup>
    import { ref, computed } from 'vue';

    // 组件逻辑

    // Props定义
    interface Props {
        // 定义props
        onClick?: (e: Event) => void;
        // 其他事件回调
    }

    // Slots类型定义（如需使用具名插槽）
    // interface Slots {
    //     default?: () => VNode[];
    //     header?: () => VNode[];
    //     footer?: () => VNode[];
    // }

    const props = defineProps<Props>();
    // const slots = defineSlots<Slots>(); // Vue 3.3+

    // 响应式数据
    const data = ref<string>('');

    // 计算属性
    const computedValue = computed(() => {
        return data.value.toUpperCase();
    });

    // 方法
    const handleClick = () => {
        if (props.onClick) {
            props.onClick(new Event('click'));
        }
    };
</script>

<template>
    <div class="component-name">
        <!-- 默认插槽 -->
        <slot v-if="$slots.default" />

        <!-- 具名插槽示例 -->
        <!-- <div class="component-name__header" v-if="$slots.header">
            <slot name="header" />
        </div> -->

        <!-- 组件内容 -->

        <!-- 作用域插槽示例 -->
        <!-- <slot name="content" :data="data" :computedValue="computedValue" /> -->
    </div>
</template>

<style lang="less" scoped>
    .component-name {
        // 组件样式
    }
</style>
```

**完整示例**：

```vue
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

<template>
    <div class="user-card">
        <img :src="avatar" class="user-card__avatar" alt="Avatar" />
        <div class="user-card__content">
            <h3 class="user-card__name">{{ name }}</h3>
            <p class="user-card__email">{{ email }}</p>
        </div>
        <button @click="handleClick" class="user-card__button">View Profile</button>
    </div>
</template>

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

#### defineComponent 组件模板 (.tsx 文件)

**模板结构**：

```tsx
import { defineComponent, ref, computed, type PropType } from 'vue';
import styles from './style.module.less';

interface Props {
    // Props定义
    onClick?: (e: Event) => void;
}

// Slots类型定义
// interface Slots {
//     default?: () => any;
//     header?: () => any;
//     footer?: () => any;
// }

const ComponentName = defineComponent({
    name: 'ComponentName',
    props: {
        onClick: {
            type: Function as PropType<(e: Event) => void>,
            default: undefined,
        },
    },
    // slots: {} as Slots, // 如果需要使用具名插槽，可以定义slots类型
    setup(props, { slots }) {
        // 响应式数据
        const data = ref<string>('');

        // 计算属性
        const computedValue = computed(() => {
            return data.value.toUpperCase();
        });

        // 方法
        const handleClick = () => {
            if (props.onClick) {
                props.onClick(new Event('click'));
            }
        };

        // 渲染函数
        return () => {
            return (
                <div class={styles.componentName} onClick={handleClick}>
                    {/* 默认插槽 */}
                    {slots.default?.()}

                    {/* 具名插槽示例 */}
                    {/* slots.header && (
                        <div class={styles.componentName__header}>
                            {slots.header()}
                        </div>
                    ) */}

                    {/* 组件内容 */}

                    {/* 作用域插槽示例 */}
                    {/* slots.content && slots.content({ data: data.value, computedValue: computedValue.value }) */}
                </div>
            );
        };
    },
});

export default ComponentName;
```

**带泛型的完整示例**：

```tsx
import { defineComponent, ref, computed, type PropType, type SetupContext } from 'vue';
import styles from './style.module.less';

interface User {
    id: number;
    name: string;
    email: string;
    avatar: string;
}

interface Props {
    user: User;
    isActive?: boolean;
    onClick?: (e: Event) => void;
    onViewProfile?: (id: number) => void;
}

const UserCard = defineComponent<Props>({
    name: 'UserCard',
    props: {
        user: {
            type: Object as PropType<User>,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: false,
        },
        onClick: {
            type: Function as PropType<(e: Event) => void>,
            default: undefined,
        },
        onViewProfile: {
            type: Function as PropType<(id: number) => void>,
            default: undefined,
        },
    },
    setup(props) {
        const isExpanded = ref(false);

        const statusText = computed(() => {
            return props.isActive ? 'Active' : 'Inactive';
        });

        const handleClick = (e: Event) => {
            if (props.onClick) {
                props.onClick(e);
            }
            if (props.onViewProfile) {
                props.onViewProfile(props.user.id);
            }
        };

        const toggleExpand = () => {
            isExpanded.value = !isExpanded.value;
        };

        return () => {
            const { user } = props;
            return (
                <div class={styles.userCard}>
                    <img src={user.avatar} class={styles.userCard__avatar} alt="Avatar" />
                    <div class={styles.userCard__content}>
                        <h3 class={styles.userCard__name}>{user.name}</h3>
                        <p class={styles.userCard__email}>{user.email}</p>
                        <span class={styles.userCard__status}>{statusText.value}</span>
                    </div>
                    <button onClick={handleClick} class={styles.userCard__button}>
                        View Profile
                    </button>
                    {isExpanded.value && (
                        <div class={styles.userCard__details}>
                            <p>User ID: {user.id}</p>
                            <p>Status: {statusText.value}</p>
                        </div>
                    )}
                </div>
            );
        };
    },
});

export default UserCard;
```

#### FunctionalComponent 组件模板 (.tsx 文件)

**模板结构**：

```tsx
import { type FunctionalComponent as FC, type PropType } from 'vue';
import styles from './style.module.less';

interface Props {
    // Props定义
    onClick?: (e: Event) => void;
}

// Slots类型定义
// interface Slots {
//     default?: () => any;
//     header?: () => any;
//     footer?: () => any;
// }

const ComponentName: FC<Props> = (props, { slots }) => {
    // 组件逻辑
    const {
        /* 解构props */
    } = props;

    const handleClick = () => {
        if (props.onClick) {
            props.onClick(new Event('click'));
        }
    };

    return (
        <div class={styles.componentName} onClick={handleClick}>
            {/* 默认插槽 */}
            {slots.default?.()}

            {/* 具名插槽示例 */}
            {/* slots.header && (
                <div class={styles.componentName__header}>
                    {slots.header()}
                </div>
            ) */}

            {/* 组件内容 */}

            {/* 作用域插槽示例 */}
            {/* slots.content && slots.content({}) */}
        </div>
    );
};

// Props定义
ComponentName.props = {
    onClick: {
        type: Function as PropType<(e: Event) => void>,
        default: undefined,
    },
};

// Slots定义（如果需要使用具名插槽）
// ComponentName.slots = {} as Slots;

export default ComponentName;
```

**完整示例**：

```tsx
import { type FunctionalComponent as FC, type PropType } from 'vue';
import styles from './style.module.less';

interface ButtonProps {
    type?: 'primary' | 'secondary' | 'danger';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    onClick?: () => void;
    children?: string;
}

const Button: FC<ButtonProps> = props => {
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

### 5. 样式文件模板

#### CSS Modules 样式文件 (.module.less)

```less
// 组件根类名
.componentName {
    // 组件基础样式

    // BEM命名规范的修饰符
    &--modifier {
        // 修饰符样式
    }

    // 子元素
    &__element {
        // 子元素样式

        // 子元素修饰符
        &--modifier {
            // 子元素修饰符样式
        }
    }

    // 插槽样式示例
    &__slot {
        // 插槽容器样式
    }
}

// 响应式设计示例
@media (max-width: 768px) {
    .componentName {
        // 移动端样式
    }
}

// 动画示例
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
```

**完整示例**：

```less
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

    &--active {
        border-color: #007bff;
        background-color: #f8f9fa;
    }

    &--disabled {
        opacity: 0.6;
        cursor: not-allowed;
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

    &__status {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 12px;
        margin-top: 4px;

        &--active {
            background-color: #d4edda;
            color: #155724;
        }

        &--inactive {
            background-color: #f8d7da;
            color: #721c24;
        }
    }

    &__button {
        padding: 8px 16px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;

        &:hover:not(:disabled) {
            background-color: #0056b3;
        }

        &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
    }

    &__details {
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid #eee;
        font-size: 12px;
        color: #666;
    }
}

// 响应式设计
@media (max-width: 768px) {
    .userCard {
        flex-direction: column;
        text-align: center;

        &__avatar {
            margin-right: 0;
            margin-bottom: 12px;
        }

        &__button {
            margin-top: 12px;
            width: 100%;
        }
    }
}
```

### 6. 类型定义文件模板

#### types.ts 文件（可选）

```typescript
// 组件Props类型定义
export interface 组件名Props {
    // Props定义
    onClick?: (e: Event) => void;
    // 其他事件回调定义
}

// 组件内部状态类型（仅用于组件内部管理）
export interface 组件名State {
    // 内部状态定义
}

// 组件配置选项（如需暴露给外部使用）
export interface 组件名Options {
    // 配置选项定义
}

// 组件数据模型（用于复杂数据结构）
export interface 组件名Model {
    // 数据模型定义
}
```

### 7. 索引文件模板

#### index.ts 文件（可选，用于组件导出）

```typescript
// 组件导出
export { default as ComponentName } from './ComponentName';

// 类型导出
export type * from './types';

// 工具函数导出（如果有的话）
// export * from './utils';
```

## 使用示例

### 示例 1：创建 Vue 单文件组件

**用户输入**: "创建名为 UserCard 的 Vue 组件，使用.vue 格式"

**处理步骤**:

1. 验证"UserCard"符合命名规范
2. 确定组件类型为 vue
3. 创建 UserCard.vue 文件
4. 创建 UserCard.module.less 样式文件
5. 填充 Vue 单文件组件模板
6. 填充样式文件模板

**生成的文件结构**:

```
src/components/UserCard/
├── UserCard.vue
└── UserCard.module.less
```

### 示例 2：创建 defineComponent 组件

**用户输入**: "创建名为 Modal 的 tsx 组件，使用 defineComponent，需要泛型支持"

**处理步骤**:

1. 验证"Modal"符合命名规范
2. 确定组件类型为 defineComponent
3. 创建 index.tsx 文件
4. 创建 types.ts 文件
5. 创建 style.module.less 样式文件
6. 填充 defineComponent 模板，包含泛型定义

**生成的文件结构**:

```
src/components/Modal/
├── index.tsx
├── types.ts
└── style.module.less
```

### 示例 3：创建 FunctionalComponent 组件

**用户输入**: "创建名为 Button 的函数式组件，使用 FC 类型"

**处理步骤**:

1. 验证"Button"符合命名规范
2. 确定组件类型为 functional
3. 创建 index.tsx 文件
4. 创建 style.module.less 样式文件
5. 填充 FunctionalComponent 模板

**生成的文件结构**:

```
src/components/Button/
├── index.tsx
└── style.module.less
```

### 示例 4：创建页面组件

**用户输入**: "在 views 目录下创建名为 Dashboard 的页面组件，使用 vue 格式"

**处理步骤**:

1. 验证"Dashboard"符合命名规范
2. 确定组件类型为 vue
3. 确定路径为 src/views/Dashboard/
4. 创建 Dashboard.vue 文件
5. 创建 Dashboard.module.less 样式文件
6. 填充 Vue 单文件组件模板（页面级组件）

**生成的文件结构**:

```
src/views/Dashboard/
├── Dashboard.vue
└── Dashboard.module.less
```

## 最佳实践

### 1. 命名规范

-   **组件名**: PascalCase（如：UserCard, Modal, Button）
-   **文件命名**: 组件名.vue 或 index.tsx
-   **样式文件**: 组件名.module.less
-   **类型文件**: types.ts

### 2. 组件结构

-   **Vue 组件**: 遵循 script -> template -> style 三段式
-   **TypeScript 组件**: 使用 defineComponent 或 FunctionalComponent
-   **样式**: 使用 CSS Modules 和 BEM 命名规范
-   **类型**: 使用 TypeScript 类型定义

### 3. Props 定义

-   使用 TypeScript 接口定义 Props 类型
-   为可选 Props 提供默认值
-   使用 PropType 进行复杂类型定义

### 4. 事件处理

-   使用 `onXxx` 函数作为 Props 接收事件回调，替代传统的 `emits` 系统
-   为事件回调提供完整的参数类型定义，确保类型安全
-   支持可选的事件处理器，方便组件的灵活使用

### 5. 样式组织

-   使用 BEM 命名规范
-   使用 CSS Modules 避免样式冲突
-   支持响应式设计
-   按功能模块组织样式

### 6. 组件复用

-   通用组件放在 components 目录
-   页面组件放在 views 目录
-   布局组件放在 layout 目录
-   工具组件放在 utils 目录

## 注意事项

### 1. 组件命名

-   必须使用 PascalCase 命名
-   避免使用 HTML 元素名（如：div, span）
-   避免使用 Vue 内置组件名（如：Transition, KeepAlive）

### 2. 路径处理

-   确保目标目录存在
-   避免在系统目录中创建组件
-   支持相对路径和绝对路径

### 3. 文件冲突

-   检查目标文件是否已存在
-   提示用户是否覆盖现有文件
-   提供重命名选项

### 4. 样式处理

-   默认使用 less 预处理器
-   支持 CSS Modules
-   自动生成 BEM 样式的类名

### 5. 类型安全

-   所有组件都必须具备完整的 TypeScript 类型定义
-   采用严格模式确保类型安全
-   为事件回调（onXxx）提供准确的参数类型验证
-   支持泛型参数以满足复杂类型需求

## 错误处理

-   **组件名无效**: 提示用户使用 PascalCase 命名规范
-   **组件类型无效**: 提示用户选择有效的组件类型（vue, defineComponent, functional）
-   **路径不存在**: 创建目录或提示用户提供有效路径
-   **文件已存在**: 提示用户是否覆盖或选择其他名称
-   **样式类型不支持**: 提示用户选择支持的样式类型（less, css, scss）

## 完成后的操作建议

创建完成后，建议用户：

1. **检查组件结构**: 确认文件结构正确
2. **填充业务逻辑**: 根据实际需求修改组件逻辑
3. **调整样式**: 根据设计需求调整样式
4. **添加测试**: 为组件添加单元测试
5. **文档说明**: 添加组件使用说明

## 模板变量说明

在模板中使用的变量说明：

| 变量名              | 说明               | 示例                       |
| ------------------- | ------------------ | -------------------------- |
| `组件名`            | 用户输入的组件名称 | `UserCard`                 |
| `组件目录`          | 组件所在目录       | `src/components/UserCard/` |
| `style.module.less` | 样式文件名         | `UserCard.module.less`     |
| `types.ts`          | 类型定义文件名     | `types.ts`                 |

## 与现有项目集成

创建的组件会自动与现有项目配置集成：

1. **TypeScript 配置**: 支持 tsconfig.json 中的路径映射
2. **CSS Modules**: 自动使用项目配置的 localIdentName
3. **代码规范**: 遵循项目的 ESLint 和 Prettier 配置
4. **构建配置**: 使用项目的 Vue CLI 配置

---

## 组件类型选择建议

基于项目实践，我们建议根据以下原则选择合适的组件类型：

-   **复杂业务组件/页面**：优先使用 Vue 单文件组件（.vue 格式），因其模板与逻辑分离清晰，更适合复杂业务场景
-   **通用 UI 组件库**：推荐使用 defineComponent（.tsx 格式），提供完整的 TypeScript 类型支持和泛型特性
-   **简单展示组件**：选用 FunctionalComponent（.tsx 格式），语法简洁、性能优越，特别适合无状态的纯展示组件

**重要说明**: 本技能默认采用 `onXxx` 函数作为事件回调模式，替代传统的 `emits` 系统。这种模式更符合 React 开发者的习惯，代码结构更清晰，类型推导更直观。
