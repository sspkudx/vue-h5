#!/bin/bash

# 脚本用于在 Node 14 环境下运行所有测试
# 使用方法: ./scripts/run-tests-node14.sh

set -e

echo "=== 在 Node 14 环境下运行测试 ==="

# 检查当前 Node 版本
CURRENT_NODE_VERSION=$(node --version)
echo "当前 Node 版本: $CURRENT_NODE_VERSION"

# 检查是否是 Node 14
if [[ "$CURRENT_NODE_VERSION" != v14* ]]; then
    echo "⚠️  当前不是 Node 14 环境"
    echo "请先运行: ./scripts/switch-to-node14.sh"
    exit 1
fi

echo "✅ 当前运行在 Node 14 环境"

# 运行兼容性检查
echo "🔍 运行 Node 14 兼容性检查..."
node ./scripts/check-node14-compatibility.js

# 安装依赖（如果需要）
echo "📦 检查依赖..."
if [ ! -d "node_modules" ]; then
    echo "安装依赖..."
    pnpm install
fi

# 运行 shared 包的测试
echo "🧪 运行 shared 包测试..."
cd packages/shared
pnpm test

# 运行覆盖率测试
echo "📊 生成测试覆盖率报告..."
pnpm test:coverage

# 显示覆盖率摘要
echo ""
echo "📈 测试覆盖率摘要:"
cat coverage/lcov-report/index.html | grep -A 5 -B 5 "Coverage Summary" || echo "覆盖率报告生成完成，查看 coverage/lcov-report/index.html"

echo ""
echo "🎉 所有测试在 Node 14 环境下通过！"
echo ""
echo "可用命令:"
echo "  pnpm test           # 运行所有测试"
echo "  pnpm test:watch     # 监视模式"
echo "  pnpm test:coverage  # 生成覆盖率报告"
echo "  pnpm test:shared    # 运行 shared 包的测试"
echo ""
echo "要切换回其他 Node 版本:"
echo "  fnm use 16    # 切换到 Node 16"
echo "  fnm use 18    # 切换到 Node 18"
echo "  fnm use 20    # 切换到 Node 20"
echo "  fnm use 22    # 切换到 Node 22"