import type { App } from 'vue';

export interface AuthPluginOptions {
    tokenKey?: string;
}

/**
 * 认证插件示例
 * @description 通过 app.use 安装后，提供 $auth（setToken/getToken/clearToken）
 */
export const authPlugin = {
    install(app: App, options: AuthPluginOptions = {}) {
        const { tokenKey = 'token' } = options;

        const setToken = (token: string) => {
            localStorage.setItem(tokenKey, token);
        };
        const getToken = () => localStorage.getItem(tokenKey);
        const clearToken = () => {
            localStorage.removeItem(tokenKey);
        };

        app.config.globalProperties.$auth = { setToken, getToken, clearToken };
    },
};
