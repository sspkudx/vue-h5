import { createRouter, createWebHashHistory } from 'vue-router';

/** router used by the app */
const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component() {
                return import('../views/HomeView/index');
            },
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk for this route
            // which is lazy-loaded when the route is visited.
            component() {
                return import('../views/AboutView/index');
            },
        },
        {
            path: '/playground',
            name: 'PlaygroundPage',
            component() {
                return import('../views/PlaygroundPage/PlaygroundPage.vue');
            },
        },
    ],
});

export default router;
