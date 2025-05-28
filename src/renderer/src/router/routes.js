import Home from '@renderer/pages/Home.vue'
import Setting from '@renderer/pages/Setting.vue'
import About from '@renderer/pages/About.vue'

const routes = [
    {
        path: '/',
        component: Home
    },
    {
        path: '/setting',
        component: Setting
    },
    {
        path: '/about',
        component: About
    }
]

export { routes }
