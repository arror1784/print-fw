import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import { DirOrFile } from './ipc/filesystem'
import './ipc/cmdChannels'
import { FileSystemCH, ProductCH, ResinCH, WorkerCH } from './ipc/cmdChannels';

interface ContextBridgeApi {
    readDirTW: (path : string) => Promise<DirOrFile[]>;
    resinListTW: () => Promise<string[]>;
    getOffsetSettingsTW: () => Promise<string[]>;
    getProductInfoTW: () => Promise<string[]>; // 0:version,1:serial,2:wifi,3:ip,


    printStartRM: (path : string, material : string) => void;
    printCommandRM: (cmd :string) => void;
    unLockRM: () => void;
    requestPrintInfo: () => void,

    onWorkingStateChangedMR: (callback:(event:IpcRendererEvent,state: string) => void) => Electron.IpcRenderer;
    onPrintInfoMR: (callback:(event:IpcRendererEvent,state: string, material: string, 
                                filename: string, layerheight: number, elapsedTime: number, 
                                totalTime: number,progress : number,enabelTimer: number) => void) => Electron.IpcRenderer;
    onLCDStateChangedMR: (callback:(event:IpcRendererEvent,state: boolean) => void) => Electron.IpcRenderer;
    onShutDownMR: (callback:(event:IpcRendererEvent) => void) => Electron.IpcRenderer;
    onStartErrorMR: (callback:(event:IpcRendererEvent,error: string) => void) => Electron.IpcRenderer;
    onProgressMR: (callback:(event:IpcRendererEvent,progress: number) => void) => Electron.IpcRenderer;


}
const exposedApi: ContextBridgeApi = {
    readDirTW: (path: string) => ipcRenderer.invoke(FileSystemCH.readDirTW,path),
    resinListTW: () => ipcRenderer.invoke(ResinCH.resinListTW),
    getOffsetSettingsTW: () => ipcRenderer.invoke(ProductCH.getOffsetSettingsTW),
    getProductInfoTW: () => ipcRenderer.invoke(ProductCH.getPrinterInfoTW),

    printStartRM: (path : string, material : string) => ipcRenderer.send(WorkerCH.startRM,path,material),
    printCommandRM: (cmd :string) => ipcRenderer.send(WorkerCH.commandRM,cmd),
    unLockRM: () => ipcRenderer.send(WorkerCH.unlockRM),
    requestPrintInfo: () => ipcRenderer.send(WorkerCH.requestPrintInfoMR),

    onWorkingStateChangedMR: (callback:(event: IpcRendererEvent,state: string) => void) => {return ipcRenderer.on(WorkerCH.onWorkingStateChangedMR,callback)},
    onPrintInfoMR: (callback:(event:IpcRendererEvent,state: string, material: string, 
                                filename: string, layerheight: number, elapsedTime: number, 
                                totalTime: number,progress : number,enabelTimer: number) => void) => {return ipcRenderer.on(WorkerCH.onPrintInfoMR,callback)},
    onLCDStateChangedMR: (callback:(event:IpcRendererEvent,state: boolean) => void) => {return ipcRenderer.on(ProductCH.onLCDStateChangedMR,callback)},
    onShutDownMR: (callback:(event:IpcRendererEvent) => void) => {return ipcRenderer.on(ProductCH.onShutDownMR,callback)},
    onStartErrorMR: (callback:(event:IpcRendererEvent,error: string) => void) => {return ipcRenderer.on(WorkerCH.onStartErrorMR,callback)},
    onProgressMR: (callback:(event:IpcRendererEvent,progress: number) => void) => {return ipcRenderer.on(WorkerCH.onProgressMR,callback)},

}
contextBridge.exposeInMainWorld('electronAPI', exposedApi)

export type {ContextBridgeApi}