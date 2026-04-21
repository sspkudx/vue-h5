import { createApp } from 'vue';
import pluginsList from './plugins';
import App from './App';

function main() {
    const mainApp = createApp(App);
    return pluginsList.reduce((selfApp, plugin) => selfApp.use(plugin), mainApp).mount('#app');
}

main();
