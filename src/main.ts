import { createApp } from 'vue';
import App from './App';
import { plugins } from './plugins';
import '@/assets/global-conf.less';

function main() {
    const mainApp = createApp(App);
    return plugins.reduce((app, plugin) => app.use(plugin), mainApp).mount('#app');
}

main();
