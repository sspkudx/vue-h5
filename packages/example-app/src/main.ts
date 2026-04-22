import { createApp } from 'vue';
import pluginsList from './plugins';
import App from './App';

function main() {
    const mainApp = pluginsList.reduce((_app, plugin) => {
        return _app.use(plugin);
    }, createApp(App));

    let mountElement = document.getElementById('app');
    if (!mountElement) {
        ({ body: mountElement } = document);
    }
    return mainApp.mount(mountElement);
}

main();
