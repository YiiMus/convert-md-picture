import { createApp } from 'vue'
import App from './App.vue'
// Ant Design
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
// i18n
import i18n from './i18n'
// vue-router
import router from './router'
// Element Plus
import 'element-plus/dist/index.css'
// Main Style
import './main.less'

const app = createApp(App)
const vuetify = createVuetify({
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi
        }
    }
})

app.use(Antd)
app.use(i18n)
app.use(router)
app.use(vuetify)
app.mount('#app')
