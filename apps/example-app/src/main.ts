import { createApp, type App as VueApp } from 'vue';
import pluginsList from './plugins';
import App from './App.vue';
import 'ress/dist/ress.min.css';

const getAppInstance = () => {
    const instance = pluginsList.reduce((current, plugin) => {
        return current.use(plugin);
    }, createApp(App));
    return instance;
};

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

const main = () => {
    return mountApp(getAppInstance());
};

main();
