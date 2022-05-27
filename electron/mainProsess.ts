import { BrowserWindow, ipcMain, IpcMainEvent } from "electron"
import { ImageProvider } from "./imageProvider"
import { PrintWorker } from "./printWorker"
import { UartConnection } from "./uartConnection"
import { ImageCH, WorkerCH } from './ipc/cmdChannels'

import * as fs from "fs";
import * as AdmZip from 'adm-zip'

import { ProductSetting } from "./ProductSetting"

const sliceFileRoot = "/opt/capsuleFW/print/printFilePath/"

let uartConnection = new UartConnection('/dev/ttyUSB0')
let imageProvider = new ImageProvider('C10',sliceFileRoot)

let worker = new PrintWorker(uartConnection,imageProvider)

function mainProsessing(mainWindow:BrowserWindow,imageWindow:BrowserWindow){

    imageProvider.imageCB((src : string) => {
        console.log("imageSet")
        imageWindow.webContents.send(ImageCH.changeImage,src)
    })

    ipcMain.on(WorkerCH.start,(event:IpcMainEvent,path:string,material:string)=>{


        if(!fs.existsSync(path))
            return false
        if(!ProductSetting.getInstance().resinList.includes(material))
            return false
            
        let zip = new AdmZip(path)
        if(!zip.test())
            return false
        
        zip.extractAllTo(sliceFileRoot,true)
        if(!fs.existsSync(sliceFileRoot+'/resin.png')){
            
        }


        if(!worker.run(path,material)){

        }
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