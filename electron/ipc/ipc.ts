import { ipcMain } from "electron"
import { FileSystemCH, ResinCH } from "./cmdChannels"

import { readDir } from "./filesystem"
import { resinList } from "./resin"

function ipcHandle(){
    ipcMain.handle(FileSystemCH.readDir, readDir)
    ipcMain.handle(ResinCH.resinList, resinList)

}

export {ipcHandle}