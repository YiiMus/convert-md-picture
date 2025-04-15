import { createApp } from 'vue'
import App from './App.vue'
import './main.less'
// Ant Design
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
// i18n
import i18n from './i18n'
// vue-router
import router from './router'

const app = createApp(App)

app.use(Antd)
app.use(i18n)
app.use(router)
app.mount('#app')
