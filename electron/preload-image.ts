import { contextBridge, ipcRenderer,IpcRendererEvent } from "electron";
import { ImageCH } from "./ipc/cmdChannels";

interface ContextBridgeImageApi {
    onChangeImageMR: (callback:(event:IpcRendererEvent,image:string) => void) => Electron.IpcRenderer;
    onChangeScaleMR: (callback:(event:IpcRendererEvent,scale:number) => void) => Electron.IpcRenderer;

}

const exposedApi: ContextBridgeImageApi = {
    onChangeImageMR: (callback:(event: IpcRendererEvent,image:string) => void) => {return ipcRenderer.on(ImageCH.changeImageMR,callback)},
    onChangeScaleMR: (callback:(event:IpcRendererEvent,scale:number) => void) => {return ipcRenderer.on(ImageCH.changeScaleMR,callback)},

}

contextBridge.exposeInMainWorld('imageAPI', exposedApi)

export type {ContextBridgeImageApi}