import { ipcRenderer } from 'electron'

export const api = {
    // Minimize app
    minimize: () => {
        ipcRenderer.send('minimize')
    },

    // Close app
    closeApp: () => {
        ipcRenderer.send('closeApp')
    },

    // 获取 package.json
    getPackageJson: () => ipcRenderer.invoke('getPackageJson'),

    // 选择文件
    selectFiles: () => ipcRenderer.invoke('selectFiles')
}
