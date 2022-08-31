import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import { DirOrFile } from './ipc/filesystem'
import { FileSystemCH, ProductCH, ResinCH, WorkerCH,WifiCH, UpdateCH } from './ipc/cmdChannels';
import { WifiCallbackType, WifiInfo} from '../cpp/wifiModule';
import { UpdateNotice } from './update';
let _id = 0

interface EventListener{
    channel:string;
    id:string;
}
interface EventListenerArr{
    [key:string] : (...args : any[]) => void
}
let eventListnerArr : EventListenerArr = {}

function eventADD(channel : string,listner:(...args : any[]) => void) : EventListener{

    _id++
    eventListnerArr[_id.toString()] = listner
    ipcRenderer.on(channel,eventListnerArr[_id.toString()])

    console.log("IPC EVENT ADD",channel,ipcRenderer.listenerCount(channel),Object.keys(eventListnerArr).length)

    return {channel:channel,id:_id.toString()}
}
function eventRemove(listener:EventListener){
    ipcRenderer.removeListener(listener.channel,eventListnerArr[listener.id])

    delete eventListnerArr[listener.id]

    console.log("IPC EVENT REMOVE",listener.channel,"Listener Count : ",ipcRenderer.listenerCount(listener.channel),"Total Key Length : ",Object.keys(eventListnerArr).length)
}

interface electronApiInterface {
    readDirTW: (path : string) => Promise<DirOrFile[]>;
    resinListTW: () => Promise<string[]>;
    getLayerHeightTW: (filePath:string) => Promise<number>;
    getOffsetSettingsTW: () => Promise<string[]>;
    isCustomTW: (filePath:string) => Promise<boolean>;
    getProductInfoTW: () => Promise<string[]>; // 0:version,1:serial,2:wifi,3:ip,
    getWifiListTW: () => Promise<WifiInfo[]>;
    getCurrentWifiStatusTW: () => Promise<WifiInfo>;
    getCurrentLatestResinVersionTW: () => Promise<Date>;
    checkAvailableToResinUpdateNetworkTW: () => Promise<Date|null>;
    getCurrentVersionTW: ()=>Promise<string>;
    getServerVersionTW: ()=>Promise<string|null>;


    printStartRM: (path : string, material : string) => void;
    printCommandRM: (cmd :string) => void;
    unLockRM: () => void;
    requestPrintInfoRM: () => void;
    shutdownRM: () => void;
    connectWifiRM : (ssid:string,bssid:string,passwd:string|undefined) => void;
    disconnectWifiRM : () => void;
    scanWifiRM : () => void;
    resinUpdateRM :() => void;
    softwareUpdateRM: () => void;

    onWorkingStateChangedMR: (callback:(event:IpcRendererEvent,state: string) => void) => EventListener;
    onPrintInfoMR: (callback:(event:IpcRendererEvent,state: string, material: string, 
                                filename: string, layerheight: number, elapsedTime: number, 
                                totalTime: number,progress : number,enabelTimer: number) => void) => EventListener;
    onLCDStateChangedMR: (callback:(event:IpcRendererEvent,state: boolean) => void) => EventListener;
    onShutDownEventMR: (callback:(event:IpcRendererEvent) => void) => EventListener;
    onStartErrorMR: (callback:(event:IpcRendererEvent,error: string) => void) => EventListener;
    onProgressMR: (callback:(event:IpcRendererEvent,progress: number) => void) => EventListener;
    onStatusChangeMR: (callback:(event:IpcRendererEvent,status: WifiInfo)=>void) => EventListener;
    onWifiListChangeMR: (callback:(evnet:IpcRendererEvent,wifiList: WifiInfo[]) => void) => EventListener;
    onWifiNoticeMR: (callback:(event:IpcRendererEvent,type:WifiCallbackType,value:number)=>void ) => EventListener;
    onUpdateNoticeMR: (callback:(event:IpcRendererEvent,value:UpdateNotice)=>void ) => EventListener;

    removeListener : (listener:EventListener) => void;
    removeAllListner : (channel:string) => void;

}
const exposedApi: electronApiInterface = {
    readDirTW: (path: string) => ipcRenderer.invoke(FileSystemCH.readDirTW,path),
    resinListTW: () => ipcRenderer.invoke(ResinCH.resinListTW),
    getLayerHeightTW: (filePath:string) => ipcRenderer.invoke(FileSystemCH.getLayerHeightTW,filePath),
    getOffsetSettingsTW: () => ipcRenderer.invoke(ProductCH.getOffsetSettingsTW),
    isCustomTW: (filePath:string) => ipcRenderer.invoke(FileSystemCH.isCustomTW,filePath),
    getProductInfoTW: () => ipcRenderer.invoke(ProductCH.getProductInfoTW),
    getWifiListTW: () => ipcRenderer.invoke(WifiCH.getWifiListTW),
    getCurrentWifiStatusTW: () => ipcRenderer.invoke(WifiCH.getCurrentWifiStatusTW),
    getCurrentLatestResinVersionTW:()=>ipcRenderer.invoke(UpdateCH.getCurrentLatestResinVersionTW),
    checkAvailableToResinUpdateNetworkTW:()=>ipcRenderer.invoke(UpdateCH.checkAvailableToResinUpdateNetworkTW),
    getCurrentVersionTW:()=>ipcRenderer.invoke(UpdateCH.getCurrentVersionTW),
    getServerVersionTW:()=>ipcRenderer.invoke(UpdateCH.getServerVersionTW),

    printStartRM: (path : string, material : string) => ipcRenderer.send(WorkerCH.startRM,path,material),
    printCommandRM: (cmd :string) => ipcRenderer.send(WorkerCH.commandRM,cmd),
    unLockRM: () => ipcRenderer.send(WorkerCH.unlockRM),
    requestPrintInfoRM: () => ipcRenderer.send(WorkerCH.requestPrintInfoRM),
    shutdownRM: () => ipcRenderer.send(ProductCH.shutDownRM),
    connectWifiRM: (ssid:string,bssid:string,passwd:string|undefined) => ipcRenderer.send(WifiCH.connectWifiRM,ssid,bssid,passwd),
    disconnectWifiRM: () => ipcRenderer.send(WifiCH.disconnectWifiRM),
    scanWifiRM: () => ipcRenderer.send(WifiCH.scanWifiRM),
    resinUpdateRM: ()=>ipcRenderer.send(UpdateCH.resinUpdateRM),
    softwareUpdateRM:()=>ipcRenderer.send(UpdateCH.softwareUpdateRM),

    onWorkingStateChangedMR: (callback:(event: IpcRendererEvent,state: string) => void) => {return eventADD(WorkerCH.onWorkingStateChangedMR,callback)},
    onPrintInfoMR: (callback:(event:IpcRendererEvent,state: string, material: string, 
                                filename: string, layerheight: number, elapsedTime: number, 
                                totalTime: number,progress : number,enabelTimer: number) => void) => {return eventADD(WorkerCH.onPrintInfoMR,callback)},
    onLCDStateChangedMR: (callback:(event:IpcRendererEvent,state: boolean) => void) => {return eventADD(ProductCH.onLCDStateChangedMR,callback)},
    onShutDownEventMR: (callback:(event:IpcRendererEvent) => void) => {return eventADD(ProductCH.onShutDownEventMR,callback)},
    onStartErrorMR: (callback:(event:IpcRendererEvent,error: string) => void) => {return eventADD(WorkerCH.onStartErrorMR,callback)},
    onProgressMR: (callback:(event:IpcRendererEvent,progress: number) => void) => {return eventADD(WorkerCH.onProgressMR,callback)},
    onStatusChangeMR: (callback:(event:IpcRendererEvent,status: WifiInfo) => void) => {return eventADD(WifiCH.onStatusChangeMR,callback)},
    onWifiListChangeMR: (callback:(event:IpcRendererEvent,wifiList:WifiInfo[]) => void) => {return eventADD(WifiCH.onWifiListChangeMR,callback)},
    onWifiNoticeMR: (callback:(event:IpcRendererEvent,type:WifiCallbackType,value:number)=>void) => {return eventADD(WifiCH.onWifiNoticeMR,callback)},
    onUpdateNoticeMR:(callback:(event:IpcRendererEvent,value:UpdateNotice) => void) => {return eventADD(UpdateCH.onUpdateNoticeMR,callback)},

    removeListener : (listener:EventListener) => eventRemove(listener),
    removeAllListner : (channel:string) => ipcRenderer.removeAllListeners(channel),
}

contextBridge.exposeInMainWorld('electronAPI', exposedApi)

export type {electronApiInterface}