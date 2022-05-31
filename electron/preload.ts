import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import { DirOrFile } from './ipc/filesystem'
import { FileSystemCH, ProductCH, ResinCH, WorkerCH } from './ipc/cmdChannels';
import { channel } from 'diagnostics_channel';
let _id = 0

interface EventListnerArr{
    [key:string] : (...args : any[]) => void
}
let eventListnerArr : EventListnerArr = {}

function eventADD(channel : string,listner:(...args : any[]) => void) : [string,string]{

    _id++
    eventListnerArr[_id.toString()] = listner
    ipcRenderer.on(channel,eventListnerArr[_id.toString()])

    console.log(channel,ipcRenderer.listenerCount(channel),eventListnerArr[_id],Object.keys(eventListnerArr).length)

    return [channel,_id.toString()]
}
function eventRemove(channel : string,id:string){
    ipcRenderer.removeListener(channel,eventListnerArr[id])

    delete eventListnerArr[id]

    console.log(channel,ipcRenderer.listenerCount(channel),eventListnerArr[_id],Object.keys(eventListnerArr).length)

}

interface ContextBridgeApi {
    readDirTW: (path : string) => Promise<DirOrFile[]>;
    resinListTW: () => Promise<string[]>;
    getOffsetSettingsTW: () => Promise<string[]>;
    getProductInfoTW: () => Promise<string[]>; // 0:version,1:serial,2:wifi,3:ip,


    printStartRM: (path : string, material : string) => void;
    printCommandRM: (cmd :string) => void;
    unLockRM: () => void;
    requestPrintInfo: () => void,

    onWorkingStateChangedMR: (callback:(event:IpcRendererEvent,state: string) => void) => [string,string];
    onPrintInfoMR: (callback:(event:IpcRendererEvent,state: string, material: string, 
                                filename: string, layerheight: number, elapsedTime: number, 
                                totalTime: number,progress : number,enabelTimer: number) => void) => [string,string];
    onLCDStateChangedMR: (callback:(event:IpcRendererEvent,state: boolean) => void) => [string,string];
    onShutDownMR: (callback:(event:IpcRendererEvent) => void) => [string,string];
    onStartErrorMR: (callback:(event:IpcRendererEvent,error: string) => void) => [string,string];
    onProgressMR: (callback:(event:IpcRendererEvent,progress: number) => void) => [string,string];

    removeListener : (channel:string,id:string) => void;
    removeAllListner : (channel:string) => void;

}
const exposedApi: ContextBridgeApi = {
    readDirTW: (path: string) => ipcRenderer.invoke(FileSystemCH.readDirTW,path),
    resinListTW: () => ipcRenderer.invoke(ResinCH.resinListTW),
    getOffsetSettingsTW: () => ipcRenderer.invoke(ProductCH.getOffsetSettingsTW),
    getProductInfoTW: () => ipcRenderer.invoke(ProductCH.getProductInfoTW),

    printStartRM: (path : string, material : string) => ipcRenderer.send(WorkerCH.startRM,path,material),
    printCommandRM: (cmd :string) => ipcRenderer.send(WorkerCH.commandRM,cmd),
    unLockRM: () => ipcRenderer.send(WorkerCH.unlockRM),
    requestPrintInfo: () => ipcRenderer.send(WorkerCH.requestPrintInfoMR),

    onWorkingStateChangedMR: (callback:(event: IpcRendererEvent,state: string) => void) => {return eventADD(WorkerCH.onWorkingStateChangedMR,callback)},
    onPrintInfoMR: (callback:(event:IpcRendererEvent,state: string, material: string, 
                                filename: string, layerheight: number, elapsedTime: number, 
                                totalTime: number,progress : number,enabelTimer: number) => void) => {return eventADD(WorkerCH.onPrintInfoMR,callback)},
    onLCDStateChangedMR: (callback:(event:IpcRendererEvent,state: boolean) => void) => {return eventADD(ProductCH.onLCDStateChangedMR,callback)},
    onShutDownMR: (callback:(event:IpcRendererEvent) => void) => {return eventADD(ProductCH.onShutDownMR,callback)},
    onStartErrorMR: (callback:(event:IpcRendererEvent,error: string) => void) => {return eventADD(WorkerCH.onStartErrorMR,callback)},
    onProgressMR: (callback:(event:IpcRendererEvent,progress: number) => void) => {return eventADD(WorkerCH.onProgressMR,callback)},

    removeListener : (channel:string,id:string) => eventRemove(channel,id),
    removeAllListner : (channel:string) => ipcRenderer.removeAllListeners(channel),
}

contextBridge.exposeInMainWorld('electronAPI', exposedApi)

export type {ContextBridgeApi}