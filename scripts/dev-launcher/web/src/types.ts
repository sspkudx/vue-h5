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
    /** build 脚本含 --watch，无 dev 脚本时也按 watch 构建持续运行 */
    buildIsWatch: boolean;
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

/** 新建应用请求 */
export interface CreateAppRequest {
    name: string;
    port?: number;
    /** 是否同时更新根 package.json 的 dev/build/lint:{name} 脚本（默认 true） */
    withScripts?: boolean;
}

/** 新建包请求 */
export interface CreatePackageRequest {
    name: string;
    description?: string;
    type: 'utility' | 'component' | 'helper' | 'plugin';
    withTests?: boolean;
}

/** 创建成功响应（含生成文件清单） */
export interface CreateResponse extends ActionResponse {
    dir: string;
    files: string[];
    scripts?: string[];
    tests?: string[];
}

/** pnpm install 状态 */
export interface PkgInstallStatusResponse {
    ok: boolean;
    running: boolean;
    done: boolean;
    exitCode: number | null;
    logs: string[];
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
