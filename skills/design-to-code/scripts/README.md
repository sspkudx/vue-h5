# Design-to-Code 代码质量检查工具

此工具用于检查 Design-to-Code 技能生成的 Vue 3 代码是否符合项目规范。

## 功能特性

- ✅ 检查 TypeScript/TSX 文件类型定义
- ✅ 检查 Vue 组件规范
- ✅ 检查 CSS Modules 和 BEM 命名规范
- ✅ 检查 mpx 单位使用情况
- ✅ 检查颜色变量使用
- ✅ 检查代码结构和最佳实践
- ✅ 支持 ESLint 和 Stylelint 集成

## 安装

```bash
# 安装依赖
cd /Users/yueb/Projects/vue-h5/.catpaw/skills/design-to-code/scripts
npm install
```

或者直接使用（无需安装）：

```bash
node check-code-quality.js
```

## 使用方法

### 1. 基本使用

```bash
# 检查整个项目
node check-code-quality.js

# 检查指定目录
node check-code-quality.js --dir src/components

# 检查指定文件
node check-code-quality.js src/components/Button/index.tsx
```

### 2. 集成到工作流中

```json
// package.json 中添加脚本
{
  "scripts": {
    "check:design": "node .catpaw/skills/design-to-code/scripts/check-code-quality.js"
  }
}
```

然后运行：

```bash
npm run check:design
```

### 3. 作为全局工具

```bash
# 链接为全局命令
npm link

# 使用全局命令
check-design-code
```

## 检查规则

### TypeScript/TSX 检查
- 必须使用 `defineComponent` 定义 Vue 组件
- 避免使用 `any` 类型
- 使用 `PropType` 定义组件 props 类型
- 推荐使用 JSX 语法而非 template
- 建议在 setup 函数中返回 render 函数

### Vue 组件检查
- 单文件组件样式必须使用 CSS Modules
- script 标签建议使用 setup 语法糖
- 组件名使用 PascalCase
- 使用 Composition API

### CSS/Less 检查
- 样式文件必须使用 `.module.less` 后缀
- 所有尺寸必须使用 `mpx` 单位
- 禁止使用 `px`、`rem`、`em` 单位
- 类名必须符合 BEM 命名规范
- 建议使用颜色变量而非硬编码颜色值

### 代码结构检查
- 使用路径别名 (`@/`) 而非相对路径
- 避免在生产代码中保留 `console.log`
- 文件导入顺序规范
- 代码格式化检查

## 配置

可以通过修改 `check-code-quality.js` 中的 `CONFIG` 对象来调整检查规则：

```javascript
const CONFIG = {
    // 要检查的文件扩展名
    extensions: ['.tsx', '.ts', '.vue', '.less'],
    
    // 要检查的目录
    directories: ['src/components', 'src/views', 'src/styles'],
    
    // 必须使用的 mpx 单位
    requiredUnit: 'mpx',
    
    // 不允许使用的单位
    disallowedUnits: ['px', 'rem', 'em'],
    
    // BEM 命名正则
    bemPattern: /^[a-z]([a-z0-9-]+)?(__[a-z0-9]([a-z0-9-]+)?)?(--[a-z0-9]([a-z0-9-]+)?)?$/,
};
```

## 输出示例

```
🔍 开始 Design-to-Code 代码质量检查...

📁 检查目录: src/components
   ✅ 通过: 15, ⚠️ 警告: 3, ❌ 失败: 1

📊 检查结果汇总:
   ✅ 总通过数: 15
   ⚠️ 总警告数: 3
   ❌ 总失败数: 1

❌ 错误详情:
   📄 文件: src/components/Button/index.tsx
     ❌ 行 5: 缺少 Vue defineComponent 导入
     ❌ 行 12: 应使用 mpx 单位，而不是 px 单位: 12px

⚠️ 警告详情:
   📄 文件: src/components/Card/style.module.less
     ⚠️ 行 8: 类名 "card-item" 可能不符合 BEM 命名规范
     ⚠️ 行 15: 建议使用颜色变量替代硬编码颜色: #333333

💡 建议:
   1. 请优先修复所有错误 (❌)
   2. 确保所有样式使用 mpx 单位
   3. 检查 Vue 组件是否使用 defineComponent
   4. 确保样式文件使用 .module.less 后缀
```

## 与现有工具的集成

### ESLint 集成
此工具会调用项目的 ESLint 配置进行检查。确保项目根目录有 `.eslintrc.js` 或 `.eslintrc.json` 文件。

### Stylelint 集成
此工具会调用 Stylelint 检查样式文件。确保项目根目录有 `.stylelintrc.js` 或 `.stylelintrc.json` 文件。

### Git Hook 集成
可以在 Git 提交前自动检查代码：

```bash
# .husky/pre-commit
#!/bin/sh
node .catpaw/skills/design-to-code/scripts/check-code-quality.js
```

### CI/CD 集成
可以在 CI/CD 流程中集成检查：

```yaml
# .github/workflows/check-design.yml
name: Design-to-Code Check
on: [pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '14'
      - run: npm ci
      - run: node .catpaw/skills/design-to-code/scripts/check-code-quality.js
```

## 常见问题

### Q: 如何忽略某些检查？
A: 目前不支持忽略检查。如果确实需要忽略，可以暂时注释掉相应的检查规则。

### Q: 检查速度慢怎么办？
A: 可以只检查特定目录或文件，或者配置只检查最近修改的文件。

### Q: 如何添加自定义检查规则？
A: 修改 `check-code-quality.js` 文件，在相应的检查函数中添加新的规则。

### Q: 如何输出 JSON 格式的报告？
A: 当前版本只支持控制台输出。可以修改脚本以支持 JSON 输出。

## 开发指南

### 添加新的检查规则
1. 在 `check-code-quality.js` 中找到对应的检查函数
2. 添加新的正则表达式或条件检查
3. 添加相应的错误/警告信息
4. 测试新的检查规则

### 修改现有规则
1. 找到要修改的规则定义
2. 调整正则表达式或检查逻辑
3. 更新错误/警告信息
4. 确保不会产生误报

### 扩展支持的语言
1. 在 `checkFile` 函数中添加新的文件类型判断
2. 创建对应的检查函数
3. 更新 `CONFIG.extensions` 配置
4. 编写测试用例

## 测试

```bash
# 运行测试
npm test

# 检查特定示例文件
node check-code-quality.js examples/Button/index.tsx
```

## 许可证

MIT License