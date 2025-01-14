import { createApp } from 'vue';
import App from './App.vue';
import { plugins } from './plugins';
import '@/assets/styles/less/global-conf.less';

function main() {
    const mainApp = createApp(App);
    return plugins.reduce((app, plugin) => app.use(plugin), mainApp).mount('#app');
}

main();
