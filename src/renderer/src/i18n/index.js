import { createI18n } from 'vue-i18n'
import zhCN from './zh-CN.json'
import en from './en.json'

const messages = {
    zhCN: zhCN,
    en
}

const i18n = createI18n({
    locale: 'zhCN',
    messages
})

export default i18n
