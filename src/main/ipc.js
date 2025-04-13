import { ipcMain } from 'electron'

export function setupIPC() {
    ipcMain.on('ping', (_, value) => console.log('pong', value))
}
