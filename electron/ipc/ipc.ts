import { ipcMain } from "electron"
import { FileSystemCH, ResinCH, UpdateCH } from "./cmdChannels"

import { getLayerHeight, isCustom, readDir } from "./filesystem"
import { resinList } from "./resin"

import { factoryReset } from './factoryReset'
function ipcHandle(){
    ipcMain.handle(FileSystemCH.readDirTW, readDir)
    ipcMain.handle(FileSystemCH.getLayerHeightTW, getLayerHeight)
    ipcMain.handle(ResinCH.resinListTW, resinList)
    ipcMain.handle(FileSystemCH.isCustomTW,isCustom)

    ipcMain.on(UpdateCH.factoryRestRM,factoryReset)
}

export {ipcHandle}