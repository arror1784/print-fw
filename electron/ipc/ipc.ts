import { ipcMain } from "electron"

import { readDir } from "./filesystem"
import { resinList } from "./resin"

function ipcHandle(){
    ipcMain.handle('filesystem:readDir', readDir)
    ipcMain.handle('resin:resinList', resinList)

}

export {ipcHandle}