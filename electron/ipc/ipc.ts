import { ipcMain } from "electron"
import { FileSystemCH, ResinCH } from "./cmdChannels"

import { getLayerHeight, isCustom, readDir } from "./filesystem"
import { resinList } from "./resin"

function ipcHandle(){
    ipcMain.handle(FileSystemCH.readDirTW, readDir)
    ipcMain.handle(FileSystemCH.getLayerHeightTW, getLayerHeight)
    ipcMain.handle(ResinCH.resinListTW, resinList)
    ipcMain.handle(FileSystemCH.isCustomTW,isCustom)
}

export {ipcHandle}