import { createApp, type App as VueApp } from 'vue';
import pluginsList from './plugins';
import App from './App.vue';
import 'ress/dist/ress.min.css';

/**
 * 合并全局配置到 Vue 应用实例
 * @description 通过 Object.assign 将 configs 注入 app.config，
 * 统一管理全局配置（如 errorHandler），避免在 getAppInstance 中散落配置逻辑
 * @param app - Vue 应用实例
 * @param configs - 待合并的全局配置项（如 errorHandler 等）
 */
const hookVueAppGlobalConfig = <VA extends VueApp = VueApp>(app: VA, configs: Partial<VA['config']>) => {
    Object.assign(app.config, configs);
};

const getAppInstance = () => {
    const instance = pluginsList.reduce((current, plugin) => {
        return current.use(plugin);
    }, createApp(App));
    return instance;
};

const mountApp = <A extends VueApp>(appInstance: A) => {
    let mountElement = document.getElementById('app');
    if (!mountElement) {
        mountElement = document.createElement('div');
        mountElement.id = 'vue-app';
        if (!document.body) {
            document.documentElement.appendChild(mountElement);
        } else {
            document.body.appendChild(mountElement);
        }
    }
    return appInstance.mount(mountElement);
};

const main = () => {
    const appInstance = getAppInstance();
    // 集中注入全局配置，统一兜底错误处理，后续可接入上报（如 sentry）与用户提示
    hookVueAppGlobalConfig(appInstance, {
        // 全局错误处理：统一兜底，后续可接入上报（如 sentry）与用户提示
        errorHandler(error, instance, info) {
            console.error('[app-error]', error, instance, info);
        },
    });
    return mountApp(appInstance);
};

main();
