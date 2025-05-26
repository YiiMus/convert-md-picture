import { ipcMain, dialog, shell } from 'electron'
import path from 'path'
import { getPackageJson } from './services/utils'
import { uploadImage } from './services/upload'

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

        if (result.filePaths && result.filePaths.length > 0) {
            // 提取文件名和路径信息
            const filesInfo = result.filePaths.map((filePath) => ({
                filePath: filePath,
                fileName: path.basename(filePath) // 获取带扩展名的文件名
            }))

            return filesInfo // 返回包含文件路径和文件名的数组
        }

        return [] // 如果没有选择文件，则返回空数组
    })

    // 上传文件中的本地图片到图床
    ipcMain.handle('uploadImage', (event, filePathList) => {
        uploadImage(event, filePathList)
    })

    // 打开文件夹
    ipcMain.on('openFolder', (event, filePath) => {
        if (filePath) {
            shell.showItemInFolder(filePath)
        }
    })
}
