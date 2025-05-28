import { ipcRenderer } from 'electron'
import { RendererToMainEvent, MainToRendererEvent } from '@common/const'

export const api = {
    // Minimize app
    minimize: () => {
        ipcRenderer.send(RendererToMainEvent.minimize)
    },

    // Close app
    closeApp: () => {
        ipcRenderer.send(RendererToMainEvent.closeApp)
    },

    // 获取 package.json
    getPackageJson: () => ipcRenderer.invoke(RendererToMainEvent.getPackageJson),

    // 选择文件
    selectFiles: () => ipcRenderer.invoke(RendererToMainEvent.selectFiles),

    // 上传文件中的本地图片到图床
    uploadImage: (filePathList) => ipcRenderer.invoke(RendererToMainEvent.uploadImage, filePathList),

    // 打开文件夹
    openFolder: (filePath) => {
        ipcRenderer.send(RendererToMainEvent.openFolder, filePath)
    },

    // 任务通知
    onTaskNotify: (callback) => ipcRenderer.on(MainToRendererEvent.taskNotify, callback)
}
