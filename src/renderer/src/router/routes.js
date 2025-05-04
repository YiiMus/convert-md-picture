const routes = [
    {
        path: '/',
        component: () => import('../pages/Home.vue')
    },
    {
        path: '/setting',
        component: () => import('../pages/Setting.vue')
    },
    {
        path: '/about',
        component: () => import('../pages/About.vue')
    }
]

export { routes }
