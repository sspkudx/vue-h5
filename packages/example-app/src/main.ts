import { createApp } from 'vue';
import pluginsList from './plugins';
import App from './App';

function main() {
    const mainApp = pluginsList.reduce((_app, plugin) => {
        return _app.use(plugin);
    }, createApp(App));

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
    return mainApp.mount(mountElement);
}

main();
