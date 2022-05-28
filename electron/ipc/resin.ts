import { getPrinterSetting } from "../json/printerSetting"

function resinList() : string[] {
    return getPrinterSetting().data.resinList
}

export {resinList}