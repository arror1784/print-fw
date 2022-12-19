import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import { DirOrFile } from './ipc/filesystem'
import { FileSystemCH, ProductCH, ResinCH, WorkerCH,WifiCH, UpdateCH } from './ipc/cmdChannels';
import { WifiCallbackType, WifiInfo} from '../cpp/wifiModule';
import { UpdateNotice } from './update';
import { MoveMotorCommand } from './printWorker';
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

    // console.log("IPC EVENT ADD",channel,ipcRenderer.listenerCount(channel),Object.keys(eventListnerArr).length)

    return {channel:channel,id:_id.toString()}
}
function eventRemove(listener:EventListener){
    ipcRenderer.removeListener(listener.channel,eventListnerArr[listener.id])

    delete eventListnerArr[listener.id]

    // console.log("IPC EVENT REMOVE",listener.channel,"Listener Count : ",ipcRenderer.listenerCount(listener.channel),"Total Key Length : ",Object.keys(eventListnerArr).length)
}

interface electronApiInterface {
    readDirTW: (path : string) => Promise<DirOrFile[]>;
    resinListTW: () => Promise<string[]>;
    getLayerHeightTW: (filePath:string) => Promise<number>;
    getOffsetSettingsTW: () => Promise<number[]>;
    isCustomTW: (filePath:string) => Promise<boolean>;
    getProductInfoTW: () => Promise<string[]>; // 0:version,1:serial,2:wifi,3:ip,
    getUartConnectionErrorTW: ()=>Promise<boolean>;
    getUSBPathTW:()=>Promise<string>;
    getWifiListTW: () => Promise<WifiInfo[]>;
    getCurrentWifiStatusTW: () => Promise<WifiInfo>;
    getResinCurrentVersion: () => Promise<Date>;
    getResinServerVersion: () => Promise<Date|null>;
    getResinFileVersion: (path:string) => Promise<Date|null>;
    getSWCurrentVersionTW: ()=>Promise<string>;
    getSWServerVersionTW: ()=>Promise<string|null>;
    getSWFileVersionTW: (path:string)=>Promise<string|null>


    printStartRM: (path : string, material : string) => void;
    printCommandRM: (cmd :string) => void;
    unlockRM: () => void;
    requestPrintInfoRM: () => void;
    shutdownRM: () => void;
    connectWifiRM : (ssid:string,bssid:string,passwd:string|undefined) => void;
    disconnectWifiRM : () => void;
    scanWifiRM : () => void;
    resinUpdateRM :() => void;
    resinFileUpdateRM:(path:string) => void;
    softwareUpdateRM: () => void;
    softwareFileUpdateRM: (path:string) => void;
    factoryRestRM:()=>void;
    saveLEDOffsetRM:(offset:number)=>void;
    saveHeightOffsetRM:(offset:number)=>void;
    moveMotorRM:(command:MoveMotorCommand,value:number)=>void;

    onWorkingStateChangedMR: (callback:(event:IpcRendererEvent,state: string,message?:string) => void) => EventListener;
    onPrintInfoMR: (callback:(event:IpcRendererEvent,state: string, material: string, 
                                filename: string, layerheight: number, elapsedTime: number, 
                                totalTime: number,progress : number,enabelTimer: number) => void) => EventListener;
    onLCDStateChangedMR: (callback:(event:IpcRendererEvent,state: boolean) => void) => EventListener;
    onShutDownEventMR: (callback:(event:IpcRendererEvent) => void) => EventListener;
    onStartErrorMR: (callback:(event:IpcRendererEvent,error: string) => void) => EventListener;
    onProgressMR: (callback:(event:IpcRendererEvent,progress: number) => void) => EventListener;
    onStatusChangeMR: (callback:(event:IpcRendererEvent,status: WifiInfo)=>void) => EventListener;
    onSetTotalTimeMR: (callback:(event:IpcRendererEvent,value:number)=>void) => EventListener;
    onWifiListChangeMR: (callback:(evnet:IpcRendererEvent,wifiList: WifiInfo[]) => void) => EventListener;
    onWifiNoticeMR: (callback:(event:IpcRendererEvent,type:WifiCallbackType,value:number)=>void ) => EventListener;
    onUpdateNoticeMR: (callback:(event:IpcRendererEvent,value:UpdateNotice)=>void ) => EventListener;
    onMoveFinishMR: (callback:(event:IpcRendererEvent,command:MoveMotorCommand,value:number)=>void)=>EventListener;
    onUartConnectionStateChangeMR:(callback:(event:IpcRendererEvent,isOpen:boolean) => void) => EventListener;

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
    getUartConnectionErrorTW: ()=>ipcRenderer.invoke(ProductCH.getUartConnectionErrorTW),
    getUSBPathTW:()=>ipcRenderer.invoke(FileSystemCH.getUSBPathTW),
    getWifiListTW: () => ipcRenderer.invoke(WifiCH.getWifiListTW),
    getCurrentWifiStatusTW: () => ipcRenderer.invoke(WifiCH.getCurrentWifiStatusTW),
    getResinCurrentVersion:()=>ipcRenderer.invoke(UpdateCH.getResinCurrentVersion),
    getResinServerVersion:()=>ipcRenderer.invoke(UpdateCH.getResinServerVersion),
    getResinFileVersion: (path:string)=>ipcRenderer.invoke(UpdateCH.getResinFileVersion,path),
    getSWCurrentVersionTW:()=>ipcRenderer.invoke(UpdateCH.getSWCurrentVersionTW),
    getSWServerVersionTW:()=>ipcRenderer.invoke(UpdateCH.getSWServerVersionTW),
    getSWFileVersionTW: (path:string)=>ipcRenderer.invoke(UpdateCH.getSWFileVersionTW,path),

    printStartRM: (path : string, material : string) => ipcRenderer.send(WorkerCH.startRM,path,material),
    printCommandRM: (cmd :string) => ipcRenderer.send(WorkerCH.commandRM,cmd),
    unlockRM: () => ipcRenderer.send(WorkerCH.unlockRM),
    requestPrintInfoRM: () => ipcRenderer.send(WorkerCH.requestPrintInfoRM),
    shutdownRM: () => ipcRenderer.send(ProductCH.shutDownRM),
    connectWifiRM: (ssid:string,bssid:string,passwd:string|undefined) => ipcRenderer.send(WifiCH.connectWifiRM,ssid,bssid,passwd),
    disconnectWifiRM: () => ipcRenderer.send(WifiCH.disconnectWifiRM),
    scanWifiRM: () => ipcRenderer.send(WifiCH.scanWifiRM),
    resinUpdateRM: ()=>ipcRenderer.send(UpdateCH.resinUpdateRM),
    resinFileUpdateRM:(path:string) => ipcRenderer.send(UpdateCH.resinFileUpdateRM,path),
    softwareUpdateRM:()=>ipcRenderer.send(UpdateCH.softwareUpdateRM),
    softwareFileUpdateRM:(path:string)=>ipcRenderer.send(UpdateCH.softwareFileUpdateRM,path),
    factoryRestRM:()=>ipcRenderer.send(UpdateCH.factoryRestRM),
    saveHeightOffsetRM: (offset:number) => ipcRenderer.send(ProductCH.saveHeightOffsetRM,offset),
    saveLEDOffsetRM:(offset:number)=> ipcRenderer.send(ProductCH.saveLEDOffsetRM,offset),
    moveMotorRM:(command:MoveMotorCommand,value:number) => ipcRenderer.send(ProductCH.moveMotorRM,command,value),

    onWorkingStateChangedMR: (callback:(event: IpcRendererEvent,state: string,message?:string) => void) => {return eventADD(WorkerCH.onWorkingStateChangedMR,callback)},
    onPrintInfoMR: (callback:(event:IpcRendererEvent,state: string, material: string, 
                                filename: string, layerheight: number, elapsedTime: number, 
                                totalTime: number,progress : number,enabelTimer: number) => void) => {return eventADD(WorkerCH.onPrintInfoMR,callback)},
    onLCDStateChangedMR: (callback:(event:IpcRendererEvent,state: boolean) => void) => {return eventADD(ProductCH.onLCDStateChangedMR,callback)},
    onShutDownEventMR: (callback:(event:IpcRendererEvent) => void) => {return eventADD(ProductCH.onShutDownEventMR,callback)},
    onStartErrorMR: (callback:(event:IpcRendererEvent,error: string) => void) => {return eventADD(WorkerCH.onStartErrorMR,callback)},
    onProgressMR: (callback:(event:IpcRendererEvent,progress: number) => void) => {return eventADD(WorkerCH.onProgressMR,callback)},
    onStatusChangeMR: (callback:(event:IpcRendererEvent,status: WifiInfo) => void) => {return eventADD(WifiCH.onStatusChangeMR,callback)},
    onSetTotalTimeMR: (callback:(event:IpcRendererEvent,value:number)=>void) =>{return eventADD(WorkerCH.onSetTotalTimeMR,callback)},
    onWifiListChangeMR: (callback:(event:IpcRendererEvent,wifiList:WifiInfo[]) => void) => {return eventADD(WifiCH.onWifiListChangeMR,callback)},
    onWifiNoticeMR: (callback:(event:IpcRendererEvent,type:WifiCallbackType,value:number)=>void) => {return eventADD(WifiCH.onWifiNoticeMR,callback)},
    onUpdateNoticeMR:(callback:(event:IpcRendererEvent,value:UpdateNotice) => void) => {return eventADD(UpdateCH.onUpdateNoticeMR,callback)},
    onMoveFinishMR:(callback:(event:IpcRendererEvent,command:MoveMotorCommand,value:number) => void) => {return eventADD(ProductCH.onMoveFinishMR,callback)},
    onUartConnectionStateChangeMR:(callback:(event:IpcRendererEvent,isOpen:boolean) => void) => {return eventADD(ProductCH.uartConnectionStateChangeMR,callback)},
    
    removeListener : (listener:EventListener) => eventRemove(listener),
    removeAllListner : (channel:string) => ipcRenderer.removeAllListeners(channel),
}

contextBridge.exposeInMainWorld('electronAPI', exposedApi)

export type {electronApiInterface}