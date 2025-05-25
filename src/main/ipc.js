import { ipcMain, dialog } from 'electron'
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

    // 选择文件
    ipcMain.handle('selectFiles', async () => {
        const result = await dialog.showOpenDialog({
            properties: ['openFile', 'multiSelections'],
            filters: [{ name: 'Markdown Files', extensions: ['md'] }]
        })
        return result.filePaths // 返回完整的文件路径数组
    })
}
