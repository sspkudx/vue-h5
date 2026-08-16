import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

/** 全局 API 基础路径，来自 .env.* 的 VITE_APP_API_URL */
const API_BASE_URL = import.meta.env.VITE_APP_API_URL || '/api';

/** 统一错误抛出的出口，后续可在此接入 toast/上报 */
const handleError = (message: string): never => {
    throw new Error(message);
};

/**
 * 创建带拦截器的 axios 实例
 * @param config - 额外配置，可覆盖默认值
 */
const createRequest = (config: AxiosRequestConfig = {}): AxiosInstance => {
    const instance = axios.create({
        baseURL: API_BASE_URL,
        timeout: 10000,
        ...config,
    });

    // 请求拦截器：注入通用参数（token、签名等）
    instance.interceptors.request.use(cfg => {
        // TODO: 接入登录后在此注入 Authorization
        return cfg;
    });

    // 响应拦截器：统一解包与错误处理
    instance.interceptors.response.use(
        response => response.data,
        error => {
            if (error.response) {
                const { status } = error.response;
                const message = error.response.data?.message || `请求失败（${status}）`;
                return handleError(message);
            }
            if (error.code === 'ECONNABORTED') {
                return handleError('请求超时，请稍后重试');
            }
            return handleError('网络异常，请检查网络连接');
        }
    );

    return instance;
};

/** 默认请求实例 */
const request = createRequest();

export default request;
