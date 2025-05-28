import { app } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { createWindow } from '@main/core/window'
import { setupIPC } from '@main/core/ipc'

app.whenReady().then(() => {
    electronApp.setAppUserModelId('com.nanoopic')

    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })

    setupIPC()
    const mainWindow = createWindow()

    app.on('activate', function () {
        if (app.getAllWindows().length === 0) createWindow()
    })

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    })

    const gotTheLock = app.requestSingleInstanceLock()

    if (!gotTheLock) {
        app.quit()
    } else {
        app.on('second-instance', () => {
            if (mainWindow) {
                if (mainWindow.isMinimized()) mainWindow.restore()
                mainWindow.focus()
            }
        })
    }
})
