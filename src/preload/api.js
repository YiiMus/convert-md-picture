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

    // 上传进度
    onUploadProgress: (callback) => ipcRenderer.on('uploadProgress', callback),

    // 打开文件夹
    openFolder: (filePath) => {
        ipcRenderer.send('openFolder', filePath)
    }
}
