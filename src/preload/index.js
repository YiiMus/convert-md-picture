import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { api } from './api'

if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld('electron', electronAPI)
        contextBridge.exposeInMainWorld('api', api)
    } catch (e) {
        console.error(e)
    }
} else {
    window.electron = electronAPI
    window.api = api
}
