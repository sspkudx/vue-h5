---
name: design-to-code
description: 根据视觉设计稿生成符合项目规范的 Vue 3 代码，支持 Figma、Dribble、蓝湖等平台设计稿转换。同时支持代码视觉走查，确保还原度和代码质量。使用当用户需要将设计稿转换为代码、检查代码与设计稿一致性，或需要视觉还原度审查时。
---

# Design-to-Code 技能

## 概述

此技能用于将设计稿（Figma、Dribble、蓝湖等平台）转换为高质量的 Vue 3 + TypeScript 代码，同时支持代码与设计稿的视觉一致性检查。根据本项目代码规范生成组件、样式和页面，确保代码质量、可维护性和视觉还原度。

## 使用场景

- 将 Figma 设计稿转换为 Vue 3 + TypeScript 组件代码
- 将 Dribble 设计稿转换为符合项目规范的样式代码
- 将蓝湖设计稿转换为响应式 Vue 页面
- 检查现有代码与设计稿的视觉一致性
- 生成符合 BEM 命名规范的 CSS Modules 样式
- 使用 mpx 单位编写样式以兼容 postcss-px-to-viewport 配置

## 核心原则

### 1. 视觉还原优先级
- **像素级还原**: 精确匹配设计稿的间距、字体、颜色等样式属性
- **布局还原**: 准确实现设计稿的 Flexbox、Grid、Position 等布局方案
- **交互还原**: 完整还原设计稿的交互状态和动画效果

### 2. 代码质量要求
- **符合项目规范**: 遵循 vue-h5 项目的 ESLint、Prettier、TypeScript 等配置
- **TypeScript 强类型**: 所有组件和函数必须有明确的类型定义
- **组件化设计**: 按照项目结构创建可复用的组件
- **CSS Modules**: 使用 `.module.less` 文件和 BEM 命名规范
- **mpx 单位**: 所有尺寸单位使用 mpx，由 postcss-px-to-viewport 自动转换

### 3. 文件结构规范
- **组件文件**: 使用 PascalCase 命名（如 `Button.vue` 或 `Button.tsx`）
- **样式文件**: 使用 `.module.less` 后缀和 BEM 命名规范
- **目录结构**: 遵循项目标准的 `components/`、`views/`、`composables/` 目录组织
- **模块导入**: 使用项目标准的路径别名和导入语法

## 工作流程

### 阶段一：设计稿分析

#### 1. 提取设计信息
```
设计稿分析清单:
- [ ] 提取整体布局结构（Header、Content、Footer、Sidebar等）
- [ ] 提取颜色方案（主要色、辅助色、文字色、背景色等）
- [ ] 提取字体样式（字体族、大小、行高、字重等）
- [ ] 提取间距系统（边距、内边距、栅格系统等）
- [ ] 提取组件样式（按钮、输入框、卡片、弹窗等）
- [ ] 提取交互状态（hover、active、disabled、focus等）
- [ ] 提取响应式断点（移动端、平板、桌面等）
```

#### 2. 创建设计规范文档
根据提取的设计信息创建设计规范文档，包含：
- 颜色变量定义
- 字体变量定义
- 间距变量定义
- 组件样式规范

#### 3. 生成设计变量代码
创建 `src/styles/variables.less` 文件：

```less
// 颜色变量
@primary-color: #1890ff;
@primary-color-hover: #40a9ff;
@primary-color-active: #096dd9;
@text-color: #333333;
@text-color-secondary: #666666;
@border-color: #d9d9d9;
@background-color: #f5f5f5;

// 字体变量
@font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
@font-size-base: 14px;
@font-size-lg: 16px;
@font-size-sm: 12px;
@line-height-base: 1.5;

// 间距变量
@spacing-xs: 4mpx;
@spacing-sm: 8mpx;
@spacing-md: 12mpx;
@spacing-lg: 16mpx;
@spacing-xl: 24mpx;
@spacing-xxl: 32mpx;

// 圆角变量
@border-radius-sm: 2mpx;
@border-radius-base: 4mpx;
@border-radius-lg: 8mpx;
```

### 阶段二：代码生成

#### 1. 创建组件结构
根据设计稿的组件层级创建对应的 Vue 组件：

**文件命名规范:**
- 页面组件: `src/views/{ViewName}/index.tsx` + `style.module.less`
- 通用组件: `src/components/{ComponentName}/index.tsx` + `style.module.less`

#### 2. 生成 Vue 3 组件代码

**组件模板 (TypeScript + JSX):**
```tsx
import { defineComponent } from 'vue';
import styles from './style.module.less';

const ComponentName = defineComponent({
    name: 'ComponentName',
    props: {
        // 组件属性定义
        title: {
            type: String as PropType<string>,
            default: '',
        },
    },
    emits: {
        // 组件事件定义
        'click': (value: string) => typeof value === 'string',
    },
    setup(props, { emit }) {
        const handleClick = () => {
            emit('click', props.title);
        };

        const render = () => {
            return (
                <div class={styles.component}>
                    <h1 class={styles.component__title}>{props.title}</h1>
                    <button class={styles.component__button} onClick={handleClick}>
                        点击
                    </button>
                </div>
            );
        };

        return render;
    },
});

export default ComponentName;
```

#### 3. 生成样式代码

**CSS Modules 样式模板:**
```less
.component {
    // 使用 mpx 单位
    padding: @spacing-md;
    margin: @spacing-lg;
    background: @background-color;
    border-radius: @border-radius-base;
    
    // BEM 命名规范
    &__title {
        color: @text-color;
        font-size: 18mpx;
        font-weight: 600;
        margin-bottom: @spacing-md;
    }
    
    &__button {
        padding: @spacing-sm @spacing-lg;
        background: @primary-color;
        color: white;
        border: none;
        border-radius: @border-radius-base;
        cursor: pointer;
        transition: background-color 0.3s ease;
        
        &:hover {
            background: @primary-color-hover;
        }
        
        &:active {
            background: @primary-color-active;
        }
    }
}
```

### 阶段三：视觉走查与优化

#### 1. 代码规范检查
运行项目代码检查工具，确保代码质量：
```bash
# 代码检查
pnpm lint

# 自动修复代码格式问题
pnpm lint:fix

# 使用专用检查工具
node .catpaw/skills/design-to-code/scripts/check-code-quality.js
```

#### 2. 视觉一致性检查清单
```
视觉走查清单:
- [ ] 布局结构是否与设计稿一致
- [ ] 颜色方案是否准确还原
- [ ] 字体样式是否完全匹配
- [ ] 间距尺寸是否精确对应
- [ ] 组件样式是否完整实现
- [ ] 交互状态是否齐全
- [ ] 响应式设计是否正确实现
```

## 设计平台兼容性

### Figma 设计稿
1. **颜色提取**: 使用 Figma API 获取颜色变量
2. **文本样式**: 提取字体、大小、行高、字重
3. **组件提取**: 识别 Figma Components 和 Frames
4. **间距测量**: 使用 Figma 的 Auto Layout 间距

### 蓝湖设计稿
1. **标注提取**: 解析蓝湖标注信息
2. **切图导出**: 处理图片资源
3. **样式测量**: 获取像素精确的样式信息

### Dribbble 设计稿
1. **图片解析**: 分析设计稿截图
2. **视觉还原**: 根据图片重建样式
3. **颜色分析**: 使用颜色提取工具提取主要色系

## 项目规范遵循

### 1. TypeScript 规范
- 使用严格类型定义
- 避免使用 `any` 类型
- 使用 `as PropType<Type>` 定义组件 Props
- 使用 `ref<T>` 和 `computed<T>` 进行类型推断

### 2. Vue 3 规范
- 使用 Composition API
- 遵循 One-File-One-Component 原则
- 使用 defineComponent 函数定义组件
- 使用 JSX 语法编写模板

### 3. CSS Modules 规范
- 使用 `.module.less` 文件扩展名
- 遵循 BEM 命名规范（block__element--modifier）
- 使用项目定义的 CSS 变量
- 使用 mpx 单位编写尺寸

### 4. 响应式设计实现
```less
// 移动端优先的响应式设计
.component {
    // 基础样式（移动端）
    display: flex;
    flex-direction: column;
    padding: @spacing-md;
    
    // 平板端
    @media (min-width: 768px) {
        flex-direction: row;
        padding: @spacing-lg;
    }
    
    // 桌面端
    @media (min-width: 1024px) {
        padding: @spacing-xl;
        max-width: 1200mpx;
        margin: 0 auto;
    }
}
```

## 验证与测试

### 1. 视觉测试清单
```
✅ 像素级检查:
- 布局结构匹配度 ≥ 95%
- 颜色还原度 ≥ 98%
- 字体样式匹配度 ≥ 95%
- 间距精确度 ≥ 90%

✅ 功能测试:
- 所有交互状态正常工作
- 响应式设计各断点正常
- 组件状态切换正常
- 动画效果流畅自然

✅ 代码质量:
- 通过 ESLint 检查
- 通过 TypeScript 类型检查
- 通过 Stylelint 检查
- 通过 Prettier 格式化
```

### 2. 性能检查
- 检查 CSS 选择器复杂度
- 优化图片资源加载
- 实现懒加载和代码分割
- 检查组件渲染性能

## 快速开始

### 使用示例

**用户输入**: "根据Figma设计稿创建一个按钮组件，包含主要、次要、危险三种类型，有正常、hover、active、disabled四种状态"

**代码生成流程:**
1. 提取设计稿中的按钮样式规范
2. 创建 `src/components/Button/index.tsx` 组件文件
3. 创建 `src/components/Button/style.module.less` 样式文件
4. 使用 TypeScript 定义组件 Props 和事件
5. 使用 CSS Modules + BEM 命名规范编写样式
6. 使用 mpx 单位编写所有尺寸
7. 实现所有交互状态（hover、active、disabled）
8. 添加响应式设计支持

**完整代码示例请查看 [examples.md](examples.md)**

## 注意事项

1. **单位使用**: 所有尺寸必须使用 `mpx` 单位，不要使用 `px`、`rem`、`em`
2. **颜色变量**: 使用设计规范中定义的颜色变量，不要硬编码颜色值
3. **字体变量**: 使用设计规范中定义的字体变量，保持字体一致性
4. **CSS Modules**: 所有样式必须使用 CSS Modules，避免全局样式污染
5. **BEM 规范**: 严格遵循 BEM 命名规范，保持样式选择器可预测
6. **响应式设计**: 采用移动端优先的设计策略
7. **性能优化**: 避免过深的嵌套选择器，优化 CSS 性能

## 故障排除

### 常见问题及解决方案

| 问题 | 可能原因 | 解决方案 |
|------|---------|----------|
| 样式未生效 | CSS Modules 类名未正确引用 | 检查 `styles['class-name']` 语法 |
| mpx 单位转换错误 | postcss-px-to-viewport 未配置 | 检查 `.postcssrc.js` 配置 |
| 组件导入错误 | 路径别名配置错误 | 检查 `tsconfig.json` 中的路径映射 |
| TypeScript 类型错误 | 缺少类型定义 | 使用正确的 `PropType` 和 `Ref` 类型 |

### 调试建议
1. **浏览器开发者工具**: 使用 Chrome DevTools 检查 CSS 计算值和布局
2. **Vue DevTools**: 检查组件层次结构和 Props 传递
3. **样式调试**: 临时添加背景色或边框来可视化布局
4. **响应式测试**: 使用浏览器模拟器测试不同设备尺寸

## 完成标准

✅ 设计稿成功转换为 Vue 3 组件代码
✅ 代码通过所有 lint 检查
✅ 样式使用 mpx 单位并正确转换
✅ 组件功能完整，交互正常
✅ 视觉还原度达到 95% 以上
✅ 代码符合项目所有规范
✅ 文档和注释完整

---

## 相关资源

- **详细代码规范**: [项目代码规范文档](../docs/agents/coding-standards.md)
- **完整组件示例**: [examples.md](examples.md)
- **技术参考文档**: [reference.md](reference.md)
- **代码质量检查工具**: [scripts/check-code-quality.js](scripts/check-code-quality.js)

**提示**: 所有详细示例代码和完整组件模板都在 [examples.md](examples.md) 文件中，请参考该文件获取完整代码实现。