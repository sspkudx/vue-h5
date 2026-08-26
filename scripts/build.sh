#!/bin/bash
# 构建编排薄壳：全部委托给 pnpm workspace 原生能力（-r run），
# 保留旧 CLI 参数兼容（--packages-only / --apps-only / --parallel / --skip-clean / --clean-only / --no-color）。
#
# 历史：原实现（build.sh / build-packages.sh 各约 300 行）自研"发现项目 + 串并行 + 清理 dist"逻辑，
# 已被 pnpm 原生能力取代：`pnpm -r run` 默认按依赖拓扑排序执行、workspace-concurrency（默认 4）并行。
# 与 main 分支的差异：本分支包构建走 rollup（不自动清理 dist），因此默认保留前置清理步骤。

set -euo pipefail

FILTER=""
NO_COLOR=false
CLEAN_ONLY=false
SKIP_CLEAN=false

usage() {
    cat << 'EOF'
使用: ./scripts/build.sh [选项]

构建 vue-h5 全部 workspace 成员（packages + apps）。
委托 `pnpm -r run build`（默认按依赖拓扑排序，依赖先构建，最多 4 个并行）。

选项:
  -h, --help            显示帮助
  --packages-only       只构建 packages/**
  --apps-only           只构建 apps/**
  --parallel            并行构建（pnpm 默认 workspace-concurrency=4，兼容保留）
  --skip-clean          跳过构建前清理 dist（rollup 不自动清理，默认会先清理）
  --clean-only          只清理 dist，不构建
  --no-color            禁用彩色输出

示例:
  ./scripts/build.sh              # 完全构建（先清理）
  ./scripts/build.sh --skip-clean # 构建但不清理
  ./scripts/build.sh --packages-only # 只构建 packages
EOF
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        -h | --help)
            usage
            exit 0
            ;;
        --packages-only) FILTER="./packages/**" ;;
        --apps-only) FILTER="./apps/**" ;;
        --parallel) : ;; # 兼容参数：pnpm -r run 默认即拓扑排序 + 并行
        --skip-clean) SKIP_CLEAN=true ;;
        --clean-only) CLEAN_ONLY=true ;;
        --no-color) NO_COLOR=true ;;
        *)
            echo "[ERROR] 未知参数: $1" >&2
            usage
            exit 1
            ;;
    esac
    shift
done

if [ ! -f "pnpm-workspace.yaml" ]; then
    echo "[ERROR] 请确保在项目根目录下运行此脚本" >&2
    exit 1
fi

clean_dist_dirs() {
    echo "[INFO] 清理旧的 dist 目录..."
    # 跳过 node_modules（-prune 不下钻），只清各 workspace 成员自己的 dist
    find packages apps \( -name node_modules -prune \) -o \( -name dist -type d -exec rm -rf {} + \) 2>/dev/null || true
}

if [ "$CLEAN_ONLY" = true ]; then
    clean_dist_dirs
    exit 0
fi

if [ "$SKIP_CLEAN" = false ]; then
    clean_dist_dirs
fi

PNPM_ARGS=(-r)
if [ -n "$FILTER" ]; then
    PNPM_ARGS+=(--filter "$FILTER")
fi
if [ "$NO_COLOR" = true ]; then
    export NO_COLOR=1
fi

echo "[INFO] pnpm ${PNPM_ARGS[*]} run build（-r run 默认拓扑排序 + 最多 4 并行）"
pnpm "${PNPM_ARGS[@]}" run build
