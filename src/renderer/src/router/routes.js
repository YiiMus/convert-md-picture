import Home from '../pages/Home.vue'
import Setting from '../pages/Setting.vue'
import About from '../pages/About.vue'

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
