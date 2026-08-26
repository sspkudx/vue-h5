<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { fetchEntries, saveSelection, startEntry, stopAll } from './api';
import EntryCard from './components/EntryCard.vue';
import type { LauncherEntry, SelectionState } from './types';

/** 主题本地存储键 */
const THEME_KEY = 'dev-launcher-theme';
type Theme = 'light' | 'dark';

/** 读取主题：localStorage > 系统偏好 > 默认浅色 */
const resolveInitialTheme = (): Theme => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') {
        return saved;
    }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const theme = ref<Theme>(resolveInitialTheme());

/** 应用主题到 documentElement 并持久化 */
const applyTheme = (value: Theme) => {
    document.documentElement.setAttribute('data-theme', value);
    localStorage.setItem(THEME_KEY, value);
};

const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark';
    applyTheme(theme.value);
};

/** 轮询间隔（与原实现一致） */
const POLL_INTERVAL = 3000;

/** 当前条目缓存与勾选记忆缓存 */
const entries = ref<LauncherEntry[]>([]);
const selection = reactive<SelectionState>({ apps: null, packages: null });
/** 各条目日志区展开状态（按条目名持久化，轮询刷新不折叠） */
const logsOpen = reactive<Record<string, boolean>>({});
const lastUpdated = ref('');

/** 条目卡片实例引用（用于轮询时刷新已展开的日志） */
const cardRefs = new Map<string, InstanceType<typeof EntryCard>>();
const setCardRef = (name: string, el: unknown) => {
    if (el) {
        cardRefs.set(name, el as InstanceType<typeof EntryCard>);
    } else {
        cardRefs.delete(name);
    }
};

const appEntries = computed(() => entries.value.filter(entry => !entry.extra && entry.kind === 'app'));
const packageEntries = computed(() => entries.value.filter(entry => !entry.extra && entry.kind === 'package'));
const extraEntries = computed(() => entries.value.filter(entry => entry.extra));

/** 按 kind 收集全部条目名（含手工登记条目，与原实现一致） */
const namesOfKind = (kind: LauncherEntry['kind']) =>
    entries.value.filter(entry => entry.kind === kind).map(entry => entry.name);

/** 当前条目是否已勾选（记忆为 null 时视为全选） */
const isChecked = (entry: LauncherEntry) => {
    const saved = entry.kind === 'app' ? selection.apps : selection.packages;
    return Array.isArray(saved) ? saved.includes(entry.name) : true;
};

/** 勾选变化：更新记忆并持久化 */
const onCheckChange = (entry: LauncherEntry, checked: boolean) => {
    const key = entry.kind === 'app' ? 'apps' : 'packages';
    const saved = selection[key];
    const list = Array.isArray(saved)
        ? saved
        : entries.value.filter(item => item.kind === entry.kind).map(item => item.name);
    selection[key] = checked ? [...new Set([...list, entry.name])] : list.filter(name => name !== entry.name);
    saveSelection({ ...selection });
};

/** 拉取条目；首次无记忆时按「全选」回填并持久化 */
const refresh = async () => {
    const data = await fetchEntries();
    entries.value = data.entries ?? [];
    const saved = data.config?.selection;
    if (saved) {
        selection.apps = Array.isArray(saved.apps) ? saved.apps : selection.apps;
        selection.packages = Array.isArray(saved.packages) ? saved.packages : selection.packages;
    }

    // 首次启动无记忆时，按「全选」回填并持久化，后续保持用户的选择
    if (!Array.isArray(selection.apps) && !Array.isArray(selection.packages) && entries.value.length > 0) {
        selection.apps = namesOfKind('app');
        selection.packages = namesOfKind('package');
        saveSelection({ ...selection });
    }

    // 已展开的日志区跟随轮询持续刷新
    await Promise.all(
        Object.keys(logsOpen)
            .filter(name => logsOpen[name])
            .map(name => cardRefs.get(name)?.loadLogs())
    );

    lastUpdated.value = `更新于 ${new Date().toLocaleTimeString('zh-Hans')}`;
};

/** 全选/全不选（作用于当前渲染的全部条目，与原实现一致） */
const setAllChecked = (checked: boolean) => {
    selection.apps = checked ? namesOfKind('app') : [];
    selection.packages = checked ? namesOfKind('package') : [];
    if (checked && entries.value.length === 0) {
        selection.apps = null;
        selection.packages = null;
    }
    saveSelection({ ...selection });
};

/** 启动所有已勾选条目（跳过已在运行的） */
const startSelected = async () => {
    const targets = entries.value.filter(
        entry => isChecked(entry) && entry.status !== 'running' && entry.status !== 'starting'
    );
    for (const entry of targets) {
        await startEntry(entry.name);
    }
    await refresh();
};

/** 停止全部服务 */
const onStopAll = async () => {
    await stopAll();
    await refresh();
};

let pollingTimer: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
    applyTheme(theme.value);
    refresh();
    pollingTimer = setInterval(refresh, POLL_INTERVAL);
});

onBeforeUnmount(() => {
    if (pollingTimer) {
        clearInterval(pollingTimer);
    }
});
</script>

<template>
    <header class="header">
        <div class="header-title">
            <h1>vue-h5 开发启动器</h1>
            <p class="subtitle">勾选要启动的应用与包，服务日志实时输出在启动终端</p>
        </div>
        <button
            type="button"
            class="theme-toggle"
            :title="theme === 'dark' ? '切换到浅色' : '切换到深色'"
            @click="toggleTheme"
        >
            {{ theme === 'dark' ? '☀' : '☾' }}
        </button>
    </header>

    <main class="main">
        <section class="toolbar">
            <button type="button" class="btn btn-secondary" @click="setAllChecked(true)">全选</button>
            <button type="button" class="btn btn-secondary" @click="setAllChecked(false)">全不选</button>
            <button type="button" class="btn btn-primary" @click="startSelected">启动所选</button>
            <button type="button" class="btn btn-danger" @click="onStopAll">停止全部</button>
            <button type="button" class="btn btn-secondary" @click="refresh">刷新</button>
            <span class="last-updated">{{ lastUpdated }}</span>
        </section>

        <section class="section">
            <div class="section-header">
                <h2>应用</h2>
                <span class="section-tip">启动 dev server</span>
                <span class="section-count">{{ appEntries.length }}</span>
            </div>
            <div v-if="appEntries.length" class="entry-list">
                <EntryCard
                    v-for="entry in appEntries"
                    :key="entry.name"
                    :ref="el => setCardRef(entry.name, el)"
                    :entry="entry"
                    :checked="isChecked(entry)"
                    :logs-open="Boolean(logsOpen[entry.name])"
                    @update:checked="onCheckChange(entry, $event)"
                    @update:logs-open="logsOpen[entry.name] = $event"
                    @changed="refresh"
                />
            </div>
            <div v-else class="empty-state">apps/ 目录下暂无应用</div>
        </section>

        <section class="section">
            <div class="section-header">
                <h2>包</h2>
                <span class="section-tip">有 dev 脚本或 build --watch 为持续构建，否则构建一次</span>
                <span class="section-count">{{ packageEntries.length }}</span>
            </div>
            <div v-if="packageEntries.length" class="entry-list">
                <EntryCard
                    v-for="entry in packageEntries"
                    :key="entry.name"
                    :ref="el => setCardRef(entry.name, el)"
                    :entry="entry"
                    :checked="isChecked(entry)"
                    :logs-open="Boolean(logsOpen[entry.name])"
                    @update:checked="onCheckChange(entry, $event)"
                    @update:logs-open="logsOpen[entry.name] = $event"
                    @changed="refresh"
                />
            </div>
            <div v-else class="empty-state">packages/ 目录下暂无包</div>
        </section>

        <section v-if="extraEntries.length" class="section">
            <div class="section-header">
                <h2>手工登记条目</h2>
                <span class="section-tip">来自 .dev-launcher.json 的 extra</span>
                <span class="section-count">{{ extraEntries.length }}</span>
            </div>
            <div class="entry-list">
                <EntryCard
                    v-for="entry in extraEntries"
                    :key="entry.name"
                    :ref="el => setCardRef(entry.name, el)"
                    :entry="entry"
                    :checked="isChecked(entry)"
                    :logs-open="Boolean(logsOpen[entry.name])"
                    @update:checked="onCheckChange(entry, $event)"
                    @update:logs-open="logsOpen[entry.name] = $event"
                    @changed="refresh"
                />
            </div>
        </section>
    </main>
</template>
