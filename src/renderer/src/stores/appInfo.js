import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppInfoStore = defineStore('appInfo', () => {
    const activeRoute = ref()
    const currentTitle = ref()

    const handleChangeActiveRoute = (route) => {
        activeRoute.value = route
    }

    const handleChangeCurrentTitle = (route) => {
        currentTitle.value = route
    }

    return { activeRoute, handleChangeActiveRoute, currentTitle, handleChangeCurrentTitle }
})
