---
name: create-component
description: 在vue-h5项目中创建Vue组件，支持三种组件形式：.vue文件（script -> template -> style三段式）、tsx defineComponent形式、tsx FunctionalComponent形式。根据组件类型自动创建相应的文件结构和代码模板。使用当用户需要创建新的Vue组件、页面或视图时。
---

# 创建Vue组件

## 概述

此技能用于在vue-h5项目中创建Vue组件，支持三种不同的组件形式：
1. **Vue单文件组件**（.vue文件）：script -> template -> style三段式结构
2. **TypeScript组件**（.tsx文件）：使用defineComponent创建，支持泛型参数
3. **函数式组件**（.tsx文件）：使用FunctionalComponent类型，简写为FC

## 使用场景

- 用户需要创建新的Vue组件
- 用户需要创建新的页面或视图组件
- 用户需要创建可复用的UI组件
- 用户需要根据项目规范创建标准化的组件文件
- 用户需要创建带有类型定义和样式文件的组件

## 组件类型选择指南

### 1. Vue单文件组件 (.vue文件)
- **适用场景**：复杂组件、带有模板逻辑的组件、需要分离样式和逻辑的组件
- **特点**：script -> template -> style三段式结构，易于维护，支持Vue模板语法
- **推荐使用**：页面组件、包含复杂模板逻辑的组件

### 2. defineComponent组件 (.tsx文件)
- **适用场景**：TypeScript项目、需要类型安全的组件、需要泛型支持的组件
- **特点**：使用defineComponent创建，支持泛型参数，类型安全
- **推荐使用**：通用UI组件、需要复杂类型定义的组件

### 3. FunctionalComponent组件 (.tsx文件)
- **适用场景**：简单组件、无状态组件、纯展示组件
- **特点**：使用FunctionalComponent类型，简写为FC，简洁明了
- **推荐使用**：纯展示组件、无副作用的简单组件

## 创建流程

### 1. 获取组件信息

在创建组件前，需要从用户处获取以下信息：
- **组件名称**（必需）：组件名称，遵循PascalCase命名规范（如：MyComponent）
- **组件类型**（必需）：组件形式，可选值：vue、defineComponent、functional
- **组件路径**（可选）：组件文件存储路径，默认为当前目录
- **样式类型**（可选）：样式文件类型，可选值：less、css、scss，默认为less
- **是否创建样式文件**（可选）：是否创建配套的样式文件，默认为true
- **是否需要CSS Modules**（可选）：是否使用CSS Modules，默认为true

### 2. 验证输入

验证组件名称：
- 必须符合PascalCase命名规范（首字母大写）
- 不能与现有组件重名
- 不能包含特殊字符

验证组件类型：
- 必须是有效的类型：vue、defineComponent、functional

验证组件路径：
- 路径必须存在
- 必须是有效的目录路径

### 3. 创建组件文件结构

根据选择的组件类型，创建相应的文件结构：

#### Vue单文件组件 (.vue)
```
组件目录/
├── 组件名.vue
└── 组件名.module.less (如需要样式文件)
```

#### defineComponent组件 (.tsx)
```
组件目录/
├── index.tsx
├── types.ts (可选，类型定义)
└── style.module.less (如需要样式文件)
```

#### FunctionalComponent组件 (.tsx)
```
组件目录/
├── index.tsx
└── style.module.less (如需要样式文件)
```

### 4. 组件模板

#### Vue单文件组件模板 (.vue文件)

**模板结构**：
```vue
<template>
    <div class="组件名">
        <!-- 组件内容 -->
    </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';

// 组件逻辑

// Props定义
interface Props {
    // 定义props
}

// 事件定义
interface Emits {
    // 定义emits
}

// Props接收
const props = defineProps<Props>();

// Emits定义
const emit = defineEmits<Emits>();

// 响应式数据
const data = ref<string>('');

// 计算属性
const computedValue = computed(() => {
    return data.value.toUpperCase();
});

// 方法
const handleClick = () => {
    emit('click');
};
</script>

<style lang="less" scoped>
.组件名 {
    // 组件样式
}
</style>
```

**完整示例**：
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

#### defineComponent组件模板 (.tsx文件)

**模板结构**：
```tsx
import { defineComponent, ref, computed, type PropType } from 'vue';
import styles from './style.module.less';

const 组件名 = defineComponent({
    name: '组件名',
    props: {
        // Props定义
    },
    emits: {
        // Emits定义
    },
    setup(props, { emit }) {
        // 响应式数据
        const data = ref<string>('');
        
        // 计算属性
        const computedValue = computed(() => {
            return data.value.toUpperCase();
        });

        // 方法
        const handleClick = () => {
            emit('click');
        };

        // 渲染函数
        return () => {
            return (
                <div class={styles.组件名}>
                    {/* 组件内容 */}
                </div>
            );
        };
    },
});

export default 组件名;
```

**带泛型的完整示例**：
```tsx
import { defineComponent, ref, computed, type PropType } from 'vue';
import type { SetupContext } from 'vue';
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
    onViewProfile?: (id: number) => void;
}

interface Emits {
    click: () => void;
    viewProfile: [id: number];
}

const UserCard = defineComponent<Props, Emits>({
    name: 'UserCard',
    props: {
        user: {
            type: Object as PropType<User>,
            required: true,
        },
        isActive: {
            type: Boolean as PropType<boolean>,
            default: false,
        },
        onViewProfile: {
            type: Function as PropType<(id: number) => void>,
            default: undefined,
        },
    },
    emits: {
        click: () => true,
        viewProfile: (id: number) => typeof id === 'number',
    },
    setup(props, { emit }: SetupContext<Emits>) {
        const isExpanded = ref(false);

        const statusText = computed(() => {
            return props.isActive ? 'Active' : 'Inactive';
        });

        const handleClick = () => {
            emit('click');
            if (props.onViewProfile) {
                props.onViewProfile(props.user.id);
            }
            emit('viewProfile', props.user.id);
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

#### FunctionalComponent组件模板 (.tsx文件)

**模板结构**：
```tsx
import { type FC } from 'vue';
import styles from './style.module.less';

interface Props {
    // Props定义
}

const 组件名: FC<Props> = (props) => {
    // 组件逻辑
    const { /* 解构props */ } = props;

    return (
        <div class={styles.组件名}>
            {/* 组件内容 */}
        </div>
    );
};

组件名.props = {
    // Props验证
};

组件名.emits = {
    // Emits定义
};

export default 组件名;
```

**完整示例**：
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

### 5. 样式文件模板

#### CSS Modules样式文件 (.module.less)
```less
// 组件根类名
.组件名 {
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
}

// 响应式设计示例
@media (max-width: 768px) {
    .组件名 {
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
.userCard {
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

#### types.ts文件（可选）
```typescript
// 组件Props类型定义
export interface 组件名Props {
    // Props定义
}

// 组件事件定义
export interface 组件名Emits {
    // Emits定义
}

// 组件状态类型
export interface 组件名State {
    // 状态定义
}

// 组件配置选项
export interface 组件名Options {
    // 配置选项
}

// 组件数据模型
export interface 组件名Model {
    // 数据模型
}
```

### 7. 索引文件模板

#### index.ts文件（可选，用于组件导出）
```typescript
// 组件导出
export { default } from './组件名';

// 类型导出
export type * from './types';

// 工具函数导出（如果有的话）
// export * from './utils';
```

## 使用示例

### 示例1：创建Vue单文件组件

**用户输入**: "创建名为UserCard的Vue组件，使用.vue格式"

**处理步骤**:
1. 验证"UserCard"符合命名规范
2. 确定组件类型为vue
3. 创建UserCard.vue文件
4. 创建UserCard.module.less样式文件
5. 填充Vue单文件组件模板
6. 填充样式文件模板

**生成的文件结构**:
```
src/components/UserCard/
├── UserCard.vue
└── UserCard.module.less
```

### 示例2：创建defineComponent组件

**用户输入**: "创建名为Modal的tsx组件，使用defineComponent，需要泛型支持"

**处理步骤**:
1. 验证"Modal"符合命名规范
2. 确定组件类型为defineComponent
3. 创建index.tsx文件
4. 创建types.ts文件
5. 创建style.module.less样式文件
6. 填充defineComponent模板，包含泛型定义

**生成的文件结构**:
```
src/components/Modal/
├── index.tsx
├── types.ts
└── style.module.less
```

### 示例3：创建FunctionalComponent组件

**用户输入**: "创建名为Button的函数式组件，使用FC类型"

**处理步骤**:
1. 验证"Button"符合命名规范
2. 确定组件类型为functional
3. 创建index.tsx文件
4. 创建style.module.less样式文件
5. 填充FunctionalComponent模板

**生成的文件结构**:
```
src/components/Button/
├── index.tsx
└── style.module.less
```

### 示例4：创建页面组件

**用户输入**: "在views目录下创建名为Dashboard的页面组件，使用vue格式"

**处理步骤**:
1. 验证"Dashboard"符合命名规范
2. 确定组件类型为vue
3. 确定路径为src/views/Dashboard/
4. 创建Dashboard.vue文件
5. 创建Dashboard.module.less样式文件
6. 填充Vue单文件组件模板（页面级组件）

**生成的文件结构**:
```
src/views/Dashboard/
├── Dashboard.vue
└── Dashboard.module.less
```

## 最佳实践

### 1. 命名规范
- **组件名**: PascalCase（如：UserCard, Modal, Button）
- **文件命名**: 组件名.vue 或 index.tsx
- **样式文件**: 组件名.module.less
- **类型文件**: types.ts

### 2. 组件结构
- **Vue组件**: 遵循script -> template -> style三段式
- **TypeScript组件**: 使用defineComponent或FunctionalComponent
- **样式**: 使用CSS Modules和BEM命名规范
- **类型**: 使用TypeScript类型定义

### 3. Props定义
- 使用TypeScript接口定义Props类型
- 为可选Props提供默认值
- 使用PropType进行复杂类型定义

### 4. Emits定义
- 使用TypeScript接口定义Emits类型
- 为事件提供参数类型验证

### 5. 样式组织
- 使用BEM命名规范
- 使用CSS Modules避免样式冲突
- 支持响应式设计
- 按功能模块组织样式

### 6. 组件复用
- 通用组件放在components目录
- 页面组件放在views目录
- 布局组件放在layout目录
- 工具组件放在utils目录

## 注意事项

### 1. 组件命名
- 必须使用PascalCase命名
- 避免使用HTML元素名（如：div, span）
- 避免使用Vue内置组件名（如：Transition, KeepAlive）

### 2. 路径处理
- 确保目标目录存在
- 避免在系统目录中创建组件
- 支持相对路径和绝对路径

### 3. 文件冲突
- 检查目标文件是否已存在
- 提示用户是否覆盖现有文件
- 提供重命名选项

### 4. 样式处理
- 默认使用less预处理器
- 支持CSS Modules
- 自动生成BEM样式的类名

### 5. 类型安全
- 所有组件都需要类型定义
- 使用TypeScript严格模式
- 为事件提供参数类型验证

## 错误处理

- **组件名无效**: 提示用户使用PascalCase命名规范
- **组件类型无效**: 提示用户选择有效的组件类型（vue, defineComponent, functional）
- **路径不存在**: 创建目录或提示用户提供有效路径
- **文件已存在**: 提示用户是否覆盖或选择其他名称
- **样式类型不支持**: 提示用户选择支持的样式类型（less, css, scss）

## 完成后的操作建议

创建完成后，建议用户：

1. **检查组件结构**: 确认文件结构正确
2. **填充业务逻辑**: 根据实际需求修改组件逻辑
3. **调整样式**: 根据设计需求调整样式
4. **添加测试**: 为组件添加单元测试
5. **文档说明**: 添加组件使用说明

## 模板变量说明

在模板中使用的变量说明：

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `组件名` | 用户输入的组件名称 | `UserCard` |
| `组件目录` | 组件所在目录 | `src/components/UserCard/` |
| `style.module.less` | 样式文件名 | `UserCard.module.less` |
| `types.ts` | 类型定义文件名 | `types.ts` |

## 与现有项目集成

创建的组件会自动与现有项目配置集成：

1. **TypeScript配置**: 支持tsconfig.json中的路径映射
2. **CSS Modules**: 自动使用项目配置的localIdentName
3. **代码规范**: 遵循项目的ESLint和Prettier配置
4. **构建配置**: 使用项目的Vue CLI配置

---

**提示**: 根据项目需求选择合适的组件类型：
- 复杂业务组件建议使用Vue单文件组件
- 通用UI组件建议使用defineComponent
- 简单展示组件建议使用FunctionalComponent