import { type Plugin } from 'vue';
import { createPinia } from 'pinia';
import router from '@/router';

const store = createPinia();
const pluginsList = Object.freeze<Plugin[]>([router, store]);

export { store };
export default pluginsList;
