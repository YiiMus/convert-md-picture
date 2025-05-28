import { contextBridge } from 'electron'
import { api } from '@preload/api'

if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld('api', api)
    } catch (e) {
        console.error(e)
    }
} else {
    window.api = api
}
