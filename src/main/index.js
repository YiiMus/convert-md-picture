import { app } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { createWindow } from './window'
import { setupIPC } from './ipc'

app.whenReady().then(() => {
    electronApp.setAppUserModelId('com.nanoopic')

    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })

    setupIPC()
    createWindow()

    app.on('activate', function () {
        if (app.getAllWindows().length === 0) createWindow()
    })

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    })
})
