import { type Plugin } from 'vue';
import { createPinia } from 'pinia';
import router from '@/router';

/** Pinia 状态管理实例 */
const store = createPinia();

/** 应用插件列表（按声明顺序注册：先路由后状态管理） */
const pluginsList = Object.freeze<Plugin[]>([router, store]);
export default pluginsList;
