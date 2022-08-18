import { BrowserWindow, ipcMain, IpcMainEvent } from "electron";
import { WifiCH } from './cmdChannels'
import {WifiCallbackType,WifiInfo,WifiModuleAddon,addOn} from "../../cpp/wifiModule";

export function wifiInit(mainWindow:BrowserWindow){
    ipcMain.on(WifiCH.connectWifiRM,(event:IpcMainEvent,ssid:string,bssid:string,passwd:string|undefined)=>{
        addOn.connect(ssid,bssid,passwd)
    })
    ipcMain.on(WifiCH.disconnectWifiRM,(event:IpcMainEvent)=>{
        console.log("disconnect")
        addOn.disconnect()
    })
    ipcMain.on(WifiCH.scanWifiRM,(event:IpcMainEvent)=>{
        addOn.scan()
    })
    ipcMain.handle(WifiCH.getCurrentWifiStatusTW,()=>{
        return addOn.getCurrentConnection()
    })
    ipcMain.handle(WifiCH.getWifiListTW,()=>{
        return addOn.getList()
    })
    // mainWindow.webContents.send(WorkerCH.onProgressMR,progress)
    addOn.onData((type:WifiCallbackType,value:number)=>{
        mainWindow.webContents.send(WifiCH.onWifiNoticeMR,type,value)
        switch(type){
            case WifiCallbackType.StateChange:
                mainWindow.webContents.send(WifiCH.onStatusChangeMR,addOn.getCurrentConnection())
                break;
            case WifiCallbackType.AssocFail:
                break;
            case WifiCallbackType.ListUpdate:
                mainWindow.webContents.send(WifiCH.onWifiListChangeMR,addOn.getList())
                break;
            case WifiCallbackType.ScanFail:
                break;
            case WifiCallbackType.TryAssociate:
                break;
            default:
                break;
        }
    })
}

export function getWifiName():string{
    const a = addOn.getCurrentConnection()
    if(a.connected)
        return a.ssid
    return ""
}