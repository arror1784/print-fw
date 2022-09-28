
import { BrowserWindow, ipcMain, IpcMainEvent } from "electron"
import { ImageProvider } from "./imageProvider"
import { MoveMotorCommand, PrintWorker, WorkingState } from "./printWorker"
import { UartConnection, UartConnectionTest, UartResponseType } from "./uartConnection"
import { ImageCH, ProductCH, UpdateCH, WorkerCH } from './ipc/cmdChannels'

import fs from "fs"
import { ResinSetting } from "./json/resin"
import { getProductSetting } from "./json/productSetting"
import { wifiInit } from "./ipc/wifiControl"

import { getPrinterSetting } from "./json/printerSetting"

import { WebSocketMessage } from "./json/webSockectMessage"
import { MessageType, WebPrintControl } from "./webPrintControl"
import { productIpcInit } from "./ipc/product"
import { updateIpcInit } from "./ipc/update"
import { atob, Base64, btoa, decode, toUint8Array } from 'js-base64'

const sliceFileRoot : string = process.platform === "win32" ? process.cwd() + "/temp/print/printFilePath/" : "/opt/capsuleFW/print/printFilePath/"

let uartConnection : UartConnection | UartConnectionTest

if(process.platform === "win32" || process.arch != 'arm')
    uartConnection = new UartConnectionTest()
else 
    uartConnection = new UartConnection('/dev/ttyUSB0')

let imageProvider = new ImageProvider(getProductSetting().data.product,sliceFileRoot)

let worker = new PrintWorker(uartConnection,imageProvider)

let webSockect = new WebPrintControl(worker)

Base64.extendString()

async function mainProsessing(mainWindow:BrowserWindow,imageWindow:BrowserWindow){
    webSockect.onMessage = ( message:WebSocketMessage )=>{
        let msg = (message.data) 
        console.log(msg.method)
        switch((msg.method as MessageType)){
            case MessageType.Print:
                try {

                    let material = msg.arg["selectedMaterial"] as string
                    let name = msg.arg["selectedFilename"] as string
                    let files = msg.arg["printFiles"] as any

                    fs.readdirSync(sliceFileRoot).forEach((value:string)=>{
                        fs.rmSync(sliceFileRoot + value)
                    })

                    for (const value of Object.keys(files)) {
                        fs.writeFileSync(sliceFileRoot+value,toUint8Array((files[value] as string).split(',')[1]))
                    }
                    
                    worker.print(material,sliceFileRoot+name,name)
                    webSockect.sendMessage("start","")

                } catch (error) {
                    webSockect.settingError(0,(error as Error).message)
                    console.log((error as Error).message)
                }

                break;
            case MessageType.ChangeState:
                let state = message.data.arg as String;
                if(state == "pause"){
                    worker.pause()
                }else if(state == "resume"){
                    worker.resume()
                }else if(state == "quit"){
                    worker.stop()
                }
                break;
            case MessageType.GetProductName:
                webSockect.sendMessage("setProductName",getProductSetting().data.product == "L10" ? "L-10" : "C-10")
                break;
            case MessageType.ListMaterialName:
                webSockect.sendMessage("listMaterialName",getPrinterSetting().data.resinList)
                break;
            case MessageType.PrintInfo:
                let info = worker.getPrintInfo()
                webSockect.sendMessage("printInfo",info)
                break;
        }
    }

    ipcMain.on(WorkerCH.startRM,(event:IpcMainEvent,path:string,material:string)=>{
        try {
            let nameArr = path.split('/')
            let name = nameArr[nameArr.length - 1]
            worker.print(material,path,name)
            webSockect.sendMessage("start","")

        } catch (error) {
            mainWindow.webContents.send(WorkerCH.onStartErrorMR,(error as Error).message)
            console.log((error as Error).message)
        }
    })
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
        webSockect.changeProgress(progress)
    })
    worker.onStateChangeCB((state:WorkingState,message?:string)=>{
        mainWindow.webContents.send(WorkerCH.onWorkingStateChangedMR,state,message)
        webSockect.changeState(state,message)
    })
    worker.onSetTotalTimeCB((value:number)=>{
        mainWindow.webContents.send(WorkerCH.onSetTotalTimeMR,value)
        webSockect.setTotalTime(value)
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
        webSockect.changeState(WorkingState.stop)
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