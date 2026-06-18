<script lang="ts" setup>
import { shallowRef } from 'vue';

const countValue = shallowRef(0);

const addCount = () => {
    countValue.value++;
};
</script>

<template>
    <div class="playground-page">
        <button class="playground-page__button" type="button" @click="addCount">++</button>
        <p class="playground-page__text">Current count is: {{ countValue }}</p>
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
