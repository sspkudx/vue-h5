#!/bin/bash

set -e

# 配置参数
SKIP_CLEAN=false
PARALLEL=false
MAX_PARALLEL=4
NO_COLOR=false

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
使用: ./scripts/build-packages.sh [选项]

构建vue-h5项目中packages目录下的所有包

选项:
  -h, --help           显示帮助信息
  --skip-clean         跳过清理旧的dist目录
  --parallel           并行构建（最多4个进程）
  --no-color           禁用彩色输出

示例:
  ./scripts/build-packages.sh              # 构建所有包（先清理）
  ./scripts/build-packages.sh --skip-clean # 构建但不清理
  ./scripts/build-packages.sh --parallel   # 并行构建
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
clean_packages_dist() {
    if [ "$SKIP_CLEAN" = true ]; then
        print_info "跳过清理packages的dist目录"
        return 0
    fi
    
    print_info "清理packages目录下的dist目录..."
    
    if [ -d "packages" ]; then
        find packages -name "dist" -type d -exec rm -rf {} + 2>/dev/null || true
        print_success "packages的dist目录清理完成"
    else
        print_warning "packages目录不存在，跳过清理"
    fi
}

# 构建单个包
build_single_package() {
    local dir="$1"
    local name="$2"
    
    print_info "构建包: $name (位于: $dir)"
    
    if ! cd "$dir" 2>/dev/null; then
        print_error "无法进入目录: $dir"
        return 1
    fi
    
    if pnpm run build; then
        print_success "包 $name 构建成功"
        cd - > /dev/null || return 1
        return 0
    else
        print_error "包 $name 构建失败"
        cd - > /dev/null || true
        return 1
    fi
}

# 并行构建函数
build_parallel_packages() {
    local items=("$@")
    local total=${#items[@]}
    local running=0
    local completed=0
    local failed=0
    local pids=()
    
    print_info "并行构建中 (最多 $MAX_PARALLEL 个进程)..."
    
    for item in "${items[@]}"; do
        IFS='|' read -r dir name <<< "$item"
        
        while [ $running -ge $MAX_PARALLEL ]; do
            # 等待任何子进程完成
            wait -n 2>/dev/null || true
            running=$((running - 1))
            completed=$((completed + 1))
        done
        
        # 后台运行构建
        (build_single_package "$dir" "$name" &> "/tmp/build_package_${name}.log") &
        pid=$!
        pids+=($pid)
        running=$((running + 1))
        print_info "启动包 $name (PID: $pid)"
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
    print_info "  总计: $total 个包"
    print_info "  成功: $((total - failed))"
    print_info "  失败: $failed"
    
    if [ $failed -gt 0 ]; then
        return 1
    fi
    return 0
}

# 构建packages目录下的所有包
build_all_packages() {
    if [ ! -d "packages" ]; then
        print_warning "packages目录不存在，跳过构建"
        return 0
    fi
    
    print_info "开始构建packages目录下的所有包..."
    
    # 查找packages目录下的所有包
    local packages=()
    while IFS= read -r pkg_json; do
        local pkg_dir=$(dirname "$pkg_json")
        local pkg_name=$(basename "$pkg_dir")
        
        # 检查是否有build脚本
        if grep -q '"build"' "$pkg_json"; then
            packages+=("$pkg_dir|$pkg_name")
        else
            print_warning "包 $pkg_name 没有build脚本，跳过"
        fi
    done < <(find packages -name "package.json" -type f 2>/dev/null | grep -v node_modules)
    
    if [ ${#packages[@]} -eq 0 ]; then
        print_warning "packages目录下没有需要构建的包"
        return 0
    fi
    
    local package_count=${#packages[@]}
    print_info "找到 $package_count 个包需要构建"
    
    if [ "$PARALLEL" = true ]; then
        if ! build_parallel_packages "${packages[@]}"; then
            print_error "packages构建失败"
            exit 1
        fi
    else
        local build_count=0
        for item in "${packages[@]}"; do
            IFS='|' read -r dir name <<< "$item"
            
            if build_single_package "$dir" "$name"; then
                build_count=$((build_count + 1))
            else
                print_error "构建失败"
                exit 1
            fi
        done
        
        print_success "packages目录构建完成: $build_count/$package_count 个包构建成功"
    fi
}

# 主函数
main() {
    parse_args "$@"
    
    print_info "开始构建packages..."
    
    # 检查环境
    check_root_dir
    check_pnpm
    
    # 清理旧的dist目录
    clean_packages_dist
    
    # 记录开始时间
    local start_time=$(date +%s)
    
    # 构建packages目录下的所有包
    build_all_packages
    
    # 计算执行时间
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    print_success "packages构建完成!"
    print_info "构建总结:"
    print_info "  ✓ packages目录下的所有依赖已构建完成"
    print_info "  ⏱️  总耗时: ${duration}秒"
}

# 执行主函数
main "$@"