/**
 * CLI 交互模式（pnpm dev --cli）
 * @description 终端多选要启动的应用与包（@clack/prompts），选中即拉起对应服务，
 * 日志带 [名称] 前缀实时输出，Ctrl+C 停止全部并退出
 */

import { cancel, isCancel, log, multiselect, note } from '@clack/prompts';
import { loadConfig, ProcessManager, saveConfig } from './core.mjs';
import { scanEntries } from './core.mjs';

/** 启动选项渲染用的单选/多选描述 */
const entryHint = entry => {
    if (entry.kind === 'app') {
        return `端口 ${entry.port}${entry.description ? ` · ${entry.description}` : ''}`;
    }
    return entry.hasDevScript ? 'watch 构建' : '无 dev 脚本，构建一次';
};

/** 从配置读取上次勾选（null 表示首次，按全选处理） */
const initialSelection = (entries, key) => {
    const saved = loadConfig().selection?.[key];
    if (Array.isArray(saved)) {
        return saved.filter(name => entries.some(entry => entry.name === name));
    }
    return entries.map(entry => entry.name);
};

/**
 * CLI 主流程
 * @returns 退出码
 */
export const runCli = async () => {
    // 非 TTY 环境（管道/CI）下 @clack/prompts 无法交互，给出明确提示
    if (!process.stdout.isTTY) {
        log.error('CLI 模式需要交互终端，请直接在终端运行 pnpm dev --cli');
        return 1;
    }

    const entries = scanEntries();
    const apps = entries.filter(entry => entry.kind === 'app');
    const packages = entries.filter(entry => entry.kind === 'package');

    if (apps.length === 0 && packages.length === 0) {
        log.error('未发现可启动的应用或包（apps/、packages/ 目录为空）');
        return 1;
    }

    const manager = new ProcessManager((name, line) => {
        console.log(`[${name}] ${line}`);
    });

    const selectedApps = await multiselect({
        message: '选择要启动的应用（空格勾选，回车确认）',
        options: apps.map(entry => ({
            value: entry.name,
            label: entry.name,
            hint: entryHint(entry),
        })),
        required: false,
        initialValues: initialSelection(entries, 'apps'),
    });
    if (isCancel(selectedApps)) {
        cancel('已取消');
        return 0;
    }

    const selectedPackages = await multiselect({
        message: '选择要构建的包（有 dev 脚本为 watch 构建，否则构建一次）',
        options: packages.map(entry => ({
            value: entry.name,
            label: entry.name,
            hint: entryHint(entry),
        })),
        required: false,
        initialValues: initialSelection(entries, 'packages'),
    });
    if (isCancel(selectedPackages)) {
        cancel('已取消');
        return 0;
    }

    const chosen = [...selectedApps, ...selectedPackages];
    if (chosen.length === 0) {
        log.warn('未选择任何条目，直接退出');
        return 0;
    }

    // 持久化本次勾选，Web 控制台与下次 CLI 共享记忆
    saveConfig({
        ...loadConfig(),
        selection: { apps: selectedApps, packages: selectedPackages },
    });

    const targets = entries.filter(entry => chosen.includes(entry.name));
    for (const entry of targets) {
        const result = manager.start(entry);
        log[result.ok ? 'info' : 'warn'](`${entry.name}: ${result.message}`);
    }

    note(`已启动 ${targets.length} 个服务，日志实时输出中。按 Ctrl+C 停止全部并退出。`, '运行中');

    // Ctrl+C：先停止全部子进程再退出，避免残留 vite/tsc
    const handleExit = () => {
        console.log('\n正在停止全部服务...');
        manager.stopAll();
        setTimeout(() => process.exit(0), 800);
    };
    process.on('SIGINT', handleExit);
    process.on('SIGTERM', handleExit);

    // 常驻等待：子进程事件循环保持存活，这里仅兜底（若所有子进程退出则提示）
    await new Promise(() => {});
    return 0;
};
