import { BrowserWindow, ipcMain, IpcMainEvent } from "electron"
import { ImageProvider } from "./imageProvider"
import { PrintWorker, WorkingState } from "./printWorker"
import { UartConnection } from "./uartConnection"
import { ImageCH, WorkerCH } from './ipc/cmdChannels'

import * as fs from "fs"
import * as AdmZip from 'adm-zip'
import { getPrinterSetting } from "./json/printerSetting"
import { ResinSetting } from "./json/resin"

const sliceFileRoot : string = "/opt/capsuleFW/print/printFilePath/"

let uartConnection = new UartConnection('/dev/ttyUSB0')
let imageProvider = new ImageProvider('C10',sliceFileRoot)

let worker = new PrintWorker(uartConnection,imageProvider)

function mainProsessing(mainWindow:BrowserWindow,imageWindow:BrowserWindow){

    if(!uartConnection.checkConnection())
        return new Error("uart connect error")
    
    imageProvider.imageCB((src : string) => {
        console.log("imageSet")
        imageWindow.webContents.send(ImageCH.changeImage,src)
    })
    worker.onProgressCB((progress:number)=>{
        mainWindow.webContents.send(WorkerCH.onProgress,progress)
    })
    worker.onStateChangeCB((state:WorkingState)=>{
        mainWindow.webContents.send(WorkerCH.onWorkingStateChanged,state)
    })
    ipcMain.on(WorkerCH.start,(event:IpcMainEvent,path:string,material:string)=>{

        if(!fs.existsSync(path))
            return new Error("file not exist")
        if(!getPrinterSetting().data.resinList.includes(material))
            return new Error("resin not exist")
            
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
        let name = nameArr[nameArr.length -1].split('/')[0]
        try {
            worker.run(name,resin)
        } catch (error) {
            mainWindow.webContents.send(WorkerCH.onStartError,(error as Error).message)
        }
        mainWindow.webContents.send(WorkerCH.start,name,material,worker.infoSetting.layerHeight)

    })

    ipcMain.on(WorkerCH.command,(event:IpcMainEvent,cmd:string)=>{
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
            default:
                break;
        }
    })
}

export {mainProsessing}