<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { createApp, createPackage, fetchPkgInstallStatus, pkgInstall } from '../api';
import type { CreateResponse } from '../types';

/** 对话框形态：新建应用 / 新建包 */
const props = defineProps<{
    kind: 'app' | 'package';
}>();
const emit = defineEmits<{
    /** 创建成功（或发起安装）后通知父组件刷新列表 */
    created: [];
    close: [];
}>();

/** 当前激活 tab（应用 / 包） */
const activeTab = ref<'app' | 'package'>(props.kind === 'app' ? 'app' : 'package');

/** 提交状态 */
const submitting = ref(false);
const error = ref('');
const success = ref<{ message: string; result: CreateResponse } | null>(null);
/** pnpm install 后台执行状态 */
const installRunning = ref(false);

/** 应用表单 */
const appForm = reactive({
    name: '',
    port: '' as string,
    withScripts: true,
});

/** 包表单 */
const pkgForm = reactive({
    name: '',
    description: '',
    type: 'utility' as 'utility' | 'component' | 'helper' | 'plugin',
    withTests: true,
});

const PACKAGE_TYPES: Array<{ value: 'utility' | 'component' | 'helper' | 'plugin'; label: string; hint: string }> = [
    { value: 'utility', label: '工具库', hint: '通用工具函数，纯 TS' },
    { value: 'component', label: '组件库', hint: 'Vue 3 组件，peerDependencies 声明 vue' },
    { value: 'helper', label: '工具函数集', hint: '业务相关工具函数' },
    { value: 'plugin', label: '插件库', hint: 'Vue 插件（App.use）' },
];

/** 简洁校验（服务端仍会二次校验返回明确错误） */
const appError = computed(() => {
    if (!appForm.name.trim()) return '请输入应用名称';
    if (!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(appForm.name.trim()))
        return '名称需为小写字母/数字/连字符，不能以连字符开头';
    if (
        appForm.port !== '' &&
        (!/^\d+$/.test(appForm.port) || Number(appForm.port) < 1024 || Number(appForm.port) > 65535)
    ) {
        return '端口需为 1024-65535 的数字';
    }
    return '';
});

const pkgError = computed(() => {
    if (!pkgForm.name.trim()) return '请输入包名称';
    if (!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(pkgForm.name.trim()))
        return '名称需为小写字母/数字/连字符，不能以连字符开头';
    return '';
});

const selectPackageType = (value: string) => {
    if (PACKAGE_TYPES.some(item => item.value === value)) {
        pkgForm.type = value as typeof pkgForm.type;
    }
};

const submitDisabled = computed(
    () => (activeTab.value === 'app' ? Boolean(appError.value) : Boolean(pkgError.value)) || submitting.value
);

const openCreate = async () => {
    error.value = '';
    submitting.value = true;
    try {
        const data =
            activeTab.value === 'app'
                ? await createApp({
                      name: appForm.name.trim(),
                      port: appForm.port ? Number(appForm.port) : undefined,
                      withScripts: appForm.withScripts,
                  })
                : await createPackage({
                      name: pkgForm.name.trim(),
                      description: pkgForm.description.trim() || undefined,
                      type: pkgForm.type,
                      withTests: pkgForm.withTests,
                  });
        if (!data.ok) {
            error.value = data.message;
            return;
        }
        success.value = { message: data.message, result: data };
        emit('created');
    } catch {
        error.value = '网络错误，请确认启动器后端已运行';
    } finally {
        submitting.value = false;
    }
};

/** 创建成功后触发 pnpm install（新包首次入 workspace 锁文件） */
const runInstall = async () => {
    installRunning.value = true;
    error.value = '';
    try {
        const data = await pkgInstall();
        if (!data.ok) {
            error.value = data.message;
            installRunning.value = false;
        }
        // 成功后即开启轮询状态
        if (data.ok) {
            pollPkgInstall();
        }
    } catch {
        error.value = '发起 pnpm install 失败';
        installRunning.value = false;
    }
};

let installTimer: ReturnType<typeof setInterval> | null = null;

const pollPkgInstall = () => {
    if (installTimer) {
        return;
    }
    installRunning.value = true;
    installTimer = setInterval(async () => {
        try {
            const data = await fetchPkgInstallStatus();
            if (data.done && !data.running) {
                clearInterval(installTimer!);
                installTimer = null;
                installRunning.value = false;
                emit('created');
            }
        } catch {
            /* 轮询失败不中断 */
        }
    }, 1500);
};

const closeDialog = () => {
    if (installTimer) {
        clearInterval(installTimer);
        installTimer = null;
    }
    emit('close');
};

const reset = () => {
    error.value = '';
    success.value = null;
    appForm.name = '';
    appForm.port = '';
    pkgForm.name = '';
    pkgForm.description = '';
};
</script>

<template>
    <div class="dialog-mask" @click.self="closeDialog">
        <div class="dialog">
            <div class="dialog-header">
                <h3>在启动器中新建</h3>
                <button type="button" class="dialog-close" @click="closeDialog">×</button>
            </div>

            <div v-if="!success" class="dialog-body">
                <div class="dialog-tabs">
                    <button
                        type="button"
                        class="tab"
                        :class="{ active: activeTab === 'app' }"
                        @click="
                            activeTab = 'app';
                            reset();
                        "
                    >
                        应用
                    </button>
                    <button
                        type="button"
                        class="tab"
                        :class="{ active: activeTab === 'package' }"
                        @click="
                            activeTab = 'package';
                            reset();
                        "
                    >
                        包
                    </button>
                </div>

                <form v-if="activeTab === 'app'" @submit.prevent="openCreate">
                    <label class="field">
                        <span class="field-label">应用名称 <em>必填</em></span>
                        <input v-model="appForm.name" class="input" placeholder="如 my-app、admin-panel" />
                        <span class="field-hint">小写字母/数字/连字符；将创建 apps/&lt;名称&gt; 并自动出现在列表</span>
                    </label>
                    <label class="field">
                        <span class="field-label">端口号</span>
                        <input v-model="appForm.port" class="input" placeholder="默认 3000（1024-65535，自动查重）" />
                    </label>
                    <label class="checkbox-row">
                        <input v-model="appForm.withScripts" type="checkbox" />
                        <span>同时在根 package.json 添加 dev/build/lint:&lt;名称&gt; 脚本</span>
                    </label>
                    <p v-if="appError" class="form-error">{{ appError }}</p>
                </form>

                <form v-else @submit.prevent="openCreate">
                    <label class="field">
                        <span class="field-label">包名称 <em>必填</em></span>
                        <input v-model="pkgForm.name" class="input" placeholder="如 utils、ui-components" />
                        <span class="field-hint">将创建 packages/&lt;名称&gt;，包名为 @my-app/&lt;名称&gt;</span>
                    </label>
                    <label class="field">
                        <span class="field-label">包描述</span>
                        <input v-model="pkgForm.description" class="input" placeholder="简短说明包的用途（可选）" />
                    </label>
                    <div class="field">
                        <span class="field-label">包类型</span>
                        <div class="type-list">
                            <button
                                v-for="item in PACKAGE_TYPES"
                                :key="item.value"
                                type="button"
                                class="type-option"
                                :class="{ active: pkgForm.type === item.value }"
                                @click="selectPackageType(item.value)"
                            >
                                <span class="type-name">{{ item.label }}</span>
                                <span class="type-hint">{{ item.hint }}</span>
                            </button>
                        </div>
                    </div>
                    <label class="checkbox-row">
                        <input v-model="pkgForm.withTests" type="checkbox" />
                        <span>附带基础单元测试（__tests__）</span>
                    </label>
                    <p v-if="pkgError" class="form-error">{{ pkgError }}</p>
                </form>
            </div>

            <div v-else class="dialog-body">
                <div class="success-panel">
                    <p class="success-title">创建成功</p>
                    <p class="success-message">{{ success.message }}</p>
                    <p class="success-hint">
                        <template v-if="activeTab === 'package'"
                            >新包首次入 workspace 锁文件需要执行 pnpm install；完成后即可在列表中勾选启动。</template
                        >
                        <template v-else>新应用已出现在「应用」列表（每次刷新实时扫描），可勾选直接启动。</template>
                    </p>
                </div>
            </div>

            <div v-if="error" class="error-message">{{ error }}</div>

            <div class="dialog-footer">
                <template v-if="!success">
                    <button type="button" class="btn btn-secondary" @click="closeDialog">取消</button>
                    <button type="button" class="btn btn-primary" :disabled="submitDisabled" @click="openCreate">
                        {{ submitting ? '创建中…' : '创建' }}
                    </button>
                </template>
                <template v-else>
                    <button
                        v-if="activeTab === 'package'"
                        type="button"
                        class="btn btn-primary"
                        :disabled="installRunning"
                        @click="runInstall"
                    >
                        {{ installRunning ? '安装中…' : '后台执行 pnpm install' }}
                    </button>
                    <button type="button" class="btn btn-secondary" @click="closeDialog">完成</button>
                </template>
            </div>
        </div>
    </div>
</template>
