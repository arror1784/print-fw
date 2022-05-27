import { contextBridge, ipcRenderer,IpcRendererEvent } from "electron";
import { ImageCH } from "./ipc/cmdChannels";

interface ContextBridgeImageApi {
    onChangeImage: (callback:(event:IpcRendererEvent,image:string) => void) => Electron.IpcRenderer;
}

const exposedApi: ContextBridgeImageApi = {
    onChangeImage: (callback:(event: IpcRendererEvent,image:string) => void) => {return ipcRenderer.on(ImageCH.changeImage,callback)},
}

contextBridge.exposeInMainWorld('imageAPI', exposedApi)

export type {ContextBridgeImageApi}