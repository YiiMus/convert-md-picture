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
    selectFiles: () => ipcRenderer.invoke('selectFiles'),

    // 上传文件中的本地图片到图床
    uploadImage: (filePathList) => ipcRenderer.invoke('uploadImage', filePathList),

    // 打开文件夹
    openFolder: (filePath) => {
        ipcRenderer.send('openFolder', filePath)
    },

    // 开始任务
    onStartTask: (callback) => ipcRenderer.on('startTask', callback),

    // 上传进度
    onUploadProgress: (callback) => ipcRenderer.on('uploadProgress', callback),

    // 任务结束
    onEndTask: (callback) => ipcRenderer.on('endTask', callback),

    // 任务中止
    onAbortTask: (callback) => ipcRenderer.on('abortTask', callback)
}
