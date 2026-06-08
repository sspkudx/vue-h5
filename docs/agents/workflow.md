# 项目开发工作流

本文档描述了 vue-h5 项目的标准开发工作流程，包括启动开发、日常开发、代码质量检查、测试和构建等环节。

## 1. 启动开发

### 1.1 初始化项目

```bash
# 克隆项目
git clone <repository-url>
cd vue-h5

# 安装所有依赖
pnpm install

# 构建共享包
pnpm build:packages
```

### 1.2 启动开发服务器

```bash
# 启动示例应用开发服务器
pnpm dev:example

# 启动新创建的应用
pnpm dev:{app-name}

# 例如：启动名为 my-app 的应用
pnpm dev:my-app
```

### 1.3 多应用开发

```bash
# 启动多个应用（在不同终端中）
# 终端 1
pnpm dev:app1

# 终端 2
pnpm dev:app2

# 终端 3 - 包开发模式
cd packages/shared
pnpm dev
```

## 2. 开发工作流

### 2.1 应用开发流程

#### 修改应用代码
当修改应用代码时，开发服务器会自动热重载，无需手动操作：

```bash
# 修改 apps/{app-name}/src/ 目录下的文件
# 开发服务器会自动检测变化并重新加载
```

#### 修改包代码
当修改包代码时，需要重新构建包才能生效：

```bash
# 方法 1：重新构建所有包
pnpm build:packages

# 方法 2：在包的目录下单独构建
cd packages/{package-name}
pnpm build

# 方法 3：使用开发模式（监听变化）
cd packages/{package-name}
pnpm dev
```

### 2.2 包开发流程

#### 包开发模式
```bash
# 进入包目录
cd packages/{package-name}

# 启动开发模式（监听文件变化）
pnpm dev

# 开发模式会：
# 1. 监听 src/ 目录下的文件变化
# 2. 自动重新构建
# 3. 生成 source map 便于调试
```

#### 包依赖更新
当包依赖发生变化时：

```bash
# 更新包依赖后，需要重新构建
cd packages/{package-name}
pnpm build

# 或者在根目录构建所有包
pnpm build:packages
```

## 3. 代码质量检查

### 3.1 ESLint 代码检查

```bash
# 检查所有代码规范
pnpm lint

# 自动修复代码规范问题
pnpm lint:fix

# 检查特定应用的代码
pnpm lint:{app-name}
```

### 3.2 Stylelint 样式检查

```bash
# 检查样式规范
pnpm lint:style

# 自动修复样式规范问题
pnpm lint:style:fix

# 检查特定目录的样式
pnpm lint:style --path apps/{app-name}/src
```

### 3.3 Prettier 代码格式化

```bash
# 格式化所有代码
pnpm format

# 检查代码格式
pnpm format:check

# 格式化特定文件
npx prettier --write src/components/MyComponent.vue
```

### 3.4 Git 提交前检查

项目配置了 husky 和 lint-staged，在提交代码时会自动运行：

```bash
# Git 提交流程
git add .
git commit -m "feat: add new feature"

# 提交时会自动执行：
# 1. 代码格式化 (Prettier)
# 2. 代码检查 (ESLint)
# 3. 样式检查 (Stylelint)
# 4. 测试运行 (Jest)
```

## 4. 测试

### 4.1 运行测试

```bash
# 运行所有测试
pnpm test

# 运行测试并监听变化（开发模式）
pnpm test:watch

# 生成测试覆盖率报告
pnpm test:coverage

# 运行特定包的测试
pnpm -F @my-app/shared test

# 运行特定应用的测试
pnpm -F {app-name} test
```

### 4.2 测试覆盖率

测试覆盖率报告包含：

- **语句覆盖率**：执行的语句百分比
- **分支覆盖率**：执行的分支百分比
- **函数覆盖率**：执行的函数百分比
- **行覆盖率**：执行的行百分比

查看覆盖率报告：
```bash
# 生成覆盖率报告后，在浏览器中打开
open coverage/lcov-report/index.html
```

### 4.3 测试最佳实践

#### 单元测试
```typescript
// 测试工具函数
describe('formatDate', () => {
    it('should format date correctly', () => {
        expect(formatDate(new Date('2023-01-01'), 'YYYY-MM-DD'))
            .toBe('2023-01-01');
    });
});
```

#### 组件测试
```typescript
// 测试 Vue 组件
describe('MyComponent', () => {
    it('renders correctly', () => {
        const wrapper = mount(MyComponent, {
            props: { msg: 'Hello' }
        });
        expect(wrapper.text()).toContain('Hello');
    });
});
```

## 5. 构建

### 5.1 应用构建

```bash
# 构建特定应用
pnpm build:{app-name}

# 构建所有应用
pnpm build:apps

# 构建并分析包大小
pnpm build:{app-name} --report
```

### 5.2 包构建

```bash
# 构建所有包
pnpm build:packages

# 构建特定包
cd packages/{package-name}
pnpm build

# 构建并生成类型声明
pnpm build:types
```

### 5.3 完整构建

```bash
# 完整构建（所有应用和包）
pnpm build

# 构建流程：
# 1. 清理构建目录
# 2. 构建所有包
# 3. 构建所有应用
# 4. 生成构建报告
```

## 6. 部署

### 6.1 生产构建

```bash
# 生产环境构建
NODE_ENV=production pnpm build:{app-name}

# 或者使用预设脚本
pnpm build:prod:{app-name}
```

### 6.2 构建产物

构建产物位于：
```
apps/{app-name}/dist/      # 应用构建产物
packages/{package-name}/dist/  # 包构建产物
```

### 6.3 部署检查清单

部署前检查：

1. **代码质量**
   ```bash
   pnpm lint
   pnpm test
   pnpm build
   ```

2. **依赖检查**
   ```bash
   pnpm audit
   pnpm outdated
   ```

3. **构建验证**
   ```bash
   # 检查构建产物
   ls -la apps/{app-name}/dist/
   
   # 验证构建产物完整性
   pnpm build:verify
   ```

## 7. 开发环境配置

### 7.1 环境变量

项目支持以下环境变量：

```bash
# .env 文件示例
VUE_APP_API_URL=https://api.example.com
VUE_APP_DEBUG=true
VUE_APP_VERSION=1.0.0
```

### 7.2 开发代理

在 `vue.config.js` 中配置开发代理：

```javascript
module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true
            }
        }
    }
};
```

### 7.3 热重载配置

```javascript
// vue.config.js
module.exports = {
    devServer: {
        hot: true,
        hotOnly: true,
        liveReload: false,
        client: {
            overlay: {
                errors: true,
                warnings: false
            }
        }
    }
};
```

## 8. 多应用开发

### 8.1 应用间共享代码

```typescript
// 在应用中使用共享包
import { formatDate } from '@my-app/shared';

// 或者直接引用其他应用的组件
// 注意：这需要配置路径别名
import { MyComponent } from '@my-app/other-app/components';
```

### 8.2 应用独立开发

每个应用都可以独立开发和部署：

```bash
# 独立安装依赖
cd apps/{app-name}
pnpm install

# 独立开发
pnpm dev

# 独立构建
pnpm build
```

### 8.3 应用间通信

应用间可以通过以下方式通信：

1. **共享状态**：使用 Pinia store
2. **事件总线**：使用 Vue 的 provide/inject
3. **URL 参数**：通过路由传递参数
4. **本地存储**：使用 localStorage/sessionStorage

## 9. 包管理

### 9.1 添加新依赖

```bash
# 为特定应用添加依赖
pnpm -F {app-name} add package-name

# 为特定包添加依赖
pnpm -F @my-app/{package-name} add package-name

# 为所有包添加开发依赖
pnpm -r add -D package-name
```

### 9.2 更新依赖

```bash
# 更新所有依赖
pnpm update

# 更新特定包
pnpm update package-name

# 更新到最新版本
pnpm update --latest
```

### 9.3 移除依赖

```bash
# 移除特定应用的依赖
pnpm -F {app-name} remove package-name

# 移除特定包的依赖
pnpm -F @my-app/{package-name} remove package-name
```

## 10. 调试技巧

### 10.1 调试开发服务器

```bash
# 启动开发服务器时开启调试
NODE_OPTIONS=--inspect pnpm dev:{app-name}

# 或者指定端口
NODE_OPTIONS=--inspect=9229 pnpm dev:{app-name}
```

### 10.2 调试构建过程

```bash
# 构建时显示详细日志
pnpm build:{app-name} --verbose

# 生成 Webpack 配置
vue inspect > webpack.config.js
```

### 10.3 性能分析

```bash
# 生成构建性能报告
pnpm build:{app-name} --profile

# 分析包大小
pnpm build:{app-name} --report
```

## 11. 工作流总结

### 日常开发流程

```bash
# 1. 启动开发
pnpm install
pnpm build:packages
pnpm dev:{app-name}

# 2. 开发代码
# 修改代码 -> 自动热重载

# 3. 运行测试
pnpm test

# 4. 代码检查
pnpm lint
pnpm format

# 5. 提交代码
git add .
git commit -m "feat: add feature"

# 6. 构建验证
pnpm build:{app-name}
```

### 发布流程

```bash
# 1. 更新版本
npm version patch  # 或 minor, major

# 2. 运行完整测试
pnpm test
pnpm lint
pnpm build

# 3. 发布包（如果有）
pnpm -r publish

# 4. 提交和推送
git push origin main --tags
```

## 12. 故障排除

### 常见问题

#### 开发服务器无法启动
- 检查端口是否被占用
- 检查依赖是否完整安装
- 查看错误日志

#### 热重载失效
- 检查文件变化监听
- 检查 Webpack 配置
- 尝试重启开发服务器

#### 构建失败
- 检查 TypeScript 错误
- 检查依赖版本冲突
- 清理构建缓存

#### 包引用错误
- 确保包已构建
- 检查路径别名配置
- 重新安装依赖

### 调试命令

```bash
# 检查依赖树
pnpm list

# 检查重复的包
pnpm list | grep -E "(duplicate|multiple)"

# 检查 TypeScript 配置
pnpm -F {app-name} tsc --noEmit

# 清理缓存
rm -rf node_modules/.cache
```

## 下一步

- 参考 [代码规范与最佳实践](./coding-standards.md)
- 查看 [故障排除指南](./troubleshooting.md)
- 了解 [技能开发指南](./skill-development-guide.md)
- 查看 [项目概览](./overview.md) 了解更多信息