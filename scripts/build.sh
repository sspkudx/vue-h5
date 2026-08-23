#!/bin/bash
# 构建编排薄壳：全部委托给 pnpm workspace 原生能力（-r run），
# 保留旧 CLI 参数兼容（--packages-only / --apps-only / --parallel / --skip-clean / --clean-only / --no-color）。
#
# 历史：原实现（build.sh / build-packages.sh 各 ~300 行）自研"发现项目 + 串并行 + 清理 dist"逻辑，
# 已被 pnpm 原生能力取代：`pnpm -r run` 默认按依赖拓扑排序执行、workspace-concurrency（默认 4）并行、
# Vite emptyOutDir 自动清理 dist。详见 CONTEXT.md 构建编排。

set -euo pipefail

FILTER=""
NO_COLOR=false
CLEAN_ONLY=false

usage() {
    cat << 'EOF'
使用: ./scripts/build.sh [选项]

构建 vue-h5 全部 workspace 成员（packages + apps + dev-launcher-web）。
委托 `pnpm -r run build`（默认按依赖拓扑排序，依赖先构建，最多 4 个并行）。

选项:
  -h, --help            显示帮助
  --packages-only       只构建 packages/**
  --apps-only           只构建 apps/**
  --parallel            并行构建（pnpm 默认 workspace-concurrency=4，兼容保留）
  --skip-clean          跳过清理（Vite emptyOutDir 已负责清理 dist，兼容保留）
  --clean-only          只清理 dist，不构建
  --no-color            禁用彩色输出
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
        --parallel | --skip-clean) : ;; # 兼容参数：pnpm 原生并行 / Vite emptyOutDir 清理
        --clean-only) CLEAN_ONLY=true ;;
        --no-color) NO_COLOR=true ;;
        *)
            echo "未知参数: $1" >&2
            usage
            exit 1
            ;;
    esac
    shift
done

if [ "$CLEAN_ONLY" = true ]; then
    echo "[INFO] 清理 dist 目录..."
    find packages apps scripts/dev-launcher/web -name dist -type d -prune -exec rm -rf {} + 2>/dev/null || true
    exit 0
fi

PNPM_ARGS=(-r)
if [ -n "$FILTER" ]; then
    PNPM_ARGS+=(--filter "$FILTER")
fi
[ "$NO_COLOR" = true ] && export NO_COLOR=1

echo "[INFO] pnpm ${PNPM_ARGS[*]} run build（-r run 默认拓扑排序 + 最多 4 并行）"
pnpm "${PNPM_ARGS[@]}" run build
