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

## Node 版本

项目基线为 **Node 22 LTS**（见根目录 `.node-version` 与 `engines`）。使用 fnm 或 nvm 对齐版本即可：

```bash
# fnm
fnm install 22 && fnm use 22

# nvm
nvm install 22 && nvm use 22

node --version  # 应显示 v22.x
```

> 说明：浏览器兼容性由 `browserslist` + 构建转译保证，与 Node 版本无关；Node 只决定构建机与测试环境的语法能力。

## 测试目录结构

```
packages/shared/src/
├── __tests__/
│   ├── index.test.ts        # safeNum 函数测试
│   └── utils.test.ts        # 工具函数测试
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

## CI/CD 集成建议

仓库已提供 GitHub Actions（`.github/workflows/ci.yml`），包含 lint、测试与构建。如需单独运行测试：

```yaml
steps:
    - uses: actions/setup-node@v4
      with:
          node-version-file: .node-version

    - name: Install dependencies
      run: pnpm install --frozen-lockfile

    - name: Run tests
      run: pnpm test
```

## 故障排除

### Jest 找不到测试文件

确保测试文件命名正确且位于 `__tests__` 目录中，或者文件名以 `.test.ts` 或 `.spec.ts` 结尾。

### TypeScript 编译错误

确保所有测试文件的导入路径正确，并且类型定义完整。

### Node 版本问题

如果遇到语法错误或依赖安装失败，请确认当前 Node 版本是否为 22（根目录 `engines` 已声明）：

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

- [Jest 文档](https://jestjs.io/docs/getting-started)
- [ts-jest 文档](https://kulshekhar.github.io/ts-jest/)
- [Node.js LTS 版本](https://nodejs.org/en/about/previous-releases)
- [fnm 文档](https://github.com/Schniz/fnm)
