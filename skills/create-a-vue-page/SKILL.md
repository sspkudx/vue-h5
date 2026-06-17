---
name: create-a-vue-page
description: 在 Vue H5 应用的 views 目录下创建页面组件，支持 TypeScript JSX (tsx) 和 Vue 单文件组件 (.vue) 两种创建方式。
---

# 创建 Vue 页面

## 概述

此技能用于在 vue-h5 项目的应用 views 目录下创建新的页面组件。支持两种创建方式：TypeScript JSX (tsx) 和 Vue 单文件组件 (.vue)，开发者可以根据需求选择。

## 使用场景

- 用户需要在应用中添加新的页面
- 用户需要选择页面组件的实现方式（tsx 或 vue）
- 用户需要在指定应用中创建页面
- 用户需要快速生成标准的页面组件结构

## 创建流程

### 1. 获取页面信息

在创��页面前，需要从用户处获取以下信息：

- **页面名称** (必需): 页面的名称，将用于组件名称和目录名称
- **目标应用** (可选): 指定在哪个应用中创建页面，默认为 example-app
- **页面类型** (可选): 选择页面类型
  - `tsx`: TypeScript JSX 方式
  - `vue`: Vue 单文件组件方式
  - 默认为 `vue` 以鼓励新用户使用现代 Vue 开发方式

### 2. 验证输入

验证页面名称：
- 必须符合 PascalCase 命名规范（首字母大写，无下划线）
- 不能与现有页面重名
- 长度适中（建议 2-30 个字符）

验证目标应用：
- 必须存在于 apps 目录中
- 应用目录结构必须完整

验证页面类型：
- 只接受 `tsx` 或 `vue` 两种类型

### 3. 创建页面组件

根据选择的类型创建对应的页面结构：

#### 对于 tsx 类型
目录结构为：
```
views/{PageName}View/
├── index.tsx
└── style.module.less
```

#### 对于 vue 类型
目录结构为：
```
views/{PageName}View/
├── {PageName}View.vue
└── style.module.less
```

### 4. 更新路由配置

自动更新目标应用的 `src/router/index.ts` 文件：
1. 添加新的路由配置
2. 保持路由配置文件语法正确
3. 确保路由路径符合命名规范（小写和连字符）

## 文件模板

### tsx 页面模板

#### views/{PageName}View/index.tsx

```tsx
import { defineComponent } from 'vue';
import styles from './style.module.less';

const {PageName}View = defineComponent({
    name: '{PageName}View',
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

export default {PageName}View;
```

### Vue 页面模板

#### views/{PageName}View/{PageName}View.vue

```vue
<script lang="ts" setup>
import { ref } from 'vue';
import styles from './style.module.less';

const title = ref('{PageName} Page');
const welcomeMessage = ref(`Welcome to the {PageName} page!`);
</script>

<template>
    <div :class="styles.container">
        <h1 :class="styles.title">{{ title }}</h1>
        <p :class="styles.message">{{ welcomeMessage }}</p>
    </div>
</template>
```

### 样式文件模板

#### views/{PageName}View/style.module.less

```less
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
```

## 路由配置示例

### tsx 页面路由配置

在 `src/router/index.ts` 中添加：

```typescript
{
    path: '/{page-name}',
    name: '{PageName}View',
    component() {
        return import(/* webpackChunkName: "{PageName}View" */ '../views/{PageName}View/index');
    },
},
```

### Vue 页面路由配置

在 `src/router/index.ts` 中添加：

```typescript
{
    path: '/{page-name}',
    name: '{PageName}View',
    component() {
        return import(/* webpackChunkName: "{PageName}View" */ '../views/{PageName}View/{PageName}View.vue');
    },
},
```

## 示例

### 示例 1：在 example-app 中创建 Vue 页面

**用户输入**: "创建名为 UserProfile 的页面"

**处理步骤**:
1. 验证"UserProfile"符合命名规范
2. 验证 example-app 应用存在
3. 创建目录结构 `apps/example-app/src/views/UserProfileView/`
4. 创建 `UserProfileView.vue` 文件
5. 创建 `style.module.less` 文件
6. 更新 `src/router/index.ts`，添加路由配置：
   ```typescript
   {
       path: '/user-profile',
       name: 'UserProfileView',
       component() {
           return import(/* webpackChunkName: "UserProfileView" */ '../views/UserProfileView/UserProfileView.vue');
       },
   }
   ```

### 示例 2：在指定应用中创建 tsx 页面

**用户输入**: "在 my-app 中创建名为 Settings 的页面，使用 tsx 方式"

**处理步骤**:
1. 验证"Settings"符合命名规范
2. 验证 my-app 应用存在
3. 创建目录结构 `apps/my-app/src/views/SettingsView/`
4. 创建 `index.tsx` 文件
5. 创建 `style.module.less` 文件
6. 更新 `src/router/index.ts`，添加路由配置：
   ```typescript
   {
       path: '/settings',
       name: 'SettingsView',
       component() {
           return import(/* webpackChunkName: "SettingsView" */ '../views/SettingsView/index');
       },
   }
   ```

### 示例 3：创建复杂页面

**用户输入**: "创建名为 Dashboard 的页面，使用 vue 方式"

**处理步骤**:
1. 验证"Dashboard"符合命名规范
2. 创建目录结构 `apps/example-app/src/views/DashboardView/`
3. 创建基础 Vue 单文件组件
4. 更新路由配置

## 转换规则

### 页面名称转换

- **输入**: UserProfile
- **组件目录**: UserProfileView
- **Vue 文件名**: UserProfileView.vue
- **路由名称**: UserProfileView
- **路由路径**: user-profile

### 路由名称转换

- UserProfile → user-profile
- DashboardView → dashboard-view
- SettingsPage → settings-page

## 注意事项

1. **命名规范**: 页面名称必须使用 PascalCase 格式（如 UserProfile）
2. **目录结构**: 每种类型都有固定的目录结构
3. **路由更新**: 会自动更新路由配置，确保语法正确
4. **路由冲突**: 检查路由路径是否已被使用
5. **应用支持**: 页面必须在已存在的应用中创建
6. **默认类型**: 如果不指定类型，默认为 vue

## 错误处理

- **页面名称已存在**: 提示用户选择其他名称
- **目标应用不存在**: 提示用户先创建应用或选择其他应用
- **路径冲突**: 检查路由路径是否已被其他页面使用
- **目录创建失败**: 检查文件权限
- **路由更新失败**: 检查路由文件是否存在或语法是否正确

## 使用建议

1. **新页面推荐**: 建议使用 vue 类型，因为它更现代且易于维护
2. **状态管理**: 如果页面需要状态管理，可以在组件中添加 Pinia store
3. **样式规范**: 使用 CSS Modules 避免样式冲突
4. **命名一致**: 保持页面名称、路由名称的一致性
5. **测试路由**: 创��后建议测试路由是否正常工作

**重要**: 创建页面后，可以直接通过 `pnpm run dev:app-name` 启动应用，然后访问新页面来验证功能。
