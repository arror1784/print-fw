
import { BrowserWindow, ipcMain, IpcMainEvent } from "electron"
import { ImageProvider } from "./imageProvider"
import { MoveMotorCommand, PrintWorker, WorkingState } from "./printWorker"
import { UartConnection, UartConnectionTest, UartResponseType } from "./uartConnection"
import { ImageCH, ProductCH, UpdateCH, WorkerCH } from './ipc/cmdChannels'

import fs from "fs"
import {networkInterfaces} from 'os'
import AdmZip from 'adm-zip'
import { ResinSetting } from "./json/resin"
import { getProductSetting } from "./json/productSetting"
import { exec, execSync } from "child_process"
import { getVersionSetting } from "./json/version"
import { getModelNoInstaceSetting } from "./json/modelNo"
import { getWifiName, wifiInit } from "./ipc/wifiControl"

import address from 'address'
import { ResinControl } from "./resinUpdate"
import { SWUpdate } from "./swUpdate"
import { UpdateNotice } from "./update"
import { getPrinterSetting } from "./json/printerSetting"

import sizeOf from 'image-size'

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
    worker.onStateChangeCB((state:WorkingState,message?:string)=>{
        mainWindow.webContents.send(WorkerCH.onWorkingStateChangedMR,state,message)
    })
    worker.onSetTotalTimeCB((value:number)=>{
        mainWindow.webContents.send(WorkerCH.onSetTotalTimeMR,value)
    })
    
    ipcMain.on(WorkerCH.startRM,(event:IpcMainEvent,path:string,material:string)=>{
        try {
            if(!fs.existsSync(path))
                throw new Error("Error: 파일이 존재하지 않습니다.")
                
            let zip = new AdmZip(path)
            if(!zip.test())
                throw new Error("zip archive error")
            
            fs.readdirSync(sliceFileRoot).forEach((value:string)=>{
                fs.rmSync(sliceFileRoot + value)
            })

            zip.extractAllTo(sliceFileRoot,true)

            if(fs.existsSync(sliceFileRoot+"/0.png")){
                let height = sizeOf(sliceFileRoot+"/0.png").height
                console.log(height)
                switch (getProductSetting().data.product) {
                    case "C10":
                        if(height != 1440)
                            throw new Error("Error: 맞지 않는 이미지 사이즈 입니다.")
                        break;
                    case "L10":
                        if(height != 1620)
                            throw new Error("Error: 맞지 않는 이미지 사이즈 입니다.")
                        break;
                }
            }
            let resin : ResinSetting
            if(fs.existsSync(sliceFileRoot+'/resin.json') && material == "custom"){
                resin = new ResinSetting("custom",fs.readFileSync(sliceFileRoot+'/resin.json',"utf8"))
            }else{
                resin = new ResinSetting(material)
            }

            let nameArr = path.split('/')
            let name = nameArr[nameArr.length -1]
            if(process.platform === "win32" || process.arch != 'arm'){
                console.log("do hdmi reset")
            }else{
                execSync("vcgencmd display_power 0") // hdmi power off
                execSync("vcgencmd display_power 1") // hdmi power on
            }

            worker.run(name,resin)
            
        } catch (error) {
            mainWindow.webContents.send(WorkerCH.onStartErrorMR,(error as Error).message)
            console.log((error as Error).message)
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
        webSockect.changeState("unlock")
    })
    ipcMain.handle(ProductCH.getUartConnectionErrorTW,()=>{
        return uartConnection.checkConnection()
    })
    ipcMain.on(ProductCH.moveMotorRM, async (event:IpcMainEvent,command:MoveMotorCommand,value:number)=>{
        await worker.moveMotor(command,value)
        mainWindow.webContents.send(ProductCH.onMoveFinishMR,command,value)
    })
    productIpcInit(mainWindow)
    wifiInit(mainWindow)
    updateIpcInit(mainWindow)
}
export {mainProsessing}