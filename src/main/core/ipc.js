import { ipcMain } from 'electron'
import { getPackageJson, openSelectFilesDialog, closeWindow, minimizeWindow, openFolder } from '@main/utils'
import { uploadTask } from '@main/services/uploadTask'

const setupIPC = () => {
    // Close app
    ipcMain.on('closeApp', (event) => {
        closeWindow(event)
    })

    // Minimize app
    ipcMain.on('minimize', (event) => {
        minimizeWindow(event)
    })

    // 获取 package.json
    ipcMain.handle('getPackageJson', () => {
        return getPackageJson()
    })

    // 选择文件
    ipcMain.handle('selectFiles', async () => {
        return await openSelectFilesDialog({
            properties: ['openFile', 'multiSelections'],
            filters: [{ name: 'Markdown Files', extensions: ['md'] }]
        })
    })

    // 上传文件中的本地图片到图床
    ipcMain.handle('uploadImage', (event, filePathList) => {
        uploadTask(event, filePathList)
    })

    // 打开文件夹
    ipcMain.on('openFolder', (event, filePath) => {
        openFolder(filePath)
    })
}

export { setupIPC }
