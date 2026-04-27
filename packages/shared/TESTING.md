# @my-app/shared 单元测试指南

## 测试框架

本项目使用 [Jest](https://jestjs.io/) 作为测试框架，配合 [ts-jest](https://kulshekhar.github.io/ts-jest/) 支持 TypeScript。

## 安装和配置

测试配置已经集成到项目中。主要文件包括：

1. **根目录 Jest 配置** - `/jest.config.js`
2. **Shared 包 Jest 配置** - `/packages/shared/jest.config.js`
3. **测试脚本** - 已在 `package.json` 中添加

## 运行测试

### 在根目录运行所有测试

```bash
pnpm test
```

### 运行 shared 包的测试

```bash
pnpm test:shared
```

### 在 shared 包目录内运行测试

```bash
cd packages/shared
pnpm test
```

### 运行测试并生成覆盖率报告

```bash
cd packages/shared
pnpm test:coverage
```

### 监视模式（文件变化时自动重新运行测试）

```bash
cd packages/shared
pnpm test:watch
```

## Node 14 环境

根据项目要求，测试需要适配 Node 14 环境。以下是配置步骤：

### 使用 fnm 管理 Node 版本

1. 安装 fnm (Fast Node Manager):

    ```bash
    # 使用 Homebrew (macOS)
    brew install fnm

    # 或使用 curl
    curl -fsSL https://fnm.vercel.app/install | bash
    ```

2. 初始化 fnm:

    ```bash
    # 将以下内容添加到 ~/.zshrc 或 ~/.bashrc
    eval "$(fnm env --use-on-cd)"
    ```

3. 安装并切换到 Node 14:

    ```bash
    # 安装 Node 14
    fnm install 14

    # 切换到 Node 14
    fnm use 14

    # 验证版本
    node --version  # 应该显示 v14.x.x
    ```

### Node 14 兼容性说明

测试已经验证了以下 Node 14 特性：

-   ✅ 可选链操作符 `?.` (Node 14+)
-   ✅ 空值合并操作符 `??` (Node 14+)
-   ✅ `Promise.allSettled()` (Node 12.9.0+)
-   ✅ `String.matchAll()` (Node 12+)
-   ✅ `BigInt` (Node 10.4.0+)
-   ✅ `globalThis` (Node 12+)

## 测试目录结构

```
packages/shared/src/
├── __tests__/
│   ├── index.test.ts        # safeNum 函数测试
│   ├── utils.test.ts        # 工具函数测试
│   └── node14-compatibility.test.ts  # Node 14 兼容性测试
└── index.ts                 # 源代码
```

## 编写测试

测试文件应放置在 `src/__tests__/` 目录中，命名格式为 `*.test.ts` 或 `*.spec.ts`。

### 示例测试

```typescript
import { safeNum } from '../index';

describe('safeNum', () => {
    test('should convert valid number string to number', () => {
        expect(safeNum('123')).toBe(123);
    });

    test('should return 0 for NaN values', () => {
        expect(safeNum('abc')).toBe(0);
    });
});
```

## 测试覆盖率
当前测试覆盖率为 100%：
- Statements: 100%
- Branches: 100%
- Functions: 100%
- Lines: 100%

## 测试用例详情

### 已测试的函数
1. **safeNum** - 安全数字转换
   - 有效数字字符串
   - 数字类型
   - NaN 值处理
   - 布尔值处理
   - 数组处理
   - 对象处理
   - 特殊数值（Infinity、科学计数法、十六进制、二进制）
   - 空格处理
   - 日期对象

2. **isNumber** - 数字类型检查
   - 有效数字
   - 非数字值
   - NaN 处理

3. **isString** - 字符串类型检查
   - 字符串值
   - 非字符串值

4. **isObject** - 普通对象检查
   - 普通对象
   - 非对象值（null、undefined、数组、函数等）
   - 排除 Map、Set 等内置对象

5. **isEmpty** - 空值检查
   - null 和 undefined
   - 空字符串和空白字符串
   - 空数组和对象
   - 非空值
   - 嵌套结构
   - 函数和符号
   - Map 和 Set 对象

6. **formatNumber** - 数字格式化
   - 默认小数位数
   - 自定义小数位数
   - 无效输入处理
   - 四舍五入
   - 大数和小数
   - 精度限制
   - 极值处理
   - 边界情况四舍五入

### Node 14 兼容性测试
- 可选链操作符 (`?.`)
- 空值合并操作符 (`??`)
- `Promise.allSettled()`
- `String.matchAll()`
- `BigInt`
- `globalThis`
- 数字分隔符 (`_`)
- `String.prototype.replaceAll()`
- 逻辑赋值运算符 (`||=`, `&&=`, `??=`)
- `Promise.any()` (如果可用)
- `Array.prototype.at()` (如果可用)
- JavaScript 版本验证

## CI/CD 集成建议

可以在 CI 配置中添加以下步骤：

```yaml
steps:
    - uses: actions/setup-node@v3
      with:
          node-version: '14'

    - name: Install dependencies
      run: pnpm install

    - name: Run tests
      run: pnpm test

    - name: Generate coverage report
      run: pnpm test:coverage
```

## 故障排除

### Jest 找不到测试文件

确保测试文件命名正确且位于 `__tests__` 目录中，或者文件名以 `.test.ts` 或 `.spec.ts` 结尾。

### TypeScript 编译错误

确保所有测试文件的导入路径正确，并且类型定义完整。

### Node 版本问题

如果遇到语法错误，请确认当前 Node 版本是否为 14 或更高：

```bash
node --version
```

### 安装依赖失败

确保已安装所有依赖：

```bash
pnpm install
```

## 扩展测试

要添加新测试：

1. 在 `src/__tests__/` 目录中创建新的测试文件
2. 使用 `describe` 和 `test`（或 `it`）编写测试用例
3. 确保每个函数都有对应的测试
4. 考虑边界情况和错误处理

## 参考链接

-   [Jest 文档](https://jestjs.io/docs/getting-started)
-   [ts-jest 文档](https://kulshekhar.github.io/ts-jest/)
-   [Node 14 新特性](https://nodejs.org/en/blog/release/v14.0.0/)
-   [fnm 文档](https://github.com/Schniz/fnm)
