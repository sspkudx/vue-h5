/**
 * 启动器后端 API 封装
 * @description 与 scripts/dev-launcher/server.mjs 的 JSON API 一一对应
 */

import type {
    ActionResponse,
    CreateAppRequest,
    CreatePackageRequest,
    CreateResponse,
    EntriesResponse,
    LogsResponse,
    PkgInstallStatusResponse,
    SelectionState,
} from './types';

/** 轻量请求封装 */
const request = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
    const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });
    return (await res.json()) as T;
};

/** 条目列表（后端每次请求实时重扫，新增即出现） */
export const fetchEntries = () => request<EntriesResponse>('/api/entries');

/** 某条目的最近日志（环形缓冲） */
export const fetchLogs = (name: string) => request<LogsResponse>(`/api/logs?name=${encodeURIComponent(name)}`);

/** 保存勾选记忆 */
export const saveSelection = (selection: SelectionState) =>
    request<ActionResponse>('/api/selection', { method: 'POST', body: JSON.stringify(selection) });

/** 启动条目 */
export const startEntry = (name: string) =>
    request<ActionResponse>('/api/start', { method: 'POST', body: JSON.stringify({ name }) });

/** 停止条目 */
export const stopEntry = (name: string) =>
    request<ActionResponse>('/api/stop', { method: 'POST', body: JSON.stringify({ name }) });

/** 停止全部 */
export const stopAll = () => request<ActionResponse>('/api/stop-all', { method: 'POST' });

/** 新建应用（模板来自 templates/app/） */
export const createApp = (payload: CreateAppRequest) =>
    request<CreateResponse>('/api/create-app', { method: 'POST', body: JSON.stringify(payload) });

/** 新建依赖包（模板来自 templates/package/，按类型展开） */
export const createPackage = (payload: CreatePackageRequest) =>
    request<CreateResponse>('/api/create-package', { method: 'POST', body: JSON.stringify(payload) });

/** 后台执行 pnpm install（新包首次入 workspace 锁文件时使用） */
export const pkgInstall = () => request<ActionResponse>('/api/pkg-install', { method: 'POST' });

/** 查询 pnpm install 运行状态与日志 */
export const fetchPkgInstallStatus = () => request<PkgInstallStatusResponse>('/api/pkg-install/status');
