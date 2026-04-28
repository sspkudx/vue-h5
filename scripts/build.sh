#!/bin/bash

set -e

# 配置参数
CLEAN_DIST=true
SKIP_CLEAN=false
ONLY_PACKAGES=false
ONLY_APPS=false
PARALLEL=false
CLEAN_ONLY=false
NO_COLOR=false
MAX_PARALLEL=4

# 打印彩色输出函数
print_info() {
    if [ "$NO_COLOR" = true ]; then
        echo "[INFO] $1"
    else
        echo -e "\033[1;34m[INFO]\033[0m $1"
    fi
}

print_success() {
    if [ "$NO_COLOR" = true ]; then
        echo "[SUCCESS] $1"
    else
        echo -e "\033[1;32m[SUCCESS]\033[0m $1"
    fi
}

print_error() {
    if [ "$NO_COLOR" = true ]; then
        echo "[ERROR] $1" >&2
    else
        echo -e "\033[1;31m[ERROR]\033[0m $1" >&2
    fi
}

print_warning() {
    if [ "$NO_COLOR" = true ]; then
        echo "[WARNING] $1"
    else
        echo -e "\033[1;33m[WARNING]\033[0m $1"
    fi
}

# 显示帮助信息
show_help() {
    cat << EOF
使用: ./scripts/build.sh [选项]

构建vue-h5项目的所有包和应用

选项:
  -h, --help           显示帮助信息
  --skip-clean         跳过清理旧的dist目录
  --clean-only         只清理dist目录，不构建
  --packages-only      只构建packages目录下的包
  --apps-only          只构建apps目录下的应用
  --parallel           并行构建（最多4个进程）
  --no-color           禁用彩色输出

示例:
  ./scripts/build.sh              # 完全构建
  ./scripts/build.sh --skip-clean # 构建但不清理
  ./scripts/build.sh --parallel   # 并行构建
  ./scripts/build.sh --packages-only # 只构建packages
EOF
}

# 解析命令行参数
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            --skip-clean)
                SKIP_CLEAN=true
                shift
                ;;
            --clean-only)
                CLEAN_ONLY=true
                shift
                ;;
            --packages-only)
                ONLY_PACKAGES=true
                ONLY_APPS=false
                shift
                ;;
            --apps-only)
                ONLY_APPS=true
                ONLY_PACKAGES=false
                shift
                ;;
            --parallel)
                PARALLEL=true
                shift
                ;;
            --no-color)
                NO_COLOR=true
                shift
                ;;
            *)
                print_error "未知参数: $1"
                show_help
                exit 1
                ;;
        esac
    done
}

# 检查是否在项目根目录
check_root_dir() {
    if [ ! -f "pnpm-workspace.yaml" ]; then
        print_error "请确保在项目根目录下运行此脚本"
        exit 1
    fi
}

# 检查pnpm是否安装
check_pnpm() {
    if ! command -v pnpm &> /dev/null; then
        print_error "pnpm未安装，请先安装pnpm"
        print_info "安装命令: npm install -g pnpm"
        exit 1
    fi
}

# 清理旧的dist目录
clean_dist_dirs() {
    if [ "$SKIP_CLEAN" = true ]; then
        print_info "跳过清理旧的dist目录"
        return 0
    fi
    
    print_info "清理旧的dist目录..."
    
    # 清理packages下的dist目录
    if [ -d "packages" ]; then
        find packages -name "dist" -type d -exec rm -rf {} + 2>/dev/null || true
    fi
    
    # 清理apps下的dist目录
    if [ -d "apps" ]; then
        find apps -name "dist" -type d -exec rm -rf {} + 2>/dev/null || true
    fi
    
    print_success "旧的dist目录清理完成"
}

# 构建单个包或应用
build_single() {
    local dir="$1"
    local name="$2"
    local type="$3"
    
    print_info "构建$type: $name (位于: $dir)"
    
    if ! cd "$dir" 2>/dev/null; then
        print_error "无法进入目录: $dir"
        return 1
    fi
    
    if pnpm run build; then
        print_success "$type $name 构建成功"
        cd - > /dev/null || return 1
        return 0
    else
        print_error "$type $name 构建失败"
        cd - > /dev/null || true
        return 1
    fi
}

# 并行构建函数
build_parallel() {
    local items=("$@")
    local total=${#items[@]}
    local running=0
    local completed=0
    local failed=0
    local pids=()
    
    print_info "并行构建中 (最多 $MAX_PARALLEL 个进程)..."
    
    for item in "${items[@]}"; do
        # 使用更兼容的方法解析分隔符
        local dir="${item%%|*}"
        local rest="${item#*|}"
        local name="${rest%%|*}"
        local type="${rest#*|}"
        
        while [ $running -ge $MAX_PARALLEL ]; do
            # 等待任何子进程完成
            wait -n 2>/dev/null || true
            running=$((running - 1))
            completed=$((completed + 1))
        done
        
        # 后台运行构建
        (build_single "$dir" "$name" "$type" &> "/tmp/build_${name}.log") &
        pid=$!
        pids+=($pid)
        running=$((running + 1))
        print_info "启动 $type $name (PID: $pid)"
    done
    
    # 等待所有进程完成
    for pid in "${pids[@]}"; do
        if wait $pid; then
            print_success "进程 $pid 完成"
        else
            print_error "进程 $pid 失败"
            failed=$((failed + 1))
        fi
    done
    
    echo ""
    print_info "并行构建完成统计:"
    print_info "  总计: $total 个项目"
    print_info "  成功: $((total - failed))"
    print_info "  失败: $failed"
    
    if [ $failed -gt 0 ]; then
        return 1
    fi
    return 0
}

# 构建packages目录下的所有包
build_packages() {
    # 准备参数
    local build_packages_args=""
    
    if [ "$SKIP_CLEAN" = true ]; then
        build_packages_args="$build_packages_args --skip-clean"
    fi
    
    if [ "$PARALLEL" = true ]; then
        build_packages_args="$build_packages_args --parallel"
    fi
    
    if [ "$NO_COLOR" = true ]; then
        build_packages_args="$build_packages_args --no-color"
    fi
    
    # 调用独立的build-packages.sh脚本
    if ./scripts/build-packages.sh $build_packages_args; then
        print_success "packages构建完成"
    else
        print_error "packages构建失败"
        exit 1
    fi
}

# 构建apps目录下的所有应用
build_apps() {
    if [ ! -d "apps" ]; then
        print_warning "apps目录不存在，跳过"
        return 0
    fi
    
    print_info "开始构建apps目录下的所有应用..."
    
    # 查找apps目录下的所有应用
    local apps=()
    # 使用临时文件替代进程替换，以提高兼容性
    local temp_file=$(mktemp)
    find apps -name "package.json" -type f 2>/dev/null | grep -v node_modules > "$temp_file"
    
    while IFS= read -r app_json; do
        local app_dir=$(dirname "$app_json")
        local app_name=$(basename "$app_dir")
        
        # 检查是否有build脚本
        if grep -q '"build"' "$app_json"; then
            apps+=("$app_dir|$app_name|应用")
        else
            print_warning "应用 $app_name 没有build脚本，跳过"
        fi
    done < "$temp_file"
    
    # 清理临时文件
    rm -f "$temp_file"
    
    if [ ${#apps[@]} -eq 0 ]; then
        print_warning "apps目录下没有需要构建的应用"
        return 0
    fi
    
    local app_count=${#apps[@]}
    print_info "找到 $app_count 个应用需要构建"
    
    if [ "$PARALLEL" = true ]; then
        if ! build_parallel "${apps[@]}"; then
            print_error "apps构建失败"
            exit 1
        fi
    else
        local build_count=0
        for item in "${apps[@]}"; do
            # 使用更兼容的方法解析分隔符
            local dir="${item%%|*}"
            local rest="${item#*|}"
            local name="${rest%%|*}"
            local type="${rest#*|}"
            
            if build_single "$dir" "$name" "$type"; then
                build_count=$((build_count + 1))
            else
                print_error "构建失败"
                exit 1
            fi
        done
        
        print_success "apps目录构建完成: $build_count/$app_count 个应用构建成功"
    fi
}

# 主函数
main() {
    parse_args "$@"
    
    print_info "开始构建过程..."
    
    # 检查环境
    check_root_dir
    check_pnpm
    
    # 清理旧的dist目录
    clean_dist_dirs
    
    if [ "$CLEAN_ONLY" = true ]; then
        print_info "只执行清理操作，跳过构建"
        exit 0
    fi
    
    # 记录开始时间
    local start_time=$(date +%s)
    
    # 构建packages目录下的所有依赖
    if [ "$ONLY_APPS" = false ]; then
        print_info "=== 第一步: 构建packages依赖 ==="
        build_packages
    else
        print_info "跳过packages构建 (--apps-only 模式)"
    fi
    
    # 构建apps目录下的所有应用
    if [ "$ONLY_PACKAGES" = false ]; then
        print_info "=== 第二步: 构建apps应用 ==="
        build_apps
    else
        print_info "跳过apps构建 (--packages-only 模式)"
    fi
    
    # 计算执行时间
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    print_success "所有构建任务完成!"
    print_info "构建总结:"
    
    if [ "$ONLY_APPS" = false ]; then
        print_info "  ✓ packages目录下的所有依赖已构建完成"
    fi
    
    if [ "$ONLY_PACKAGES" = false ]; then
        print_info "  ✓ apps目录下的所有应用已构建完成"
    fi
    
    print_info "  ✓ 所有构建产物已生成到各自的dist目录"
    print_info "  ⏱️  总耗时: ${duration}秒"
}

# 执行主函数
main "$@"
