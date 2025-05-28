const TaskStatus = {
    // 等待中
    waiting: 'waiting',
    // 开始任务
    startTask: 'startTask',
    // 上传进度
    uploadProgress: 'uploadProgress',
    // 任务结束
    endTask: 'endTask',
    // 任务中止
    abortTask: 'abortTask'
}

// Renderer -> Main
const RendererToMainEvent = {
    // 最小化应用
    minimize: 'minimize',
    // 关闭应用
    closeApp: 'closeApp',
    // 获取 package.json
    getPackageJson: 'getPackageJson',
    // 选择文件
    selectFiles: 'selectFiles',
    // 上传文件中的本地图片到图床
    uploadImage: 'uploadImage',
    // 打开文件夹
    openFolder: 'openFolder'
}

// Main -> Renderer
const MainToRendererEvent = {
    // 任务通知
    taskNotify: 'taskNotify'
}

export { TaskStatus, RendererToMainEvent, MainToRendererEvent }
