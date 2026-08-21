#!/bin/bash
# 包 watch 构建脚本（packages/* 的 dev 脚本共用，需在包目录下执行）
# 说明：
#   1. 先执行一次完整 pnpm build（vite 清空 dist，保证无残留旧产物）
#   2. 再并行启动 vite build --watch（JS 产物）与 tsc --watch（d.ts 声明）
#   3. Ctrl+C 时通过 trap 终止整个进程组，避免残留 watcher
set -e

echo "[watch-package] 首次完整构建（清空 dist）..."
pnpm build

# 捕获退出信号，终止所有后台 watcher
trap 'kill 0' EXIT INT TERM

echo "[watch-package] 启动 watch 构建：vite（JS）+ tsc（d.ts）..."
vite build --watch --emptyOutDir false &
tsc -p tsconfig.build.json --watch &
wait
