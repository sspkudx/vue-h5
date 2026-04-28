#!/bin/bash

# 脚本用于切换到 Node 14 环境
# 使用方法: ./scripts/switch-to-node14.sh

set -e

echo "=== 切换到 Node 14 环境 ==="

# 检查 fnm 是否安装
if ! command -v fnm &> /dev/null; then
    echo "❌ fnm 未安装。请先安装 fnm:"
    echo "    curl -fsSL https://fnm.vercel.app/install | bash"
    echo "    或使用 Homebrew: brew install fnm"
    exit 1
fi

# 安装 Node 14（如果尚未安装）
echo "📦 检查 Node 14 是否已安装..."
if ! fnm list | grep -q "v14"; then
    echo "📥 安装 Node 14..."
    fnm install 14
else
    echo "✅ Node 14 已安装"
fi

# 切换到 Node 14
echo "🔄 切换到 Node 14..."
fnm use 14

# 验证版本
CURRENT_NODE_VERSION=$(node --version)
echo "✅ 当前 Node 版本: $CURRENT_NODE_VERSION"

if ! echo "$CURRENT_NODE_VERSION" | grep -q "^v14"; then
    echo "⚠️  警告: 当前 Node 版本不是 v14.x.x"
    echo "请确保已正确配置 fnm 环境变量"
    echo "将以下内容添加到 ~/.zshrc 或 ~/.bashrc:"
    echo "    eval \"\$(fnm env --use-on-cd)\""
    exit 1
fi

# 安装依赖
echo "📦 安装项目依赖..."
pnpm install

# 运行测试
echo "🧪 运行测试..."
cd packages/shared
pnpm test

echo ""
echo "🎉 所有测试在 Node 14 环境下运行成功！"
echo ""
echo "可用命令:"
echo "  pnpm test           # 运行所有测试"
echo "  pnpm test:watch     # 监视模式"
echo "  pnpm test:coverage  # 生成覆盖率报告"
echo "  pnpm test:shared    # 运行shared包的测试"