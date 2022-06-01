import { ipcMain } from "electron"
import { FileSystemCH, ResinCH } from "./cmdChannels"

import { getLayerHeight, readDir } from "./filesystem"
import { resinList } from "./resin"

function ipcHandle(){
    ipcMain.handle(FileSystemCH.readDirTW, readDir)
    ipcMain.handle(FileSystemCH.getLayerHeightTW, getLayerHeight)
    ipcMain.handle(ResinCH.resinListTW, resinList)
}

export {ipcHandle}