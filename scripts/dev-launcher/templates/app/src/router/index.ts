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
                return import('../views/HomeView/HomeView.vue');
            },
        },
    ],
});

export default router;
