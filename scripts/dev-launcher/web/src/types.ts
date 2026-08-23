/**
 * 启动器条目类型定义
 * @description 与 scripts/dev-launcher/core.mjs 的 scanEntries + ProcessManager.list() 输出保持一致
 */

export type EntryKind = 'app' | 'package';

export type EntryStatus = 'stopped' | 'starting' | 'running' | 'stopping' | 'done' | 'exited' | string;

export interface LauncherEntry {
    kind: EntryKind;
    /** 条目名（目录名或 extra 登记名，作为唯一标识） */
    name: string;
    displayName: string;
    description: string;
    port: number | null;
    hasDevScript: boolean;
    /** 来自 .dev-launcher.json 的手工登记条目 */
    extra: boolean;
    status: EntryStatus;
    actualPort: number | null;
    exitCode: number | null;
    startedAt: number | null;
}

export interface SelectionState {
    apps: string[] | null;
    packages: string[] | null;
}

export interface EntriesResponse {
    ok: boolean;
    entries: LauncherEntry[];
    config?: { selection?: Partial<SelectionState> };
}

export interface LogsResponse {
    ok: boolean;
    name: string;
    logs: string[];
}

export interface ActionResponse {
    ok: boolean;
    message: string;
}

/** 状态徽标文案映射 */
export const STATUS_TEXT: Record<string, string> = {
    stopped: '未启动',
    starting: '启动中',
    running: '运行中',
    stopping: '停止中',
    done: '已完成',
};

/** 状态徽标样式映射 */
export const STATUS_BADGE: Record<string, string> = {
    stopped: 'badge-stopped',
    starting: 'badge-starting',
    running: 'badge-running',
    stopping: 'badge-stopping',
    done: 'badge-done',
};
