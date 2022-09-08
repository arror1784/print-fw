import AdmZip = require("adm-zip");
import { IpcMainEvent, IpcMainInvokeEvent } from "electron";
import fs from "fs";
import { InfoSetting } from "../json/infoSetting";

interface DirOrFile{
    name:string;
    isDir:boolean;
    path:string;
    id:number;
}

const rootPath :string = process.platform === "win32" || process.arch != 'arm' ? process.cwd() + "/temp/USB" : "/media/pi"

async function readDir (event:IpcMainInvokeEvent,path: string) : Promise<DirOrFile[]> {

    var list : DirOrFile[] = []
    if(!fs.existsSync(path))
        return []
    fs.readdirSync(path,{withFileTypes:true}).forEach((value: fs.Dirent,index:number)=>{
        list.push({
            name: value.name,
            isDir: value.isDirectory(),
            path: path + '/' + value.name,
            id: index
        })
    })
    return list
}

async function getUSBPath() {
    let tmp = fs.readdirSync(rootPath,{withFileTypes:true}).filter((value:fs.Dirent)=>{
        return value.isDirectory() && !value.name.match("recoveryfs[0-9]*")
    })

    if(tmp.length == 0)
        return ""
    else
        return rootPath + '/' + tmp[0].name
}

async function getLayerHeight(event:IpcMainInvokeEvent,filePath:string): Promise<number>{

    try {
        
        let zip = new AdmZip(filePath)

        if(!zip.test())
            return 0

        let fileText = zip.readAsText("info.json","utf8")

        return new InfoSetting(fileText).data.layerHeight

    } catch (error) {
        return 0
    }

}
async function isCustom(event:IpcMainInvokeEvent,filePath:string): Promise<boolean>{

    try {
        
        let zip = new AdmZip(filePath)

        if(!zip.test())
            return false

        return zip.getEntry("resin.json") ? true : false
    } catch (error) {
        return false
    }
}
export {readDir,getLayerHeight,isCustom,getUSBPath}
export type { DirOrFile }