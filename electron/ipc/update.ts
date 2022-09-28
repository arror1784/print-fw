import { BrowserWindow, ipcMain, IpcMainEvent } from "electron"
import { ResinControl } from "../resinUpdate"
import { SWUpdate } from "../swUpdate"
import { UpdateNotice } from "../update"
import { UpdateCH } from "./cmdChannels"


let rc = new ResinControl()
let sw = new SWUpdate()

export function updateIpcInit(mainWindow:BrowserWindow){


    ipcMain.handle(UpdateCH.getResinCurrentVersion,()=>{
        return rc.currentVersion()
    })
    ipcMain.handle(UpdateCH.getResinServerVersion,()=>{
        return rc.serverVersion()
    })
    ipcMain.handle(UpdateCH.getResinFileVersion,(event:Electron.IpcMainInvokeEvent,path:string)=>{
        return rc.fileVersion(path)
    })
    ipcMain.handle(UpdateCH.getSWCurrentVersionTW,()=>{
        return sw.currentVersion()
    })
    ipcMain.handle(UpdateCH.getSWServerVersionTW,()=>{
        return sw.serverVersion()
    })
    ipcMain.handle(UpdateCH.getSWFileVersionTW,(event:Electron.IpcMainInvokeEvent,path:string)=>{
        return sw.fileVersion(path)
    })

    ipcMain.on(UpdateCH.resinUpdateRM,(event:IpcMainEvent)=>{
        rc.update()
    })
    ipcMain.on(UpdateCH.softwareUpdateRM,(event:IpcMainEvent)=>{
        sw.update()
    })
    ipcMain.on(UpdateCH.resinFileUpdateRM,(event:IpcMainEvent,path:string)=>{
        rc.updateFile(path)
    })
    ipcMain.on(UpdateCH.softwareFileUpdateRM,(event:IpcMainEvent,path:string)=>{
        sw.updateFile(path)
    })

    rc.updateCB = (v:UpdateNotice) => mainWindow.webContents.send(UpdateCH.onUpdateNoticeMR,v)
    sw.updateCB = (v:UpdateNotice) => mainWindow.webContents.send(UpdateCH.onUpdateNoticeMR,v)

}