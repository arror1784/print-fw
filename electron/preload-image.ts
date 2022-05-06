import { contextBridge, ipcRenderer } from "electron";

interface ContextBridgeImageApi {
    isImage: boolean;
    onChangeImage: (callback:(event:Electron.IpcRendererEvent)=> {}) => Electron.IpcRenderer;
    onSetUrl: (callback:(event:Electron.IpcRendererEvent)=> {}) => Electron.IpcRenderer;
}

const exposedApi: ContextBridgeImageApi = {
    isImage: true,
    onChangeImage: (callback:(event: Electron.IpcRendererEvent) => {}) => ipcRenderer.on('image::changeImage',callback),
    onSetUrl: (callback: (event: Electron.IpcRendererEvent) => {}) => ipcRenderer.on('image:setUrl',callback)
}

contextBridge.exposeInMainWorld('imageAPI', exposedApi)

export type {ContextBridgeImageApi}