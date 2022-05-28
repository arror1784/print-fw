import { contextBridge, ipcRenderer,IpcRendererEvent } from "electron";
import { ImageCH } from "./ipc/cmdChannels";

interface ContextBridgeImageApi {
    onChangeImage: (callback:(event:IpcRendererEvent,image:string) => void) => Electron.IpcRenderer;
    onChangeScale: (callback:(event:IpcRendererEvent,scale:number) => void) => Electron.IpcRenderer;

}

const exposedApi: ContextBridgeImageApi = {
    onChangeImage: (callback:(event: IpcRendererEvent,image:string) => void) => {return ipcRenderer.on(ImageCH.changeImageMR,callback)},
    onChangeScale: (callback:(event:IpcRendererEvent,scale:number) => void) => {return ipcRenderer.on(ImageCH.changeScaleMR,callback)},

}

contextBridge.exposeInMainWorld('imageAPI', exposedApi)

export type {ContextBridgeImageApi}