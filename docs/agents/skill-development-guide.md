"名为 e2e-test-app 的 Vue 应用，端口号设为 9999";
    
    // 解析参数
    const params = ParameterParser.parse(userInput);
    
    // 验证参数
    const isValid = CreateVueAppSkill.validate(params);
    expect(isValid).toBe(true);
    
    // 执行技能
    await CreateVueAppSkill.execute(params);
    
    // 验证结果
    expect(fs.existsSync('apps/e2e-test-app')).toBe(true);
    
    const vueConfig = fs.readFileSync('apps/e2e-test-app/vue.config.js', 'utf-8');
    expect(vueConfig).toContain('port: 9999');
    
    const packageJson = JSON.parse(fs.readFileSync('apps/e2e-test-app/package.json', 'utf-8'));
    expect(packageJson.name).toBe('e2e-test-app');
    
    // 清理
    fs.rmSync('apps/e2e-test-app', { recursive: true });
  });
});
```

## 技能部署

### 1. 部署到 AI 编辑器
```bash
# 复制技能文件到 AI 编辑器目录
# CatPaw
cp -r skills/create-vue-app/ .catpaw/skills/

# Cursor
cp -r skills/create-vue-app/ .cursor/skills/

# Windsurf
cp -r skills/create-vue-app/ .windsurf/skills/

# Trae
cp -r skills/create-vue-app/ .trae/skills/
```

### 2. 验证技能功能
```bash
# 在 AI 编辑器中测试技能
# 1. 重启 AI 编辑器
# 2. 测试技能识别
# 3. 测试技能执行
# 4. 验证生成结果
```

### 3. 更新项目文档
```bash
# 更新技能列表
# 在 docs/agents/available-skills.md 中添加新技能

# 更新索引
# 在 AGENTS.md 中更新索引

# 更新 README
# 在项目 README 中添加技能说明
```

## 技能维护清单

### 每周维护
- [ ] 测试所有技能功能
- [ ] 检查依赖版本
- [ ] 验证生成的文件结构
- [ ] 更新示例代码

### 每月维护
- [ ] 检查技能文档完整性
- [ ] 更新技能模板
- [ ] 优化技能性能
- [ ] 收集用户反馈

### 每季度维护
- [ ] 审查技能架构
- [ ] 评估技能使用情况
- [ ] 规划技能改进
- [ ] 发布技能更新

## 技能开发资源

### 1. 模板资源
```typescript
// 项目模板目录
templates/
├── vue-app/          # Vue 应用模板
├── utility-library/  # 工具库模板
├── component-library/ # 组件库模板
└── helper-functions/ # 工具函数集模板
```

### 2. 工具函数
```typescript
// 技能开发工具函数
utils/
├── template-engine.ts  # 模板引擎
├── file-system.ts      # 文件操作
├── parameter-parser.ts # 参数解析
└── validation.ts       # 验证工具
```

### 3. 测试工具
```typescript
// 技能测试工具
tests/
├── fixtures/          # 测试数据
├── mocks/            # 模拟对象
├── helpers/          # 测试辅助函数
└── setup.ts          # 测试配置
```

## 故障排除

### 1. 技能未被识别
**问题**: AI 编辑器无法识别技能

**解决方案**:
```bash
# 1. 检查技能文件位置
ls -la .catpaw/skills/

# 2. 检查技能文件格式
cat .catpaw/skills/create-vue-app/SKILL.md | head -5

# 3. 重启 AI 编辑器
# 4. 检查编辑器配置
```

### 2. 技能执行失败
**问题**: 技能执行过程中出错

**解决方案**:
```bash
# 1. 检查错误信息
# 查看控制台输出

# 2. 检查权限
ls -la apps/ packages/

# 3. 检查磁盘空间
df -h

# 4. 检查依赖
pnpm list --depth=0
```

### 3. 生成文件错误
**问题**: 生成的文件包含错误

**解决方案**:
```bash
# 1. 检查模板文件
cat skills/create-vue-app/templates/package.json

# 2. 检查变量替换
# 验证模板变量是否正确替换

# 3. 检查文件权限
ls -la apps/new-app/

# 4. 验证文件内容
cat apps/new-app/package.json
```

### 4. 性能问题
**问题**: 技能执行速度慢

**解决方案**:
```bash
# 1. 分析执行时间
time pnpm run create-app my-app

# 2. 检查文件操作
# 优化文件读写操作

# 3. 使用缓存
# 缓存模板文件

# 4. 并行处理
# 使用 Promise.all 并行处理
```

## 下一步

- 查看 [可用技能列表](./available-skills.md) 了解现有技能
- 学习 [技能使用规范](./usage-guidelines.md) 了解如何使用技能
- 参考 [创建 Vue 应用指南](./create-vue-app-guide.md) 学习具体技能实现
- 查看 [创建依赖包指南](./create-package-guide.md) 了解包创建技能
- 学习 [项目开发工作流](./workflow.md) 了解整体开发流程
- 参考 [代码规范与最佳实践](./coding-standards.md) 保持代码质量
- 查看 [故障排除指南](./troubleshooting.md) 解决常见问题