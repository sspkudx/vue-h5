<script setup lang="ts">
import { computed, ref } from 'vue';
import { fetchLogs, startEntry, stopEntry } from '../api';
import { STATUS_BADGE, STATUS_TEXT, type LauncherEntry } from '../types';

const props = defineProps<{
    entry: LauncherEntry;
    /** 是否勾选（由父组件依据勾选记忆计算） */
    checked: boolean;
    /** 日志区是否展开（父组件按条目名持久化，轮询刷新不丢失） */
    logsOpen: boolean;
}>();

const emit = defineEmits<{
    /** 勾选变化（v-model 语义） */
    'update:checked': [checked: boolean];
    /** 展开/收起日志 */
    'update:logsOpen': [open: boolean];
    /** 启动/停止完成后通知父组件立即刷新 */
    changed: [];
}>();

/** 日志内容与加载状态 */
const logsText = ref('');
const actionPending = ref(false);

const port = computed(() => props.entry.actualPort ?? props.entry.port);

const statusText = computed(() =>
    props.entry.status === 'exited'
        ? `已退出（code=${props.entry.exitCode}）`
        : (STATUS_TEXT[props.entry.status] ?? props.entry.status)
);

const badgeClass = computed(() => STATUS_BADGE[props.entry.status] ?? 'badge-stopped');

const link = computed(() => (props.entry.kind === 'app' && port.value ? `http://localhost:${port.value}` : ''));

const running = computed(() => props.entry.status === 'running' || props.entry.status === 'starting');

const desc = computed(() => props.entry.description || (props.entry.extra ? '手工登记条目' : '（无描述）'));

const onCheck = (event: Event) => {
    emit('update:checked', (event.target as HTMLInputElement).checked);
};

/** 展开时拉取一次日志；供父组件在轮询中对已展开条目持续刷新 */
const loadLogs = async () => {
    const data = await fetchLogs(props.entry.name);
    logsText.value = data.logs?.length ? data.logs.join('\n') : '（暂无日志）';
};

const toggleLogs = async () => {
    const open = !props.logsOpen;
    emit('update:logsOpen', open);
    if (open) {
        await loadLogs();
    }
};

const toggleAction = async () => {
    actionPending.value = true;
    try {
        if (running.value) {
            await stopEntry(props.entry.name);
        } else {
            await startEntry(props.entry.name);
        }
    } finally {
        actionPending.value = false;
        emit('changed');
    }
};

defineExpose({ loadLogs });
</script>

<template>
    <div class="entry-card">
        <div class="entry-row">
            <input type="checkbox" :checked="checked" @change="onCheck" />
            <div>
                <div class="entry-name">{{ entry.displayName }}</div>
                <div class="entry-desc">{{ desc }}</div>
            </div>
            <div class="entry-meta">
                <span v-if="entry.kind === 'app'">端口 {{ port }}</span>
                <span v-else>{{ entry.hasDevScript ? 'watch 构建' : '构建一次' }}</span>
                <span class="badge" :class="badgeClass">{{ statusText }}</span>
            </div>
        </div>
        <div class="entry-row" style="margin-top: 6px">
            <a v-if="link" :href="link" target="_blank" rel="noopener">打开应用 →</a>
            <button type="button" class="btn logs-toggle" @click="toggleLogs">
                {{ logsOpen ? '收起日志' : '查看日志' }}
            </button>
            <button
                type="button"
                class="btn"
                :class="running ? 'btn-danger' : 'btn-primary'"
                style="margin-left: auto"
                :disabled="actionPending"
                @click="toggleAction"
            >
                {{ running ? '停止' : '启动' }}
            </button>
        </div>
        <div class="logs-box" :class="{ open: logsOpen }">{{ logsText }}</div>
    </div>
</template>
