import { ipcMain } from "electron"
import { FileSystemCH, ResinCH } from "./cmdChannels"

import { readDir } from "./filesystem"
import { resinList } from "./resin"

function ipcHandle(){
    ipcMain.handle(FileSystemCH.readDirTW, readDir)
    ipcMain.handle(ResinCH.resinListTW, resinList)
}

export {ipcHandle}