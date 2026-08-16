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

/**
 * 创建 Vue 应用实例并注册全部插件
 * @description 以根组件 App 创建应用实例，
 * 通过 reduce 依次注册 pluginsList 中的插件（如 router、pinia），
 * 保证插件按声明顺序完成挂载
 * @returns 完成插件注册的 Vue 应用实例
 */
const getAppInstance = () => {
    const instance = pluginsList.reduce((current, plugin) => {
        return current.use(plugin);
    }, createApp(App));
    return instance;
};

/**
 * 将应用挂载到 DOM
 * @description 优先挂载到页面已有的 #app 元素；
 * 不存在时自动创建 id 为 vue-app 的 div 并追加到 body（body 未就绪时退化为 documentElement），
 * 保证任意加载时机下都能正常挂载
 * @param appInstance - 已完成配置与插件注册的 Vue 应用实例
 * @returns 挂载完成后的根组件实例
 */
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

/**
 * 应用入口
 * @description 创建应用实例 → 注入全局配置（错误兜底等）→ 挂载到 DOM，
 * 返回挂载后的根组件实例，便于调试或后续扩展
 * @returns 挂载完成后的根组件实例
 */
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
