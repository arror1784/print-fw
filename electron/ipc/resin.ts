import { IpcMainInvokeEvent } from "electron"
import { getPrinterSetting } from "../json/printerSetting"

async function resinList(event:IpcMainInvokeEvent) : Promise<string[]> {
    return getPrinterSetting().data.resinList
}

export {resinList}