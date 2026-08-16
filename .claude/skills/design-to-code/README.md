# Design-to-Code 技能

## 概述

Design-to-Code 技能是一个用于将视觉设计稿（Figma、蓝湖、Dribbble 等）转换为高质量 Vue 3 + TypeScript 代码的工具。它遵循 vue-h5 项目的代码规范，确保生成的代码符合最佳实践。

## 核心功能

### 1. 设计稿转代码
- **Figma 设计稿**: 提取颜色、字体、间距、组件等设计规范
- **蓝湖设计稿**: 解析标注信息，转换为 CSS 变量和组件
- **Dribbble 设计稿**: 从图片中重建样式和布局

### 2. 代码视觉走查
- **布局一致性检查**: 确保代码与设计稿布局一致
- **颜色匹配验证**: 验证颜色使用是否符合设计规范
- **字体样式检查**: 确保字体、大小、行高与设计稿一致
- **间距测量**: 验证边距、内边距、间距系统

### 3. 代码质量保证
- **TypeScript 类型安全**: 完整的类型定义
- **CSS Modules + BEM**: 样式隔离和命名规范
- **mpx 单位**: 兼容 postcss-px-to-viewport 配置
- **响应式设计**: 移动端优先的设计策略
- **性能优化**: 优化的 CSS 选择器和组件渲染

## 使用示例

### 示例 1：从设计稿创建按钮组件

**设计稿要求**:
- 主要按钮（蓝色背景）
- 次要按钮（灰色边框）
- 危险按钮（红色背景）
- 三种尺寸：小、中、大
- 四种状态：正常、hover、active、disabled

**生成的代码**:
```bash
# 技能会自动生成以下文件：

src/components/Button/index.tsx        # 按钮组件 TypeScript 代码
src/components/Button/style.module.less # 按钮样式（使用 CSS Modules）
```

**组件特性**:
- 完整的 TypeScript 类型定义
- CSS Modules 样式隔离
- BEM 命名规范
- mpx 单位支持
- 响应式设计
- 无障碍支持（ARIA 标签）

### 示例 2：视觉走查现有代码

**检查内容**:
```bash
# 运行代码质量检查
node .catpaw/skills/design-to-code/scripts/check-code-quality.js

# 输出结果示例：
✅ 通过: 15, ⚠️ 警告: 3, ❌ 失败: 1

❌ 错误详情:
   📄 文件: src/components/Button/index.tsx
     ❌ 行 5: 缺少 Vue defineComponent 导入
     ❌ 行 12: 应使用 mpx 单位，而不是 px 单位: 12px

⚠️ 警告详情:
   📄 文件: src/components/Card/style.module.less
     ⚠️ 行 8: 类名 "card-item" 可能不符合 BEM 命名规范
     ⚠️ 行 15: 建议使用颜色变量替代硬编码颜色: #333333
```

## 文件结构

```
design-to-code/
├── SKILL.md              # 技能主文档（核心指令）
├── examples.md           # 完整代码示例和模板
├── reference.md          # 技术参考文档
└── scripts/
    ├── check-code-quality.js    # 代码质量检查工具
    ├── package.json            # 脚本依赖配置
    └── README.md              # 工具使用说明
```

## 快速开始

### 1. 基本使用

当您有设计稿需要转换为代码时，只需告诉技能：

```bash
"根据这个Figma设计稿创建一个用户卡片组件，包含头像、用户名、职位描述"
```

技能会自动：
1. 分析设计稿的样式规范
2. 提取颜色、字体、间距等设计变量
3. 生成符合规范的 Vue 3 组件代码
4. 创建对应的样式文件
5. 添加 TypeScript 类型定义

### 2. 视觉走查

要检查现有代码与设计稿的一致性：

```bash
"检查这个用户卡片组件是否符合设计稿的视觉规范"
```

技能会：
1. 分析代码中的样式实现
2. 与设计稿进行对比
3. 报告不一致的地方
4. 提供修复建议

### 3. 批量转换

要转换整个设计稿页面：

```bash
"将这个登录页面的Figma设计稿转换为Vue 3代码"
```

技能会：
1. 分析页面结构和组件层级
2. 创建对应的目录结构
3. 生成所有必要的组件
4. 建立组件间的依赖关系
5. 确保代码结构和设计稿一致

## 代码规范

### TypeScript 规范
```typescript
// 正确示例
import { defineComponent, PropType } from 'vue';

interface ButtonProps {
    type: 'primary' | 'secondary' | 'danger';
    size?: 'small' | 'medium' | 'large';
}

const Button = defineComponent({
    name: 'Button',
    props: {
        type: {
            type: String as PropType<ButtonProps['type']>,
            required: true,
        },
        size: {
            type: String as PropType<ButtonProps['size']>,
            default: 'medium',
        },
    },
});
```

### CSS Modules 规范
```less
// 正确示例（BEM 命名 + mpx 单位）
.button {
    padding: 12mpx 24mpx;
    background: @primary-color;
    
    &--primary {
        background: @primary-color;
        
        &:hover {
            background: @primary-color-hover;
        }
    }
    
    &__icon {
        margin-right: 8mpx;
    }
}
```

## 常见用例

### 用例 1：创建UI组件库
```bash
# 转换整个设计系统的组件
"将这个设计系统的所有组件（按钮、输入框、卡片、弹窗、导航栏）转换为Vue 3组件库"
```

### 用例 2：重构现有页面
```bash
# 根据新设计稿重构页面
"根据这个新的Figma设计稿重构用户个人中心页面，保持现有功能但更新UI"
```

### 用例 3：响应式适配
```bash
# 添加响应式支持
"为这个组件添加移动端响应式支持，设计稿提供了移动端和桌面端的布局"
```

### 用例 4：无障碍优化
```bash
# 改进无障碍支持
"为这个表单组件添加ARIA标签和键盘导航支持"
```

## 配置说明

### 设计变量提取
技能会自动从设计稿中提取并生成：

```less
// 颜色变量
@primary-color: #1890ff;
@primary-color-hover: #40a9ff;
@text-color: #333333;

// 字体变量
@font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
@font-size-base: 14mpx;
@font-size-lg: 16mpx;

// 间距变量
@spacing-xs: 4mpx;
@spacing-sm: 8mpx;
@spacing-md: 12mpx;
```

### mpx 单位转换
所有尺寸使用 mpx 单位，postcss-px-to-viewport 会自动转换：

```less
/* 输入：设计稿使用 mpx */
.component {
    padding: 16mpx;
    font-size: 14mpx;
    border-radius: 8mpx;
}

/* 输出：转换为 vmin（基于 390px 设计稿） */
.component {
    padding: 4.103vmin;  /* 16/390*100 ≈ 4.103 */
    font-size: 3.59vmin; /* 14/390*100 ≈ 3.59 */
    border-radius: 2.051vmin; /* 8/390*100 ≈ 2.051 */
}
```

## 故障排除

### 问题 1：样式不生效
**可能原因**: CSS Modules 类名引用错误
**解决方案**: 检查 `styles['class-name']` 语法是否正确

### 问题 2：mpx 单位未转换
**可能原因**: postcss-px-to-viewport 配置错误
**解决方案**: 检查项目的 `.postcssrc.js` 配置

### 问题 3：组件导入错误
**可能原因**: 路径别名配置不正确
**解决方案**: 检查 `tsconfig.json` 中的路径映射

### 问题 4：TypeScript 类型错误
**可能原因**: 缺少类型定义或 PropType 使用错误
**解决方案**: 确保所有 props 都有正确的类型定义

## 性能建议

### 1. CSS 性能
- 避免深度嵌套选择器（不超过 3 层）
- 减少通用选择器（*）的使用
- 使用 transform 替代 top/left 动画

### 2. JavaScript 性能
- 使用 computed 缓存计算结果
- 避免在模板中使用复杂表达式
- 合理使用 v-memo 优化渲染

### 3. 资源优化
- 图片使用 WebP 格式
- 字体文件压缩
- 代码分割和懒加载

## 更新日志

### v1.0.0 (2024-01-01)
- 初始版本发布
- 支持 Figma、蓝湖、Dribbble 设计稿转换
- 完整的 TypeScript + CSS Modules + BEM 代码生成
- 视觉走查和代码质量检查工具
- mpx 单位支持和 postcss 配置兼容

## 贡献指南

欢迎贡献代码和改进建议！请确保：

1. 遵循现有代码规范
2. 所有代码都有完整的类型定义
3. 使用 CSS Modules 和 BEM 命名
4. 使用 mpx 单位编写样式
5. 包含完整的测试用例

## 许可证

MIT License

---

**提示**: 更多详细信息和完整代码示例，请查看 [examples.md](examples.md) 和 [reference.md](reference.md) 文档。