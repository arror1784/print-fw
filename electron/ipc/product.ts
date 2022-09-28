import address from "address";
import { exec } from "child_process";
import { BrowserWindow, ipcMain, IpcMainEvent } from "electron";
import { networkInterfaces } from "os";
import { getModelNoInstaceSetting } from "../json/modelNo";
import { getPrinterSetting } from "../json/printerSetting";
import { getVersionSetting } from "../json/version";
import { ProductCH } from "./cmdChannels";
import { getWifiName } from "./wifiControl";

export function productIpcInit(mainWindow:BrowserWindow){

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
    ipcMain.handle(ProductCH.getOffsetSettingsTW,()=>{

        let offsetArr : number[] = []

        offsetArr.push(getPrinterSetting().data.heightOffset)
        offsetArr.push(getPrinterSetting().data.ledOffset)

        return [...offsetArr]
    })
    ipcMain.on(ProductCH.saveHeightOffsetRM,(event:IpcMainEvent,offset:number)=>{
        getPrinterSetting().data.heightOffset = offset
        getPrinterSetting().saveFile()
    })
    ipcMain.on(ProductCH.saveLEDOffsetRM,(event:IpcMainEvent,offset:number)=>{
        getPrinterSetting().data.ledOffset = offset;
        getPrinterSetting().saveFile()
    })
}