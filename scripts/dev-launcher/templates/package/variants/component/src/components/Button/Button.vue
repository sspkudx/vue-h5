<template>
    <button :class="['btn', `btn-${type}`, { 'btn-disabled': disabled }]" :disabled="disabled" @click="handleClick">
        <slot />
    </button>
</template>

<script setup lang="ts">
export interface ButtonProps {
    type?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
}

const props = withDefaults(defineProps<ButtonProps>(), {
    type: 'primary',
    disabled: false,
});

const emit = defineEmits<{
    (e: 'click', event: MouseEvent): void;
}>();

const handleClick = (event: MouseEvent) => {
    if (!props.disabled) {
        emit('click', event);
    }
};
</script>

<style lang="less" scoped>
/* mpx 是项目自定义的待转换单位（非笔误）：由应用端 .postcssrc.js 的
   postcss-px-to-viewport（unitToConvert: 'mpx'，viewportWidth: 390）统一转为 vmin，
   包自身无需配置 postcss。参见 apps/example-app/.postcssrc.js */
.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8mpx 16mpx;
    border: none;
    border-radius: 4mpx;
    font-size: 14mpx;
    cursor: pointer;

    &-primary {
        background: #42b983;
        color: #fff;
    }

    &-secondary {
        background: #6c757d;
        color: #fff;
    }

    &-danger {
        background: #ef4444;
        color: #fff;
    }

    &-disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
}
</style>
