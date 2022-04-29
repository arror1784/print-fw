import { IpcMainEvent, IpcMainInvokeEvent } from "electron";
import * as fs from "fs";

interface DirOrFile{
    name:string;
    isDir:boolean;
    path:string;
    id:number;
}

async function readDir (event:IpcMainInvokeEvent,path: string) : Promise<DirOrFile[]> {

    var list : DirOrFile[] = []
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

export {readDir}
export type { DirOrFile }