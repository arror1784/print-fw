import { BrowserWindow, ipcMain, IpcMainEvent } from "electron"
import { ImageProvider } from "./imageProvider"
import { PrintWorker, WorkingState } from "./printWorker"
import { UartConnection, UartConnectionTest, UartResponseType } from "./uartConnection"
import { ImageCH, ProductCH, WorkerCH } from './ipc/cmdChannels'

import * as fs from "fs"
import AdmZip from 'adm-zip'
import { getPrinterSetting } from "./json/printerSetting"
import { ResinSetting } from "./json/resin"
import { getProductSetting } from "./json/productSetting"
import { exec } from "child_process"
import { getVersionSetting } from "./json/version"
import { getModelNoInstaceSetting } from "./json/modelNo"
import { wifiInit } from "./ipc/wifiControl"

const sliceFileRoot : string = process.platform === "win32" ? process.cwd() + "/temp/print/printFilePath/" : "/opt/capsuleFW/print/printFilePath/"

let uartConnection : UartConnection | UartConnectionTest

if(process.platform === "win32" || process.arch != 'arm')
    uartConnection = new UartConnectionTest()
else 
    uartConnection = new UartConnection('/dev/ttyUSB0')

let imageProvider = new ImageProvider(getProductSetting().data.product,sliceFileRoot)

let worker = new PrintWorker(uartConnection,imageProvider)

function mainProsessing(mainWindow:BrowserWindow,imageWindow:BrowserWindow){

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
            console.log("shutdown -h now")
            if (error) {
                console.log(`error: ${error.message}`)
                return
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`)
                return
            }
            console.log(`stdout: ${stdout}`)})
    })
    ipcMain.handle(ProductCH.getProductInfoTW,()=>{
        return [getVersionSetting().data.version,getModelNoInstaceSetting().data.modelNo,"3","4"]
    })
    
    wifiInit(mainWindow)

}
export {mainProsessing}