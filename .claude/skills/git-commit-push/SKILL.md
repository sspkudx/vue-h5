---
name: git-commit-push
description: 根据本项目规范自动提交代码和推送更改。支持常规Git提交、husky/lint-staged代码检查拦截处理以及Gerrit推送。使用git add、git commit和git push命令，按照项目规范生成符合语义化版本的提交信息。使用当用户需要提交代码变更、需要推送代码到远程仓库，或者需要符合项目的Git提交规范时。
---

# Git 提交和推送技能

## 概述

此技能用于自动执行 Git 操作：暂存变更、提交代码和推送到远程仓库。根据本项目的提交规范生成语义化的提交信息，确保代码提交符合团队规范。支持 husky/lint-staged 代码检查拦截处理，以及 Gerrit 推送（git push origin HEAD:refs/for/<branch>）流程。

## 使用场景

-   用户需要提交本地代码变更
-   用户需要推送代码到远程仓库（包括标准 Git 和 Gerrit）
-   用户需要符合项目的 Git 提交规范
-   用户需要自动生成符合语义化版本的提交信息
-   用户想要批量提交所有变更
-   代码提交被 husky/lint-staged 拦截，需要自动修复并重试
-   需要处理代码格式化、lint 检查等预处理步骤
-   需要在 Gerrit 代码审查平台上推送代码变更

## Git 提交规范

根据本项目的 AGENTS.md 文档，提交信息应遵循以下格式：

```
<type>: <description>

<optional body>
```

### 提交类型 (commit types)

1. **feat**: 添加新功能
2. **fix**: 修复问题
3. **docs**: 文档更新
4. **style**: 代码格式调整（不影响代码逻辑的更改，如空格、格式化等）
5. **refactor**: 代码重构（既不是修复 bug 也不是添加新功能）
6. **test**: 测试相关
7. **chore**: 构建过程或辅助工具变动

## 工作流程

### 1. 代码质量检查与预处理

在提交前，自动运行代码质量检查，确保代码符合规范：

```bash
# 检查是否存在 husky/lint-staged 配置
if [ -f .husky/pre-commit ] || [ -f package.json ] && grep -q "lint-staged" package.json; then
    # 如果配置了 husky/lint-staged，运行预提交钩子
    npm run prepare # 或 pnpm prepare（如果使用 pnpm）
fi

# 运行 lint 检查
pnpm lint

# 如果存在 lint 错误，尝试自动修复
pnpm lint:fix

# 检查代码格式
pnpm format:check

# 如果格式有问题，自动格式化
pnpm format
```

### 2. 检查 Git 状态

首先检查当前工作区的 Git 状态，确认是否有变更需要提交：

```bash
git status
```

### 3. 分析变更内容

根据`git diff`的结果分析变更类型，自动确定合适的提交类型：

-   **依赖更新** (package.json, pnpm-lock.yaml)：使用`chore`
-   **新功能实现**：使用`feat`
-   **问题修复**：使用`fix`
-   **文档更新**：使用`docs`
-   **代码重构**：使用`refactor`
-   **测试相关**：使用`test`
-   **代码格式化**：使用`style`
-   **husky/lint-staged 相关变更**：使用`chore`
-   **Gerrit 配置变更**：使用`chore`

### 4. 暂存变更

将所有变更添加到暂存区：

```bash
git add .
```

或者只添加特定文件：

```bash
git add <file1> <file2>
```

### 5. 生成提交信息

根据变更类型生成符合规范的提交信息：

**语法格式**：

```
<type>: <short description>

<optional longer description>
```

**示例**：

```
chore: 更新依赖版本

- 更新 vue 从 3.5.34 到 3.5.35
- 更新 vue-router 从 5.0.6 到 5.1.0
- 更新 less 从 4.4.2 到 4.6.4
- 更新 rollup 从 3.29.4 到 3.30.0
```

**husky/lint-staged 相关提交示例**：

```
chore: 配置 husky 和 lint-staged

- 添加 husky 预提交钩子
- 配置 lint-staged 自动修复代码格式
- 添加 commitlint 规范提交信息
```

### 6. 提交代码

使用生成的提交信息进行提交，处理可能被 husky/lint-staged 拦截的情况：

```bash
# 尝试提交，如果被拦截则处理
if ! git commit -m "chore: 更新依赖版本"; then
    echo "提交被拦截，可能是代码检查未通过"

    # 检查是否是 lint 错误
    if pnpm lint 2>&1 | grep -q "error"; then
        echo "存在 lint 错误，尝试自动修复..."
        pnpm lint:fix

        # 重新添加修复后的文件
        git add .

        # 再次尝试提交
        git commit -m "chore: 更新依赖版本"
    fi
fi
```

对于包含详细描述的提交：

```bash
git commit -m "chore: 更新依赖版本" -m "- 更新 vue 从 3.5.34 到 3.5.35" -m "- 更新 vue-router 从 5.0.6 到 5.1.0"
```

### 7. 推送到远程仓库

将提交推送到远程仓库，支持标准 Git 推送和 Gerrit 推送：

**标准 Git 推送**（通常到 main 分支）：

```bash
git push origin main
```

或者推送到当前分支：

```bash
git push origin HEAD
```

**Gerrit 推送**（代码审查平台）：

```bash
# 推送到 Gerrit 的 refs/for/<branch> 分支进行代码审查
git push origin HEAD:refs/for/main

# 或者根据当前分支自动确定
current_branch=$(git branch --show-current)
git push origin HEAD:refs/for/$current_branch

# 或者推送到特定分支的 Gerrit 审查
git push origin HEAD:refs/for/develop
```

### 8. 处理 Gerrit 推送的特殊情况

对于 Gerrit，可能需要额外的配置和处理：

```bash
# 检查是否配置了 Gerrit
if git remote -v | grep -q "gerrit"; then
    echo "检测到 Gerrit 远程仓库，使用 Gerrit 推送方式"

    # 获取当前分支
    current_branch=$(git branch --show-current)

    # 推送到 Gerrit 进行代码审查
    git push origin HEAD:refs/for/$current_branch

    echo "已推送到 Gerrit 进行代码审查"
    echo "请访问 Gerrit Web 界面查看和评审代码"
else
    echo "使用标准 Git 推送"
    git push origin HEAD
fi
```

## 具体实现步骤

### 步骤 1：检查 Git 仓库状态

```bash
# 检查当前分支和状态
git status

# 查看具体变更
git diff --stat
git diff --name-only
```

### 步骤 2：分析变更类型

根据变更文件确定提交类型：

| 变更文件/内容                   | 建议提交类型 | 说明     |
| ------------------------------- | ------------ | -------- |
| package.json, pnpm-lock.yaml    | chore        | 依赖更新 |
| \*.md 文件                      | docs         | 文档更新 |
| 测试文件 (_.test.ts, _.spec.ts) | test         | 测试相关 |
| 样式文件 (_.less, _.css)        | style        | 样式调整 |
| 源代码重构                      | refactor     | 代码重构 |
| 新功能实现                      | feat         | 新功能   |
| Bug 修复                        | fix          | 问题修复 |

### 步骤 3：生成提交信息模板

根据变更类型生成相应的提交信息：

**依赖更新模板**：

```
chore: 更新依赖版本

<列出主要依赖更新>
```

**新功能模板**：

```
feat: <功能描述>

<详细描述功能实现>
```

**Bug 修复模板**：

```
fix: 修复<问题描述>

<描述修复内容和影响范围>
```

**文档更新模板**：

```
docs: 更新<文档内容>

<更新的文档范围和内容>
```

### 步骤 4：执行提交操作

```bash
# 添加所有变更
git add .

# 提交代码
git commit -m "chore: 更新依赖版本" -m "- 更新 vue 到 3.5.35" -m "- 更新 vue-router 到 5.1.0"

# 推送到远程
git push origin main
```

## 扩展功能：husky/lint-staged 支持

### 1. 检测 husky/lint-staged 配置

在提交前检查项目是否配置了 husky 和 lint-staged：

```bash
# 检查 husky 配置
if [ -d .husky ] || [ -f .husky/pre-commit ]; then
    echo "检测到 husky 配置"
fi

# 检查 lint-staged 配置
if [ -f package.json ] && grep -q "lint-staged" package.json; then
    echo "检测到 lint-staged 配置"
fi

# 检查 commitlint 配置
if [ -f .commitlintrc.js ] || [ -f .commitlintrc.json ] || [ -f .commitlintrc.yml ] || [ -f .commitlintrc.yaml ]; then
    echo "检测到 commitlint 配置"
fi
```

### 2. 自动处理预提交钩子

如果配置了 husky，确保预提交钩子能够正确运行：

```bash
# 如果使用 pnpm，可能需要运行 prepare
if [ -f package.json ] && grep -q "pnpm" package.json; then
    pnpm prepare
fi

# 或者如果使用 npm
if [ -f package.json ] && grep -q "npm" package.json; then
    npm run prepare
fi
```

### 3. 处理 lint-staged 拦截

当提交被 lint-staged 拦截时，自动修复并重试：

```bash
# 尝试提交
commit_message="chore: 更新依赖版本"
if ! git commit -m "$commit_message"; then
    echo "提交被 lint-staged 拦截，正在处理..."

    # 检查是否是 ESLint 错误
    if [ -f package.json ] && grep -q "eslint" package.json; then
        echo "运行 ESLint 修复..."
        pnpm lint:fix || npm run lint:fix || yarn lint:fix

        # 重新添加修复后的文件
        git add .
    fi

    # 检查是否是 Prettier 格式问题
    if [ -f package.json ] && grep -q "prettier" package.json; then
        echo "运行 Prettier 格式化..."
        pnpm format || npm run format || yarn format

        # 重新添加格式化后的文件
        git add .
    fi

    # 再次尝试提交
    if git commit -m "$commit_message"; then
        echo "提交成功！"
    else
        echo "提交仍然失败，请手动检查问题"
        exit 1
    fi
fi
```

### 4. 支持 commitlint

如果项目使用了 commitlint 验证提交信息格式：

```bash
# 检查提交信息格式
if [ -f package.json ] && grep -q "commitlint" package.json; then
    echo "检查提交信息格式..."

    # 验证提交信息格式
    if ! echo "$commit_message" | npx commitlint; then
        echo "提交信息格式不符合规范，请修改"
        echo "预期格式: <type>: <description>"
        echo "例如: feat: 添加新功能"
        exit 1
    fi
fi
```

## 扩展功能：Gerrit 推送支持

### 1. 检测 Gerrit 配置

```bash
# 检查远程仓库是否是 Gerrit
if git remote -v | grep -qi "gerrit\|review"; then
    echo "检测到 Gerrit 远程仓库配置"
    is_gerrit=true
else
    is_gerrit=false
fi

# 检查 .gitreview 文件（Gerrit 配置文件）
if [ -f .gitreview ]; then
    echo "检测到 .gitreview 配置文件"
    is_gerrit=true
fi
```

### 2. Gerrit 推送命令

根据项目配置选择合适的 Gerrit 推送方式：

```bash
# 获取当前分支
current_branch=$(git branch --show-current)

# 确定目标分支
if [ "$current_branch" = "main" ] || [ "$current_branch" = "master" ]; then
    target_branch="main"
elif [ "$current_branch" = "develop" ]; then
    target_branch="develop"
else
    target_branch="$current_branch"
fi

# Gerrit 推送
if [ "$is_gerrit" = true ]; then
    echo "使用 Gerrit 推送方式"
    git push origin HEAD:refs/for/$target_branch

    # 或者使用 git review（如果安装了 git-review）
    if command -v git-review &> /dev/null; then
        echo "使用 git-review 工具"
        git review
    fi
else
    echo "使用标准 Git 推送"
    git push origin HEAD
fi
```

### 3. Gerrit 推送选项

```bash
# 带标签推送（用于 Gerrit Code Review）
git push origin HEAD:refs/for/$target_branch%topic=my-feature

git push origin HEAD:refs/for/$target_branch%l=Verified+1

git push origin HEAD:refs/for/$target_branch%cc=reviewer@example.com

# 强制推送（谨慎使用）
git push origin HEAD:refs/for/$target_branch --force
```

## 最佳实践

### 1. 提交信息编写指南

-   **第一行**：简明扼要，不超过 50 个字符
-   **正文**：详细描述变更内容和原因
-   **时态**：使用现在时（"更新"而不是"已更新"）
-   **内容**：说明"为什么"而不仅仅是"做了什么"
-   **格式**：使用项目规范的类型前缀

### 2. 提交粒度

-   **原子性**：每次提交只做一件事
-   **可追溯性**：提交信息要清晰明确
-   **相关性**：相关的变更一起提交

### 3. 特殊情况处理

#### 3.1 多个类型变更

如果一次变更包含多个类型（如同时更新依赖和修复 bug）：

1. **优先原则**：选择最重要的类型
2. **分割提交**：建议分开多次提交
3. **组合描述**：在提交信息中说明所有变更

示例：

```
chore: 更新依赖并修复相关问题

- 更新 vue 到 3.5.35
- 修复路由配置问题
- 更新文档说明
```

#### 3.2 回滚提交

如果需要回滚提交：

```bash
# 查看提交历史
git log --oneline

# 回滚到特定提交
git revert <commit-hash>
```

#### 3.3 修改提交

```bash
# 修改最后一次提交信息
git commit --amend -m "新的提交信息"

# 修改并保持文件变更
git commit --amend --no-edit
```

## 使用示例

### 示例 1：常规提交（无 husky/lint-staged）

**用户请求**："帮我根据当前代码变更，commit 并 push 代码，提交信息你来定"

**处理步骤**：

1. 运行代码质量检查（lint、format 等）
2. 检查变更，发现只有 package.json 和 pnpm-lock.yaml 有变化
3. 分析变更内容，确定为依赖版本更新
4. 生成提交信息：`chore: 更新依赖版本`
5. 执行提交和推送操作

**具体操作**：

```bash
# 运行代码检查
pnpm lint
pnpm format:check

# 查看变更
git status
git diff package.json

# 添加变更
git add package.json pnpm-lock.yaml

# 提交代码
git commit -m "chore: 更新依赖版本" -m "- 更新 vue 从 3.5.34 到 3.5.35" -m "- 更新 vue-router 从 5.0.6 到 5.1.0" -m "- 更新 less 从 4.4.2 到 4.6.4" -m "- 更新 rollup 从 3.29.4 到 3.30.0"

# 推送到远程
git push origin main
```

### 示例 2：带 husky/lint-staged 的提交

**场景**：项目配置了 husky 和 lint-staged，提交时被 ESLint 拦截

**处理流程**：

1. 运行预提交钩子
2. 被 lint-staged 拦截，检测到 ESLint 错误
3. 自动运行 `pnpm lint:fix` 修复错误
4. 重新添加修复后的文件
5. 重新尝试提交
6. 提交成功后推送到远程

**智能处理代码**：

```bash
#!/bin/bash

# 尝试提交
if ! git commit -m "feat: 添加用户登录功能"; then
    echo "提交被拦截，检查 husky/lint-staged 输出..."

    # 检查错误类型
    if [ -f package.json ] && grep -q "eslint" package.json; then
        echo "检测到 ESLint 错误，尝试自动修复..."

        # 运行 ESLint 修复
        pnpm lint:fix

        # 检查是否还有其他错误
        if pnpm lint; then
            echo "ESLint 错误已修复，重新添加文件..."
            git add .

            # 重新提交
            if git commit -m "feat: 添加用户登录功能"; then
                echo "提交成功！"
            else
                echo "提交仍然失败，请手动检查"
                exit 1
            fi
        else
            echo "ESLint 修复后仍然存在错误，请手动修复"
            exit 1
        fi
    fi
fi

# 推送代码
git push origin HEAD
```

### 示例 3：Gerrit 推送

**场景**：项目使用 Gerrit 代码审查平台

**处理流程**：

1. 检测到 Gerrit 远程仓库配置
2. 获取当前分支
3. 推送到 Gerrit 的 `refs/for/<branch>` 分支
4. 提供 Gerrit 审查链接（如果可获取）

**Gerrit 推送代码**：

```bash
#!/bin/bash

# 检查是否是 Gerrit 仓库
if git remote -v | grep -qi "gerrit\|review"; then
    echo "检测到 Gerrit 仓库配置"

    # 获取当前分支
    current_branch=$(git branch --show-current)

    # 推送到 Gerrit
    echo "推送到 Gerrit: refs/for/$current_branch"
    git push origin HEAD:refs/for/$current_branch

    echo "已推送到 Gerrit 代码审查平台"
    echo "请访问 Gerrit Web 界面查看和评审代码"

    # 尝试获取 Gerrit URL
    gerrit_url=$(git remote get-url origin | sed 's/git@//' | sed 's/\.git$//' | sed 's/:\/\//\//')
    if [[ $gerrit_url == *"gerrit"* ]]; then
        echo "Gerrit 链接: https://$(echo $gerrit_url | sed 's/ssh\/\///' | sed 's/:/\//')"
    fi
else
    # 标准 Git 推送
    git push origin HEAD
fi
```

### 示例 4：混合场景（husky + Gerrit）

**场景**：项目同时配置了 husky/lint-staged 和 Gerrit

**完整工作流**：

````bash
#!/bin/bash

# 1. 运行代码检查
pnpm lint
pnpm format:check

# 2. 如果有错误，自动修复
if [ $? -ne 0 ]; then
    pnpm lint:fix
    pnpm format
    git add .
fi

# 3. 提交代码（处理 husky 拦截）
commit_message="fix: 修复用户登录验证逻辑"
max_retries=3
retry_count=0

while [ $retry_count -lt $max_retries ]; do
    if git commit -m "$commit_message"; then
        echo "提交成功！"
        break
    else
        echo "提交被拦截，尝试修复..."
        retry_count=$((retry_count + 1))

        # 运行修复脚本
        if [ -f package.json ]; then
            pnpm lint:fix 2>/dev/null || true
            pnpm format 2>/dev/null || true
            git add .
        fi
    fi

done

if [ $retry_count -eq $max_retries ]; then
    echo "提交失败，请手动检查"
    exit 1
fi

# 4. Gerrit 推送
if git remote -v | grep -qi "gerrit\|review"; then
    echo "检测到 Gerrit 仓库配置，推送到 Gerrit 进行代码审查"
    current_branch=$(git branch --show-current)
    git push origin HEAD:refs/for/$current_branch

    echo "已推送到 Gerrit 代码审查平台"
    # 尝试获取 Gerrit URL
    gerrit_url=$(git remote get-url origin | sed 's/git@//' | sed 's/\.git$//' | sed 's/:\/\//\//')
    if [[ $gerrit_url == *"gerrit"* ]]; then
        echo "Gerrit 链接: https://$(echo $gerrit_url | sed 's/ssh\/\///' | sed 's/:/\//')"
    fi
else
    echo "推送到标准 Git 远程仓库"
    git push origin HEAD
fi
```

## 高级配置

### husky 配置示例

如果项目需要配置 husky 和 lint-staged，可以参考以下配置：

**package.json**:
```json
{
  "scripts": {
    "prepare": "husky install",
    "lint-staged": "lint-staged"
  },
  "devDependencies": {
    "husky": "^8.0.0",
    "lint-staged": "^13.0.0",
    "@commitlint/cli": "^17.0.0",
    "@commitlint/config-conventional": "^17.0.0"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx,vue}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,css,less,scss}": [
      "prettier --write"
    ]
  }
}
```

**.husky/pre-commit**:
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
```

**.commitlintrc.js**:
```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore']
    ],
    'subject-case': [0]
  }
}
```

### Gerrit 配置示例

**配置 .gitreview 文件**:
```ini
[gerrit]
host=gerrit.example.com
port=29418
project=project-name
defaultbranch=main
```

**配置 SSH 密钥**:
```bash
# 生成 SSH 密钥（如果没有）
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

# 将公钥添加到 Gerrit
cat ~/.ssh/id_rsa.pub

# 配置 SSH 连接
cat >> ~/.ssh/config << EOF
Host gerrit.example.com
    HostName gerrit.example.com
    Port 29418
    User your-username
    IdentityFile ~/.ssh/id_rsa
EOF
```

**安装 git-review**:
```bash
# 使用 pip 安装
pip install git-review

# 或使用包管理器
brew install git-review  # macOS
apt-get install git-review  # Ubuntu/Debian
yum install git-review  # CentOS/RHEL
```

## 交互流程

### 获取用户确认

在执行提交前，应该：

1. **显示变更摘要**：列出将要提交的文件
2. **显示提交信息**：展示生成的提交信息
3. **显示代码检查结果**：如果有 husky/lint-staged 配置
4. **显示推送方式**：标准 Git 还是 Gerrit
5. **获取用户确认**：询问用户是否确认提交

### 异常处理

1. **没有变更**：提示用户"没有需要提交的变更"
2. **Git 配置问题**：检查用户名和邮箱配置
3. **远程仓库问题**：检查远程仓库配置和权限
4. **合并冲突**：提示用户先解决冲突
5. **husky/lint-staged 拦截**：自动修复并重试，如果失败则提示用户
6. **Gerrit 权限问题**：提示用户检查 Gerrit 访问权限
7. **代码检查失败**：显示具体错误信息，建议修复方案
````

## 完成后的操作

提交成功后，建议：

1. **显示提交信息**：确认提交内容
2. **显示提交哈希**：提供提交的唯一标识
3. **提供后续操作建议**：
    - 如何查看提交历史：`git log --oneline`
    - 如何回滚提交：`git revert <commit-hash>`
    - 如何推送到特定分支：`git push origin <branch-name>`

## 注意事项

1. **权限检查**：确保有推送到远程仓库的权限
2. **分支保护**：检查目标分支是否有保护规则
3. **CI/CD 集成**：提交可能会触发 CI/CD 流程
4. **代码审查**：可能需要创建 Pull Request

## 错误处理

-   **无变更提交**：提示用户没有需要提交的变更
-   **Git 配置缺失**：提示用户配置用户名和邮箱
-   **远程仓库未设置**：提示用户设置远程仓库
-   **推送权限不足**：提示用户检查权限或使用 SSH
-   **合并冲突**：提示用户先解决冲突再提交

## 完成后的操作建议

提交成功后，建议用户：

1. **查看提交历史**：`git log --oneline -10`
2. **确认推送状态**：`git status`
3. **检查 CI/CD 状态**：如果有 CI/CD 流程
4. **通知相关人员**：如果涉及代码审查

### 对于 husky/lint-staged 项目：

5. **验证预提交钩子**：检查 `.husky/pre-commit` 是否正常运行
6. **检查 lint-staged 配置**：确认 `package.json` 中的 `lint-staged` 配置正确
7. **测试自动修复**：确保 `pnpm lint:fix` 和 `pnpm format` 能正常工作

### 对于 Gerrit 项目：

8. **检查 Gerrit 推送状态**：使用 `git log --oneline --decorate` 查看提交状态
9. **访问 Gerrit Web 界面**：检查代码审查是否成功创建
10. **添加评审者**：在 Gerrit 中添加合适的代码评审者
11. **设置标签**：根据需要设置 Verified、Code-Review 等标签

## 故障排除

### husky/lint-staged 相关问题

#### 问题 1：预提交钩子不执行

```bash
# 解决方案
chmod +x .husky/*
pnpm prepare  # 或 npm run prepare

# 检查钩子权限
ls -la .husky/
```

#### 问题 2：lint-staged 配置错误

```bash
# 检查配置
cat package.json | grep -A 10 "lint-staged"

# 手动运行测试
npx lint-staged
```

#### 问题 3：提交被拦截但无错误信息

```bash
# 手动运行预提交钩子
./.husky/pre-commit

# 检查 lint-staged 日志
npx lint-staged --debug
```

### Gerrit 相关问题

#### 问题 1：Gerrit 推送权限不足

```bash
# 检查 SSH 配置
ssh -T git@gerrit.example.com -p 29418

# 检查公钥是否添加
curl -u username:password https://gerrit.example.com/a/accounts/self/sshkeys
```

#### 问题 2：Gerrit 推送失败

```bash
# 检查远程仓库配置
git remote -v

# 使用 git review（如果已安装）
git review

# 手动推送
git push origin HEAD:refs/for/main --dry-run
```

#### 问题 3：无法解析 Gerrit URL

```bash
# 检查网络连接
ping gerrit.example.com

# 检查 SSH 配置
cat ~/.ssh/config

# 使用 HTTPS 替代 SSH
git remote set-url origin https://gerrit.example.com/project-name
```

### 通用问题

#### 问题：Git 配置问题

```bash
# 检查 Git 配置
git config --list

# 设置用户名和邮箱（如果需要）
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

#### 问题：远程仓库不存在或无权限

```bash
# 检查远程仓库
git remote -v

# 添加远程仓库（如果需要）
git remote add origin git@github.com:username/repository.git

# 检查 SSH 密钥
ssh -T git@github.com
```

## 最佳实践总结

### 1. 代码质量保障

-   **预提交检查**：始终启用 husky/lint-staged 确保代码质量
-   **自动修复**：配置 ESLint 和 Prettier 自动修复功能
-   **提交信息规范**：使用 commitlint 确保提交信息格式统一

### 2. Gerrit 工作流

-   **代码审查**：利用 Gerrit 的代码审查流程
-   **分支管理**：清晰的分支策略（main/develop/feature）
-   **标签使用**：合理使用 Gerrit 标签（Verified, Code-Review）

### 3. 自动化脚本

-   **智能检测**：自动检测项目配置（husky/lint-staged/Gerrit）
-   **错误处理**：提供清晰的错误信息和修复建议
-   **重试机制**：对可恢复的错误自动重试

### 4. 用户体验

-   **进度反馈**：显示每个步骤的状态和结果
-   **清晰提示**：提供明确的下一步操作建议
-   **错误恢复**：帮助用户从常见错误中恢复

## 更新日志

### v2.0.0 (2024-01-01)

-   新增 husky/lint-staged 支持
-   新增 Gerrit 推送支持
-   新增智能错误处理和自动修复
-   改进代码质量检查流程
-   增加高级配置示例

### v1.0.0 (2023-01-01)

-   初始版本发布
-   支持基本的 Git 提交和推送
-   支持语义化提交信息生成
-   支持变更类型分析
