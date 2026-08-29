<script lang="ts" setup>
import { safeNum } from '@my-app/shared';

/**
 * 首页示例组件
 * @description 展示 workspace 包（@my-app/shared）的源码联调效果：
 * safeNum 将入参安全转换为数字，非法输入兜底为 0
 */
const validNum = safeNum('123');
const invalidNum = safeNum('abc');
</script>

<template>
    <div class="home-view">
        <p class="home-view__text">首页</p>
        <p class="home-view__text home-view__text--gray">欢迎使用 vue-h5 模板</p>
        <div class="home-view__demo">
            <p>@my-app/shared 包导入示例：</p>
            <p>safeNum('123') = {{ validNum }}</p>
            <p>safeNum('abc') = {{ invalidNum }}</p>
        </div>
    </div>
</template>

<style lang="less" scoped>
.home-view {
    display: flex;
    flex-flow: column;
    align-items: center;

    &__text {
        margin-bottom: 12mpx;
        font-size: 24mpx;

        &:last-child {
            margin-bottom: 0;
        }

        &--gray {
            color: #818999;
        }
    }

    &__demo {
        margin-top: 24mpx;
        padding: 16mpx 24mpx;
        border-radius: 8mpx;
        background: #f6f7f9;
    }
}
</style>
