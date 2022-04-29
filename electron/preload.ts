import { contextBridge, ipcRenderer } from 'electron'
import { DirOrFile } from './ipc/filesystem'

interface ContextBridgeApi {
  readDir: (path : string) => Promise<DirOrFile[]>;
  resinList: () => Promise<string[]>;
}

const exposedApi: ContextBridgeApi = {
  readDir: (path: string) => ipcRenderer.invoke('filesystem:readDir',path),
  resinList: () => ipcRenderer.invoke('resin:resinList')
}
contextBridge.exposeInMainWorld('electronAPI', exposedApi)

export type {ContextBridgeApi}
