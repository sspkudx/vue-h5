/**
 * 启动器后端 API 封装
 * @description 与 scripts/dev-launcher/server.mjs 的 JSON API 一一对应
 */

import type { ActionResponse, EntriesResponse, LogsResponse, SelectionState } from './types';

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
