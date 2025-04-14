import { ipcMain } from 'electron'
import { getPackageJson } from './services/utils'

export function setupIPC() {
    // Close app
    ipcMain.on('closeApp', (event) => {
        const window = event.sender.getOwnerBrowserWindow()
        if (window) {
            window.close()
        }
    })

    // Minimize app
    ipcMain.on('minimize', (event) => {
        const window = event.sender.getOwnerBrowserWindow()
        if (window) {
            window.minimize()
        }
    })

    // 获取 package.json
    ipcMain.handle('getPackageJson', () => {
        return getPackageJson()
    })
}
