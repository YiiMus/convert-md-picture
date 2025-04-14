import { ipcRenderer } from 'electron'

export const api = {
    minimize: () => {
        ipcRenderer.send('minimize')
    },
    closeApp: () => {
        ipcRenderer.send('closeApp')
    },
    getPackageJson: () => ipcRenderer.invoke('getPackageJson')
}
