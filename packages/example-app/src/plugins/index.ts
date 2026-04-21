import { Plugin } from 'vue';
import router from '@/router';

const pluginsList = Object.freeze<Plugin[]>([router]);

export default pluginsList;
