import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import { DirOrFile } from './ipc/filesystem'
import './ipc/cmdChannels'
import { FileSystemCH, ProductCH, ResinCH, WorkerCH } from './ipc/cmdChannels';

interface ContextBridgeApi {
    readDir: (path : string) => Promise<DirOrFile[]>;
    resinList: () => Promise<string[]>;
    getOffsetSettings: () => Promise<string[]>;
    getPrinterInfo: () => Promise<string[]>;


    printStart: (name : string, material : string,height:number) => void;
    printCommand: (cmd :string) => void;

    onWorkingStateChanged: (callback:(event:IpcRendererEvent,state: string) => void) => Electron.IpcRenderer;
    onPrintInfo: (callback:(event:IpcRendererEvent,state: string, material: string, 
                                filename: string, layerheight: number, elapsedTime: number, 
                                totalTime: number,progress : number,enabelTimer: number) => void) => Electron.IpcRenderer;
    onLCDStateChanged: (callback:(event:IpcRendererEvent,state: boolean) => void) => Electron.IpcRenderer;
    onStartError: (callback:(event:IpcRendererEvent,error: string) => void) => Electron.IpcRenderer;


}
const exposedApi: ContextBridgeApi = {
    readDir: (path: string) => ipcRenderer.invoke(FileSystemCH.readDirTW,path),
    resinList: () => ipcRenderer.invoke(ResinCH.resinListTW),
    getOffsetSettings: () => ipcRenderer.invoke(ProductCH.getOffsetSettingsTW),
    getPrinterInfo: () => ipcRenderer.invoke(ProductCH.getPrinterInfoTW),

    printStart: (name : string, material : string,height:number) => ipcRenderer.send(WorkerCH.startRM,name,material,height),
    printCommand: (cmd :string) => ipcRenderer.send(WorkerCH.commandRM,cmd),

    onWorkingStateChanged: (callback:(event: IpcRendererEvent,state: string) => void) => {return ipcRenderer.on(WorkerCH.onWorkingStateChangedMR,callback)},
    onPrintInfo: (callback:(event:IpcRendererEvent,state: string, material: string, 
                                filename: string, layerheight: number, elapsedTime: number, 
                                totalTime: number,progress : number,enabelTimer: number) => void) => {return ipcRenderer.on(WorkerCH.onPrintInfoMR,callback)},

    onLCDStateChanged: (callback:(event:IpcRendererEvent,state: boolean) => void) => {return ipcRenderer.on(ProductCH.onLCDStateChanged,callback)},
    onStartError: (callback:(event:IpcRendererEvent,error: string) => void) => {return ipcRenderer.on(WorkerCH.onStartErrorMR,callback)},

}
contextBridge.exposeInMainWorld('electronAPI', exposedApi)