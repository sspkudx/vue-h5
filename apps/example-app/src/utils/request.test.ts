import type { AxiosAdapter, AxiosResponse } from 'axios';
import { describe, expect, test } from 'vitest';
import { createRequest } from './request';

/**
 * 请求层（axios 拦截器）单元测试
 * @description 通过注入自定义 adapter 驱动 axios 错误分支，验证响应拦截器的统一错误映射：
 * 业务错误（response.status）→ 后端 message；超时（ECONNABORTED）→ 超时提示；其余 → 网络异常。
 */

/** 成功响应 adapter：返回最小 AxiosResponse（config 细节对测试无关紧要，作 never 断言） */
const successAdapter: AxiosAdapter = () =>
    Promise.resolve({
        data: { ok: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
    } as unknown as AxiosResponse);

/** 失败 adapter：同步抛错，axios 会将其包装后交给响应拦截器的错误分支 */
const rejectAdapter =
    (rejectWith: unknown): AxiosAdapter =>
    () => {
        throw rejectWith;
    };

describe('request（axios 拦截器统一错误处理）', () => {
    test('成功响应：响应拦截器返回 response.data', async () => {
        const req = createRequest({ adapter: successAdapter });
        await expect(req.get('/users')).resolves.toEqual({ ok: true });
    });

    test('业务错误（500 + 后端 message）：抛出后端 message', async () => {
        const req = createRequest({
            adapter: rejectAdapter({ response: { status: 500, data: { message: '服务器开小差' } }, config: {} }),
        });
        await expect(req.get('/users')).rejects.toThrow('服务器开小差');
    });

    test('业务错误（404 无 message）：兜底"请求失败（404）"', async () => {
        const req = createRequest({
            adapter: rejectAdapter({ response: { status: 404, data: {} }, config: {} }),
        });
        await expect(req.get('/users')).rejects.toThrow('请求失败（404）');
    });

    test('超时（ECONNABORTED）：抛出超时提示', async () => {
        const req = createRequest({ adapter: rejectAdapter({ code: 'ECONNABORTED', config: {} }) });
        await expect(req.get('/users')).rejects.toThrow('请求超时，请稍后重试');
    });

    test('其他网络错误：抛出网络异常提示', async () => {
        const req = createRequest({ adapter: rejectAdapter({ code: 'ERR_NETWORK', config: {} }) });
        await expect(req.get('/users')).rejects.toThrow('网络异常，请检查网络连接');
    });
});
