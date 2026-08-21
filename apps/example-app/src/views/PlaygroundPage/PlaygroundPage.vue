<script lang="ts" setup>
import { shallowRef } from 'vue';

/**
 * 演示页：计数器
 * @description 示例 shallowRef 的基础用法：点击按钮递增计数，
 * 页面展示当前计数值
 */
const countValue = shallowRef(0);

const addCount = () => {
    countValue.value++;
};
</script>

<template>
    <div class="playground-page">
        <button class="playground-page__button" type="button" @click="addCount">+1</button>
        <p class="playground-page__text">当前计数：{{ countValue }}</p>
    </div>
</template>

<style lang="less" scoped>
.playground-page {
    display: flex;
    flex-flow: column;

    &__button {
        margin-right: 10px;
    }

    &__text {
        margin-top: 10px;
    }
}
</style>
