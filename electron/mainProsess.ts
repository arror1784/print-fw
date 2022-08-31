
import { BrowserWindow, ipcMain, IpcMainEvent } from "electron"
import { ImageProvider } from "./imageProvider"
import { PrintWorker, WorkingState } from "./printWorker"
import { UartConnection, UartConnectionTest, UartResponseType } from "./uartConnection"
import { ImageCH, ProductCH, ResinCH, UpdateCH, WorkerCH } from './ipc/cmdChannels'

import fs from "fs"
import {networkInterfaces} from 'os'
import AdmZip from 'adm-zip'
import { ResinSetting } from "./json/resin"
import { getProductSetting } from "./json/productSetting"
import { exec } from "child_process"
import { getVersionSetting } from "./json/version"
import { getModelNoInstaceSetting } from "./json/modelNo"
import { getWifiName, wifiInit } from "./ipc/wifiControl"

import address from 'address'
import { ResinControl } from "./resinUpdate"
import { SWUpdate } from "./swUpdate"
import { UpdateNotice } from "./update"

const sliceFileRoot : string = process.platform === "win32" ? process.cwd() + "/temp/print/printFilePath/" : "/opt/capsuleFW/print/printFilePath/"

let uartConnection : UartConnection | UartConnectionTest

if(process.platform === "win32" || process.arch != 'arm')
    uartConnection = new UartConnectionTest()
else 
    uartConnection = new UartConnection('/dev/ttyUSB0')

let imageProvider = new ImageProvider(getProductSetting().data.product,sliceFileRoot)

let worker = new PrintWorker(uartConnection,imageProvider)

let rc = new ResinControl()
let sw = new SWUpdate()

async function mainProsessing(mainWindow:BrowserWindow,imageWindow:BrowserWindow){

    console.log(await rc.fileVersion("/home/jsh/USBtest/updateFile/resin_20201231.updateFile"))
    
    if(!uartConnection.checkConnection())
        return new Error("uart connect error")
    
    uartConnection.onResponse((type : UartResponseType,response:number) => {
        switch(type){
            case UartResponseType.SHUTDOWN:
                console.log("event shutdown ")
                mainWindow.webContents.send(ProductCH.onShutDownEventMR)
                break;
            case UartResponseType.LCD:
                console.log("event LCD ")

                if(response){
                    worker.setLcdState(true)
                }else{
                    worker.setLcdState(false)
                }

                mainWindow.webContents.send(ProductCH.onLCDStateChangedMR,response)
                break;
            case UartResponseType.ERROR:
                console.log("ERRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRROR")
                break;
            default:
                break;
        }
    })
    imageProvider.imageCB((src : string) => {
        if(!imageWindow.isDestroyed())
            imageWindow.webContents.send(ImageCH.changeImageMR,src)
    })
    worker.onProgressCB((progress:number)=>{
        mainWindow.webContents.send(WorkerCH.onProgressMR,progress)
    })
    worker.onStateChangeCB((state:WorkingState)=>{
        mainWindow.webContents.send(WorkerCH.onWorkingStateChangedMR,state)
    })
    
    ipcMain.on(WorkerCH.startRM,(event:IpcMainEvent,path:string,material:string)=>{
        try {
            if(!fs.existsSync(path))
                return new Error("file not exist")
                
            let zip = new AdmZip(path)
            if(!zip.test())
                return new Error("can not open zip")
            
            zip.extractAllTo(sliceFileRoot,true)
            let resin : ResinSetting
            if(fs.existsSync(sliceFileRoot+'/resin.json')){
                resin = new ResinSetting("custom",fs.readFileSync(sliceFileRoot+'/resin.json',"utf8"))
            }else{
                resin = new ResinSetting(material)
            }
            let nameArr = path.split('/')
            let name = nameArr[nameArr.length -1]
            try {
                worker.run(name,resin)
            } catch (error) {
                console.log((error as Error).stack)

                mainWindow.webContents.send(WorkerCH.onStartErrorMR,(error as Error).message)
            }

        } catch (error) {
            console.log((error as Error).stack)
        }
    })
    ipcMain.on(WorkerCH.commandRM,(event:IpcMainEvent,cmd:string)=>{
        switch (cmd) {
            case "pause":
                worker.pause()
                break;
            case "quit":
                worker.stop()
                break;
            case "resume":
                worker.resume()
                break;
            case "printAgain":
                if(worker.resinName == "custom")
                    worker.printAgain(new ResinSetting("custom",fs.readFileSync(sliceFileRoot+'/resin.json',"utf8")))
                else
                    worker.printAgain()
                break;
            default:
                break;
        }
    })
    ipcMain.on(WorkerCH.requestPrintInfoRM,(event:IpcMainEvent)=>{
        mainWindow.webContents.send(WorkerCH.onPrintInfoMR,...worker.getPrintInfo())
    })
    ipcMain.on(WorkerCH.unlockRM,(event:IpcMainEvent)=>{
        worker.unlock()
    })
    ipcMain.on(ProductCH.shutDownRM,(event:IpcMainEvent)=>{
        exec("echo rasp | sudo -S shutdown -h now",(error, stdout, stderr) => {
            console.log("shutdown -h now")})
    })
    ipcMain.handle(ProductCH.getProductInfoTW,()=>{

        const nets = networkInterfaces();
        const results : string[] = [] // Or just '{}', an empty object
        
        for (const name of Object.keys(nets)) {
            if(name == 'lo')
                continue    
            results.push(address.ip(name));
        }
        return [getVersionSetting().data.version,getModelNoInstaceSetting().data.modelNo,getWifiName(),...results]
    })
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

    wifiInit(mainWindow)
}
export {mainProsessing}