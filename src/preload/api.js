import { ipcRenderer } from 'electron'

export const api = {
    ping: () => {
        ipcRenderer.send('ping', 1)
    }
}
