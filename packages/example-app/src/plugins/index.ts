import { type Plugin } from 'vue';
import { createPinia } from 'pinia';
import router from '@/router';

/** Pinia instance */
const store = createPinia();

const pluginsList = Object.freeze<Plugin[]>([router, store]);
export default pluginsList;
