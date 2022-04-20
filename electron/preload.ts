import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  sendToMain: () => {
    console.log("sendToMain method")
    ipcRenderer.send('handle-receive')
  }
})

console.log("preload.ts")