import { contextBridge, ipcRenderer,IpcRendererEvent } from "electron";

interface ContextBridgeImageApi {
    onChangeImage: (callback:(event:IpcRendererEvent,image:string) => void) => Electron.IpcRenderer;
}

const exposedApi: ContextBridgeImageApi = {
    onChangeImage: (callback:(event: IpcRendererEvent,image:string) => void) => {return ipcRenderer.on('image::changeImage',callback)},
}

contextBridge.exposeInMainWorld('imageAPI', exposedApi)

export type {ContextBridgeImageApi}