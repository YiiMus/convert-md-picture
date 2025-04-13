import { ipcMain } from 'electron'

export function setupIPC() {
  ipcMain.on('ping', () => console.log('pong'))
}
