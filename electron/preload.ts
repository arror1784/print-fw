import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import { DirOrFile } from './ipc/filesystem'
import './ipc/cmdChannels'
import { FileSystemCH, ProductCH, ResinCH, WorkerCH } from './ipc/cmdChannels';

interface ContextBridgeApi {
    readDir: (path : string) => Promise<DirOrFile[]>;
    resinList: () => Promise<string[]>;
    getOffsetSettings: () => Promise<string[]>;
    getPrinterInfo: () => Promise<string[]>;


    printStart: (path : string, material : string) => void;
    printCommand: (cmd :string) => void;

    onWorkingStateChanged: (callback:(event:IpcRendererEvent,state: string) => void) => Electron.IpcRenderer;
    onPrintInfo: (callback:(event:IpcRendererEvent,state: string, material: string, 
                                filename: string, layerheight: number, elapsedTime: number, 
                                totalTime: number,progress : number,enabelTimer: number) => void) => Electron.IpcRenderer;
    onLCDStateChanged: (callback:(event:IpcRendererEvent,state: boolean) => void) => Electron.IpcRenderer;


}
const exposedApi: ContextBridgeApi = {
    readDir: (path: string) => ipcRenderer.invoke(FileSystemCH.readDir,path),
    resinList: () => ipcRenderer.invoke(ResinCH.resinList),
    getOffsetSettings: () => ipcRenderer.invoke(ProductCH.getOffsetSettings),
    getPrinterInfo: () => ipcRenderer.invoke(ProductCH.getPrinterInfo),

    printStart: (path : string, material : string) => ipcRenderer.send(WorkerCH.start,path,material),
    printCommand: (cmd :string) => ipcRenderer.send(WorkerCH.command,cmd),

    onWorkingStateChanged: (callback:(event: IpcRendererEvent,state: string) => void) => {return ipcRenderer.on(WorkerCH.onWorkingStateChanged,callback)},
    onPrintInfo: (callback:(event:IpcRendererEvent,state: string, material: string, 
                                filename: string, layerheight: number, elapsedTime: number, 
                                totalTime: number,progress : number,enabelTimer: number) => void) => {return ipcRenderer.on(WorkerCH.onPrintInfo,callback)},

    onLCDStateChanged: (callback:(event:IpcRendererEvent,state: boolean) => void) => {return ipcRenderer.on(ProductCH.onLCDStateChanged,callback)},
}
contextBridge.exposeInMainWorld('electronAPI', exposedApi)