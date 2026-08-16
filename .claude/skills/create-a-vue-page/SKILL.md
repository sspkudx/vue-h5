---
name: create-a-vue-page
description: 在 Vue H5 应用的 views 目录下创建页面组件，支持 TypeScript JSX (tsx) 和 Vue 单文件组件 (.vue) 两种创建方式。
---

# 创建 Vue 页面

## 概述

此技能用于在 vue-h5 项目的应用 views 目录下创建新的页面组件。支持两种创建方式：TypeScript JSX (tsx) 和 Vue 单文件组件 (.vue)，开发者可以根据需求选择。

## 使用场景

-   用户需要在应用中添加新的页面
-   用户需要选择页面组件的实现方式（tsx 或 vue）
-   用户需要在指定应用中创建页面
-   用户需要快速生成标准的页面组件结构

## 创建流程

### 1. 获取页面信息

在创 �� 页面前，需要从用户处获取以下信息：

-   **页面名称** (必需): 页面的名称，将用于组件名称和目录名称
-   **目标应用** (可选): 指定在哪个应用中创建页面，默认为 example-app
-   **页面类型** (可选): 选择页面类型
    -   `tsx`: TypeScript JSX 方式
    -   `vue`: Vue 单文件组件方式
    -   默认为 `vue` 以鼓励新用户使用现代 Vue 开发方式

### 2. 验证输入

验证页面名称：

-   必须符合 PascalCase 命名规范（首字母大写，无下划线）
-   不能与现有页面重名
-   长度适中（建议 2-30 个字符）

验证目标应用：

-   必须存在于 apps 目录中
-   应用目录结构必须完整

验证页面类型：

-   只接受 `tsx` 或 `vue` 两种类型

### 3. 创建页面组件

根据选择的类型创建对应的页面结构：

#### 对于 tsx 类型

目录结构为：

```
views/{PageName}/
├── index.tsx
└── style.module.less
```

#### 对于 vue 类型

目录结构为：

```
views/{PageName}/
└── {PageName}.vue
```

### 4. 更新路由配置

自动更新目标应用的 `src/router/index.ts` 文件：

1. 添加新的路由配置
2. 保持路由配置文件语法正确
3. 确保路由路径符合命名规范（小写和连字符）

## 文件模板

### tsx 页面模板

#### views/{PageName}/index.tsx

```tsx
import { defineComponent } from 'vue';
import styles from './style.module.less';

const { PageName } = defineComponent({
    name: '{PageName}',
    setup() {
        const render = () => {
            return (
                <div class={styles.container}>
                    <h1>{PageName} Page</h1>
                    <p>Welcome to the {PageName} page!</p>
                </div>
            );
        };
        return render;
    },
});

export default { PageName };
```

### Vue 页面模板

#### views/{PageName}/{PageName}.vue

```vue
<script lang="ts" setup>
import { ref } from 'vue';

const title = ref('{PageName}');
const welcomeMessage = ref(`Welcome to the {PageName} page!`);
</script>

<template>
    <div class="container">
        <h1 class="title">{{ title }}</h1>
        <p class="message">{{ welcomeMessage }}</p>
    </div>
</template>

<style lang="less" scoped>
.container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;

    .title {
        color: #333;
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 15px;
    }

    .message {
        color: #666;
        font-size: 16px;
        line-height: 1.5;
    }
}
</style>
```

## 路由配置示例

### tsx 页面路由配置

在 `src/router/index.ts` 中添加：

```typescript
{
    path: '/{page-name}',
    name: '{PageName}',
    component() {
        return import(/* webpackChunkName: "{PageName}" */ '../views/{PageName}/index');
    },
},
```

### Vue 页面路由配置

在 `src/router/index.ts` 中添加：

```typescript
{
    path: '/{page-name}',
    name: '{PageName}',
    component() {
        return import(/* webpackChunkName: "{PageName}" */ '../views/{PageName}/{PageName}.vue');
    },
},
```

## 示例

### 示例 1：在 example-app 中创建 Vue 页面

**用户输入**: "创建名为 UserProfile 的页面"

**处理步骤**:

1. 验证"UserProfile"符合命名规范
2. 验证 example-app 应用存在
3. 创建目录结构 `apps/example-app/src/views/UserProfile/`
4. 创建 `UserProfile.vue` 文件（包含脚本、模板和样式）
5. 更新 `src/router/index.ts`，添加路由配置：
    ```typescript
    {
        path: '/user-profile',
        name: 'UserProfile',
        component() {
            return import(/* webpackChunkName: "UserProfile" */ '../views/UserProfile/UserProfile.vue');
        },
    }
    ```

### 示例 2：在指定应用中创建 tsx 页面

**用户输入**: "在 my-app 中创建名为 Settings 的页面，使用 tsx 方式"

**处理步骤**:

1. 验证"Settings"符合命名规范
2. 验证 my-app 应用存在
3. 创建目录结构 `apps/my-app/src/views/Settings/`
4. 创建 `index.tsx` 文件
5. 创建 `style.module.less` 文件
6. 更新 `src/router/index.ts`，添加路由配置：
    ```typescript
    {
        path: '/settings',
        name: 'Settings',
        component() {
            return import(/* webpackChunkName: "Settings" */ '../views/Settings/index');
        },
    }
    ```

### 示例 3：创建复杂页面

**用户输入**: "创建名为 Dashboard 的页面，使用 vue 方式"

**处理步骤**:

1. 验证"Dashboard"符合命名规范
2. 创建目录结构 `apps/example-app/src/views/Dashboard/`
3. 创建基础 Vue 单文件组件
4. 更新路由配置

## 转换规则

### 页面名称转换

-   **输入**: UserProfile
-   **组件目录**: UserProfile
-   **Vue 文件名**: UserProfile.vue
-   **路由名称**: UserProfile
-   **路由路径**: user-profile

### 路由名称转换

-   UserProfile → user-profile
-   Dashboard → dashboard
-   Settings → settings

## 注意事项

1. **命名规范**: 页面名称必须使用 PascalCase 格式（如 UserProfile）
2. **目录结构**: 每种类型都有固定的目录结构
3. **路由更新**: 会自动更新路由配置，确保语法正确
4. **路由冲突**: 检查路由路径是否已被使用
5. **应用支持**: 页面必须在已存在的应用中创建
6. **默认类型**: 如果不指定类型，默认为 vue

## 错误处理

-   **页面名称已存在**: 提示用户选择其他名称
-   **目标应用不存在**: 提示用户先创建应用或选择其他应用
-   **路径冲突**: 检查路由路径是否已被其他页面使用
-   **目录创建失败**: 检查文件权限
-   **路由更新失败**: 检查路由文件是否存在或语法是否正确

## 使用建议

1. **新页面推荐**: 建议使用 vue 类型，因为它更现代且易于维护
2. **状态管理**: 如果页面需要状态管理，可以在组件中添加 Pinia store
3. **样式规范**: tsx 页面使用 CSS Modules 避免样式冲突，vue 页面使用 scoped 样式
4. **命名一致**: 保持页面名称、路由名称的一致性
5. **测试路由**: 创建后建议测试路由是否正常工作

**重要**: 创建页面后，可以直接通过 `pnpm run dev:app-name` 启动应用，然后访问新页面来验证功能。

## 关联技能

本技能专注于快速创建 Vue 页面组件并自动配置路由。如果你需要创建更复杂的组件或需要更多选项（如组件类型选择、样式类型配置等），可以考虑使用 `create-component` 技能。

### 技能对比

| 特性 | create-a-vue-page | create-component |
|------|-------------------|------------------|
| **主要用途** | 创建页面组件，自动配置路由 | 创建通用 Vue 组件 |
| **组件类型** | tsx 或 vue 格式 | vue, defineComponent, functional |
| **创建位置** | 固定在应用的 views 目录下 | 可在任意目录（components, views 等） |
| **路由配置** | 自动配置路由 | 不自动配置路由 |
| **样式选项** | CSS Modules (tsx) 或 scoped (vue) | 支持 CSS Modules、CSS、SCSS 等多种样式类型 |
| **组件复杂度** | 适合标准页面组件 | 适合复杂业务组件、UI 组件、页面组件 |
| **页面组件支持** | 专门为页面设计，自动命名规范 | 支持在 views 目录下创建页面组件，但需手动配置路由 |

### 选择建议

- **使用 `create-a-vue-page`**: 当需要快速创建标准页面组件并自动配置路由时
- **使用 `create-component`**: 当需要创建可复用组件、复杂业务组件，或需要更多自定义选项时

**注意**: 两种技能都可以在 views 目录下创建页面组件，但 `create-a-vue-page` 会自动更新路由配置，而 `create-component` 需要手动配置路由。
