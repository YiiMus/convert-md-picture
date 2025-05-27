import { app, dialog } from 'electron'
import path from 'path'

const getPackageJson = () => {
    try {
        return require(path.join(app.getAppPath(), 'package.json'))
    } catch (e) {
        console.error('加载 package.json 失败:', e.message)
        return {}
    }
}

const openSelectFilesDialog = async (config) => {
    const result = await dialog.showOpenDialog(config)

    if (result.filePaths && result.filePaths.length > 0) {
        // 提取文件名和路径信息
        const filesInfo = result.filePaths.map((filePath) => ({
            filePath: filePath,
            fileName: path.basename(filePath)
        }))

        return filesInfo
    }

    return []
}

const closeWindow = (event) => {
    const window = event.sender.getOwnerBrowserWindow()
    if (window) {
        window.close()
    }
}

const minimizeWindow = (event) => {
    const window = event.sender.getOwnerBrowserWindow()
    if (window) {
        window.minimize()
    }
}

export { getPackageJson, openSelectFilesDialog, closeWindow, minimizeWindow }
