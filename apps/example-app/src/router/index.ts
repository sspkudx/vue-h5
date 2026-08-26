import { createRouter, createWebHashHistory } from 'vue-router';

/**
 * 应用路由实例
 * @description 采用 hash 模式路由（H5 静态部署友好，无需服务端回退配置）；
 * 所有页面均为路由级懒加载，访问时再加载对应 chunk
 */
const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component() {
                return import(/* webpackChunkName: "HomeView" */ '../views/HomeView/index');
            },
        },
        {
            path: '/about',
            name: 'about',
            // 路由级代码分割：该路由单独生成 chunk（webpackChunkName 命名），首次访问时才懒加载
            component() {
                return import(/* webpackChunkName: "AboutView" */ '../views/AboutView/index');
            },
        },
        {
            path: '/playground',
            name: 'PlaygroundPage',
            component() {
                return import(/* webpackChunkName: "PlaygroundPage" */ '../views/PlaygroundPage/PlaygroundPage.vue');
            },
        },
    ],
});

export default router;
